require('dotenv').config();

import { ref, getBytes, getMetadata } from 'firebase/storage';
import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import { storage } from '../services/firebase';
import { database } from '../database';
import { Book, BookModel } from '../models/book';
import { booksService } from '../services/books';
import { File } from 'formidable';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function downloadImageBytes(
  imageRefPath: string,
  imageUrl: string
): Promise<Uint8Array> {
  if (imageRefPath) {
    const storageRef = ref(storage, imageRefPath);
    const bytes = await getBytes(storageRef);
    return new Uint8Array(bytes);
  }

  if (!imageUrl) {
    throw new Error('No image source provided');
  }

  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch image by URL: ${response.status} ${response.statusText}`
    );
  }
  const arrayBuffer = await response.arrayBuffer();
  return new Uint8Array(arrayBuffer);
}

async function migrateOne(book: Book): Promise<void> {
  // Se já migrado, ignora
  if (book.originalImageUrl && book.originalImageRef) return;

  // Cria arquivo temporário para simular upload (compatível com formidable File)
  const tmpDir = await fs.mkdtemp(
    path.join(os.tmpdir(), 'flashbooks-migrate-')
  );

  // Descobre nome e mimetype preferencialmente via metadata do Storage
  let originalFilename: string | null = null;
  let mimeType: string | null = null;
  try {
    if (book.imageRef) {
      const metadata = await getMetadata(ref(storage, book.imageRef));
      mimeType = metadata.contentType || null;
      const parts = (metadata.fullPath || '').split('/');
      originalFilename = parts.length ? parts[parts.length - 1] : null;
    }
  } catch {}

  if (!originalFilename) {
    try {
      const url = new URL(book.imageUrl);
      const nameFromUrl = path.basename(url.pathname);
      originalFilename = nameFromUrl || `${book.id}`;
    } catch {
      throw new Error('No original filename found');
    }
  }

  if (!mimeType) {
    throw new Error('No mime type found');
  }

  const tempFilePath = path.join(tmpDir, originalFilename);

  const bytes = await downloadImageBytes(book.imageRef, book.imageUrl);

  try {
    await fs.writeFile(tempFilePath, bytes);

    const tempFile: File = {
      size: bytes.byteLength,
      filepath: tempFilePath,
      originalFilename,
      newFilename: path.basename(tempFilePath),
      mimetype: mimeType,
      mtime: new Date(),
      hashAlgorithm: false,
      toJSON: () => ({
        length: bytes.byteLength,
        mimetype: mimeType,
        mtime: new Date(),
        size: bytes.byteLength,
        filepath: tempFilePath,
        originalFilename,
        newFilename: path.basename(tempFilePath),
        hash: null,
      }),
      toString: () => tempFilePath,
    };

    await booksService.update(book.id, {
      title: book.title,
      author: book.author,
      description: book.description,
      chapters: book.chapters,
      categoryIds: book.categoryIds,
      purchaseLink: book.purchaseLink,
      image: tempFile,
    });
  } finally {
    // Limpa arquivo temporário e diretório
    await fs.rm(tempFilePath, { force: true }).catch(() => undefined);
    await fs
      .rm(tmpDir, { recursive: true, force: true })
      .catch(() => undefined);
  }
}

async function main() {
  await database.connect();

  const toMigrate = await BookModel.find({
    $or: [
      { originalImageUrl: { $exists: false } },
      { originalImageUrl: null },
      { originalImageUrl: '' },
    ],
  });

  console.log(`Found ${toMigrate.length} books to migrate`);

  // Process sequentially to avoid throttling
  let success = 0;
  let failed = 0;
  for (const book of toMigrate) {
    try {
      // eslint-disable-next-line no-console
      console.log(`Migrating book: ${book.title} (${book.id})`);
      await migrateOne(book);
      success += 1;
      // small backoff to be gentle with storage API
      // eslint-disable-next-line no-await-in-loop
      await sleep(150);
    } catch (err) {
      failed += 1;
      // eslint-disable-next-line no-console
      console.error(`Failed to migrate ${book.title} (${book.id})`, err);
      // eslint-disable-next-line no-await-in-loop
      await sleep(300);
    }
    console.log(`Migrated ${success} books, ${failed} failed.`);
  }

  // eslint-disable-next-line no-console
  console.log(`Migration finished. Success: ${success}, Failed: ${failed}`);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
main();

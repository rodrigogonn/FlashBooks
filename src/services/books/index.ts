import {
  getDownloadURL,
  ref,
  uploadBytes,
  deleteObject,
} from 'firebase/storage';
import { BookModel, Book } from '../../models/book';
import {
  CreateBookParams,
  ListNotSyncedParams,
  ListNotSyncedReturn,
  UpdateBookParams,
} from './types';
import { storage } from '../firebase';
import { v4 as uuidV4 } from 'uuid';
import fs from 'fs/promises';
import { File } from 'formidable';
import sharp from 'sharp';
import { toTitleCase } from '../../utils/titleCase';

const uploadImage = async (
  image: File
): Promise<{
  imageUrl: string; // optimized url
  imageRef: string; // optimized ref
  originalImageUrl: string;
  originalImageRef: string;
}> => {
  const imageExtension = image.originalFilename?.split('.').pop() || 'jpg';
  const originalKey = `booksImages/originals/${uuidV4()}.${imageExtension}`;
  const optimizedKey = `booksImages/optimized/${uuidV4()}.webp`;

  const originalRef = ref(storage, originalKey);
  const optimizedRef = ref(storage, optimizedKey);

  const imageFile = await fs.readFile(image.filepath);

  // Upload original as-is
  await uploadBytes(originalRef, new Uint8Array(imageFile), {
    contentType: image.mimetype || undefined,
  });

  // Create optimized webp (max width 800px, keep aspect ratio)
  const optimizedBuffer = await sharp(imageFile)
    .resize({ width: 512, withoutEnlargement: true })
    .webp({ quality: 75 })
    .toBuffer();

  await uploadBytes(optimizedRef, new Uint8Array(optimizedBuffer), {
    contentType: 'image/webp',
  });

  const [originalImageUrl, imageUrl] = await Promise.all([
    getDownloadURL(originalRef),
    getDownloadURL(optimizedRef),
  ]);

  return {
    imageUrl,
    imageRef: optimizedRef.fullPath,
    originalImageUrl,
    originalImageRef: originalRef.fullPath,
  };
};

const create = async ({
  title,
  author,
  image,
  description,
  chapters,
  categoryIds,
  purchaseLink,
}: CreateBookParams): Promise<{ id: any }> => {
  const normalizedTitle = toTitleCase(title);
  const { imageUrl, imageRef, originalImageUrl, originalImageRef } =
    await uploadImage(image);

  const response = await BookModel.create({
    title: normalizedTitle,
    author,
    imageUrl,
    imageRef,
    description,
    chapters,
    categoryIds,
    purchaseLink,
    originalImageUrl,
    originalImageRef,
  });

  return {
    id: response.id,
  };
};

const listNotSynced = async ({
  lastSync,
}: ListNotSyncedParams): Promise<ListNotSyncedReturn> => {
  const books = await BookModel.find(
    lastSync
      ? {
          updatedAt: {
            $gte: new Date(lastSync),
          },
        }
      : {}
  );

  return { books };
};

const list = async (): Promise<Book[]> => {
  const books = await BookModel.find();
  return books;
};

const update = async (
  id: string,
  {
    title,
    author,
    image,
    description,
    chapters,
    categoryIds,
    purchaseLink,
  }: UpdateBookParams
): Promise<void> => {
  const book = await BookModel.findById(id);
  if (!book) {
    throw new Error('Book not found.');
  }

  let imageUrl = book.imageUrl;
  let imageRef = book.imageRef;
  let originalImageUrl = book.originalImageUrl;
  let originalImageRef = book.originalImageRef;

  if (image) {
    // Delete old images (optimized and original)
    if (book.imageRef) {
      const oldOptimizedRef = ref(storage, book.imageRef);
      await deleteObject(oldOptimizedRef).catch(() => undefined);
    }
    if (book.originalImageRef) {
      const oldOriginalRef = ref(storage, book.originalImageRef);
      await deleteObject(oldOriginalRef).catch(() => undefined);
    }

    // Upload new images
    const newImage = await uploadImage(image);
    imageUrl = newImage.imageUrl;
    imageRef = newImage.imageRef;
    originalImageUrl = newImage.originalImageUrl;
    originalImageRef = newImage.originalImageRef;
  }

  const normalizedTitle = toTitleCase(title);
  await BookModel.findByIdAndUpdate(id, {
    title: normalizedTitle,
    author,
    imageUrl,
    imageRef,
    description,
    chapters,
    categoryIds,
    purchaseLink,
    originalImageUrl,
    originalImageRef,
    deletedAt: null,
  });
};

const remove = async (id: string): Promise<void> => {
  const book = await BookModel.findById(id);
  if (!book) {
    throw new Error('Book not found.');
  }

  await BookModel.findByIdAndUpdate(id, {
    deletedAt: new Date(),
  });
};

export const booksService = {
  create,
  listNotSynced,
  list,
  update,
  delete: remove,
};

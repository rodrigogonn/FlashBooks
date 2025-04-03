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

const uploadImage = async (
  image: File
): Promise<{ imageUrl: string; imageRef: string }> => {
  const imageExtension = image.originalFilename?.split('.').pop();
  const imageRef = ref(storage, `booksImages/${uuidV4()}.${imageExtension}`);
  const imageFile = await fs.readFile(image.filepath);
  const imageFileArray = new Uint8Array(imageFile);
  await uploadBytes(imageRef, imageFileArray, {
    contentType: image.mimetype || undefined,
  });

  const imageUrl = await getDownloadURL(imageRef);

  return {
    imageUrl,
    imageRef: imageRef.fullPath,
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
  const { imageUrl, imageRef } = await uploadImage(image);

  const response = await BookModel.create({
    title,
    author,
    imageUrl,
    imageRef,
    description,
    chapters,
    categoryIds,
    purchaseLink,
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

  if (image) {
    // Delete old image
    if (book.imageRef) {
      const oldImageRef = ref(storage, book.imageRef);
      await deleteObject(oldImageRef);
    }

    // Upload new image
    const newImage = await uploadImage(image);
    imageUrl = newImage.imageUrl;
    imageRef = newImage.imageRef;
  }

  await BookModel.findByIdAndUpdate(id, {
    title,
    author,
    imageUrl,
    imageRef,
    description,
    chapters,
    categoryIds,
    purchaseLink,
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

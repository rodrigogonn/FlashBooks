import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { BookModel } from '../../models/book';
import {
  CreateBookParams,
  ListNotSyncedParams,
  ListNotSyncedReturn,
} from './types';
import { storage } from '../firebase';
import { v4 as uuidV4 } from 'uuid';
import fs from 'fs/promises';

const create = async ({
  title,
  author,
  image,
  description,
  chapters,
  categoryIds,
  purchaseLink,
}: CreateBookParams): Promise<{ id: any }> => {
  const imageExtension = image.originalFilename?.split('.').pop();
  const imageRef = ref(storage, `booksImages/${uuidV4()}.${imageExtension}`);
  const imageFile = await fs.readFile(image.filepath);
  const imageFileArray = new Uint8Array(imageFile);
  await uploadBytes(imageRef, imageFileArray, {
    contentType: image.mimetype || undefined,
  });

  const imageUrl = await getDownloadURL(imageRef);

  const response = await BookModel.create({
    title,
    author,
    imageUrl,
    imageRef: imageRef.fullPath,
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
          createdAt: {
            $gte: new Date(lastSync),
          },
        }
      : {}
  );

  return { books, lastSync: new Date().toISOString() };
};

export const booksService = {
  create,
  listNotSynced,
};

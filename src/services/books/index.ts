import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { Book } from '../../models/book';
import { CreateBookParams } from './types';
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
}: CreateBookParams) => {
  const imageExtension = image.originalFilename?.split('.').pop();
  const imageRef = ref(storage, `booksImages/${uuidV4()}.${imageExtension}`);
  const imageFile = await fs.readFile(image.filepath);
  await uploadBytes(imageRef, imageFile, {
    contentType: image.mimetype || undefined,
  });

  const imageUrl = await getDownloadURL(imageRef);

  const response = await Book.create({
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

export const booksService = {
  create,
};

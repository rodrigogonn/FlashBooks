import { Book } from '../../models/book';
import { CreateBookParams } from './types';

const create = async ({
  title,
  author,
  image,
  description,
  chapters,
  categoryIds,
  purchaseLink,
}: CreateBookParams) => {
  // @TODO subir image no storage
  const imageSrc = image.filepath;

  const response = await Book.create({
    title,
    author,
    imageSrc,
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

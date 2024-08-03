import { Request, Response } from 'express';
import { Book } from '../../models/book';
import {
  CreateBookRequestBody,
  CreateBookResponse,
  GetBookResponse,
} from './types';

// @TODO colocar validação da request
const create = async (
  req: Request<{}, {}, CreateBookRequestBody>,
  res: Response<CreateBookResponse>
) => {
  const { title, author, summary, chapters, categories, purchaseLink } =
    req.body;

  const response = await Book.create({
    title,
    author,
    summary,
    chapters,
    categories,
    purchaseLink,
  });

  return res.status(201).json({
    id: response.id,
    title: response.title,
  });
};

const list = async (req: Request, res: Response<GetBookResponse>) => {
  const books = await Book.find();

  return res.status(200).json(
    books.map((book) => ({
      id: book.id,
      title: book.title,
      author: book.author,
      summary: book.summary,
      chapters: book.chapters,
      categories: book.categories,
      purchaseLink: book.purchaseLink,
      createdAt: book.createdAt,
    }))
  );
};

export const booksController = {
  create,
  list,
};

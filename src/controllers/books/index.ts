import { Request, Response } from 'express';
import { Book } from '../../models/book';
import { CreateBookResponse, GetBookResponse } from './types';
import { bookValidation } from './validation';
import formidable from 'formidable';
import { booksService } from '../../services/books';
import { ApiResponse } from '../../interfaces/ApiResponse';

const create = async (req: Request, res: ApiResponse<CreateBookResponse>) => {
  const form = formidable({
    maxFileSize: 5 * 1024 * 1024, // 5MB
    keepExtensions: true,
  });

  form.parse(req, async (err, fields, files) => {
    try {
      if (err) {
        throw err;
      }

      const singleFields = Object.keys(fields).reduce((acc, key) => {
        acc[key] = fields[key]![0];
        return acc;
      }, {} as Record<string, string>);
      const image = files.image && files.image[0];

      const validatedData = bookValidation.safeParse({
        ...singleFields,
        image,
      });

      if (!validatedData.success) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          error: validatedData.error,
        });
      }

      const book = await booksService.create(validatedData.data);

      res.status(201).json({
        success: true,
        id: book.id,
      });
    } catch (error) {
      return res
        .status(400)
        .json({ success: false, message: 'Error creating book.', error });
    }
  });
};

const list = async (req: Request, res: Response<GetBookResponse>) => {
  const books = await Book.find();

  // return res.status(200).json(
  //   books.map((book) => ({
  //     id: book.id,
  //     title: book.title,
  //     author: book.author,
  //     summary: book.summary,
  //     chapters: book.chapters,
  //     categories: book.categories,
  //     purchaseLink: book.purchaseLink,
  //     createdAt: book.createdAt,
  //   }))
  // );
};

export const booksController = {
  create,
  list,
};

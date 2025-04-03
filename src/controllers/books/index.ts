import { Request } from 'express';
import {
  CreateBookResponse,
  ListBooksResponse,
  UpdateBookResponse,
  DeleteBookResponse,
} from './types';
import { createBookSchema, updateBookSchema } from './validation';
import formidable, { Fields, Files } from 'formidable';
import { booksService } from '../../services/books';
import { ApiResponse } from '../../interfaces/ApiResponse';

const create = async (req: Request, res: ApiResponse<CreateBookResponse>) => {
  const form = formidable({
    maxFileSize: 5 * 1024 * 1024, // 5MB
    keepExtensions: true,
  });

  const { error, fields, files } = await new Promise<{
    error: any;
    fields: Fields<string>;
    files: Files<string>;
  }>((resolve) => {
    form.parse(req, (error, fields, files) => {
      resolve({ error, fields, files });
    });
  });

  if (error) {
    return res
      .status(400)
      .json({ success: false, message: 'Error parsing form data', error });
  }

  const singleFields = Object.keys(fields).reduce((acc, key) => {
    acc[key] = fields[key]![0];
    return acc;
  }, {} as Record<string, string>);
  const image = files.image && files.image[0];

  const validatedData = createBookSchema.safeParse({
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
};

const list = async (req: Request, res: ApiResponse<ListBooksResponse>) => {
  const books = await booksService.list();
  res.status(200).json({
    success: true,
    books,
  });
};

const update = async (req: Request, res: ApiResponse<UpdateBookResponse>) => {
  const { id } = req.params;
  const form = formidable({
    maxFileSize: 5 * 1024 * 1024, // 5MB
    keepExtensions: true,
  });

  const { error, fields, files } = await new Promise<{
    error: any;
    fields: Fields<string>;
    files: Files<string>;
  }>((resolve) => {
    form.parse(req, (error, fields, files) => {
      resolve({ error, fields, files });
    });
  });

  if (error) {
    return res
      .status(400)
      .json({ success: false, message: 'Error parsing form data', error });
  }

  const singleFields = Object.keys(fields).reduce((acc, key) => {
    acc[key] = fields[key]![0];
    return acc;
  }, {} as Record<string, string>);
  const image = files.image && files.image[0];

  const validatedData = updateBookSchema.safeParse({
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

  await booksService.update(id, validatedData.data);

  res.status(200).json({
    success: true,
  });
};

const remove = async (req: Request, res: ApiResponse<DeleteBookResponse>) => {
  const { id } = req.params;
  await booksService.delete(id);

  res.status(200).json({
    success: true,
  });
};

export const booksController = {
  create,
  list,
  update,
  delete: remove,
};

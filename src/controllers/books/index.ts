import { Request } from 'express';
import { CreateBookResponse } from './types';
import { createBookSchema } from './validation';
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

export const booksController = {
  create,
};

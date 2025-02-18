import { Request } from 'express';
import { CreateBookCollectionResponse } from './types';
import { createBookCollectionSchema } from './validation';
import { ApiResponse } from '../../interfaces/ApiResponse';
import { bookCollectionsService } from '../../services/bookCollections';

const create = async (
  req: Request,
  res: ApiResponse<CreateBookCollectionResponse>
) => {
  const validatedData = createBookCollectionSchema.safeParse(req.body);

  if (!validatedData.success) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      error: validatedData.error,
    });
  }

  const { id } = await bookCollectionsService.create(validatedData.data);

  res.status(201).json({
    success: true,
    id,
  });
};

export const bookCollectionsController = {
  create,
};

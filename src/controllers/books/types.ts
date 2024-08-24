import { BookDocument } from '../../models/book';

export interface CreateBookResponse {
  id: string;
}

export type GetBookResponse = BookDocument[];

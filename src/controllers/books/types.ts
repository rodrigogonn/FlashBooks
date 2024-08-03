import MessageResponse from '../../interfaces/MessageResponse';
import { BookDocument } from '../../models/book';

export type CreateBookRequestBody = Omit<BookDocument, 'createdAt' | 'id'>;

interface SuccessResponse {
  id: string;
  title: string;
}
export type CreateBookResponse = SuccessResponse | MessageResponse;

export type GetBookResponse = BookDocument[];

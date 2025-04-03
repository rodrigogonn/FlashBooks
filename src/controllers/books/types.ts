import { Book } from '../../models/book';

export interface CreateBookResponse {
  id: string;
}

export interface ListBooksResponse {
  books: Book[];
}

export interface UpdateBookResponse {
  success: boolean;
}

export interface DeleteBookResponse {
  success: boolean;
}

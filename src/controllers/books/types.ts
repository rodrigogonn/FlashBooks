import { Book } from '../../models/book';

export interface CreateBookResponse {
  id: string;
}

export interface ListNotSyncedParams {
  lastSync?: string;
}
export interface ListNotSyncedReturn {
  books: Book[];
  lastSync: string;
}

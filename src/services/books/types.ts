import { File } from 'formidable';
import { BookDocument } from '../../models/book';

export interface CreateBookParams
  extends Omit<BookDocument, 'id' | 'imageUrl' | 'imageRef' | 'createdAt'> {
  image: File;
}

export interface ListNotSyncedParams {
  lastSync?: string;
}
export interface ListNotSyncedReturn {
  books: BookDocument[];
  lastSync: string;
}

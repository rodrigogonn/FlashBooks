import { File } from 'formidable';
import { Book } from '../../models/book';

export interface CreateBookParams
  extends Omit<
    Book,
    'id' | 'imageUrl' | 'imageRef' | 'createdAt' | 'updatedAt' | 'deletedAt'
  > {
  image: File;
}

export interface UpdateBookParams
  extends Omit<
    Book,
    'id' | 'imageUrl' | 'imageRef' | 'createdAt' | 'updatedAt' | 'deletedAt'
  > {
  image?: File;
}

export interface ListNotSyncedParams {
  lastSync?: string;
}

export interface ListNotSyncedReturn {
  books: Book[];
}

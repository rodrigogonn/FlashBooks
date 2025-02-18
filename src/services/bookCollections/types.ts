import { BookCollection } from '../../models/bookCollection';

export interface CreateBookCollectionParams
  extends Omit<
    BookCollection,
    'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'books'
  > {
  books: string[];
}

export interface ListNotSyncedParams {
  lastSync?: string;
}

export interface ListNotSyncedReturn {
  bookCollections: BookCollection[];
}

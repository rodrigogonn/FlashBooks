import { Book } from '../../models/book';
import { BookCollection } from '../../models/bookCollection';
export interface GetNotSyncedDataParams {
  lastSync?: string;
}
export interface NotSyncedData {
  books: Book[];
  bookCollections: BookCollection[];
  lastSync: string;
}

import { File } from 'formidable';
import { BookDocument } from '../../models/book';

export interface CreateBookParams
  extends Omit<BookDocument, 'id' | 'imageSrc' | 'createdAt'> {
  image: File;
}

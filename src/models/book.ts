import { Schema, model } from 'mongoose';

export interface BookDocument {
  id: string;
  title: string;
  author: string;
  summary: string;
  chapters: Array<{
    title: string;
    content: string;
  }>;
  categories?: string[];
  purchaseLink?: string;
  createdAt: Date;
}

const bookSchema = new Schema<BookDocument>({
  title: { type: String, required: true, unique: true },
  author: { type: String, required: true },
  summary: { type: String, required: true },
  chapters: [
    {
      title: { type: String, required: true },
      content: { type: String, required: true },
    },
  ],
  categories: [{ type: String }],
  purchaseLink: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

export const Book = model('Book', bookSchema);

import { Schema, model } from 'mongoose';

export enum ContentType {
  PARAGRAPH = 'PARAGRAPH',
}

interface Paragraph {
  type: ContentType.PARAGRAPH;
  text: string;
}

type ChapterContent = Paragraph;

interface Chapter {
  title: string;
  content: ChapterContent[];
}

export interface BookDocument {
  id: string;
  title: string;
  author: string;
  imageUrl: string;
  imageRef: string;
  description: string;
  chapters: Chapter[];
  categoryIds?: number[];
  purchaseLink?: string;
  createdAt: Date;
}

const chapterSchema = new Schema(
  {
    title: { type: String, required: true },
    content: [
      {
        type: {
          type: String,
          enum: Object.values(ContentType),
          required: true,
        },
        text: { type: String, required: true },
      },
    ],
  },
  { _id: false }
);

const bookSchema = new Schema<BookDocument>({
  title: { type: String, required: true, unique: true },
  author: { type: String, required: true },
  imageUrl: { type: String, required: true },
  imageRef: { type: String, required: true },
  description: { type: String, required: true },
  chapters: {
    type: [chapterSchema],
    required: true,
    validate: {
      validator: function (v: any) {
        return v && v.length > 0;
      },
      message: 'A book must have at least one chapter.',
    },
  },
  categoryIds: [{ type: Number, required: true }],
  purchaseLink: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

export const Book = model('Book', bookSchema);

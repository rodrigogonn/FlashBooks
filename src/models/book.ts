import { Schema, model } from 'mongoose';

export enum ContentType {
  PARAGRAPH = 'PARAGRAPH',
  KEY_POINT = 'KEY_POINT',
}

export enum KeyPointType {
  QUOTE = 'QUOTE',
  LESSON = 'LESSON',
  INSIGHT = 'INSIGHT',
  MOMENT = 'MOMENT',
  CONCEPT = 'CONCEPT',
}

interface Paragraph {
  type: ContentType.PARAGRAPH;
  text: string;
}

interface KeyPoint {
  type: ContentType.KEY_POINT;
  keyPointType: KeyPointType;
  text: string;
  context?: string;
  reference?: string;
}

type ChapterContent = Paragraph | KeyPoint;

interface Chapter {
  title: string;
  content: ChapterContent[];
}

export interface Book {
  id: string;
  title: string;
  author: string;
  imageUrl: string;
  imageRef: string;
  description: string;
  chapters: Chapter[];
  categoryIds?: number[];
  purchaseLink?: string;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
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
        keyPointType: {
          type: String,
          enum: Object.values(KeyPointType),
          required: function (this: any) {
            return this.type === ContentType.KEY_POINT;
          },
        },
        text: { type: String, required: true },
        context: { type: String },
        reference: { type: String },
      },
    ],
  },
  { _id: false }
);

const bookSchema = new Schema<Book>(
  {
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
    purchaseLink: { type: String },
    deletedAt: { type: Date },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (_doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const BookModel = model('Book', bookSchema);

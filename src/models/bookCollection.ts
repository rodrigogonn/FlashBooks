import { Schema, model, Types } from 'mongoose';

export interface BookCollection {
  id: string;
  name: string;
  books: Types.ObjectId[];
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const bookCollectionSchema = new Schema<BookCollection>(
  {
    name: { type: String, required: true },
    books: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Book',
        required: true,
      },
    ],
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

export const BookCollectionModel = model<BookCollection>(
  'BookCollection',
  bookCollectionSchema
);

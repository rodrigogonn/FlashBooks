import mongoose from 'mongoose';
import { env } from '../environment';
import { Book } from '../models/book';
import { User } from '../models/user';

const connect = async () => {
  try {
    await mongoose.connect(env.MONGODB_URI);
    await User.createIndexes();
    await Book.createIndexes();
  } catch {}
};

export const database = {
  connect,
};

import mongoose from 'mongoose';
import { env } from '../environment';
import { Book } from '../models/book';
import { User } from '../models/user';

const connect = async () => {
  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log('Conectado ao MongoDB');

    await User.createIndexes();
    await Book.createIndexes();
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error);
    process.exit(1);
  }
};

export const database = {
  connect,
};

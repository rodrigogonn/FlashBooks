import bcrypt from 'bcryptjs';
import { UserModel } from '../../models/user';
import { CreateUserParams } from './types';

const BCRYPT_ROUNDS = 10;

const create = async ({ googleId, email, username }: CreateUserParams) => {
  const userAlreadyExists = await UserModel.exists({ email });
  if (userAlreadyExists) {
    throw new Error('User already exists.');
  }

  const response = await UserModel.create({ googleId, email, username });

  return {
    id: response.id,
    username: response.username,
    email: response.email,
  };
};

const findByEmail = async (email: string) => {
  return UserModel.findOne({ email });
};

const findById = async (id: string) => {
  return UserModel.findById(id);
};

const setPassword = async (userId: string, password: string) => {
  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  await UserModel.updateOne({ _id: userId }, { passwordHash });
};

const verifyPassword = async (
  passwordHash: string | undefined,
  password: string
) => {
  if (!passwordHash) return false;
  return bcrypt.compare(password, passwordHash);
};

export const usersService = {
  create,
  findByEmail,
  findById,
  setPassword,
  verifyPassword,
};

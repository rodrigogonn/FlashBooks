import { UserModel } from '../../models/user';
import { CreateUserParams } from './types';

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

export const usersService = {
  create,
  findByEmail,
};

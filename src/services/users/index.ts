import { User } from '../../models/user';
import { CreateUserParams } from './types';

const create = async ({ googleId, email, username }: CreateUserParams) => {
  const userAlreadyExists = await User.exists({ email });
  if (userAlreadyExists) {
    throw new Error('User already exists.');
  }

  const response = await User.create({ googleId, email, username });

  return {
    id: response.id,
    username: response.username,
    email: response.email,
  };
};

const findByEmail = async (email: string) => {
  return User.findOne({ email });
};

export const usersService = {
  create,
  findByEmail,
};

import { User } from '../../models/user';
import { CreateUserParams } from './types';

const create = async ({ email, password, username }: CreateUserParams) => {
  const userAlreadyExists = await User.exists({ email });
  if (userAlreadyExists) {
    throw new Error('User already exists.');
  }

  const response = await User.create({ username, email, password });

  return {
    id: response.id,
    username: response.username,
    email: response.email,
  };
};

export const usersService = {
  create,
};

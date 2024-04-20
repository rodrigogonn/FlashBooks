import { Request, Response } from 'express';
import { User } from '../../models/user';
import { CreateUserRequestBody, CreateUserResponse } from './types';

const create = async (
  req: Request<{}, {}, CreateUserRequestBody>,
  res: Response<CreateUserResponse>
) => {
  const { username, email, password } = req.body;

  if (
    !username ||
    typeof username !== 'string' ||
    !email ||
    typeof email !== 'string' ||
    !password ||
    typeof password !== 'string'
  ) {
    return res
      .status(400)
      .json({ message: 'Invalid username, email or password.' });
  }

  const userAlreadyExists = await User.exists({ email });
  if (userAlreadyExists) {
    return res.status(400).json({ message: 'User already exists.' });
  }

  const response = await User.create({ username, email, password });

  return res.status(201).json({
    id: response.id,
    username: response.username,
    email: response.email,
  });
};

export const usersController = {
  create,
};

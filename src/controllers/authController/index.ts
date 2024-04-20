import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../../environment';
import { User } from '../../models/user';
import { JwtPayload } from '../../types/jwtPayload.interface';
import { LoginRequestBody, LoginResponse } from './types';

const login = async (
  req: Request<{}, {}, LoginRequestBody>,
  res: Response<LoginResponse>
) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: 'Email and password are required.' });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  // @TODO melhorar isso aqui com bcrypt
  const isPasswordValid = password === user.password;
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  const tokenPayload: JwtPayload = {
    userId: user.id,
  };
  // @TODO adicionar expiração do token
  const token = jwt.sign(tokenPayload, env.JWT_SECRET);

  return res.json({ token });
};

export const authController = {
  login,
};

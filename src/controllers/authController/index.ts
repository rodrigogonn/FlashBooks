import { env } from '@/environment';
import { JwtPayload } from '@/types/jwtPayload.interface';
import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { LoginRequestBody, LoginResponse } from './types';

const prisma = new PrismaClient();

const login = async (
  req: Request<{}, {}, LoginRequestBody>,
  res: Response<LoginResponse>
) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: 'Username and password are required.' });
  }

  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });

  if (!user) {
    return res.status(401).json({ message: 'Invalid username or password.' });
  }

  const isPasswordValid = password === user.password;
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid username or password.' });
  }

  const tokenPayload: JwtPayload = {
    userId: user.id,
  };
  // @TODO adicionar expiração do token
  const token = jwt.sign(tokenPayload, env.JWT_SECRET);

  res.json({ token });
};

export const authController = {
  login,
};

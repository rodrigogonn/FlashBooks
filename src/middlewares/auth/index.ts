import { env } from '@/environment';
import ErrorResponse from '@/interfaces/ErrorResponse';
import { JwtPayload } from '@/types/jwtPayload.interface';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const auth = (
  req: Request,
  res: Response<ErrorResponse>,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).send({ message: 'No token provided.' });
  }

  const tokenParts = authHeader.split(' ');
  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    return res.status(400).send({ message: 'Invalid authorization header.' });
  }

  const token = tokenParts[1];

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(400).send({ message: 'Invalid token.' });
  }
};

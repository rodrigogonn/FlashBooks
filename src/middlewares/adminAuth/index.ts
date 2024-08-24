import { NextFunction, Request, Response } from 'express';
import { env } from '../../environment';
import { ErrorResponse } from '../../interfaces/ErrorResponse';
import jwt from 'jsonwebtoken';

export const adminAuth = (
  req: Request,
  res: Response<ErrorResponse>,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res
      .status(401)
      .send({ success: false, message: 'No token provided.' });
  }

  const tokenParts = authHeader.split(' ');
  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    return res
      .status(401)
      .send({ success: false, message: 'Invalid authorization header.' });
  }

  const token = tokenParts[1];

  try {
    jwt.verify(token, env.ADM_JWT_SECRET);
    return next();
  } catch {
    return res.status(401).send({ success: false, message: 'Invalid token.' });
  }
};

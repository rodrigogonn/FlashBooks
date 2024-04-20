import { NextFunction, Request, Response } from 'express';
import { env } from '../../environment';
import ErrorResponse from '../../interfaces/ErrorResponse';

export const adminAuth = (
  req: Request,
  res: Response<ErrorResponse>,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).send({ message: 'No token provided.' });
  }

  const authHeaderParts = authHeader.split(' ');
  if (authHeaderParts.length !== 2 || authHeaderParts[0] !== 'Basic') {
    return res.status(400).send({ message: 'Invalid authorization header.' });
  }

  const credentials = Buffer.from(authHeaderParts[1], 'base64').toString(
    'ascii'
  );

  if (credentials !== env.ADMIN_SECRET) {
    return res.status(400).send({ message: 'Invalid token.' });
  }

  return next();
};

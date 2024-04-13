import { NextFunction, Request, Response } from 'express';
import { connection } from 'mongoose';

export const waitForDatabase = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (connection.readyState === 1) {
    next();
  } else {
    connection.once('connected', () => {
      next();
    });
  }
};

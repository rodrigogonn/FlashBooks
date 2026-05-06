import { NextFunction, Request, Response } from 'express';
import { connection, ConnectionStates } from 'mongoose';
import { database } from '../../database';

export const waitForDatabase = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (connection.readyState === ConnectionStates.connected) {
    return next();
  }

  try {
    await database.connect();
    return next();
  } catch (err) {
    console.error(
      '[db] waitForDatabase: connect failed:',
      (err as Error).message
    );
    return res.status(503).json({
      message: 'Service Unavailable: failed to connect to the database',
    });
  }
};

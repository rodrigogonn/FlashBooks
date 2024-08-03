import { NextFunction, Request, Response } from 'express';
import { connection, ConnectionStates } from 'mongoose';

export const waitForDatabase = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  switch (connection.readyState) {
    case ConnectionStates.connected: {
      next();
      break;
    }
    case ConnectionStates.disconnected: {
      return res.status(503).json({
        message: 'Service Unavailable: failed to connect to the database',
      });
    }
    default: {
      connection.once('connected', () => {
        next();
      });
      break;
    }
  }
};

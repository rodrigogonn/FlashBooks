import { RequestHandler, Response } from 'express';
import { env } from '../../environment';
import { ErrorResponse } from '../../interfaces/ErrorResponse';

export const errorHandler =
  (fn: RequestHandler): RequestHandler =>
  (req, res: Response<ErrorResponse & { stack: string }>, next) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
      console.log('[errorHandler]', error);

      res.status(500).json({
        success: false,
        message: env.IS_PRODUCTION ? 'Internal Server Error' : error.message,
        stack: env.IS_PRODUCTION ? '🥞' : error.stack,
      });
    });
  };

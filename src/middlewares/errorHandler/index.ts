import { env } from 'environment';
import { RequestHandler } from 'express';

export const errorHandler =
  (fn: RequestHandler): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
      res.status(500).json({
        message: env.IS_PRODUCTION ? 'Internal Server Error' : error.message,
        stack: env.IS_PRODUCTION ? '🥞' : error.stack,
      });
    });
  };

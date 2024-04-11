import { auth } from './auth';
import { errorHandler } from './errorHandler';
import { notFound } from './notFound';

export const middlewares = {
  notFound,
  errorHandler,
  auth,
};

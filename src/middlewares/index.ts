import { auth } from './auth';
import { errorHandler } from './errorHandler';
import { notFound } from './notFound';
import { waitForDatabase } from './waitForDatabase';

export const middlewares = {
  notFound,
  errorHandler,
  auth,
  waitForDatabase,
};

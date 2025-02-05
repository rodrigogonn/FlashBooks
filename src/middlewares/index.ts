import { auth } from './auth';
import { activeSubscriptionAuth } from './activeSubscriptionAuth';
import { errorHandler } from './errorHandler';
import { notFound } from './notFound';
import { waitForDatabase } from './waitForDatabase';
import { googleAuth } from './googleAuth';
import { adminAuth } from './adminAuth';

export const middlewares = {
  notFound,
  errorHandler,
  auth,
  waitForDatabase,
  activeSubscriptionAuth,
  googleAuth,
  adminAuth,
};

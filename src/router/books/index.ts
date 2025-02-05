import express from 'express';
import { booksController } from '../../controllers/books';
import { errorHandler } from '../../middlewares/errorHandler';
import { middlewares } from '../../middlewares';

const router = express.Router();

router.get(
  '/',
  middlewares.activeSubscriptionAuth,
  errorHandler(booksController.listNotSynced)
);
router.post('/', middlewares.adminAuth, errorHandler(booksController.create));

export default router;

import express from 'express';
import { booksController } from '../../controllers/books';
import { errorHandler } from '../../middlewares/errorHandler';
import { middlewares } from '../../middlewares';

const router = express.Router();

router.post('/', middlewares.adminAuth, errorHandler(booksController.create));
router.get('/', middlewares.adminAuth, errorHandler(booksController.list));
router.put('/:id', middlewares.adminAuth, errorHandler(booksController.update));
router.delete(
  '/:id',
  middlewares.adminAuth,
  errorHandler(booksController.delete)
);

export default router;

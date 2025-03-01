import express from 'express';
import { booksController } from '../../controllers/books';
import { errorHandler } from '../../middlewares/errorHandler';
import { middlewares } from '../../middlewares';

const router = express.Router();

router.post('/', middlewares.adminAuth, errorHandler(booksController.create));

export default router;

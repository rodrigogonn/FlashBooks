import express from 'express';
import { booksController } from '../../controllers/books';
import { adminAuth } from '../../middlewares/adminAuth';
import { errorHandler } from '../../middlewares/errorHandler';
import { auth } from '../../middlewares/auth';

const router = express.Router();

router.get('/', auth, errorHandler(booksController.listNotSynced));
router.post('/', adminAuth, errorHandler(booksController.create));

export default router;

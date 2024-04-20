import express from 'express';
import { booksController } from '../../controllers/booksController';
import { adminAuth } from '../../middlewares/adminAuth';
import { errorHandler } from '../../middlewares/errorHandler';

const router = express.Router();

router.get('/', errorHandler(booksController.list));
router.post('/', adminAuth, errorHandler(booksController.create));

export default router;

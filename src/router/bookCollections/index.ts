import express from 'express';
import { bookCollectionsController } from '../../controllers/bookCollections';
import { errorHandler } from '../../middlewares/errorHandler';
import { middlewares } from '../../middlewares';

const router = express.Router();

router.post(
  '/',
  middlewares.adminAuth,
  errorHandler(bookCollectionsController.create)
);

export default router;

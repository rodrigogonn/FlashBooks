import express from 'express';
import { errorHandler } from '../../middlewares/errorHandler';
import { middlewares } from '../../middlewares';
import { syncController } from '../../controllers/sync';

const router = express.Router();

router.get(
  '/',
  middlewares.activeSubscriptionAuth,
  errorHandler(syncController.getNotSyncedData)
);

export default router;

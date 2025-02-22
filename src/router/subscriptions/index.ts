import express from 'express';
import { errorHandler } from '../../middlewares/errorHandler';
import { middlewares } from '../../middlewares';
import { subscriptionsController } from '../../controllers/subscriptions';

const router = express.Router();

router.get(
  '/',
  middlewares.auth,
  errorHandler(subscriptionsController.getActiveSubscriptions)
);

export default router;

import express from 'express';
import { errorHandler } from '../../middlewares/errorHandler';
import { webhooksController } from '../../controllers/webhooks';
import { middlewares } from '../../middlewares';

const router = express.Router();

router.post(
  '/payments',
  middlewares.googleAuth,
  errorHandler(webhooksController.payments)
);
router.post(
  '/payments/dlq',
  middlewares.googleAuth,
  errorHandler(webhooksController.paymentsDLQ)
);

export default router;

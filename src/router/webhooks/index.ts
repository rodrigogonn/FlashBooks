import express from 'express';
import { errorHandler } from '../../middlewares/errorHandler';
import { webhooksController } from '../../controllers/webhooks';
import { googleAuth } from '../../middlewares/googleAuth';

const router = express.Router();

router.post('/payments', googleAuth, errorHandler(webhooksController.payments));
router.post(
  '/payments/dlq',
  googleAuth,
  errorHandler(webhooksController.paymentsDLQ)
);

export default router;

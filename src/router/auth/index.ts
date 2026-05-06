import express from 'express';
import { authController } from '../../controllers/auth';
import { errorHandler } from '../../middlewares/errorHandler';
import { auth } from '../../middlewares/auth';

const router = express.Router();

router.post('/loginWithGoogle', errorHandler(authController.loginWithGoogle));
router.post(
  '/loginWithPassword',
  errorHandler(authController.loginWithPassword)
);
router.post(
  '/setPassword',
  auth,
  errorHandler(authController.setPassword)
);
router.post('/admLogin', errorHandler(authController.admLogin));

export default router;

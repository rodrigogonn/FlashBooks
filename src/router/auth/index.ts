import express from 'express';
import { authController } from '../../controllers/auth';
import { errorHandler } from '../../middlewares/errorHandler';

const router = express.Router();

router.post('/loginWithGoogle', errorHandler(authController.loginWithGoogle));

export default router;

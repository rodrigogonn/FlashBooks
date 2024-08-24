import express from 'express';
import { authController } from '../../controllers/auth';
import { errorHandler } from '../../middlewares/errorHandler';

const router = express.Router();

router.post('/loginWithGoogle', errorHandler(authController.loginWithGoogle));
router.post('/admLogin', errorHandler(authController.admLogin));

export default router;

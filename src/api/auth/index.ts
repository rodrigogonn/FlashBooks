import { authController } from '@/controllers/authController';
import { errorHandler } from '@/middlewares/errorHandler';
import express from 'express';

const router = express.Router();

router.post('/login', errorHandler(authController.login));

export default router;

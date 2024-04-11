import { authController } from 'controllers/authController';
import express from 'express';
import { errorHandler } from 'middlewares/errorHandler';

const router = express.Router();

router.post('/login', errorHandler(authController.login));

export default router;

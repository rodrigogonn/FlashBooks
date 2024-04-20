import express from 'express';
import { usersController } from '../../controllers/usersController';
import { errorHandler } from '../../middlewares/errorHandler';

const router = express.Router();

router.post('/', errorHandler(usersController.create));

export default router;

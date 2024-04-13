import express from 'express';

import MessageResponse from '../interfaces/MessageResponse';
import { User } from '../models/user';
import auth from './auth';
import emojis from './emojis';

const router = express.Router();

router.get<{}, MessageResponse>('/', async (req, res) => {
  const users = await User.find();

  res.json({
    message: 'API - 👋🌎🌍🌏',
    users,
  } as MessageResponse);
});

router.use('/emojis', emojis);
router.use('/auth', auth);

export default router;

import express from 'express';

import { PrismaClient } from '@prisma/client';
import MessageResponse from '../interfaces/MessageResponse';
import emojis from './emojis';

const router = express.Router();

router.get<{}, MessageResponse>('/', async (req, res) => {
  const prisma = new PrismaClient();

  const users = await prisma.user.findMany();
  res.json({
    message: 'API - 👋🌎🌍🌏',
    users,
  } as MessageResponse);
});

router.use('/emojis', emojis);

export default router;

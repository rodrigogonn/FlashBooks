import express from 'express';

import auth from './auth';
import books from './books';
import webhooks from './webhooks';

const router = express.Router();

router.use('/auth', auth);
router.use('/books', books);
router.use('/webhooks', webhooks);

export default router;

import express from 'express';

import auth from './auth';
import books from './books';
import sync from './sync';
import webhooks from './webhooks';
import bookCollections from './bookCollections';
import subscriptions from './subscriptions';
const router = express.Router();

router.use('/auth', auth);
router.use('/books', books);
router.use('/bookCollections', bookCollections);
router.use('/sync', sync);
router.use('/webhooks', webhooks);
router.use('/subscriptions', subscriptions);

export default router;

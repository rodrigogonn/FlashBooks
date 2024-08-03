import express from 'express';

import auth from './auth';
import books from './books';

const router = express.Router();

router.use('/auth', auth);
router.use('/books', books);

export default router;

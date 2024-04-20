import express from 'express';

import auth from './auth';
import books from './books';
import users from './users';

const router = express.Router();

router.use('/auth', auth);
router.use('/users', users);
router.use('/books', books);

export default router;

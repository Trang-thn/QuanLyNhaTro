import { Router } from 'express';
import { getMe } from '../controllers/users';
import { authenticate } from '../middleware/auth';

export const usersRouter = Router();

usersRouter.get('/me', authenticate, getMe);

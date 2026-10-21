import { Router } from 'express';
import { getMe, updateMe, changePassword } from '../controllers/users';
import { authenticate } from '../middleware/auth';

export const usersRouter = Router();

usersRouter.get('/me', authenticate, getMe);
usersRouter.put('/me', authenticate, updateMe);
usersRouter.put('/me/password', authenticate, changePassword);

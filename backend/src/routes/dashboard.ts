import { Router } from 'express';
import { getOverview } from '../controllers/dashboard';
import { allowRoles, authenticate } from '../middleware/auth';

export const dashboardRouter = Router();

dashboardRouter.get('/overview', authenticate, allowRoles('ADMIN'), getOverview);

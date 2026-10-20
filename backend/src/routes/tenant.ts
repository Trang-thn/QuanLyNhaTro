import { Router } from 'express';
import { getTenantDashboard, getTenantProfile } from '../controllers/tenant';
import { authenticate, allowRoles } from '../middleware/auth';

export const tenantRouter = Router();
tenantRouter.use(authenticate, allowRoles('TENANT'));
tenantRouter.get('/profile', getTenantProfile);
tenantRouter.get('/dashboard', getTenantDashboard);
tenantRouter.get('/settings', getTenantProfile);

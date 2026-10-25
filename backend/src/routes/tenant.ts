import { Router } from 'express';
import { createNewTenant, getTenantDashboard, getTenantDetail, getTenantProfile, getTenants, updateExistingTenant } from '../controllers/tenant';
import { authenticate, allowRoles } from '../middleware/auth';

export const tenantRouter = Router();
tenantRouter.use(authenticate, allowRoles('TENANT'));
tenantRouter.get('/profile', getTenantProfile);
tenantRouter.get('/dashboard', getTenantDashboard);
tenantRouter.get('/settings', getTenantProfile);
tenantRouter.get('/manage', getTenants);
tenantRouter.get('/manage/:id', getTenantDetail);
tenantRouter.post('/manage', createNewTenant);
tenantRouter.patch('/manage/:id', updateExistingTenant);
// Các API quản lý khách thuê dành cho ADMIN
tenantRouter.get(
  '/manage',
  authenticate,
  allowRoles('ADMIN'),
  getTenants,
);

tenantRouter.get(
  '/manage/:id',
  authenticate,
  allowRoles('ADMIN'),
  getTenantDetail,
);

tenantRouter.post(
  '/manage',
  authenticate,
  allowRoles('ADMIN'),
  createNewTenant,
);

tenantRouter.patch(
  '/manage/:id',
  authenticate,
  allowRoles('ADMIN'),
  updateExistingTenant,
);
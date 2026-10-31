import { Router } from 'express';
import {
  createNewTenant,
  deleteExistingTenant,
  getTenantDashboard,
  getTenantDetail,
  getTenantProfile,
  getTenants,
  updateExistingTenant,
} from '../controllers/tenant';
import { authenticate, allowRoles } from '../middleware/auth';

export const tenantRouter = Router();

// ==================== API DÀNH CHO TENANT ====================
tenantRouter.get(
  '/profile',
  authenticate,
  allowRoles('TENANT'),
  getTenantProfile,
);

tenantRouter.get(
  '/dashboard',
  authenticate,
  allowRoles('TENANT'),
  getTenantDashboard,
);

tenantRouter.get(
  '/settings',
  authenticate,
  allowRoles('TENANT'),
  getTenantProfile,
);

// ==================== API QUẢN LÝ KHÁCH THUÊ DÀNH CHO ADMIN ====================
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

tenantRouter.delete(
  '/manage/:id',
  authenticate,
  allowRoles('ADMIN'),
  deleteExistingTenant,
);


import { Router } from 'express';
import {
  getTenants,
  getTenantDetail,
  createNewTenant,
  updateExistingTenant,
  deleteExistingTenant,
} from '../controllers/tenant';
import { authenticate, allowRoles } from '../middleware/auth';

export const tenantsRouter = Router();

// Chỉ ADMIN được quản lý danh sách khách thuê
tenantsRouter.use(authenticate, allowRoles('ADMIN'));

tenantsRouter.get('/', getTenants);
tenantsRouter.get('/:id', getTenantDetail);
tenantsRouter.post('/', createNewTenant);
tenantsRouter.patch('/:id', updateExistingTenant);
tenantsRouter.delete('/:id', deleteExistingTenant);

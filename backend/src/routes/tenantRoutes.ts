import { Router } from 'express';
import {
  getAllTenants,
  getTenantById,
  getTenantByCCCD,
  createTenant,
  updateTenant,
  deleteTenant,
} from '../controllers/tenantController';
import { authenticate, allowRoles } from '../middleware/auth';

export const tenantRouter = Router();

// Yêu cầu xác thực ADMIN cho module quản lý khách thuê
tenantRouter.get('/', authenticate, allowRoles('ADMIN'), getAllTenants);
tenantRouter.get('/cccd/:cccd', authenticate, allowRoles('ADMIN'), getTenantByCCCD); // Đặt route cụ thể lên trước /:id
tenantRouter.get('/:id', authenticate, allowRoles('ADMIN'), getTenantById);
tenantRouter.post('/', authenticate, allowRoles('ADMIN'), createTenant);
tenantRouter.put('/:id', authenticate, allowRoles('ADMIN'), updateTenant);
tenantRouter.delete('/:id', authenticate, allowRoles('ADMIN'), deleteTenant);
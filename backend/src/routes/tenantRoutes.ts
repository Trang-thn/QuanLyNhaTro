import { Router } from 'express';
import {
  getAllTenants,
  getTenantById,
  getTenantByCCCD,
  createTenant,
  updateTenant,
  deleteTenant,
} from '../controllers/tenantController';

export const tenantRouter = Router();

tenantRouter.get('/', getAllTenants);
tenantRouter.get('/:id', getTenantById);
tenantRouter.get('/cccd/:cccd', getTenantByCCCD);
tenantRouter.post('/', createTenant);
tenantRouter.put('/:id', updateTenant);
tenantRouter.delete('/:id', deleteTenant);
import { Router } from 'express';
import { authenticate, allowRoles } from '../middleware/auth';
import {
  createMaintenanceRequest,
  getMaintenanceRequest,
  listMaintenanceRequests,
  listTenantRooms,
  updateMaintenanceRequest,
} from '../controllers/maintenance';

export const maintenanceRouter = Router();

maintenanceRouter.use(authenticate);
maintenanceRouter.get('/', listMaintenanceRequests);
maintenanceRouter.post('/', allowRoles('TENANT'), createMaintenanceRequest);
maintenanceRouter.get('/rooms', allowRoles('TENANT'), listTenantRooms);
maintenanceRouter.get('/:id', getMaintenanceRequest);
maintenanceRouter.patch('/:id', allowRoles('ADMIN'), updateMaintenanceRequest);


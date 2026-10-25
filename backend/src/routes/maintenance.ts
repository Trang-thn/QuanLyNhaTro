import express, { NextFunction, Request, Response, Router } from 'express';
import { authenticate, allowRoles } from '../middleware/auth';
import {
  createMaintenanceRequest,
  deleteUnattachedMaintenanceImage,
  getMaintenanceImage,
  getMaintenanceRequest,
  listMaintenanceRequests,
  listTenantRooms,
  uploadMaintenanceImage,
  updateMaintenanceRequest,
} from '../controllers/maintenance';

export const maintenanceRouter = Router();

maintenanceRouter.use(authenticate);
const parseRawImage = express.raw({ type: 'application/octet-stream', limit: '5mb' });
maintenanceRouter.post('/images', allowRoles('TENANT'), (req: Request, res: Response, next: NextFunction) => {
  parseRawImage(req, res, (error?: unknown) => {
    if (error) {
      const status = (error as { status?: number }).status;
      return res.status(status === 413 ? 413 : 400).json({ message: status === 413 ? 'Image must be 5 MB or smaller' : 'Invalid image upload' });
    }
    return next();
  });
}, uploadMaintenanceImage);
maintenanceRouter.get('/images/:filename', getMaintenanceImage);
maintenanceRouter.delete('/images/:filename', allowRoles('TENANT'), deleteUnattachedMaintenanceImage);
maintenanceRouter.get('/', listMaintenanceRequests);
maintenanceRouter.post('/', allowRoles('TENANT'), createMaintenanceRequest);
maintenanceRouter.get('/rooms', allowRoles('TENANT'), listTenantRooms);
maintenanceRouter.get('/:id', getMaintenanceRequest);
maintenanceRouter.patch('/:id', allowRoles('ADMIN'), updateMaintenanceRequest);


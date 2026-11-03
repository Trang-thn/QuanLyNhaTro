import { Router } from 'express';
import { getMe } from '../controllers/users';
import { approveTenantRegistrationRequest, listTenantRegistrations } from '../controllers/admin';
import { authenticate, allowRoles } from '../middleware/auth';

export const adminRouter = Router();
adminRouter.get('/settings', authenticate, allowRoles('ADMIN'), getMe);
adminRouter.get('/tenant-registrations', authenticate, allowRoles('ADMIN'), listTenantRegistrations);
adminRouter.post('/tenant-registrations/:requestId/approve', authenticate, allowRoles('ADMIN'), approveTenantRegistrationRequest);

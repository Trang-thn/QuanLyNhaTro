import { Router } from 'express';
import { createContract, terminateContract } from '../controllers/contractController';
import { authenticate, allowRoles } from '../middleware/auth';

export const contractRouter = Router();

contractRouter.post('/', authenticate, allowRoles('ADMIN'), createContract);
contractRouter.put('/:id/terminate', authenticate, allowRoles('ADMIN'), terminateContract);
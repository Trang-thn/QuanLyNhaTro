import { Router } from 'express';
import {
  getAllContracts,
  createContract,
  renewContract,
  terminateContract,
} from '../controllers/contractController';

export const contractRouter = Router();

contractRouter.get('/', getAllContracts);
contractRouter.post('/', createContract);
contractRouter.post('/:id/renew', renewContract);
contractRouter.post('/:id/terminate', terminateContract);
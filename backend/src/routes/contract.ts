
import { Router } from 'express';

import {
  getContracts,
  getContractDetail,
  createNewContract,
  updateExistingContract,
  removeContract,
} from '../controllers/contract';

import { authenticate, allowRoles } from '../middleware/auth';

const contractRouter = Router();

// Yêu cầu đăng nhập và quyền ADMIN cho tất cả API hợp đồng
contractRouter.use(authenticate);
contractRouter.use(allowRoles('ADMIN'));

// GET /api/v1/contracts
// Lấy danh sách hợp đồng
contractRouter.get('/', getContracts);

// GET /api/v1/contracts/:id
// Lấy thông tin chi tiết một hợp đồng
contractRouter.get('/:id', getContractDetail);

// POST /api/v1/contracts
// Thêm hợp đồng mới
contractRouter.post('/', createNewContract);

// PATCH /api/v1/contracts/:id
// Cập nhật hợp đồng
contractRouter.patch('/:id', updateExistingContract);

// DELETE /api/v1/contracts/:id
// Xóa hợp đồng
contractRouter.delete('/:id', removeContract);

export { contractRouter };


import { Router } from 'express';
import {
  getTenantContracts,
  getTenantContractDetail,
  getMyTenantContracts,

   createTenantContractHandler,
  terminateTenantContractHandler,
} from '../controllers/tenantContract';

import { authenticate, allowRoles } from '../middleware/auth';

export const tenantContractRouter = Router();

// Tất cả API hợp đồng đều yêu cầu đăng nhập
tenantContractRouter.use(authenticate);

// ADMIN và TENANT đều được xem danh sách hợp đồng.
// Lưu ý: controller phải lọc hợp đồng theo quyền của từng người dùng.
tenantContractRouter.get(
  '/',
  allowRoles('ADMIN', 'TENANT'),
  getTenantContracts,
);
tenantContractRouter.get(
  '/me',
  allowRoles('TENANT'),
  getMyTenantContracts,
);
// ADMIN và TENANT đều được xem chi tiết,
// nhưng controller phải xác minh khách thuê chỉ xem được hợp đồng của mình.
tenantContractRouter.get(
  '/:id',
  allowRoles('ADMIN', 'TENANT'),
  getTenantContractDetail,
);

// Chỉ ADMIN được lập hợp đồng
tenantContractRouter.post(
  '/',
  allowRoles('ADMIN'),
  createTenantContractHandler,
);

// Chỉ ADMIN được thanh lý hợp đồng
tenantContractRouter.put(
  '/:id/terminate',
  allowRoles('ADMIN'),
  terminateTenantContractHandler,
);

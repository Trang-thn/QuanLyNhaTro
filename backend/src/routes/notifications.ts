import { Router } from 'express';
import { authenticate, allowRoles } from '../middleware/auth';

import {
  getInboxNotifications,
  getNotificationRecipients,
  getSentNotifications,
  patchNotificationRead,
  postNotification,
  removeAllSentNotifications,
  removeNotification,
  postContractExtensionRequest,
  patchContractExtensionRequest,
} from '../controllers/notifications';

export const notificationsRouter = Router();

notificationsRouter.use(authenticate);

// Thông báo nhận được: Admin và khách thuê đều có thể xem
notificationsRouter.get('/inbox', allowRoles('ADMIN', 'TENANT'), getInboxNotifications);

// Đánh dấu đã đọc
notificationsRouter.patch('/:id/read', allowRoles('ADMIN', 'TENANT'), patchNotificationRead);

// Khách thuê gửi yêu cầu gia hạn
notificationsRouter.post(
  '/contract-extension',
  
  allowRoles('TENANT'),
  postContractExtensionRequest,
);

// Admin duyệt hoặc từ chối yêu cầu gia hạn
notificationsRouter.patch(
  '/:id/contract-extension',
  allowRoles('ADMIN'),
  patchContractExtensionRequest,
);

// Các chức năng thông báo cũ dành cho Admin
notificationsRouter.get('/sent', allowRoles('ADMIN'), getSentNotifications);
notificationsRouter.get('/recipients', allowRoles('ADMIN'), getNotificationRecipients);
notificationsRouter.post('/', allowRoles('ADMIN'), postNotification);
notificationsRouter.delete('/sent', allowRoles('ADMIN'), removeAllSentNotifications);
 notificationsRouter.delete('/:id', allowRoles('ADMIN'), removeNotification);
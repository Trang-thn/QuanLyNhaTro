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
} from '../controllers/notifications';

export const notificationsRouter = Router();

notificationsRouter.use(authenticate);
notificationsRouter.get('/inbox', allowRoles('TENANT'), getInboxNotifications);
notificationsRouter.patch('/:id/read', allowRoles('TENANT'), patchNotificationRead);
notificationsRouter.get('/sent', allowRoles('ADMIN'), getSentNotifications);
notificationsRouter.get('/recipients', allowRoles('ADMIN'), getNotificationRecipients);
notificationsRouter.post('/', allowRoles('ADMIN'), postNotification);
notificationsRouter.delete('/sent', allowRoles('ADMIN'), removeAllSentNotifications);
notificationsRouter.delete('/:id', allowRoles('ADMIN'), removeNotification);

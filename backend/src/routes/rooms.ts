import { Router } from 'express';
import { authenticate, allowRoles } from '../middleware/auth';
import {
  createRoom,
  createRoomType,
  deleteRoomType,
  deleteRoom,
  getRoom,
  getRoomTypes,
  listRooms,
  updateRoom,
  updateRoomStatus,
  updateRoomType,
} from '../controllers/rooms';

export const roomsRouter = Router();

roomsRouter.use(authenticate);
roomsRouter.get('/', listRooms);
roomsRouter.get('/types', getRoomTypes);
roomsRouter.post('/types', allowRoles('ADMIN'), createRoomType);
roomsRouter.put('/types/:id', allowRoles('ADMIN'), updateRoomType);
roomsRouter.delete('/types/:id', allowRoles('ADMIN'), deleteRoomType);
roomsRouter.get('/:id', getRoom);
roomsRouter.post('/', allowRoles('ADMIN'), createRoom);
roomsRouter.put('/:id', allowRoles('ADMIN'), updateRoom);
roomsRouter.patch('/:id/status', allowRoles('ADMIN'), updateRoomStatus);
roomsRouter.delete('/:id', allowRoles('ADMIN'), deleteRoom);

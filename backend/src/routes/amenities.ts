import { Router } from 'express';
import { authenticate, allowRoles } from '../middleware/auth';
import {
  createAmenity,
  deleteAmenity,
  getAmenity,
  listAmenities,
  listRoomAmenities,
  replaceRoomAmenities,
  updateAmenity,
} from '../controllers/amenities';

export const amenitiesRouter = Router();

amenitiesRouter.use(authenticate);
amenitiesRouter.get('/amenities', listAmenities);
amenitiesRouter.get('/amenities/:id', getAmenity);
amenitiesRouter.post('/amenities', allowRoles('ADMIN'), createAmenity);
amenitiesRouter.put('/amenities/:id', allowRoles('ADMIN'), updateAmenity);
amenitiesRouter.delete('/amenities/:id', allowRoles('ADMIN'), deleteAmenity);
amenitiesRouter.get('/rooms/:roomId/amenities', listRoomAmenities);
amenitiesRouter.put('/rooms/:roomId/amenities', allowRoles('ADMIN'), replaceRoomAmenities);


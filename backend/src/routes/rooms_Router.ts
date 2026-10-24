import { Router } from 'express';
import { RoomsController } from '../controllers/rooms_Controller';

const router = Router();

router.get('/rooms', RoomsController.getAllRooms);

export default router;
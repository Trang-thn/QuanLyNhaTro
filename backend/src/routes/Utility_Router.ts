import { Router } from 'express';
import { UtilityController } from '../controllers/Utility_Controller';

const router = Router();

router.get('/utilities', UtilityController.getReadings);
router.post('/utilities', UtilityController.postReading);
router.put('/utilities/:id', UtilityController.putReading);

export default router;
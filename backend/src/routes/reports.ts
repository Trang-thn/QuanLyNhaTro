import { Router } from 'express';
import { getReport, downloadReportExcel } from '../controllers/reports';
import { allowRoles, authenticate } from '../middleware/auth';

export const reportsRouter = Router();
reportsRouter.use(authenticate, allowRoles('ADMIN'));
reportsRouter.get('/:type/excel', downloadReportExcel);
reportsRouter.get('/:type', getReport);

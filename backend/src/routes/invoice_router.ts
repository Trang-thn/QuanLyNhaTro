import { Router } from 'express';
import { InvoiceController } from '../controllers/invoice_controller';
import { allowRoles, authenticate } from '../middleware/auth';

const invoiceRouter = Router();
invoiceRouter.use(authenticate);
invoiceRouter.get('/invoices', InvoiceController.list);
invoiceRouter.get('/invoices/:id/payments', InvoiceController.payments);
invoiceRouter.post('/invoices/:id/payments', allowRoles('ADMIN'), InvoiceController.addPayment);
invoiceRouter.post('/invoices/:id/reopen', allowRoles('ADMIN'), InvoiceController.reopen);
invoiceRouter.post('/invoices/generate', allowRoles('ADMIN'), InvoiceController.generate);

export default invoiceRouter;

import { Request, Response } from 'express';
import { InvoiceService } from '../services/invoice_service';

function sendError(res: Response, error: any) {
  const status = Number(error?.status) || 500;
  return res.status(status).json({
    success: false,
    message: status === 500 ? 'Lỗi xử lý hóa đơn' : error.message,
  });
}

function optionalInteger(value: unknown): number | undefined | null {
  if (value === undefined || value === '') return undefined;
  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : null;
}

export class InvoiceController {
  static async list(req: Request, res: Response) {
    try {
      const month = optionalInteger(req.query.month);
      const year = optionalInteger(req.query.year);
      if (month === null || (month !== undefined && (month < 1 || month > 12)) || year === null || (year !== undefined && year < 2000)) {
        return res.status(400).json({ success: false, message: 'Tháng hoặc năm không hợp lệ' });
      }
      const tenantUserId = req.user?.role === 'TENANT' ? req.user.id : undefined;
      const data = await InvoiceService.list({ month, year, search: String(req.query.search ?? '').trim() }, tenantUserId);
      return res.json({ success: true, data });
    } catch (error) { return sendError(res, error); }
  }

  static async payments(req: Request, res: Response) {
    try {
      const tenantUserId = req.user?.role === 'TENANT' ? req.user.id : undefined;
      const data = await InvoiceService.getPayments(String(req.params.id), tenantUserId);
      return res.json({ success: true, data });
    } catch (error) { return sendError(res, error); }
  }

  static async addPayment(req: Request, res: Response) {
    try {
      const { amount_paid, payment_method, transaction_note } = req.body ?? {};
      const amount = Number(amount_paid);
      const allowedMethods = ['TIEN_MAT', 'CHUYEN_KHOAN', 'VI_DIEN_TU'];
      if (!Number.isFinite(amount) || amount <= 0 || !allowedMethods.includes(payment_method) ||
          (transaction_note !== undefined && typeof transaction_note !== 'string')) {
        return res.status(400).json({ success: false, message: 'Thông tin thanh toán không hợp lệ' });
      }
      await InvoiceService.addPayment(String(req.params.id), { amount_paid: amount, payment_method, transaction_note });
      return res.status(201).json({ success: true, message: 'Đã ghi nhận thanh toán' });
    } catch (error) { return sendError(res, error); }
  }

  static async reopen(req: Request, res: Response) {
    try {
      await InvoiceService.reopenUnpaid(String(req.params.id));
      return res.json({ success: true, message: 'Đã mở lại kỳ để chỉnh sửa chỉ số' });
    } catch (error) { return sendError(res, error); }
  }

  static async generate(req: Request, res: Response) {
    try {
      const month = optionalInteger(req.body?.month);
      const year = optionalInteger(req.body?.year);
      if (month === null || year === null || (month !== undefined && (month < 1 || month > 12)) || (year !== undefined && year < 2000)) {
        return res.status(400).json({ success: false, message: 'Tháng hoặc năm không hợp lệ' });
      }
      const now = new Date();
      const target = month && year ? { month, year } : (now.getMonth() === 0
        ? { month: 12, year: now.getFullYear() - 1 }
        : { month: now.getMonth(), year: now.getFullYear() });
      const result = await InvoiceService.finalizePeriod(target.year, target.month);
      return res.json({ success: true, data: result });
    } catch (error) { return sendError(res, error); }
  }
}

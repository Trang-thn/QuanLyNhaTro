import { Request, Response } from 'express';
import { UtilityService } from '../services/Utility_Service';

const toNum = (v: any) => (v === '' || v === null || v === undefined ? NaN : Number(v));
const isDate = (v: any) => v === undefined || v === null || /^\d{4}-\d{2}-\d{2}$/.test(String(v));

function sendError(res: Response, error: any) {
  console.error(error);
  const status = error.status || 500;
   const message = status === 500 ? 'Lỗi hệ thống hoặc kết nối cơ sở dữ liệu thất bại' : error.message;
  return res.status(status).json({ success: false, message });
}

export class UtilityController {
  static async getReadings(req: Request, res: Response): Promise<any> {
    try {
      const search = (req.query.search as string) || '';
      const month = Number(req.query.month) || new Date().getMonth() + 1;
      const year = Number(req.query.year) || new Date().getFullYear();
      if (month < 1 || month > 12) {
        return res.status(400).json({ success: false, message: 'Tháng không hợp lệ' });
      }
      const result = await UtilityService.fetchListByFilter(search, month, year);
      return res.json({ success: true, data: result });
    } catch (error) {
      return sendError(res, error);
    }
  }

  static async postReading(req: Request, res: Response): Promise<any> {
    try {
      const b = req.body;
      const room_id = String(b.room_id ?? '').trim();
      const billing_month = toNum(b.billing_month);
      const billing_year = toNum(b.billing_year);
      const new_electricity_kwh = toNum(b.new_electricity_kwh);
      const new_water_m3 = toNum(b.new_water_m3);

      if (!room_id ||
          !Number.isInteger(billing_month) || billing_month < 1 || billing_month > 12 ||
          !Number.isInteger(billing_year) ||
          !Number.isInteger(new_electricity_kwh) || new_electricity_kwh < 0 ||
          !Number.isInteger(new_water_m3) || new_water_m3 < 0 ||
          !isDate(b.recorded_date)) {
        return res.status(400).json({ success: false, message: 'Dữ liệu không hợp lệ' });
      }

      const r = await UtilityService.insertRecord({
        room_id, billing_month, billing_year, new_electricity_kwh, new_water_m3,
        recorded_date: b.recorded_date ?? null,
        old_electricity_kwh: Number.isFinite(toNum(b.old_electricity_kwh)) ? toNum(b.old_electricity_kwh) : 0,
        old_water_m3: Number.isFinite(toNum(b.old_water_m3)) ? toNum(b.old_water_m3) : 0,
      });

      return res.status(201).json({
        success: true,
        message: 'Lưu chỉ số thành công',
        id: r.insertId,
        consumption: { electricity_consumed: r.electricity_consumed, water_consumed: r.water_consumed },
      });
    } catch (error) {
      return sendError(res, error);
    }
  }

  static async putReading(req: Request, res: Response): Promise<any> {
    try {
      const id = String(req.params.id ?? '').trim();
      const newElec = toNum(req.body.new_electricity_kwh);
      const newWater = toNum(req.body.new_water_m3);

      if (!id ||
          !Number.isInteger(newElec) || newElec < 0 ||
          !Number.isInteger(newWater) || newWater < 0 ||
          !isDate(req.body.recorded_date)) {
        return res.status(400).json({ success: false, message: 'Dữ liệu không hợp lệ' });
      }

      await UtilityService.updateRecord(id, newElec, newWater, req.body.recorded_date ?? null);
      return res.json({ success: true, message: 'Cập nhật chỉ số điện/nước thành công' });
    } catch (error) {
      return sendError(res, error);
    }
  }
}
import { randomUUID } from 'crypto';
import { pool as db } from '../config/database';
import { UtilityItem, SaveUtilityDto } from '../types/Utility_Type';

function httpError(status: number, message: string) {
  const err: any = new Error(message);
  err.status = status;
  return err;
}

export class UtilityService {
  static async fetchListByFilter(search: string, month: number, year: number): Promise<UtilityItem[]> {
    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;

    const query = `
      SELECT r.id AS room_id, r.room_number,
             u.full_name AS tenant_name,
             ur.id AS reading_id,
             COALESCE(ur.old_electricity_kwh, prev.new_electricity_kwh, 0) AS old_electricity_kwh,
             ur.new_electricity_kwh,
             COALESCE(ur.old_water_m3, prev.new_water_m3, 0) AS old_water_m3,
             ur.new_water_m3,
             DATE_FORMAT(ur.recorded_date, '%Y-%m-%d') AS recorded_date,
             CASE
               WHEN EXISTS (SELECT 1 FROM invoices i WHERE i.utility_reading_id = ur.id) THEN 'DA_CO_HOA_DON'
               WHEN ur.id IS NOT NULL THEN 'DA_NHAP'
               ELSE 'CHUA_NHAP'
             END AS current_status
      FROM rooms r
      LEFT JOIN contracts c ON c.room_id = r.id AND c.status = 'HIEU_LUC'
      LEFT JOIN tenants t ON t.id = c.representative_tenant_id
      LEFT JOIN users u ON u.id = t.user_id
      LEFT JOIN utility_readings ur
             ON ur.room_id = r.id AND ur.billing_month = ? AND ur.billing_year = ?
      LEFT JOIN utility_readings prev
             ON prev.room_id = r.id AND prev.billing_month = ? AND prev.billing_year = ?
      WHERE r.status = 'DANG_THUE' AND (r.room_number LIKE ? OR u.full_name LIKE ?)
      ORDER BY r.floor, r.room_number
    `;
    const like = `%${search}%`;
    const [rows]: any = await db.execute(query, [month, year, prevMonth, prevYear, like, like]);
    return rows.map((r: any) => ({
      ...r,
      old_electricity_kwh: Number(r.old_electricity_kwh),
      new_electricity_kwh: r.new_electricity_kwh === null ? null : Number(r.new_electricity_kwh),
      old_water_m3: Number(r.old_water_m3),
      new_water_m3: r.new_water_m3 === null ? null : Number(r.new_water_m3),
    }));
  }

  static async hasInvoice(readingId: string): Promise<boolean> {
    const [rows]: any = await db.execute(
      `SELECT id FROM invoices WHERE utility_reading_id = ? LIMIT 1`,
      [readingId]
    );
    return rows.length > 0;
  }

  static async insertRecord(data: SaveUtilityDto): Promise<{ insertId: string; electricity_consumed: number; water_consumed: number }> {
    const prevMonth = data.billing_month === 1 ? 12 : data.billing_month - 1;
    const prevYear = data.billing_month === 1 ? data.billing_year - 1 : data.billing_year;

    // Chỉ số cũ lấy từ DB (chỉ số mới của kỳ trước), không tin hoàn toàn client
    const [prev]: any = await db.execute(
      `SELECT new_electricity_kwh, new_water_m3 FROM utility_readings
       WHERE room_id = ? AND billing_month = ? AND billing_year = ? LIMIT 1`,
      [data.room_id, prevMonth, prevYear]
    );
    const oldElec = prev.length ? Number(prev[0].new_electricity_kwh) : Number(data.old_electricity_kwh ?? 0);
    const oldWater = prev.length ? Number(prev[0].new_water_m3) : Number(data.old_water_m3 ?? 0);

    if (data.new_electricity_kwh < oldElec || data.new_water_m3 < oldWater) {
      throw httpError(400, 'Chỉ số mới không được nhỏ hơn chỉ số kỳ trước');
    }

    // Chặn trùng phòng + tháng + năm
    const [dup]: any = await db.execute(
      `SELECT id FROM utility_readings WHERE room_id = ? AND billing_month = ? AND billing_year = ? LIMIT 1`,
      [data.room_id, data.billing_month, data.billing_year]
    );
    if (dup.length) throw httpError(409, 'Đã tồn tại chỉ số điện nước cho phòng này trong tháng/năm này');

    const id = randomUUID();

    try {
      await db.execute(
        `INSERT INTO utility_readings
           (id, room_id, billing_month, billing_year, old_electricity_kwh, new_electricity_kwh,
            old_water_m3, new_water_m3, recorded_date)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, COALESCE(?, CURRENT_DATE))`,
        [id, data.room_id, data.billing_month, data.billing_year, oldElec, data.new_electricity_kwh,
         oldWater, data.new_water_m3, data.recorded_date ?? null]
      );
      return {
        insertId: id,
        electricity_consumed: data.new_electricity_kwh - oldElec,
        water_consumed: data.new_water_m3 - oldWater,
      };
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') throw httpError(409, 'Đã tồn tại chỉ số điện nước cho phòng này trong tháng/năm này');
      if (error.code === 'ER_NO_REFERENCED_ROW_2') throw httpError(400, 'Phòng không tồn tại (room_id sai)');
      throw error;
    }
  }

  static async updateRecord(id: string, newElec: number, newWater: number, date?: string | null): Promise<void> {
    const [rows]: any = await db.execute(
      `SELECT old_electricity_kwh, old_water_m3 FROM utility_readings WHERE id = ? LIMIT 1`,
      [id]
    );
    if (!rows.length) throw httpError(404, 'Không tìm thấy bản ghi để cập nhật');

    if (await UtilityService.hasInvoice(id)) {
      throw httpError(400, 'Tháng này đã được lập hóa đơn, không thể chỉnh sửa chỉ số điện nước!');
    }
    // So với chỉ số cũ lưu trong DB, không phải số client gửi lên
    if (newElec < Number(rows[0].old_electricity_kwh) || newWater < Number(rows[0].old_water_m3)) {
      throw httpError(400, 'Chỉ số mới không được nhỏ hơn chỉ số kỳ trước');
    }

    await db.execute(
      `UPDATE utility_readings
       SET new_electricity_kwh = ?, new_water_m3 = ?, recorded_date = COALESCE(?, CURRENT_DATE)
       WHERE id = ?`,
      [newElec, newWater, date ?? null, id]
    );
  }
}
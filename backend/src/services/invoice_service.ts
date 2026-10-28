import { randomUUID } from 'crypto';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { PoolConnection } from 'mysql2/promise';
import { pool } from '../config/database';
import { CreatePaymentInput, InvoiceListFilters, InvoicePayment } from '../types/invoice_type';

function httpError(status: number, message: string) {
  return Object.assign(new Error(message), { status });
}

function amount(value: unknown): number {
  return Number(value ?? 0);
}

function periodDate(year: number, month: number, day: number): string {
  const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const safeDay = Math.min(Math.max(day, 1), lastDay);
  return `${year}-${String(month).padStart(2, '0')}-${String(safeDay).padStart(2, '0')}`;
}

function nextPeriod(year: number, month: number): { year: number; month: number } {
  return month === 12 ? { year: year + 1, month: 1 } : { year, month: month + 1 };
}

export class InvoiceService {
  static async finalizePeriod(year: number, month: number) {
    const periodStart = `${year}-${String(month).padStart(2, '0')}-01`;
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT COUNT(DISTINCT c.id) AS total_contracts,
              COUNT(DISTINCT ur.id) AS recorded_readings
       FROM contracts c
       LEFT JOIN utility_readings ur
         ON ur.room_id = c.room_id AND ur.billing_month = ? AND ur.billing_year = ?
       WHERE c.status = 'HIEU_LUC' AND c.start_date <= LAST_DAY(?) AND c.end_date >= ?`,
      [month, year, periodStart, periodStart],
    );
    const total = amount(rows[0]?.total_contracts);
    const recorded = amount(rows[0]?.recorded_readings);
    if (total === 0 || recorded < total) {
      throw httpError(409, `Chưa thể chốt kỳ: đã nhập ${recorded}/${total} phòng có hợp đồng hiệu lực`);
    }
    return InvoiceService.generateForPeriod(year, month);
  }

  static async list(filters: InvoiceListFilters, tenantUserId?: string) {
    const conditions: string[] = ["i.status <> 'CHO_CHOT'"];
    const params: any[] = [];
    if (filters.month !== undefined) { conditions.push('i.billing_month = ?'); params.push(filters.month); }
    if (filters.year !== undefined) { conditions.push('i.billing_year = ?'); params.push(filters.year); }
    if (filters.search) {
      conditions.push('(i.invoice_code LIKE ? OR r.room_number LIKE ? OR u.full_name LIKE ?)');
      const term = `%${filters.search}%`;
      params.push(term, term, term);
    }
    if (tenantUserId) {
      conditions.push(`EXISTS (
        SELECT 1 FROM tenants tenant
        WHERE tenant.user_id = ? AND (
          tenant.id = c.representative_tenant_id OR EXISTS (
            SELECT 1 FROM contract_members cm WHERE cm.contract_id = c.id AND cm.tenant_id = tenant.id
          )
        )
      )`);
      params.push(tenantUserId);
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT i.id, i.invoice_code, i.contract_id, i.utility_reading_id, c.room_id,
              r.room_number, u.full_name AS tenant_name,
              i.billing_month, i.billing_year, i.room_price, i.electricity_cost,
              i.water_cost, i.other_service_cost, i.total_amount, i.paid_amount,
              CASE
                WHEN i.paid_amount >= i.total_amount THEN 'DA_THANH_TOAN'
                WHEN i.due_date < CURRENT_DATE THEN 'QUA_HAN'
                WHEN i.paid_amount > 0 THEN 'THANH_TOAN_MOT_PHAN'
                ELSE 'CHUA_THANH_TOAN'
              END AS status,
              DATE_FORMAT(i.due_date, '%Y-%m-%d') AS due_date,
              ur.old_electricity_kwh, ur.new_electricity_kwh,
              ur.old_water_m3, ur.new_water_m3,
              (SELECT up.electricity_price_per_kwh FROM utility_prices up
                WHERE up.effective_from <= LAST_DAY(STR_TO_DATE(CONCAT(i.billing_year, '-', LPAD(i.billing_month, 2, '0'), '-01'), '%Y-%m-%d'))
                ORDER BY up.effective_from DESC LIMIT 1) AS electricity_price_per_kwh,
              (SELECT up.water_price_per_m3 FROM utility_prices up
                WHERE up.effective_from <= LAST_DAY(STR_TO_DATE(CONCAT(i.billing_year, '-', LPAD(i.billing_month, 2, '0'), '-01'), '%Y-%m-%d'))
                ORDER BY up.effective_from DESC LIMIT 1) AS water_price_per_m3
       FROM invoices i
       JOIN contracts c ON c.id = i.contract_id
       JOIN rooms r ON r.id = c.room_id
       LEFT JOIN tenants t ON t.id = c.representative_tenant_id
       LEFT JOIN users u ON u.id = t.user_id
       LEFT JOIN utility_readings ur ON ur.id = i.utility_reading_id
       ${where}
       ORDER BY i.billing_year DESC, i.billing_month DESC, r.room_number`,
      params,
    );
    return rows.map((row) => ({
      ...row,
      billing_month: Number(row.billing_month), billing_year: Number(row.billing_year),
      room_price: amount(row.room_price), electricity_cost: amount(row.electricity_cost),
      water_cost: amount(row.water_cost), other_service_cost: amount(row.other_service_cost),
      total_amount: amount(row.total_amount), paid_amount: amount(row.paid_amount),
      old_electricity_kwh: row.old_electricity_kwh === null ? null : amount(row.old_electricity_kwh),
      new_electricity_kwh: row.new_electricity_kwh === null ? null : amount(row.new_electricity_kwh),
      old_water_m3: row.old_water_m3 === null ? null : amount(row.old_water_m3),
      new_water_m3: row.new_water_m3 === null ? null : amount(row.new_water_m3),
      electricity_price_per_kwh: row.electricity_price_per_kwh === null ? null : amount(row.electricity_price_per_kwh),
      water_price_per_m3: row.water_price_per_m3 === null ? null : amount(row.water_price_per_m3),
    }));
  }

  static async getPayments(invoiceId: string, tenantUserId?: string): Promise<InvoicePayment[]> {
    if (tenantUserId) {
      const [owned] = await pool.execute<RowDataPacket[]>(
        `SELECT i.id FROM invoices i JOIN contracts c ON c.id = i.contract_id
         WHERE i.id = ? AND EXISTS (
           SELECT 1 FROM tenants t WHERE t.user_id = ? AND (
             t.id = c.representative_tenant_id OR EXISTS (
               SELECT 1 FROM contract_members cm WHERE cm.contract_id = c.id AND cm.tenant_id = t.id
             )
           )
         )`, [invoiceId, tenantUserId],
      );
      if (!owned.length) throw httpError(404, 'Không tìm thấy hóa đơn');
    }
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT id, invoice_id, DATE_FORMAT(payment_date, '%Y-%m-%d %H:%i:%s') AS payment_date,
              amount_paid, payment_method, transaction_note
       FROM payments WHERE invoice_id = ? ORDER BY payment_date DESC`, [invoiceId],
    );
    return rows.map((row) => ({ ...row, amount_paid: amount(row.amount_paid) })) as InvoicePayment[];
  }

  static async reopenUnpaid(invoiceId: string): Promise<void> {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      const [rows] = await connection.execute<RowDataPacket[]>(
        'SELECT id, paid_amount, status FROM invoices WHERE id = ? FOR UPDATE', [invoiceId],
      );
      if (!rows.length) throw httpError(404, 'Không tìm thấy hóa đơn');
      if (rows[0].status === 'CHO_CHOT') throw httpError(409, 'Kỳ này đang được mở để chỉnh sửa');

      const [payments] = await connection.execute<RowDataPacket[]>(
        'SELECT id FROM payments WHERE invoice_id = ? LIMIT 1', [invoiceId],
      );
      if (amount(rows[0].paid_amount) > 0 || payments.length > 0) {
        throw httpError(409, 'Chỉ có thể mở lại hóa đơn chưa phát sinh thanh toán');
      }

      await connection.execute("UPDATE invoices SET status = 'CHO_CHOT' WHERE id = ?", [invoiceId]);
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async addPayment(invoiceId: string, input: CreatePaymentInput): Promise<void> {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      const [rows] = await connection.execute<RowDataPacket[]>(
        'SELECT total_amount, paid_amount, status FROM invoices WHERE id = ? FOR UPDATE', [invoiceId],
      );
      if (!rows.length) throw httpError(404, 'Không tìm thấy hóa đơn');
      if (rows[0].status === 'CHO_CHOT') throw httpError(409, 'Kỳ hóa đơn đang mở để chỉnh sửa, chưa thể nhận thanh toán');
      const remaining = amount(rows[0].total_amount) - amount(rows[0].paid_amount);
      if (input.amount_paid > remaining) throw httpError(400, 'Số tiền thanh toán vượt quá số dư hóa đơn');

      await connection.execute<ResultSetHeader>(
        `INSERT INTO payments (id, invoice_id, amount_paid, payment_method, transaction_note)
         VALUES (?, ?, ?, ?, ?)`,
        [randomUUID(), invoiceId, input.amount_paid, input.payment_method, input.transaction_note?.trim() || null],
      );
      const paidAmount = amount(rows[0].paid_amount) + input.amount_paid;
      const status = paidAmount >= amount(rows[0].total_amount) ? 'DA_THANH_TOAN' : 'THANH_TOAN_MOT_PHAN';
      await connection.execute('UPDATE invoices SET paid_amount = ?, status = ? WHERE id = ?', [paidAmount, status, invoiceId]);
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async generateForPeriod(year: number, month: number) {
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const next = nextPeriod(year, month);
    const [contracts] = await pool.execute<RowDataPacket[]>(
      `SELECT c.id AS contract_id, c.room_id, c.rental_price, c.billing_cycle_day,
              r.room_number, ur.id AS reading_id,
              (ur.new_electricity_kwh - ur.old_electricity_kwh) AS electricity_used,
              (ur.new_water_m3 - ur.old_water_m3) AS water_used,
              (SELECT up.electricity_price_per_kwh FROM utility_prices up
                WHERE up.effective_from <= LAST_DAY(?) ORDER BY up.effective_from DESC LIMIT 1) AS electricity_rate,
              (SELECT up.water_price_per_m3 FROM utility_prices up
                WHERE up.effective_from <= LAST_DAY(?) ORDER BY up.effective_from DESC LIMIT 1) AS water_rate
       FROM contracts c
       JOIN rooms r ON r.id = c.room_id
       JOIN utility_readings ur ON ur.room_id = c.room_id AND ur.billing_month = ? AND ur.billing_year = ?
       WHERE c.status = 'HIEU_LUC' AND c.start_date <= LAST_DAY(?) AND c.end_date >= ?`,
      [startDate, startDate, month, year, startDate, startDate],
    );

    const created: string[] = [];
    const updated: string[] = [];
    const skipped: string[] = [];
    for (const contract of contracts) {
      if (contract.electricity_rate === null || contract.water_rate === null) {
        skipped.push(contract.room_number);
        continue;
      }
      const invoiceId = randomUUID();
      const code = `HD-${year}${String(month).padStart(2, '0')}-${String(contract.room_number).replace(/[^A-Za-z0-9-]/g, '')}`;
      const electricityCost = amount(contract.electricity_used) * amount(contract.electricity_rate);
      const waterCost = amount(contract.water_used) * amount(contract.water_rate);
      const roomPrice = amount(contract.rental_price);
      const otherServiceCost = 0;
      const total = roomPrice + electricityCost + waterCost + otherServiceCost;
      const dueDate = periodDate(next.year, next.month, Number(contract.billing_cycle_day ?? 1));
      const connection: PoolConnection = await pool.getConnection();
      try {
        await connection.beginTransaction();
        const [existing] = await connection.execute<RowDataPacket[]>(
          'SELECT id, status, paid_amount FROM invoices WHERE contract_id = ? AND billing_month = ? AND billing_year = ? FOR UPDATE',
          [contract.contract_id, month, year],
        );
        if (existing.length) {
          if (existing[0].status !== 'CHO_CHOT') {
            skipped.push(contract.room_number);
            await connection.rollback();
            continue;
          }
          const [payments] = await connection.execute<RowDataPacket[]>(
            'SELECT id FROM payments WHERE invoice_id = ? LIMIT 1', [existing[0].id],
          );
          if (amount(existing[0].paid_amount) > 0 || payments.length > 0) {
            throw httpError(409, 'Không thể tính lại hóa đơn đã phát sinh thanh toán');
          }
          await connection.execute(
            `UPDATE invoices SET utility_reading_id = ?, room_price = ?, electricity_cost = ?, water_cost = ?,
             other_service_cost = ?, total_amount = ?, paid_amount = 0, status = 'CHUA_THANH_TOAN', due_date = ?
             WHERE id = ?`,
            [contract.reading_id, roomPrice, electricityCost, waterCost, otherServiceCost, total, dueDate, existing[0].id],
          );
          await connection.commit();
          updated.push(existing[0].id);
          continue;
        }
        await connection.execute<ResultSetHeader>(
          `INSERT INTO invoices
           (id, invoice_code, contract_id, utility_reading_id, billing_month, billing_year,
            room_price, electricity_cost, water_cost, other_service_cost, total_amount, paid_amount, status, due_date)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 'CHUA_THANH_TOAN', ?)`,
          [invoiceId, code, contract.contract_id, contract.reading_id, month, year,
            roomPrice, electricityCost, waterCost, otherServiceCost, total, dueDate],
        );
        await connection.commit();
        created.push(invoiceId);
      } catch (error: any) {
        await connection.rollback();
        if (error.code === 'ER_DUP_ENTRY') skipped.push(contract.room_number);
        else throw error;
      } finally {
        connection.release();
      }
    }
    return { created: created.length, updated: updated.length, skipped: skipped.length, created_ids: created, updated_ids: updated, skipped_rooms: skipped };
  }
}

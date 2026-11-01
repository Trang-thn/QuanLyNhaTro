import { RowDataPacket } from 'mysql2';
import { pool } from '../config/database';

export type ReportType = 'cashflow' | 'debt' | 'utilities' | 'occupancy';
export interface ReportColumn { key: string; label: string; format?: 'currency' | 'date' | 'number' }
export interface ReportData {
  type: ReportType; title: string; generatedAt: string;
  period: { month: number; year: number } | null;
  summary: Array<{ label: string; value: string | number; format?: 'currency' | 'number' }>;
  columns: ReportColumn[]; rows: Array<Record<string, string | number | null>>;
  note?: string;
}

const titles: Record<ReportType, string> = {
  cashflow: 'Doanh thu và dòng tiền', debt: 'Công nợ hóa đơn',
  utilities: 'Điện nước và mức tiêu thụ', occupancy: 'Lấp đầy và khách thuê',
};

function monthPeriod(value: unknown): { month: number; year: number } {
  const now = new Date();
  const fallback = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const match = String(value ?? fallback).match(/^(\d{4})-(\d{2})$/);
  if (!match) throw Object.assign(new Error('Kỳ báo cáo phải có dạng YYYY-MM'), { status: 400 });
  const year = Number(match[1]); const month = Number(match[2]);
  if (month < 1 || month > 12 || year < 2000 || year > 9999) throw Object.assign(new Error('Tháng hoặc năm không hợp lệ'), { status: 400 });
  return { month, year };
}

export async function createReport(typeValue: string, periodValue?: unknown): Promise<ReportData> {
  if (!['cashflow', 'debt', 'utilities', 'occupancy'].includes(typeValue)) {
    throw Object.assign(new Error('Loại báo cáo không hợp lệ'), { status: 400 });
  }
  const type = typeValue as ReportType;
  const period = type === 'cashflow' || type === 'utilities' ? monthPeriod(periodValue) : null;
  const generatedAt = new Date().toISOString();

  if (type === 'cashflow') {
    const start = `${period!.year}-${String(period!.month).padStart(2, '0')}-01`;
    const [payments] = await pool.query<RowDataPacket[]>(
      `SELECT DATE_FORMAT(p.payment_date, '%Y-%m-%d') AS date, 'Thu tiền' AS category,
              i.invoice_code AS reference, r.room_number AS room, p.amount_paid AS amount
       FROM payments p LEFT JOIN invoices i ON i.id = p.invoice_id
       LEFT JOIN contracts c ON c.id = i.contract_id LEFT JOIN rooms r ON r.id = c.room_id
       WHERE p.payment_date >= ? AND p.payment_date < DATE_ADD(?, INTERVAL 1 MONTH)
       ORDER BY p.payment_date, p.id`, [start, start]);
    const [maintenance] = await pool.query<RowDataPacket[]>(
      `SELECT DATE_FORMAT(mr.created_at, '%Y-%m-%d') AS date, 'Chi phí bảo trì' AS category,
              mr.title AS reference, r.room_number AS room, mr.cost AS amount
       FROM maintenance_requests mr LEFT JOIN rooms r ON r.id = mr.room_id
       WHERE mr.created_at >= ? AND mr.created_at < DATE_ADD(?, INTERVAL 1 MONTH)
         AND COALESCE(mr.cost, 0) > 0
       ORDER BY mr.created_at, mr.id`, [start, start]);
    const rows = [...payments, ...maintenance].map((r) => ({ date: r.date, category: r.category, reference: r.reference, room: r.room, amount: Number(r.amount ?? 0) }))
      .sort((a, b) => String(a.date).localeCompare(String(b.date)));
    const collected = rows.filter(r => r.category === 'Thu tiền').reduce((s, r) => s + r.amount, 0);
    const maintenanceCost = rows.filter(r => r.category === 'Chi phí bảo trì').reduce((s, r) => s + r.amount, 0);
    return { type, title: titles[type], generatedAt, period, summary: [
      { label: 'Tiền đã thu', value: collected, format: 'currency' }, { label: 'Chi phí bảo trì', value: maintenanceCost, format: 'currency' }, { label: 'Số giao dịch', value: rows.length, format: 'number' },
    ], columns: [{ key: 'date', label: 'Ngày', format: 'date' }, { key: 'category', label: 'Loại' }, { key: 'reference', label: 'Nội dung' }, { key: 'room', label: 'Phòng' }, { key: 'amount', label: 'Số tiền', format: 'currency' }], rows,
      note: 'Chi phí bảo trì được xếp theo ngày tạo sự cố; doanh thu căn cứ ngày ghi nhận thanh toán.' };
  }

  if (type === 'debt') {
    const [rowsDb] = await pool.query<RowDataPacket[]>(
      `SELECT i.invoice_code AS invoice, r.room_number AS room, COALESCE(u.full_name, t.full_name, '—') AS tenant,
              i.billing_month AS month, i.billing_year AS year, i.total_amount AS total,
              i.paid_amount AS paid, GREATEST(i.total_amount - i.paid_amount, 0) AS remaining,
              DATE_FORMAT(i.due_date, '%Y-%m-%d') AS dueDate,
              CASE WHEN i.due_date < CURRENT_DATE THEN 'Quá hạn' ELSE 'Chưa đến hạn' END AS debtStatus
       FROM invoices i JOIN contracts c ON c.id = i.contract_id
     LEFT JOIN rooms r ON r.id = c.room_id LEFT JOIN tenants t ON t.id = c.representative_tenant_id
     LEFT JOIN users u ON u.id = t.user_id
       WHERE i.status <> 'CHO_CHOT' AND COALESCE(i.paid_amount, 0) < COALESCE(i.total_amount, 0)
       ORDER BY i.due_date, r.room_number`);
    const rows = rowsDb.map(r => ({ invoice: r.invoice, room: r.room, tenant: r.tenant ?? '—', period: `${String(r.month).padStart(2, '0')}/${r.year}`, total: Number(r.total), paid: Number(r.paid), remaining: Number(r.remaining), dueDate: r.dueDate, status: r.debtStatus }));
    return { type, title: titles[type], generatedAt, period: null, summary: [
      { label: 'Tổng dư nợ', value: rows.reduce((s, r) => s + r.remaining, 0), format: 'currency' }, { label: 'Hóa đơn còn nợ', value: rows.length, format: 'number' }, { label: 'Hóa đơn quá hạn', value: rows.filter(r => r.status === 'Quá hạn').length, format: 'number' },
    ], columns: [{ key: 'invoice', label: 'Mã hóa đơn' }, { key: 'room', label: 'Phòng' }, { key: 'tenant', label: 'Khách thuê' }, { key: 'period', label: 'Kỳ' }, { key: 'total', label: 'Tổng tiền', format: 'currency' }, { key: 'paid', label: 'Đã trả', format: 'currency' }, { key: 'remaining', label: 'Còn nợ', format: 'currency' }, { key: 'dueDate', label: 'Hạn thanh toán', format: 'date' }, { key: 'status', label: 'Trạng thái' }], rows,
      note: 'Công nợ là ảnh chụp số dư tại thời điểm xuất báo cáo.' };
  }

  if (type === 'utilities') {
    const [rowsDb] = await pool.query<RowDataPacket[]>(
      `SELECT r.room_number AS room, ur.billing_month AS month, ur.billing_year AS year,
              ur.old_electricity_kwh AS oldElectricity, ur.new_electricity_kwh AS newElectricity,
              ur.old_water_m3 AS oldWater, ur.new_water_m3 AS newWater,
              i.invoice_code AS invoice, i.electricity_cost AS electricityCost, i.water_cost AS waterCost
       FROM utility_readings ur JOIN rooms r ON r.id = ur.room_id
       LEFT JOIN invoices i ON i.utility_reading_id = ur.id
       WHERE ur.billing_month = ? AND ur.billing_year = ? ORDER BY r.room_number`, [period!.month, period!.year]);
    const rows = rowsDb.map(r => ({ room: r.room, electricityOld: Number(r.oldElectricity), electricityNew: Number(r.newElectricity), electricityUse: Number(r.newElectricity) - Number(r.oldElectricity), waterOld: Number(r.oldWater), waterNew: Number(r.newWater), waterUse: Number(r.newWater) - Number(r.oldWater), invoice: r.invoice ?? 'Chưa lập hóa đơn', electricityCost: r.invoice ? Number(r.electricityCost ?? 0) : null, waterCost: r.invoice ? Number(r.waterCost ?? 0) : null }));
    return { type, title: titles[type], generatedAt, period, summary: [
      { label: 'Phòng có chỉ số', value: rows.length, format: 'number' }, { label: 'Điện tiêu thụ', value: rows.reduce((s, r) => s + r.electricityUse, 0), format: 'number' }, { label: 'Nước tiêu thụ', value: rows.reduce((s, r) => s + r.waterUse, 0), format: 'number' }, { label: 'Chi phí theo hóa đơn', value: rows.reduce((s, r) => s + (r.electricityCost ?? 0) + (r.waterCost ?? 0), 0), format: 'currency' }, { label: 'Chưa lập hóa đơn', value: rows.filter(r => !r.invoice || r.invoice === 'Chưa lập hóa đơn').length, format: 'number' },
    ], columns: [{ key: 'room', label: 'Phòng' }, { key: 'electricityOld', label: 'Điện cũ', format: 'number' }, { key: 'electricityNew', label: 'Điện mới', format: 'number' }, { key: 'electricityUse', label: 'Điện tiêu thụ', format: 'number' }, { key: 'waterOld', label: 'Nước cũ', format: 'number' }, { key: 'waterNew', label: 'Nước mới', format: 'number' }, { key: 'waterUse', label: 'Nước tiêu thụ', format: 'number' }, { key: 'invoice', label: 'Hóa đơn' }, { key: 'electricityCost', label: 'Tiền điện', format: 'currency' }, { key: 'waterCost', label: 'Tiền nước', format: 'currency' }], rows,
      note: 'Chi phí điện nước chỉ lấy từ hóa đơn đã lập; chỉ số tiêu thụ lấy từ bản ghi chỉ số.' };
  }

  const [roomRows] = await pool.query<RowDataPacket[]>(
    `SELECT r.room_number AS room, r.status AS roomStatus, COALESCE(u.full_name, t.full_name, '—') AS tenant,
            c.status AS contractStatus, DATE_FORMAT(c.start_date, '%Y-%m-%d') AS startDate,
            DATE_FORMAT(c.end_date, '%Y-%m-%d') AS endDate
     FROM rooms r
     LEFT JOIN contracts c ON c.id = (SELECT c2.id FROM contracts c2
       WHERE c2.room_id = r.id AND c2.status = 'HIEU_LUC' AND CURRENT_DATE BETWEEN c2.start_date AND c2.end_date
       ORDER BY c2.start_date DESC LIMIT 1)
     LEFT JOIN tenants t ON t.id = c.representative_tenant_id LEFT JOIN users u ON u.id = t.user_id
     ORDER BY r.room_number`);
  const rows = roomRows.map(r => ({ tenant: r.tenant ?? '—', room: r.room, status: r.contractStatus ? 'Đang thuê' : (r.roomStatus === 'BAO_TRI' ? 'Bảo trì' : 'Trống'), contractStart: r.startDate, contractEnd: r.endDate }));
  const occupied = rows.filter(r => r.status === 'Đang thuê').length;
  return { type, title: titles[type], generatedAt, period: null, summary: [
    { label: 'Tổng số phòng', value: rows.length, format: 'number' }, { label: 'Đang thuê', value: occupied, format: 'number' }, { label: 'Trống', value: rows.filter(r => r.status === 'Trống').length, format: 'number' }, { label: 'Bảo trì', value: rows.filter(r => r.status === 'Bảo trì').length, format: 'number' }, { label: 'Tỷ lệ lấp đầy', value: rows.length ? `${(occupied / rows.length * 100).toFixed(1)}%` : '0%' },
  ], columns: [{ key: 'tenant', label: 'Khách thuê' }, { key: 'room', label: 'Phòng' }, { key: 'status', label: 'Trạng thái' }, { key: 'contractStart', label: 'Hợp đồng từ ngày', format: 'date' }, { key: 'contractEnd', label: 'Hợp đồng đến ngày', format: 'date' }], rows,
    note: 'Danh sách là ảnh chụp tại thời điểm xuất; không bao gồm CCCD, email hoặc số điện thoại.' };
}

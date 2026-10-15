import { RowDataPacket } from 'mysql2';
import { pool } from '../config/database';
import { DashboardOverview, DashboardRevenuePoint, DashboardRoomStat } from '../types/dashboard';

interface RoomStatRow extends RowDataPacket {
  status: string | null;
  count: number;
}

interface DebtRow extends RowDataPacket {
  totalDebt: string;
}

interface RevenueRow extends RowDataPacket {
  month: string;
  revenue: string;
}

export async function getDashboardOverview(): Promise<DashboardOverview & Record<string, unknown>> {
  const [roomRows] = await pool.query<RoomStatRow[]>(
    'SELECT status, COUNT(*) AS count FROM rooms GROUP BY status ORDER BY status');
  const roomStats: DashboardRoomStat[] = roomRows.map((row) => ({
    status: row.status,
    count: Number(row.count),
  }));
  const totalRooms = roomStats.reduce((sum, row) => sum + row.count, 0);
  const occupiedRooms = roomStats.find((row) => row.status === 'DANG_THUE')?.count ?? 0;

  const [debtRows] = await pool.query<DebtRow[]>(
    `SELECT COALESCE(SUM(GREATEST(
       COALESCE(total_amount, 0) - COALESCE(paid_amount, 0), 0
     )), 0) AS totalDebt
     FROM invoices`);

  const [revenueRows] = await pool.query<RevenueRow[]>(
    `WITH RECURSIVE months AS (
       SELECT DATE_SUB(CAST(DATE_FORMAT(CURRENT_DATE, '%Y-%m-01') AS DATE), INTERVAL 5 MONTH) AS month_start
       UNION ALL
       SELECT DATE_ADD(month_start, INTERVAL 1 MONTH)
       FROM months
       WHERE month_start < CAST(DATE_FORMAT(CURRENT_DATE, '%Y-%m-01') AS DATE)
     )
     SELECT DATE_FORMAT(m.month_start, '%Y-%m') AS month,
            CAST(COALESCE(SUM(p.amount_paid), 0) AS CHAR) AS revenue
     FROM months m
     LEFT JOIN payments p
       ON p.payment_date >= m.month_start
      AND p.payment_date < DATE_ADD(m.month_start, INTERVAL 1 MONTH)
     GROUP BY m.month_start
     ORDER BY m.month_start`);
  const revenueChart: DashboardRevenuePoint[] = revenueRows.map((row) => ({
    month: row.month,
    revenue: row.revenue,
  }));

  const [rooms] = await pool.query<RowDataPacket[]>(
    `SELECT r.id, r.room_number, r.room_type_id, r.status, r.floor,
       COALESCE(GROUP_CONCAT(ra.amenity_id ORDER BY ra.amenity_id), '') AS amenity_ids
     FROM rooms r LEFT JOIN room_amenities ra ON ra.room_id = r.id
     GROUP BY r.id ORDER BY r.floor, r.room_number`);
  const [tenants] = await pool.query<RowDataPacket[]>(
    `SELECT t.id, u.full_name, t.identity_card_number, t.issue_place,
       t.permanent_address, t.emergency_contact, u.phone_number AS phone, u.email
     FROM tenants t LEFT JOIN users u ON u.id = t.user_id ORDER BY u.full_name`);
  const [contracts] = await pool.query<RowDataPacket[]>(
    `SELECT id, contract_number, room_id, representative_tenant_id,
       DATE_FORMAT(start_date, '%Y-%m-%d') AS start_date,
       DATE_FORMAT(end_date, '%Y-%m-%d') AS end_date,
       rental_price, deposit_amount, status, billing_cycle_day
     FROM contracts ORDER BY start_date DESC`);
  const [invoices] = await pool.query<RowDataPacket[]>(
    `SELECT i.id, i.invoice_code, i.contract_id, c.room_id, i.billing_month, i.billing_year,
       i.room_price, i.electricity_cost, i.water_cost, i.other_service_cost,
       i.total_amount, i.paid_amount, i.status, DATE_FORMAT(i.due_date, '%Y-%m-%d') AS due_date
     FROM invoices i LEFT JOIN contracts c ON c.id = i.contract_id
     ORDER BY i.billing_year DESC, i.billing_month DESC`);
  const [maintenanceRequests] = await pool.query<RowDataPacket[]>(
    `SELECT id, room_id, tenant_id, title, description, status, cost,
       DATE_FORMAT(created_at, '%Y-%m-%dT%H:%i:%s') AS created_at
     FROM maintenance_requests ORDER BY created_at DESC`);
  const [revenueData] = await pool.query<RowDataPacket[]>(
    `SELECT DATE_FORMAT(m.month_start, '%b') AS month,
       (SELECT COALESCE(SUM(p.amount_paid), 0) FROM payments p
        WHERE p.payment_date >= m.month_start AND p.payment_date < DATE_ADD(m.month_start, INTERVAL 1 MONTH)) AS revenue,
       (SELECT COALESCE(SUM(mr.cost), 0) FROM maintenance_requests mr
        WHERE mr.created_at >= m.month_start AND mr.created_at < DATE_ADD(m.month_start, INTERVAL 1 MONTH)) AS expense
     FROM (SELECT DATE_SUB(CAST(DATE_FORMAT(CURRENT_DATE, '%Y-%m-01') AS DATE), INTERVAL 5 MONTH) + INTERVAL seq MONTH AS month_start
       FROM (SELECT 0 seq UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5) n) m
     ORDER BY m.month_start`);
  const [currentRevenue] = await pool.query<(RowDataPacket & { value: string })[]>(
    `SELECT COALESCE(SUM(amount_paid), 0) AS value FROM payments
     WHERE payment_date >= DATE_FORMAT(CURRENT_DATE, '%Y-%m-01')
       AND payment_date < DATE_ADD(DATE_FORMAT(CURRENT_DATE, '%Y-%m-01'), INTERVAL 1 MONTH)`);

  return {
    totalRooms,
    roomStats,
    occupancy: {
      occupiedRooms,
      rate: totalRooms === 0 ? 0 : Math.round((occupiedRooms / totalRooms) * 10_000) / 100,
    },
    totalDebt: debtRows[0]?.totalDebt ?? '0.00',
    revenueChart,
    rooms: rooms.map((room) => ({ ...room, amenity_ids: room.amenity_ids ? String(room.amenity_ids).split(',') : [] })),
    tenants,
    contracts,
    invoices,
    maintenanceRequests,
    revenueData: revenueData.map((point) => ({ month: point.month, revenue: Number(point.revenue), expense: Number(point.expense) })),
    revenueThisMonth: Number(currentRevenue[0]?.value ?? 0),
  };
}

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

export async function getDashboardOverview(): Promise<DashboardOverview> {
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

  return {
    totalRooms,
    roomStats,
    occupancy: {
      occupiedRooms,
      rate: totalRooms === 0 ? 0 : Math.round((occupiedRooms / totalRooms) * 10_000) / 100,
    },
    totalDebt: debtRows[0]?.totalDebt ?? '0.00',
    revenueChart,
  };
}

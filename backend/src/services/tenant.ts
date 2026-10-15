import { RowDataPacket } from 'mysql2';
import { pool } from '../config/database';

export async function getTenantDashboardData(userId: string) {
  const [tenantRows] = await pool.query<(RowDataPacket & { id: string })[]>(
    'SELECT id FROM tenants WHERE user_id = ? LIMIT 1', [userId]);
  const tenantId = tenantRows[0]?.id;
  if (!tenantId) return { contractId: '', invoices: [], contracts: [], maintenanceRequests: [], rooms: [] };

  const [contracts] = await pool.query<RowDataPacket[]>(
    `SELECT c.* FROM contracts c
     WHERE c.representative_tenant_id = ? OR EXISTS (
       SELECT 1 FROM contract_members cm WHERE cm.contract_id = c.id AND cm.tenant_id = ?
     ) ORDER BY c.start_date DESC`, [tenantId, tenantId]);
  const [invoices] = await pool.query<RowDataPacket[]>(
    `SELECT i.*, c.room_id FROM invoices i JOIN contracts c ON c.id = i.contract_id
     WHERE c.representative_tenant_id = ? OR EXISTS (
       SELECT 1 FROM contract_members cm WHERE cm.contract_id = c.id AND cm.tenant_id = ?
     ) ORDER BY i.billing_year DESC, i.billing_month DESC`, [tenantId, tenantId]);
  const [maintenanceRequests] = await pool.query<RowDataPacket[]>(
    `SELECT mr.* FROM maintenance_requests mr WHERE mr.tenant_id = ? ORDER BY mr.created_at DESC`, [tenantId]);
  const [rooms] = await pool.query<RowDataPacket[]>(
    `SELECT DISTINCT r.* FROM rooms r JOIN contracts c ON c.room_id = r.id
     WHERE c.representative_tenant_id = ? OR EXISTS (
       SELECT 1 FROM contract_members cm WHERE cm.contract_id = c.id AND cm.tenant_id = ?
     )`, [tenantId, tenantId]);
  return { contractId: contracts[0]?.id ?? '', invoices, contracts, maintenanceRequests, rooms };
}

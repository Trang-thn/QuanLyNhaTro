import { RowDataPacket } from 'mysql2';
import { pool } from '../config/database';

import { randomUUID } from 'node:crypto';

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



export async function getAllTenants(keyword?: string) {
  let sql = `
    SELECT
      t.id,
      t.user_id,
      t.identity_card_number,
      t.issue_date,
      t.issue_place,
      t.permanent_address,
      t.emergency_contact,
      u.full_name,
      u.username,
      u.email,
      u.phone_number
    FROM tenants t
    LEFT JOIN users u ON u.id = t.user_id
  `;

  const values: string[] = [];

  if (keyword?.trim()) {
    sql += `
      WHERE t.identity_card_number LIKE ?
         OR u.full_name LIKE ?
         OR u.phone_number LIKE ?
         OR u.username LIKE ?
    `;

    const search = `%${keyword.trim()}%`;
    values.push(search, search, search, search);
  }

  sql += ' ORDER BY u.full_name ASC';

  const [rows] = await pool.query<RowDataPacket[]>(sql, values);
  return rows;
}

export async function getTenantById(id: string) {
  const [rows] = await pool.query<RowDataPacket[]>(
    `
      SELECT
        t.id,
        t.user_id,
        t.identity_card_number,
        t.issue_date,
        t.issue_place,
        t.permanent_address,
        t.emergency_contact,
        u.full_name,
        u.username,
        u.email,
        u.phone_number
      FROM tenants t
      LEFT JOIN users u ON u.id = t.user_id
      WHERE t.id = ?
      LIMIT 1
    `,
    [id],
  );

  return rows[0] ?? null;
}

export async function createTenant(data: {
  user_id?: string | null;
  identity_card_number: string;
  issue_date?: string | null;
  issue_place?: string | null;
  permanent_address?: string | null;
  emergency_contact?: string | null;
}) {
  const id = randomUUID();

  await pool.execute(
    `
      INSERT INTO tenants (
        id,
        user_id,
        identity_card_number,
        issue_date,
        issue_place,
        permanent_address,
        emergency_contact
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [
      id,
      data.user_id || null,
      data.identity_card_number.trim(),
      data.issue_date || null,
      data.issue_place?.trim() || null,
      data.permanent_address?.trim() || null,
      data.emergency_contact?.trim() || null,
    ],
  );

  return id;
}

export async function updateTenant(
  id: string,
  data: {
    user_id?: string | null;
    identity_card_number?: string;
    issue_date?: string | null;
    issue_place?: string | null;
    permanent_address?: string | null;
    emergency_contact?: string | null;
  },
) {
  const columnMap = {
    user_id: 'user_id',
    identity_card_number: 'identity_card_number',
    issue_date: 'issue_date',
    issue_place: 'issue_place',
    permanent_address: 'permanent_address',
    emergency_contact: 'emergency_contact',
  } as const;

  const fields: string[] = [];
  const values: (string | null)[] = [];

  for (const key of Object.keys(data) as (keyof typeof columnMap)[]) {
    const value = data[key];

    if (value === undefined) continue;

    fields.push(`${columnMap[key]} = ?`);

    if (typeof value === 'string') {
      values.push(value.trim() || null);
    } else {
      values.push(value);
    }
  }

  if (fields.length === 0) {
    return (await getTenantById(id)) !== null;
  }

  const [result] = await pool.execute(
    `UPDATE tenants SET ${fields.join(', ')} WHERE id = ?`,
    [...values, id],
  );

  const affectedRows = (result as { affectedRows: number }).affectedRows;

  if (affectedRows > 0) return true;

  return (await getTenantById(id)) !== null;
}

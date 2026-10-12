import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { randomUUID } from 'node:crypto';
import { pool } from '../config/database';
import type { AuthUser } from '../types/auth';
import type { CreateMaintenanceInput, MaintenanceRecord, MaintenanceRoomRecord, UpdateMaintenanceInput } from '../types/maintenance';

export class MaintenanceServiceError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
  }
}

interface TenantIdRow extends RowDataPacket { id: string; }
interface IdRow extends RowDataPacket { id: string; }

const selectIssues = `SELECT mr.id, mr.room_id, mr.tenant_id, mr.title, mr.description,
  mr.image_url, mr.status, mr.cost, mr.created_at, r.room_number,
  u.full_name AS tenant_name
  FROM maintenance_requests mr
  INNER JOIN rooms r ON r.id = mr.room_id
  INNER JOIN tenants t ON t.id = mr.tenant_id
  LEFT JOIN users u ON u.id = t.user_id`;

async function tenantIdForUser(userId: string): Promise<string> {
  const [rows] = await pool.query<TenantIdRow[]>('SELECT id FROM tenants WHERE user_id = ?', [userId]);
  if (!rows[0]) throw new MaintenanceServiceError(403, 'No tenant profile is linked to this account');
  return rows[0].id;
}

export async function listMaintenanceRequests(user: AuthUser, status?: string): Promise<MaintenanceRecord[]> {
  const values: Array<string> = [];
  const conditions: string[] = [];
  if (user.role !== 'ADMIN' && user.role !== 'TENANT') {
    throw new MaintenanceServiceError(403, 'Forbidden');
  }
  if (user.role === 'TENANT') {
    conditions.push('mr.tenant_id = ?');
    values.push(await tenantIdForUser(user.id));
  }
  if (status) {
    conditions.push('mr.status = ?');
    values.push(status);
  }
  const where = conditions.length ? ` WHERE ${conditions.join(' AND ')}` : '';
  const [rows] = await pool.query<MaintenanceRecord[]>(`${selectIssues}${where} ORDER BY mr.created_at DESC`, values);
  return rows;
}

export async function listTenantRooms(user: AuthUser): Promise<MaintenanceRoomRecord[]> {
  const tenantId = await tenantIdForUser(user.id);
  const [rows] = await pool.query<MaintenanceRoomRecord[]>(
    `SELECT DISTINCT r.id, r.room_number
     FROM contracts c
     INNER JOIN rooms r ON r.id = c.room_id
     LEFT JOIN contract_members cm ON cm.contract_id = c.id
     WHERE c.status = 'HIEU_LUC'
       AND c.start_date <= CURRENT_DATE AND c.end_date >= CURRENT_DATE
       AND (c.representative_tenant_id = ? OR cm.tenant_id = ?)
     ORDER BY r.room_number`,
    [tenantId, tenantId],
  );
  return rows;
}

export async function getMaintenanceRequest(id: string, user: AuthUser): Promise<MaintenanceRecord> {
  const conditions = ['mr.id = ?'];
  const values: string[] = [id];
  if (user.role !== 'ADMIN' && user.role !== 'TENANT') {
    throw new MaintenanceServiceError(403, 'Forbidden');
  }
  if (user.role === 'TENANT') {
    conditions.push('mr.tenant_id = ?');
    values.push(await tenantIdForUser(user.id));
  }
  const [rows] = await pool.query<MaintenanceRecord[]>(`${selectIssues} WHERE ${conditions.join(' AND ')}`, values);
  if (!rows[0]) throw new MaintenanceServiceError(404, 'Maintenance request not found');
  return rows[0];
}

export async function createMaintenanceRequest(user: AuthUser, input: CreateMaintenanceInput): Promise<MaintenanceRecord> {
  const connection = await pool.getConnection();
  const id = randomUUID();
  try {
    await connection.beginTransaction();
    const [tenants] = await connection.query<TenantIdRow[]>(
      'SELECT id FROM tenants WHERE user_id = ? FOR UPDATE',
      [user.id],
    );
    if (!tenants[0]) throw new MaintenanceServiceError(403, 'No tenant profile is linked to this account');

    const [rooms] = await connection.query<IdRow[]>('SELECT id FROM rooms WHERE id = ? FOR UPDATE', [input.room_id]);
    if (!rooms[0]) throw new MaintenanceServiceError(404, 'Room not found');

    const [contracts] = await connection.query<TenantIdRow[]>(
      `SELECT c.id
       FROM contracts c
       WHERE c.room_id = ? AND c.status = 'HIEU_LUC'
         AND c.start_date <= CURRENT_DATE AND c.end_date >= CURRENT_DATE
         AND (c.representative_tenant_id = ? OR EXISTS (
           SELECT 1 FROM contract_members cm
           WHERE cm.contract_id = c.id AND cm.tenant_id = ?
         ))
       LIMIT 1 FOR UPDATE`,
      [input.room_id, tenants[0].id, tenants[0].id],
    );
    if (!contracts[0]) throw new MaintenanceServiceError(403, 'You do not have an active contract for this room');

    await connection.execute<ResultSetHeader>(
      `INSERT INTO maintenance_requests (id, room_id, tenant_id, title, description, status, cost)
       VALUES (?, ?, ?, ?, ?, 'TIEP_NHAN', 0)`,
      [id, input.room_id, tenants[0].id, input.title.trim(), input.description.trim()],
    );
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
  return getMaintenanceRequest(id, user);
}

export async function updateMaintenanceRequest(id: string, input: UpdateMaintenanceInput): Promise<MaintenanceRecord> {
  const fields: string[] = [];
  const values: Array<string | number> = [];
  if (input.status !== undefined) {
    fields.push('status = ?');
    values.push(input.status);
  }
  if (input.cost !== undefined) {
    fields.push('cost = ?');
    values.push(input.cost);
  }

  const [result] = await pool.execute<ResultSetHeader>(
    `UPDATE maintenance_requests SET ${fields.join(', ')} WHERE id = ?`,
    [...values, id],
  );
  if (result.affectedRows === 0) {
    const [rows] = await pool.query<TenantIdRow[]>('SELECT id FROM maintenance_requests WHERE id = ?', [id]);
    if (!rows[0]) throw new MaintenanceServiceError(404, 'Maintenance request not found');
  }
  const [rows] = await pool.query<MaintenanceRecord[]>(`${selectIssues} WHERE mr.id = ?`, [id]);
  if (!rows[0]) throw new MaintenanceServiceError(404, 'Maintenance request not found');
  return rows[0];
}


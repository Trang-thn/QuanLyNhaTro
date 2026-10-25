
import { randomUUID } from 'node:crypto';
import type { RowDataPacket } from 'mysql2';
import { pool } from '../config/database';

import type {
  CreateTenantContractInput,
  TenantContract,
} from '../types/tenantContract';

interface ContractRow extends RowDataPacket {
  id: string;
  contract_number: string;
  room_id: string;
  room_number: string | null;
  representative_tenant_id: string;
  representative_name: string | null;
  start_date: string;
  end_date: string;
  rental_price: number | string;
  deposit_amount: number | string;
  status: string;
  billing_cycle_day: number | string;
  member_tenant_ids: string | null;
}

const SELECT_CONTRACTS = `
  SELECT
    c.id,
    c.contract_number,
    c.room_id,
    r.room_number,
    c.representative_tenant_id,
    u.full_name AS representative_name,
    DATE_FORMAT(c.start_date, '%Y-%m-%d') AS start_date,
    DATE_FORMAT(c.end_date, '%Y-%m-%d') AS end_date,
    c.rental_price,
    c.deposit_amount,
    c.status,
    c.billing_cycle_day,
    GROUP_CONCAT(DISTINCT cm.tenant_id) AS member_tenant_ids
  FROM contracts c
  LEFT JOIN rooms r ON r.id = c.room_id
  LEFT JOIN tenants t ON t.id = c.representative_tenant_id
  LEFT JOIN users u ON u.id = t.user_id
  LEFT JOIN contract_members cm ON cm.contract_id = c.id
`;

function mapContract(row: ContractRow): TenantContract {
  return {
    id: row.id,
    contract_number: row.contract_number,
    room_id: row.room_id,
    room_number: row.room_number,
    representative_tenant_id: row.representative_tenant_id,
    representative_name: row.representative_name,
    start_date: row.start_date,
    end_date: row.end_date,
    rental_price: Number(row.rental_price),
    deposit_amount: Number(row.deposit_amount),
    status: row.status,
    billing_cycle_day: Number(row.billing_cycle_day),
    member_tenant_ids: row.member_tenant_ids
      ? row.member_tenant_ids.split(',')
      : [],
  };
}

export async function getAllTenantContracts(): Promise<TenantContract[]> {
  const [rows] = await pool.query<ContractRow[]>(`
    ${SELECT_CONTRACTS}
    GROUP BY c.id
    ORDER BY c.start_date DESC
  `);

  return rows.map(mapContract);
}

export async function getTenantContractsByUserId(
  userId: string,
): Promise<TenantContract[]> {
  const [rows] = await pool.query<ContractRow[]>(
    `${SELECT_CONTRACTS}
     WHERE c.representative_tenant_id IN (
       SELECT t.id FROM tenants t WHERE t.user_id = ?
     )
     OR EXISTS (
       SELECT 1
       FROM contract_members cm2
       INNER JOIN tenants t2 ON t2.id = cm2.tenant_id
       WHERE cm2.contract_id = c.id
         AND t2.user_id = ?
     )
     GROUP BY c.id
     ORDER BY c.start_date DESC`,
    [userId, userId],
  );

  return rows.map(mapContract);
}

export async function getTenantContractById(
  id: string,
): Promise<TenantContract | null> {
  const [rows] = await pool.query<ContractRow[]>(
    `${SELECT_CONTRACTS}
     WHERE c.id = ?
     GROUP BY c.id
     LIMIT 1`,
    [id],
  );

  return rows.length ? mapContract(rows[0]) : null;
}

export async function createTenantContract(
  data: CreateTenantContractInput,
): Promise<string> {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Khóa phòng trong transaction để tránh lập hai hợp đồng đồng thời.
    const [roomRows] = await connection.query<RowDataPacket[]>(
      'SELECT id, status FROM rooms WHERE id = ? FOR UPDATE',
      [data.room_id],
    );

    if (!roomRows.length) {
      throw new Error('ROOM_NOT_FOUND');
    }

    if (roomRows[0].status !== 'TRONG') {
      throw new Error('ROOM_NOT_AVAILABLE');
    }

    // Kiểm tra người đại diện.
    const [representativeRows] = await connection.query<RowDataPacket[]>(
      'SELECT id FROM tenants WHERE id = ?',
      [data.representative_tenant_id],
    );

    if (!representativeRows.length) {
      throw new Error('REPRESENTATIVE_NOT_FOUND');
    }

    // Người đại diện luôn được đưa vào danh sách thành viên hợp đồng.
    const memberIds = [
      ...new Set([
        data.representative_tenant_id,
        ...(data.member_tenant_ids ?? []),
      ]),
    ];

    // Kiểm tra tất cả khách thuê trước khi tạo hợp đồng.
    const placeholders = memberIds.map(() => '?').join(', ');
    const [tenantRows] = await connection.query<RowDataPacket[]>(
      `SELECT id FROM tenants WHERE id IN (${placeholders})`,
      memberIds,
    );

    if (tenantRows.length !== memberIds.length) {
      throw new Error('TENANT_MEMBER_NOT_FOUND');
    }

    const id = randomUUID();

    await connection.execute(
      `INSERT INTO contracts (
        id, contract_number, room_id, representative_tenant_id,
        start_date, end_date, rental_price, deposit_amount,
        status, billing_cycle_day
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'HIEU_LUC', ?)`,
      [
        id,
        data.contract_number.trim(),
        data.room_id,
        data.representative_tenant_id,
        data.start_date,
        data.end_date,
        data.rental_price,
        data.deposit_amount ?? 0,
        data.billing_cycle_day ?? 1,
      ],
    );

    for (const tenantId of memberIds) {
      await connection.execute(
        `INSERT INTO contract_members (contract_id, tenant_id)
         VALUES (?, ?)`,
        [id, tenantId],
      );
    }

    await connection.execute(
      "UPDATE rooms SET status = 'DANG_THUE' WHERE id = ?",
      [data.room_id],
    );

    await connection.commit();
    return id;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function terminateTenantContract(
  id: string,
): Promise<boolean> {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [contractRows] = await connection.query<RowDataPacket[]>(
      `SELECT id, room_id, status
       FROM contracts
       WHERE id = ?
       FOR UPDATE`,
      [id],
    );

    if (!contractRows.length) {
      await connection.rollback();
      return false;
    }

    const contract = contractRows[0];

    if (contract.status === 'DA_THANH_LY') {
      await connection.rollback();
      return true;
    }

    await connection.execute(
      "UPDATE contracts SET status = 'DA_THANH_LY' WHERE id = ?",
      [id],
    );

    // Chỉ trả phòng về TRONG nếu không còn hợp đồng hiệu lực khác.
    const [activeRows] = await connection.query<RowDataPacket[]>(
      `SELECT id FROM contracts
       WHERE room_id = ?
         AND status = 'HIEU_LUC'
         AND id <> ?
       LIMIT 1`,
      [contract.room_id, id],
    );

    if (!activeRows.length) {
      await connection.execute(
        "UPDATE rooms SET status = 'TRONG' WHERE id = ? AND status <> 'BAO_TRI'",
        [contract.room_id],
      );
    }

    await connection.commit();
    return true;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

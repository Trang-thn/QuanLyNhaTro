
import { randomUUID } from 'node:crypto';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import { pool } from '../config/database';

import type {
  Contract,
  CreateContractInput,
  UpdateContractInput,
  ContractFilters,
} from '../types/contract';

// Kiểu dữ liệu nhận được từ truy vấn MySQL
interface ContractRow extends RowDataPacket {
  id: string;
  contract_number: string;
  room_id: string;
  room_number: string | null;
  representative_tenant_id: string;
  tenant_name: string | null;
  phone: string | null;
  email: string | null;
  start_date: string;
  end_date: string;
  rental_price: number | string;
  deposit_amount: number | string;
  status: string;
  billing_cycle_day: number | string;
}

// Câu truy vấn dùng chung để lấy thông tin hợp đồng
const CONTRACT_SELECT = `
  SELECT
    c.id,
    c.contract_number,
    c.room_id,
    r.room_number,
    c.representative_tenant_id,
    u.full_name AS tenant_name,
    u.phone_number AS phone,
    u.email,
    DATE_FORMAT(c.start_date, '%Y-%m-%d') AS start_date,
    DATE_FORMAT(c.end_date, '%Y-%m-%d') AS end_date,
    c.rental_price,
    c.deposit_amount,
    c.status,
    c.billing_cycle_day
  FROM contracts c
  LEFT JOIN rooms r
    ON r.id = c.room_id
  LEFT JOIN tenants t
    ON t.id = c.representative_tenant_id
  LEFT JOIN users u
    ON u.id = t.user_id
`;

// Chuyển dữ liệu MySQL về kiểu dữ liệu trả cho API
function mapContract(row: ContractRow): Contract {
  return {
    id: row.id,
    contract_number: row.contract_number,
    room_id: row.room_id,
    room_number: row.room_number,
    representative_tenant_id: row.representative_tenant_id,
    tenant_name: row.tenant_name,
    phone: row.phone,
    email: row.email,
    start_date: row.start_date,
    end_date: row.end_date,
    rental_price: Number(row.rental_price),
    deposit_amount: Number(row.deposit_amount),
    status: row.status,
    billing_cycle_day: Number(row.billing_cycle_day),
  };
}

// 1. Lấy danh sách hợp đồng, tìm theo số phòng và trạng thái
export async function getAllContracts(
  filters: ContractFilters = {},
): Promise<Contract[]> {
  const conditions: string[] = [];
  const values: (string | number)[] = [];

  if (filters.roomNumber?.trim()) {
    conditions.push('r.room_number LIKE ?');
    values.push(`%${filters.roomNumber.trim()}%`);
  }

  if (filters.status?.trim()) {
    conditions.push('c.status = ?');
    values.push(filters.status.trim());
  }

  let sql = CONTRACT_SELECT;

  if (conditions.length > 0) {
    sql += ` WHERE ${conditions.join(' AND ')}`;
  }

  sql += ' ORDER BY c.start_date DESC';

  const [rows] = await pool.query<ContractRow[]>(sql, values);

  return rows.map(mapContract);
}

// 2. Lấy chi tiết một hợp đồng theo ID
export async function getContractById(
  id: string,
): Promise<Contract | null> {
  const sql = `${CONTRACT_SELECT} WHERE c.id = ? LIMIT 1`;

  const [rows] = await pool.query<ContractRow[]>(sql, [id]);

  if (rows.length === 0) {
    return null;
  }

  return mapContract(rows[0]);
}

// 3. Thêm hợp đồng mới
export async function createContract(
  data: CreateContractInput,
): Promise<string> {
  const id = randomUUID();

  const sql = `
    INSERT INTO contracts (
      id,
      contract_number,
      room_id,
      representative_tenant_id,
      start_date,
      end_date,
      rental_price,
      deposit_amount,
      status,
      billing_cycle_day
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  await pool.execute<ResultSetHeader>(sql, [
    id,
    data.contract_number,
    data.room_id,
    data.representative_tenant_id,
    data.start_date,
    data.end_date,
    data.rental_price,
    data.deposit_amount,
    data.status,
    data.billing_cycle_day,
  ]);

  return id;
}

// 4. Cập nhật hợp đồng
export async function updateContract(
  id: string,
  data: UpdateContractInput,
): Promise<boolean> {
  const columnMap: Record<keyof UpdateContractInput, string> = {
    contract_number: 'contract_number',
    room_id: 'room_id',
    representative_tenant_id: 'representative_tenant_id',
    start_date: 'start_date',
    end_date: 'end_date',
    rental_price: 'rental_price',
    deposit_amount: 'deposit_amount',
    status: 'status',
    billing_cycle_day: 'billing_cycle_day',
  };

  const fields: string[] = [];
  const values: (string | number)[] = [];

  for (const key of Object.keys(data) as (keyof UpdateContractInput)[]) {
    const value = data[key];

    if (value !== undefined && columnMap[key]) {
      fields.push(`${columnMap[key]} = ?`);
      values.push(value as string | number);
    }
  }

  if (fields.length === 0) {
    const existing = await getContractById(id);
    return existing !== null;
  }

  const sql = `
    UPDATE contracts
    SET ${fields.join(', ')}
    WHERE id = ?
  `;

  const [result] = await pool.execute<ResultSetHeader>(sql, [
    ...values,
    id,
  ]);

  if (result.affectedRows > 0) {
    return true;
  }

  // MySQL có thể báo 0 dòng thay đổi nếu dữ liệu gửi lên không đổi.
  const existing = await getContractById(id);
  return existing !== null;
}

// 5. Xóa hợp đồng
export async function deleteContract(
  id: string,
): Promise<boolean> {
  const [result] = await pool.execute<ResultSetHeader>(
    'DELETE FROM contracts WHERE id = ?',
    [id],
  );

  return result.affectedRows > 0;
}

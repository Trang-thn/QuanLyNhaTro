import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { pool } from '../config/database';

import { randomUUID } from 'node:crypto';

/**
 * Lấy dữ liệu tổng quan của khách thuê có tài khoản đăng nhập.
 * Giữ nguyên chức năng dashboard hiện tại.
 */
export async function getTenantDashboardData(userId: string) {
  const [tenantRows] = await pool.query<
    (RowDataPacket & { id: string })[]
  >(
    'SELECT id FROM tenants WHERE user_id = ? LIMIT 1',
    [userId],
  );

  const tenantId = tenantRows[0]?.id;

  if (!tenantId) {
    return {
      contractId: '',
      invoices: [],
      contracts: [],
      maintenanceRequests: [],
      rooms: [],
    };
  }

  const [contracts] = await pool.query<RowDataPacket[]>(
    `SELECT c.*
     FROM contracts c
     WHERE c.representative_tenant_id = ?
        OR EXISTS (
          SELECT 1
          FROM contract_members cm
          WHERE cm.contract_id = c.id
            AND cm.tenant_id = ?
        )
     ORDER BY c.start_date DESC`,
    [tenantId, tenantId],
  );

  const [invoices] = await pool.query<RowDataPacket[]>(
    `SELECT i.*, c.room_id
     FROM invoices i
     JOIN contracts c ON c.id = i.contract_id
     WHERE c.representative_tenant_id = ?
        OR EXISTS (
          SELECT 1
          FROM contract_members cm
          WHERE cm.contract_id = c.id
            AND cm.tenant_id = ?
        )
     ORDER BY i.billing_year DESC, i.billing_month DESC`,
    [tenantId, tenantId],
  );

  const [maintenanceRequests] = await pool.query<RowDataPacket[]>(
    `SELECT mr.*
     FROM maintenance_requests mr
     WHERE mr.tenant_id = ?
     ORDER BY mr.created_at DESC`,
    [tenantId],
  );

  const [rooms] = await pool.query<RowDataPacket[]>(
    `SELECT DISTINCT r.*
     FROM rooms r
     JOIN contracts c ON c.room_id = r.id
     WHERE c.representative_tenant_id = ?
        OR EXISTS (
          SELECT 1
          FROM contract_members cm
          WHERE cm.contract_id = c.id
            AND cm.tenant_id = ?
        )`,
    [tenantId, tenantId],
  );

  return {
    contractId: contracts[0]?.id ?? '',
    invoices,
    contracts,
    maintenanceRequests,
    rooms,
  };
}

/**
 * Lấy danh sách khách thuê.
 *
 * Ưu tiên thông tin lưu trực tiếp trong bảng tenants.
 * Nếu khách thuê cũ đã liên kết với users thì dùng thông tin
 * trong users khi các trường tương ứng ở tenants đang trống.
 */
export async function getAllTenants(keyword?: string) {
  let sql = `
    SELECT
      t.id,
      t.user_id,

      COALESCE(NULLIF(t.full_name, ''), u.full_name) AS full_name,
      u.username,

      COALESCE(NULLIF(t.email, ''), u.email) AS email,
      COALESCE(NULLIF(t.phone, ''), u.phone_number) AS phone,

      t.date_of_birth,
      t.identity_card_number,
      t.issue_date,
      t.issue_place,
      t.permanent_address,
      t.emergency_contact,
      t.gender,
      t.avatar

    FROM tenants t
    LEFT JOIN users u ON u.id = t.user_id
  `;

  const values: string[] = [];

  if (keyword?.trim()) {
    sql += `
      WHERE COALESCE(NULLIF(t.full_name, ''), u.full_name) LIKE ?
         OR COALESCE(NULLIF(t.phone, ''), u.phone_number) LIKE ?
         OR COALESCE(NULLIF(t.email, ''), u.email) LIKE ?
         OR t.identity_card_number LIKE ?
         OR t.permanent_address LIKE ?
         OR u.username LIKE ?
    `;

    const search = `%${keyword.trim()}%`;

    values.push(
      search,
      search,
      search,
      search,
      search,
      search,
    );
  }

  sql += `
    ORDER BY
      COALESCE(NULLIF(t.full_name, ''), u.full_name) ASC
  `;

  const [rows] = await pool.query<RowDataPacket[]>(sql, values);

  return rows;
}

/**
 * Lấy chi tiết một khách thuê theo ID.
 */
export async function getTenantById(id: string) {
  const [rows] = await pool.query<RowDataPacket[]>(
    `
      SELECT
        t.id,
        t.user_id,

        COALESCE(NULLIF(t.full_name, ''), u.full_name) AS full_name,
        u.username,

        COALESCE(NULLIF(t.email, ''), u.email) AS email,
        COALESCE(NULLIF(t.phone, ''), u.phone_number) AS phone,

        t.date_of_birth,
        t.identity_card_number,
        t.issue_date,
        t.issue_place,
        t.permanent_address,
        t.emergency_contact,
        t.gender,
        t.avatar

      FROM tenants t
      LEFT JOIN users u ON u.id = t.user_id
      WHERE t.id = ?
      LIMIT 1
    `,
    [id],
  );

  return rows[0] ?? null;
}

/**
 * Thêm khách thuê trực tiếp vào bảng tenants.
 *
 * Không tạo tài khoản trong bảng users.
 * user_id mặc định là NULL.
 */
export async function createTenant(data: {
  user_id?: string | null;
  full_name?: string | null;
  date_of_birth?: string | null;
  identity_card_number: string;
  issue_date?: string | null;
  issue_place?: string | null;
  permanent_address?: string | null;
  emergency_contact?: string | null;
  phone?: string | null;
  email?: string | null;
  gender?: string | null;
  avatar?: string | null;
}) {
  const id = randomUUID();

  await pool.execute(
    `
      INSERT INTO tenants (
        id,
        user_id,
        full_name,
        date_of_birth,
        identity_card_number,
        issue_date,
        issue_place,
        permanent_address,
        emergency_contact,
        phone,
        email,
        gender,
        avatar
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      id,
      data.user_id || null,
      data.full_name?.trim() || null,
      data.date_of_birth || null,
      data.identity_card_number.trim(),
      data.issue_date || null,
      data.issue_place?.trim() || null,
      data.permanent_address?.trim() || null,
      data.emergency_contact?.trim() || null,
      data.phone?.trim() || null,
      data.email?.trim() || null,
      data.gender?.trim() || null,
      data.avatar?.trim() || null,
    ],
  );

  return id;
}

/**
 * Cập nhật thông tin khách thuê.
 *
 * Chỉ cập nhật những trường được cho phép.
 * Không tự động tạo hoặc liên kết tài khoản đăng nhập.
 */
export async function updateTenant(
  id: string,
  data: {
    full_name?: string | null;
    date_of_birth?: string | null;
    identity_card_number?: string;
    issue_date?: string | null;
    issue_place?: string | null;
    permanent_address?: string | null;
    emergency_contact?: string | null;
    phone?: string | null;
    email?: string | null;
    gender?: string | null;
    avatar?: string | null;
  },
) {
  const columnMap = {
    full_name: 'full_name',
    date_of_birth: 'date_of_birth',
    identity_card_number: 'identity_card_number',
    issue_date: 'issue_date',
    issue_place: 'issue_place',
    permanent_address: 'permanent_address',
    emergency_contact: 'emergency_contact',
    phone: 'phone',
    email: 'email',
    gender: 'gender',
    avatar: 'avatar',
  } as const;

  const fields: string[] = [];
  const values: (string | null)[] = [];

  for (const key of Object.keys(data) as (keyof typeof columnMap)[]) {
    const value = data[key];

    if (value === undefined) {
      continue;
    }

    fields.push(`${columnMap[key]} = ?`);

    if (value === null) {
      values.push(null);
    } else if (typeof value === 'string') {
      const trimmedValue = value.trim();

      // Các trường rỗng được lưu thành NULL.
      values.push(trimmedValue === '' ? null : trimmedValue);
    } else {
      values.push(null);
    }
  }

  if (fields.length === 0) {
    return (await getTenantById(id)) !== null;
  }

  const [result] = await pool.execute<ResultSetHeader>(
    `UPDATE tenants
     SET ${fields.join(', ')}
     WHERE id = ?`,
    [...values, id],
  );

  if (result.affectedRows > 0) {
    return true;
  }

  // MySQL có thể trả affectedRows = 0 nếu dữ liệu không thay đổi.
  return (await getTenantById(id)) !== null;
}
export async function deleteTenant(id: string): Promise<boolean> {
  const [result] = await pool.execute<ResultSetHeader>(
    'DELETE FROM tenants WHERE id = ?',
    [id],
  );

  return result.affectedRows > 0;
}
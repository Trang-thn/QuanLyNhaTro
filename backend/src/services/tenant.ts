import { RowDataPacket } from 'mysql2';
import { pool } from '../config/database';
import { TenantRow, ContractRow } from '../types/tenant';

// Lấy danh sách toàn bộ khách thuê (kèm thông tin user nếu có)
export async function getAllTenantsService() {
  const [tenants] = await pool.query<TenantRow[]>(`
    SELECT t.id, t.user_id, t.identity_card_number, 
           DATE_FORMAT(t.issue_date, '%Y-%m-%d') AS issue_date, 
           t.issue_place, t.permanent_address, t.emergency_contact,
           u.full_name, u.email, u.phone_number
    FROM tenants t
    LEFT JOIN users u ON u.id = t.user_id
    ORDER BY u.full_name ASC
  `);
  return tenants;
}

// Lấy chi tiết khách thuê theo ID
export async function getTenantByIdService(id: string) {
  const [rows] = await pool.query<TenantRow[]>(`
    SELECT t.id, t.user_id, t.identity_card_number, 
           DATE_FORMAT(t.issue_date, '%Y-%m-%d') AS issue_date, 
           t.issue_place, t.permanent_address, t.emergency_contact,
           u.full_name, u.email, u.phone_number
    FROM tenants t
    LEFT JOIN users u ON u.id = t.user_id
    WHERE t.id = ?
    LIMIT 1
  `, [id]);
  return rows[0] || null;
}

// Tìm khách thuê theo số CCCD
export async function getTenantByCCCDService(cccd: string) {
  const [rows] = await pool.query<TenantRow[]>(`
    SELECT t.id, t.user_id, t.identity_card_number, 
           DATE_FORMAT(t.issue_date, '%Y-%m-%d') AS issue_date, 
           t.issue_place, t.permanent_address, t.emergency_contact,
           u.full_name, u.email, u.phone_number
    FROM tenants t
    LEFT JOIN users u ON u.id = t.user_id
    WHERE t.identity_card_number = ?
    LIMIT 1
  `, [cccd]);
  return rows[0] || null;
}

// Tạo mới khách thuê
export async function createTenantService(data: {
  user_id?: string;
  identity_card_number: string;
  issue_date?: string;
  issue_place?: string;
  permanent_address?: string;
  emergency_contact?: string;
}) {
  const [result]: any = await pool.query(`
    INSERT INTO tenants (user_id, identity_card_number, issue_date, issue_place, permanent_address, emergency_contact)
    VALUES (?, ?, ?, ?, ?, ?)
  `, [
    data.user_id || null,
    data.identity_card_number,
    data.issue_date || null,
    data.issue_place || null,
    data.permanent_address || null,
    data.emergency_contact || null
  ]);

  return getTenantByIdService(result.insertId);
}

// Cập nhật thông tin khách thuê
export async function updateTenantService(id: string, data: any) {
  await pool.query(`
    UPDATE tenants 
    SET identity_card_number = COALESCE(?, identity_card_number),
        issue_date = COALESCE(?, issue_date),
        issue_place = COALESCE(?, issue_place),
        permanent_address = COALESCE(?, permanent_address),
        emergency_contact = COALESCE(?, emergency_contact)
    WHERE id = ?
  `, [
    data.identity_card_number,
    data.issue_date,
    data.issue_place,
    data.permanent_address,
    data.emergency_contact,
    id
  ]);

  return getTenantByIdService(id);
}

// Xóa khách thuê
export async function deleteTenantService(id: string) {
  const [result]: any = await pool.query('DELETE FROM tenants WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

// Lập hợp đồng mới (Bao gồm người đại diện, danh sách thành viên ở cùng và cập nhật phòng sang DANG_THUE)
export async function createContractService(data: {
  contract_number: string;
  room_id: string;
  representative_tenant_id: string;
  start_date: string;
  end_date: string;
  rental_price: number;
  deposit_amount: number;
  billing_cycle_day?: number;
  member_tenant_ids?: string[];
}) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Tạo hợp đồng
    const [contractResult]: any = await connection.query(`
      INSERT INTO contracts (contract_number, room_id, representative_tenant_id, start_date, end_date, rental_price, deposit_amount, status, billing_cycle_day)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'HIEU_LUC', ?)
    `, [
      data.contract_number,
      data.room_id,
      data.representative_tenant_id,
      data.start_date,
      data.end_date,
      data.rental_price,
      data.deposit_amount,
      data.billing_cycle_day || 1
    ]);

    const contractId = contractResult.insertId;

    // 2. Thêm thành viên ở cùng vào contract_members (nếu có)
    if (data.member_tenant_ids && data.member_tenant_ids.length > 0) {
      const values = data.member_tenant_ids.map(tenantId => [contractId, tenantId]);
      await connection.query(`
        INSERT INTO contract_members (contract_id, tenant_id) VALUES ?
      `, [values]);
    }

    // 3. Cập nhật trạng thái phòng thành 'DANG_THUE'
    await connection.query(`
      UPDATE rooms SET status = 'DANG_THUE' WHERE id = ?
    `, [data.room_id]);

    await connection.commit();
    return { id: contractId, ...data, status: 'HIEU_LUC' };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// Thanh lý hợp đồng trước hạn
export async function terminateContractService(contractId: string) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Lấy thông tin room_id từ hợp đồng
    const [contracts] = await connection.query<ContractRow[]>(`
      SELECT room_id FROM contracts WHERE id = ? LIMIT 1
    `, [contractId]);

    if (!contracts[0]) {
      throw new Error('Không tìm thấy hợp đồng');
    }

    const roomId = contracts[0].room_id;

    // 2. Cập nhật trạng thái hợp đồng thành 'DA_THANH_LY'
    await connection.query(`
      UPDATE contracts SET status = 'DA_THANH_LY' WHERE id = ?
    `, [contractId]);

    // 3. Trả trạng thái phòng về 'TRONG'
    await connection.query(`
      UPDATE rooms SET status = 'TRONG' WHERE id = ?
    `, [roomId]);

    await connection.commit();
    return { contractId, status: 'DA_THANH_LY' };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
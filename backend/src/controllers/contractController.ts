import { Request, Response } from 'express';
import pool from '../config/database';
import { RowDataPacket } from 'mysql2';

// 1. Lấy tất cả hợp đồng
export const getAllContracts = async (_req: Request, res: Response) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(`
      SELECT c.id, c.contract_number, c.room_id, c.representative_tenant_id, 
             c.start_date, c.end_date, c.rental_price, c.deposit_amount, 
             c.billing_cycle_day, c.status, c.created_at,
             r.room_number, u.full_name AS representative_name
      FROM contracts c
      LEFT JOIN rooms r ON c.room_id = r.id
      LEFT JOIN tenants t ON c.representative_tenant_id = t.id
      LEFT JOIN users u ON t.user_id = u.id
      ORDER BY c.created_at DESC
    `);

    return res.status(200).json({
      success: true,
      message: 'Lấy danh sách hợp đồng thành công',
      data: rows
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Lỗi hệ thống máy chủ',
      data: null
    });
  }
};

// 2. Tạo hợp đồng mới (Dùng TRANSACTION)
export const createContract = async (req: Request, res: Response) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const {
      contractNumber,
      roomId,
      representativeTenantId,
      startDate,
      endDate,
      rentalPrice,
      depositAmount,
      billingCycleDay,
      memberTenantIds
    } = req.body;

    if (!contractNumber || !roomId || !representativeTenantId || !startDate || !endDate || !rentalPrice) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp đầy đủ thông tin hợp đồng bắt buộc',
        data: null
      });
    }

    // Kiểm tra trạng thái phòng
    const [room] = await connection.query<RowDataPacket[]>('SELECT status FROM rooms WHERE id = ?', [roomId]);
    if (room.length === 0 || room[0].status === 'DANG_THUE') {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: 'Phòng không tồn tại hoặc đã được thuê',
        data: null
      });
    }

    // Tạo hợp đồng
    await connection.query(`
      INSERT INTO contracts (id, contract_number, room_id, representative_tenant_id, start_date, end_date, rental_price, deposit_amount, billing_cycle_day, status)
      VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, 'HIEU_LUC')
    `, [contractNumber, roomId, representativeTenantId, startDate, endDate, rentalPrice, depositAmount || 0, billingCycleDay || 1]);

    const [[newContract]] = await connection.query<RowDataPacket[]>('SELECT id FROM contracts WHERE contract_number = ?', [contractNumber]);
    const contractId = newContract.id;

    // Cập nhật trạng thái phòng sang DANG_THUE
    await connection.query("UPDATE rooms SET status = 'DANG_THUE' WHERE id = ?", [roomId]);

    // Thêm danh sách thành viên ở cùng
    if (memberTenantIds && Array.isArray(memberTenantIds) && memberTenantIds.length > 0) {
      const memberValues = memberTenantIds.map((tenantId: string) => [contractId, tenantId]);
      await connection.query('INSERT INTO contract_members (contract_id, tenant_id) VALUES ?', [memberValues]);
    }

    await connection.commit();
    return res.status(201).json({
      success: true,
      message: 'Tạo hợp đồng thành công',
      data: { contractId }
    });
  } catch (error: any) {
    await connection.rollback();
    return res.status(500).json({
      success: false,
      message: 'Lỗi hệ thống khi tạo hợp đồng',
      data: null
    });
  } finally {
    connection.release();
  }
};

// 3. Gia hạn hợp đồng
export const renewContract = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { newEndDate, newPrice } = req.body;

    if (!newEndDate) {
      return res.status(400).json({
        success: false,
        message: 'Ngày kết thúc mới là bắt buộc',
        data: null
      });
    }

    let query = 'UPDATE contracts SET end_date = ?';
    let params: any[] = [newEndDate];

    if (newPrice) {
      query += ', rental_price = ?';
      params.push(newPrice);
    }

    query += ' WHERE id = ?';
    params.push(id);

    await pool.query(query, params);

    return res.status(200).json({
      success: true,
      message: 'Gia hạn hợp đồng thành công',
      data: null
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Lỗi hệ thống khi gia hạn hợp đồng',
      data: null
    });
  }
};

// 4. Thanh lý hợp đồng
export const terminateContract = async (req: Request, res: Response) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { id } = req.params;

    const [contracts] = await connection.query<RowDataPacket[]>('SELECT room_id FROM contracts WHERE id = ?', [id]);
    if (contracts.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: 'Hợp đồng không tồn tại',
        data: null
      });
    }

    const roomId = contracts[0].room_id;

    // Chuyển trạng thái hợp đồng & trả phòng về TRONG
    await connection.query("UPDATE contracts SET status = 'DA_THANH_LY' WHERE id = ?", [id]);
    await connection.query("UPDATE rooms SET status = 'TRONG' WHERE id = ?", [roomId]);

    await connection.commit();
    return res.status(200).json({
      success: true,
      message: 'Thanh lý hợp đồng thành công, phòng đã chuyển về trạng thái TRỐNG',
      data: null
    });
  } catch (error: any) {
    await connection.rollback();
    return res.status(500).json({
      success: false,
      message: 'Lỗi hệ thống khi thanh lý hợp đồng',
      data: null
    });
  } finally {
    connection.release();
  }
};
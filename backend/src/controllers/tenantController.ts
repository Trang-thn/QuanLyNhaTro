import { Request, Response } from 'express';
import {pool} from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// 1. Lấy danh sách tất cả khách thuê
export const getAllTenants = async (_req: Request, res: Response) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(`
      SELECT t.id, t.user_id, t.identity_card_number, t.issue_date, t.issue_place, 
             t.permanent_address, t.emergency_contact, 
             u.full_name, u.email, u.phone_number 
      FROM tenants t
      LEFT JOIN users u ON t.user_id = u.id
      ORDER BY t.id DESC
    `);

    return res.status(200).json({
      success: true,
      message: 'Lấy danh sách khách thuê thành công',
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

// 2. Lấy chi tiết 1 khách thuê theo ID
export const getTenantById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query<RowDataPacket[]>(`
      SELECT t.id, t.user_id, t.identity_card_number, t.issue_date, t.issue_place, 
             t.permanent_address, t.emergency_contact, 
             u.full_name, u.email, u.phone_number 
      FROM tenants t
      LEFT JOIN users u ON t.user_id = u.id
      WHERE t.id = ?
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy hồ sơ khách thuê',
        data: null
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Lấy thông tin khách thuê thành công',
      data: rows[0]
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Lỗi hệ thống máy chủ',
      data: null
    });
  }
};

// 3. Tìm khách thuê theo số CCCD
export const getTenantByCCCD = async (req: Request, res: Response) => {
  try {
    const { cccd } = req.params;
    const [rows] = await pool.query<RowDataPacket[]>(`
      SELECT id, user_id, identity_card_number, issue_date, issue_place, permanent_address, emergency_contact 
      FROM tenants 
      WHERE identity_card_number = ?
    `, [cccd]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thông tin CCCD này',
        data: null
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Tìm thấy thông tin khách thuê',
      data: rows[0]
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Lỗi hệ thống máy chủ',
      data: null
    });
  }
};

// 4. Tạo mới hồ sơ khách thuê
export const createTenant = async (req: Request, res: Response) => {
  try {
    const { identityCardNumber, issueDate, issuePlace, permanentAddress, emergencyContact, userId } = req.body;

    if (!identityCardNumber) {
      return res.status(400).json({
        success: false,
        message: 'Số CCCD/CMND là bắt buộc',
        data: null
      });
    }

    const [existing] = await pool.query<RowDataPacket[]>('SELECT id FROM tenants WHERE identity_card_number = ?', [identityCardNumber]);
    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Số CCCD/CMND này đã tồn tại trong hệ thống',
        data: null
      });
    }

    await pool.query<ResultSetHeader>(`
      INSERT INTO tenants (id, user_id, identity_card_number, issue_date, issue_place, permanent_address, emergency_contact)
      VALUES (UUID(), ?, ?, ?, ?, ?, ?)
    `, [userId || null, identityCardNumber, issueDate || null, issuePlace || null, permanentAddress || null, emergencyContact || null]);

    return res.status(201).json({
      success: true,
      message: 'Tạo hồ sơ khách thuê thành công',
      data: null
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Lỗi hệ thống khi tạo hồ sơ khách thuê',
      data: null
    });
  }
};

// 5. Cập nhật thông tin khách thuê
export const updateTenant = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { identityCardNumber, issueDate, issuePlace, permanentAddress, emergencyContact } = req.body;

    await pool.query(`
      UPDATE tenants 
      SET identity_card_number = ?, issue_date = ?, issue_place = ?, permanent_address = ?, emergency_contact = ?
      WHERE id = ?
    `, [identityCardNumber, issueDate, issuePlace, permanentAddress, emergencyContact, id]);

    return res.status(200).json({
      success: true,
      message: 'Cập nhật thông tin khách thuê thành công',
      data: null
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Lỗi hệ thống khi cập nhật thông tin',
      data: null
    });
  }
};

// 6. Xóa khách thuê
export const deleteTenant = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM tenants WHERE id = ?', [id]);

    return res.status(200).json({
      success: true,
      message: 'Đã xóa hồ sơ khách thuê thành công',
      data: null
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Lỗi hệ thống khi xóa hồ sơ khách thuê',
      data: null
    });
  }
};
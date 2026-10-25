import { Request, Response } from 'express';
import { getCurrentUserProfile } from '../services/users';
import { getTenantDashboardData } from '../services/tenant';
import {
  getAllTenants,
  getTenantById,
  createTenant,
  updateTenant,
} from '../services/tenant';

export async function getTenantProfile(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user) { res.status(401).json({ message: 'Unauthorized' }); return; }
    res.status(200).json(await getCurrentUserProfile(req.user));
  } catch (error) {
    console.error('Failed to load tenant profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function getTenantDashboard(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user) { res.status(401).json({ message: 'vui lòng đăng nhập' }); return; }
    res.status(200).json(await getTenantDashboardData(req.user.id));
  } catch (error) {
    console.error('Failed to load tenant dashboard:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}




export async function getTenants(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const keyword =
      typeof req.query.keyword === 'string'
        ? req.query.keyword.trim()
        : undefined;

    const tenants = await getAllTenants(keyword);
    res.status(200).json(tenants);
  } catch (error) {
    console.error('Lỗi lấy danh sách khách thuê:', error);
    res.status(500).json({
      message: 'Không thể lấy danh sách khách thuê',
    });
  }
}

export async function getTenantDetail(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const tenant = await getTenantById(req.params.id);

    if (!tenant) {
      res.status(404).json({
        message: 'Không tìm thấy khách thuê',
      });
      return;
    }

    res.status(200).json(tenant);
  } catch (error) {
    console.error('Lỗi lấy chi tiết khách thuê:', error);
    res.status(500).json({
      message: 'Không thể lấy chi tiết khách thuê',
    });
  }
}

export async function createNewTenant(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const data = req.body;

    if (
      !data ||
      typeof data.identity_card_number !== 'string' ||
      !data.identity_card_number.trim()
    ) {
      res.status(400).json({
        message: 'Vui lòng nhập số CCCD khách thuê',
      });
      return;
    }

    const id = await createTenant({
      user_id: data.user_id ?? null,
      identity_card_number: data.identity_card_number.trim(),
      issue_date: data.issue_date ?? null,
      issue_place: data.issue_place ?? null,
      permanent_address: data.permanent_address ?? null,
      emergency_contact: data.emergency_contact ?? null,
    });

    res.status(201).json({
      message: 'Thêm khách thuê thành công',
      id,
    });
  } catch (error) {
    console.error('Lỗi thêm khách thuê:', error);

    const dbError = error as { code?: string };

    if (dbError.code === 'ER_DUP_ENTRY') {
      res.status(409).json({
        message: 'Số CCCD hoặc tài khoản đã được sử dụng',
      });
      return;
    }

    res.status(500).json({
      message: 'Không thể thêm khách thuê',
    });
  }
}

export async function updateExistingTenant(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const data = req.body;

    if (!data || Object.keys(data).length === 0) {
      res.status(400).json({
        message: 'Vui lòng nhập thông tin cần cập nhật',
      });
      return;
    }

    const updated = await updateTenant(req.params.id, data);

    if (!updated) {
      res.status(404).json({
        message: 'Không tìm thấy khách thuê',
      });
      return;
    }

    res.status(200).json({
      message: 'Cập nhật khách thuê thành công',
    });
  } catch (error) {
    console.error('Lỗi cập nhật khách thuê:', error);

    const dbError = error as { code?: string };

    if (dbError.code === 'ER_DUP_ENTRY') {
      res.status(409).json({
        message: 'Số CCCD hoặc tài khoản đã được sử dụng',
      });
      return;
    }

    res.status(500).json({
      message: 'Không thể cập nhật khách thuê',
    });
  }
}

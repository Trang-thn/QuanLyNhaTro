import { Request, Response } from 'express';
import * as tenantService from '../services/tenant';

export async function getAllTenants(_req: Request, res: Response): Promise<void> {
  try {
    const tenants = await tenantService.getAllTenantsService();
    res.status(200).json({ success: true, data: tenants });
  } catch (error) {
    console.error('Failed to get tenants:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export async function getTenantById(req: Request, res: Response): Promise<void> {
  try {
    const tenant = await tenantService.getTenantByIdService(req.params.id);
    if (!tenant) {
      res.status(404).json({ success: false, message: 'Không tìm thấy hồ sơ khách thuê' });
      return;
    }
    res.status(200).json({ success: true, data: tenant });
  } catch (error) {
    console.error('Failed to get tenant by id:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export async function getTenantByCCCD(req: Request, res: Response): Promise<void> {
  try {
    const tenant = await tenantService.getTenantByCCCDService(req.params.cccd);
    if (!tenant) {
      res.status(404).json({ success: false, message: 'Không tìm thấy hồ sơ theo CCCD' });
      return;
    }
    res.status(200).json({ success: true, data: tenant });
  } catch (error) {
    console.error('Failed to get tenant by CCCD:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export async function createTenant(req: Request, res: Response): Promise<void> {
  try {
    const newTenant = await tenantService.createTenantService(req.body);
    res.status(201).json({ success: true, message: 'Tạo hồ sơ khách thuê thành công', data: newTenant });
  } catch (error: any) {
    console.error('Failed to create tenant:', error);
    res.status(400).json({ success: false, message: error.message || 'Lỗi dữ liệu đầu vào' });
  }
}

export async function updateTenant(req: Request, res: Response): Promise<void> {
  try {
    const updated = await tenantService.updateTenantService(req.params.id, req.body);
    res.status(200).json({ success: true, message: 'Cập nhật hồ sơ thành công', data: updated });
  } catch (error: any) {
    console.error('Failed to update tenant:', error);
    res.status(400).json({ success: false, message: error.message || 'Lỗi cập nhật dữ liệu' });
  }
}

export async function deleteTenant(req: Request, res: Response): Promise<void> {
  try {
    const success = await tenantService.deleteTenantService(req.params.id);
    if (!success) {
      res.status(404).json({ success: false, message: 'Không tìm thấy hồ sơ để xóa' });
      return;
    }
    res.status(200).json({ success: true, message: 'Xóa hồ sơ thành công' });
  } catch (error) {
    console.error('Failed to delete tenant:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
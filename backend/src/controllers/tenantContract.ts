
import type { Request, Response } from 'express';

import {
  getAllTenantContracts,
  getTenantContractById,
  getTenantContractsByUserId,
  createTenantContract,
  terminateTenantContract,
} from '../services/tenantContract';

import type { CreateTenantContractInput } from '../types/tenantContract';
import { getCurrentUserProfile } from '../services/users';

export async function getTenantContracts(
  _req: Request,
  res: Response,
): Promise<void> {
  try {
    const contracts = await getAllTenantContracts();
    res.status(200).json(contracts);
  } catch (error) {
    console.error('Lỗi lấy danh sách hợp đồng:', error);
    res.status(500).json({
      message: 'Không thể lấy danh sách hợp đồng',
    });
  }
}

export async function getTenantContractDetail(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const contract = await getTenantContractById(req.params.id);

    if (!contract) {
      res.status(404).json({ message: 'Không tìm thấy hợp đồng' });
      return;
    }

    res.status(200).json(contract);
  } catch (error) {
    console.error('Lỗi lấy chi tiết hợp đồng:', error);
    res.status(500).json({
      message: 'Không thể lấy chi tiết hợp đồng',
    });
  }
}

export async function createTenantContractHandler(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const data = req.body as CreateTenantContractInput;

    if (
      !data ||
      typeof data.contract_number !== 'string' ||
      !data.contract_number.trim() ||
      typeof data.room_id !== 'string' ||
      !data.room_id.trim() ||
      typeof data.representative_tenant_id !== 'string' ||
      !data.representative_tenant_id.trim() ||
      !data.start_date ||
      !data.end_date ||
      !Number.isFinite(Number(data.rental_price)) ||
      Number(data.rental_price) < 0 ||
      (data.deposit_amount !== undefined &&
        (!Number.isFinite(Number(data.deposit_amount)) ||
          Number(data.deposit_amount) < 0))
    ) {
      res.status(400).json({
        message: 'Vui lòng kiểm tra thông tin hợp đồng và các khoản tiền',
      });
      return;
    }

    if (
      !Array.isArray(data.member_tenant_ids ?? []) ||
      (data.member_tenant_ids ?? []).some(
        (tenantId) => typeof tenantId !== 'string' || !tenantId.trim(),
      )
    ) {
      res.status(400).json({
        message: 'Danh sách người ở cùng không hợp lệ',
      });
      return;
    }

    const startDate = new Date(data.start_date);
    const endDate = new Date(data.end_date);

    if (
      Number.isNaN(startDate.getTime()) ||
      Number.isNaN(endDate.getTime()) ||
      endDate < startDate
    ) {
      res.status(400).json({
        message: 'Ngày kết thúc phải sau hoặc bằng ngày bắt đầu',
      });
      return;
    }

    const billingDay = Number(data.billing_cycle_day ?? 1);

    if (!Number.isInteger(billingDay) || billingDay < 1 || billingDay > 31) {
      res.status(400).json({
        message: 'Ngày thanh toán phải từ 1 đến 31',
      });
      return;
    }

    const id = await createTenantContract({
      ...data,
      contract_number: data.contract_number.trim(),
      rental_price: Number(data.rental_price),
      deposit_amount: Number(data.deposit_amount ?? 0),
      billing_cycle_day: billingDay,
    });

    res.status(201).json({
      message: 'Lập hợp đồng thành công',
      id,
    });
  } catch (error) {
    const code = error instanceof Error ? error.message : '';

    if (code === 'ROOM_NOT_FOUND') {
      res.status(404).json({ message: 'Không tìm thấy phòng' });
      return;
    }

    if (code === 'ROOM_NOT_AVAILABLE') {
      res.status(409).json({
        message: 'Phòng không ở trạng thái trống để lập hợp đồng',
      });
      return;
    }

    if (code === 'REPRESENTATIVE_NOT_FOUND') {
      res.status(400).json({ message: 'Người đại diện không tồn tại' });
      return;
    }

    if (code === 'TENANT_MEMBER_NOT_FOUND') {
      res.status(400).json({
        message: 'Một hoặc nhiều khách thuê trong danh sách không tồn tại',
      });
      return;
    }

    const dbError = error as { code?: string };

    if (dbError.code === 'ER_DUP_ENTRY') {
      res.status(409).json({ message: 'Mã hợp đồng đã tồn tại' });
      return;
    }

    console.error('Lỗi lập hợp đồng:', error);
    res.status(500).json({ message: 'Không thể lập hợp đồng' });
  }
}

export async function terminateTenantContractHandler(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const terminated = await terminateTenantContract(req.params.id);

    if (!terminated) {
      res.status(404).json({ message: 'Không tìm thấy hợp đồng' });
      return;
    }

    res.status(200).json({
      message: 'Thanh lý hợp đồng thành công',
    });
  } catch (error) {
    console.error('Lỗi thanh lý hợp đồng:', error);
    res.status(500).json({
      message: 'Không thể thanh lý hợp đồng',
    });
  
  }}

export async function getMyTenantContracts(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({
        message: 'Vui lòng đăng nhập',
      });
      return;
    }

    // Lấy thông tin hồ sơ khách thuê đang đăng nhập
    const profile = await getCurrentUserProfile(req.user);

    // Chỉ lấy hợp đồng liên quan đến tài khoản khách thuê này
    const contracts = await getTenantContractsByUserId(req.user.id);

    // Trả dữ liệu theo đúng cấu trúc frontend đang yêu cầu
    res.status(200).json({
      profile,
      contracts,
    });
  } catch (error) {
    console.error('Lỗi lấy hồ sơ và hợp đồng khách thuê:', error);

    res.status(500).json({
      message: 'Không thể lấy hồ sơ và hợp đồng khách hàng',
    });
  }
}
  

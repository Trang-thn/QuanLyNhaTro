
import { Request, Response } from 'express';
import {
  getAllContracts,
  getContractById,
  createContract,
  updateContract,
  deleteContract,
} from '../services/contract';
 import type {
  CreateContractInput,
  UpdateContractInput,
  ContractStatus,
} from '../types/contract';

// Kiểm tra ngày YYYY-MM-DD hợp lệ.
function isValidDate(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;

  const [, y, m, d] = match.map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));

  return date.getUTCFullYear() === y &&
    date.getUTCMonth() === m - 1 &&
    date.getUTCDate() === d;
}

// Kiểm tra trạng thái hợp đồng.
function isValidStatus(value: unknown): value is ContractStatus {
  return ['HIEU_LUC', 'KHONG_HIEU_LUC', 'DA_THANH_LY'].includes(
    value as string,
  );
}

// Kiểm tra ngày lập hóa đơn.
function isValidBillingCycleDay(value: unknown): boolean {
  const day = Number(value);
  return Number.isInteger(day) && day >= 1 && day <= 31;
}

// 1. Lấy danh sách hợp đồng.
export async function getContracts(req: Request, res: Response): Promise<void> {
  try {
    const roomNumber = typeof req.query.roomNumber === 'string'
      ? req.query.roomNumber.trim() : undefined;
    const status = typeof req.query.status === 'string'
      ? req.query.status.trim() : undefined;

    if (status && !isValidStatus(status)) {
      res.status(400).json({ message: 'Trạng thái hợp đồng không hợp lệ' });
      return;
    }

    const contracts = await getAllContracts({ roomNumber, status });
    res.status(200).json(contracts);
  } catch (error) {
    console.error('Lỗi lấy danh sách hợp đồng:', error);
    res.status(500).json({ message: 'Không thể lấy danh sách hợp đồng' });
  }
}

// 2. Lấy chi tiết hợp đồng.
export async function getContractDetail(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
     if (!id) {
      res.status(400).json({ message: 'Vui lòng cung cấp ID hợp đồng' });
      return;
    }

    const contract = await getContractById(id);
     if (!contract) {
      res.status(404).json({ message: 'Không tìm thấy hợp đồng' });
      return;
    }

    res.status(200).json(contract);
  } catch (error) {
    console.error('Lỗi lấy chi tiết hợp đồng:', error);
    res.status(500).json({ message: 'Không thể lấy chi tiết hợp đồng' });
  }
}

// 3. Thêm hợp đồng mới.
export async function createNewContract(req: Request, res: Response): Promise<void> {
  try {
    const data = req.body as CreateContractInput;

    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      res.status(400).json({ message: 'Dữ liệu hợp đồng không hợp lệ' });
      return;
    }

     if (
      typeof data.room_id !== 'string' || !data.room_id.trim() ||
      typeof data.representative_tenant_id !== 'string' ||
      !data.representative_tenant_id.trim()
    ) {
      res.status(400).json({ message: 'Vui lòng chọn phòng và khách thuê' });
      return;
    }

    if (!isValidDate(data.start_date) || !isValidDate(data.end_date)) {
      res.status(400).json({ message: 'Ngày bắt đầu hoặc ngày kết thúc không hợp lệ' });
      return;
    }

    if (data.end_date < data.start_date) {
      res.status(400).json({ message: 'Ngày kết thúc phải sau hoặc bằng ngày bắt đầu' });
      return;
    }

     if (!isValidBillingCycleDay(data.billing_cycle_day)) {
      res.status(400).json({ message: 'Ngày lập hóa đơn phải là số từ 1 đến 31.' });
      return;
    }

     const rentalPrice = Number(data.rental_price);
    const depositAmount = Number(data.deposit_amount);

    if (data.rental_price == null || !Number.isFinite(rentalPrice) || rentalPrice < 0) {
      res.status(400).json({ message: 'Tiền thuê phải là số không âm' });
      return;
    }

    if (data.deposit_amount == null || !Number.isFinite(depositAmount) || depositAmount < 0) {
      res.status(400).json({ message: 'Tiền cọc phải là số không âm' });
      return;
    }

    if (data.status !== undefined && !isValidStatus(data.status)) {
      res.status(400).json({ message: 'Trạng thái hợp đồng không hợp lệ' });
      return;
    }

    // Mã hợp đồng do backend tự động sinh.
    const input: CreateContractInput = {
      room_id: data.room_id.trim(),
      representative_tenant_id: data.representative_tenant_id.trim(),
      start_date: data.start_date,
      end_date: data.end_date,
      rental_price: rentalPrice,
      deposit_amount: depositAmount,
      billing_cycle_day: Number(data.billing_cycle_day),
      ...(data.status !== undefined ? { status: data.status } : {}),
    };

    const id = await createContract(input);
    res.status(201).json({ message: 'Thêm hợp đồng thành công', id });
  } catch (error) {
    console.error('Lỗi thêm hợp đồng:', error);
     res.status(500).json({
      message: 'Không thể thêm hợp đồng. Vui lòng kiểm tra dữ liệu và cơ sở dữ liệu.',
    });
  }
}

// 4. Cập nhật hợp đồng.
export async function updateExistingContract(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
     if (!id) {
      res.status(400).json({ message: 'Vui lòng cung cấp ID hợp đồng' });
      return;
    }

    const data = req.body as UpdateContractInput;
    if (!data || typeof data !== 'object' || Array.isArray(data) || !Object.keys(data).length) {
      res.status(400).json({ message: 'Vui lòng cung cấp thông tin cần cập nhật' });
      return;
    }

    const current = await getContractById(id);
    if (!current) {
      res.status(404).json({ message: 'Không tìm thấy hợp đồng' });
      return;
    }

    if (data.room_id !== undefined &&
      (typeof data.room_id !== 'string' || !data.room_id.trim())) {
      res.status(400).json({ message: 'Mã phòng không hợp lệ' });
      return;
    }

    if (data.representative_tenant_id !== undefined &&
      (typeof data.representative_tenant_id !== 'string' || !data.representative_tenant_id.trim())) {
      res.status(400).json({ message: 'Mã khách thuê không hợp lệ' });
      return;
    }

    if (data.start_date !== undefined && !isValidDate(data.start_date)) {
      res.status(400).json({ message: 'Ngày bắt đầu không hợp lệ' });
      return;
    }

    if (data.end_date !== undefined && !isValidDate(data.end_date)) {
      res.status(400).json({ message: 'Ngày kết thúc không hợp lệ' });
      return;
    }

    const startDate = data.start_date ?? current.start_date;
    const endDate = data.end_date ?? current.end_date;

    if (endDate < startDate) {
      res.status(400).json({ message: 'Ngày kết thúc phải sau hoặc bằng ngày bắt đầu' });
      return;
    }

    if (data.billing_cycle_day !== undefined &&
      !isValidBillingCycleDay(data.billing_cycle_day)) {
      res.status(400).json({ message: 'Ngày lập hóa đơn phải là số từ 1 đến 31.' });
      return;
    }

     if (data.rental_price !== undefined) {
      const price = Number(data.rental_price);
      if (data.rental_price === null || !Number.isFinite(price) || price < 0) {
        res.status(400).json({ message: 'Tiền thuê phải là số không âm' });
        return;
      }
    }

     if (data.deposit_amount !== undefined) {
      const deposit = Number(data.deposit_amount);
      if (data.deposit_amount === null || !Number.isFinite(deposit) || deposit < 0) {
        res.status(400).json({ message: 'Tiền cọc phải là số không âm' });
        return;
      }
    }

    if (data.status !== undefined && !isValidStatus(data.status)) {
      res.status(400).json({ message: 'Trạng thái hợp đồng không hợp lệ' });
      return;
    }

    // Chỉ cập nhật các trường được gửi lên.
    const updateData: UpdateContractInput = {
      ...(data.room_id !== undefined && { room_id: data.room_id.trim() }),
      ...(data.representative_tenant_id !== undefined && {
        representative_tenant_id: data.representative_tenant_id.trim(),
      }),
      ...(data.start_date !== undefined && { start_date: data.start_date }),
      ...(data.end_date !== undefined && { end_date: data.end_date }),
      ...(data.rental_price !== undefined && { rental_price: Number(data.rental_price) }),
      ...(data.deposit_amount !== undefined && { deposit_amount: Number(data.deposit_amount) }),
      ...(data.billing_cycle_day !== undefined && {
        billing_cycle_day: Number(data.billing_cycle_day),
      }),
      ...(data.status !== undefined && { status: data.status }),
    };

    const updated = await updateContract(id, updateData);
     if (!updated) {
      res.status(404).json({ message: 'Không tìm thấy hợp đồng cần cập nhật' });
      return;
    }

    res.status(200).json({ message: 'Cập nhật hợp đồng thành công' });
  } catch (error) {
    console.error('Lỗi cập nhật hợp đồng:', error);
    res.status(500).json({ message: 'Không thể cập nhật hợp đồng' });
  }
}

// 5. Xóa hợp đồng.
export async function removeContract(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
     if (!id) {
      res.status(400).json({ message: 'Vui lòng cung cấp ID hợp đồng' });
      return;
    }

     const deleted = await deleteContract(id);
    if (!deleted) {
      res.status(404).json({ message: 'Không tìm thấy hợp đồng cần xóa' });
      return;
    }

    res.status(200).json({ message: 'Xóa hợp đồng thành công' });
  } catch (error) {
    console.error('Lỗi xóa hợp đồng:', error);
     res.status(500).json({
      message: 'Không thể xóa hợp đồng. Hợp đồng có thể đang được dữ liệu khác tham chiếu.',
    });
  }
}

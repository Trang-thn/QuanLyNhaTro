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

// Kiểm tra ngày có đúng định dạng YYYY-MM-DD và là ngày hợp lệ hay không.
function isValidDate(value: unknown): value is string {
  if (typeof value !== 'string') {
    return false;
  }

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match) {
    return false;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

// Kiểm tra trạng thái hợp đồng.
function isValidStatus(value: unknown): value is ContractStatus {
  return (
    value === 'HIEU_LUC' ||
    value === 'KHONG_HIEU_LUC' ||
    value === 'DA_THANH_LY'
  );
}

// 1. Lấy danh sách hợp đồng, hỗ trợ tìm theo số phòng và trạng thái.
export async function getContracts(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const roomNumber =
      typeof req.query.roomNumber === 'string'
        ? req.query.roomNumber.trim()
        : undefined;

    const status =
      typeof req.query.status === 'string'
        ? req.query.status.trim()
        : undefined;

    if (status && !isValidStatus(status)) {
      res.status(400).json({
        message: 'Trạng thái hợp đồng không hợp lệ',
      });
      return;
    }

    const contracts = await getAllContracts({
      roomNumber,
      status,
    });

    res.status(200).json(contracts);
  } catch (error) {
    console.error('Lỗi lấy danh sách hợp đồng:', error);

    res.status(500).json({
      message: 'Không thể lấy danh sách hợp đồng',
    });
  }
}

// 2. Lấy thông tin chi tiết hợp đồng theo ID.
export async function getContractDetail(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        message: 'Vui lòng cung cấp ID hợp đồng',
      });
      return;
    }

    const contract = await getContractById(id);

    if (!contract) {
      res.status(404).json({
        message: 'Không tìm thấy hợp đồng',
      });
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

// 3. Thêm hợp đồng mới.
export async function createNewContract(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const data = req.body as CreateContractInput;

    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      res.status(400).json({
        message: 'Dữ liệu hợp đồng không hợp lệ',
      });
      return;
    }

    // Kiểm tra phòng và khách thuê.
    if (
      typeof data.room_id !== 'string' ||
      !data.room_id.trim() ||
      typeof data.representative_tenant_id !== 'string' ||
      !data.representative_tenant_id.trim()
    ) {
      res.status(400).json({
        message: 'Vui lòng chọn phòng và khách thuê',
      });
      return;
    }

    // Kiểm tra ngày bắt đầu và ngày kết thúc.
    if (
      !isValidDate(data.start_date) ||
      !isValidDate(data.end_date)
    ) {
      res.status(400).json({
        message: 'Ngày bắt đầu hoặc ngày kết thúc không hợp lệ',
      });
      return;
    }

    if (data.end_date < data.start_date) {
      res.status(400).json({
        message: 'Ngày kết thúc phải sau hoặc bằng ngày bắt đầu',
      });
      return;
    }

    // Kiểm tra ngày lập hóa đơn.
    if (!isValidDate(data.billing_cycle_date)) {
      res.status(400).json({
        message:
          'Ngày lập hóa đơn không hợp lệ. Định dạng yêu cầu: YYYY-MM-DD.',
      });
      return;
    }

    // Kiểm tra tiền thuê và tiền cọc.
    const rentalPrice = Number(data.rental_price);
    const depositAmount = Number(data.deposit_amount);

    if (
      data.rental_price === undefined ||
      data.rental_price === null ||
     
      !Number.isFinite(rentalPrice) ||
      rentalPrice < 0
    ) {
      res.status(400).json({
        message: 'Tiền thuê phải là số không âm',
      });
      return;
  }
    if (
      data.deposit_amount === undefined ||
      data.deposit_amount === null ||
      
      !Number.isFinite(depositAmount) ||
      depositAmount < 0
    ) {
      res.status(400).json({
        message: 'Tiền cọc phải là số không âm',
      });
      return;
    }

    // Nếu có trạng thái, phải thuộc danh sách cho phép.
    if (
      data.status !== undefined &&
      !isValidStatus(data.status)
    ) {
      res.status(400).json({
        message: 'Trạng thái hợp đồng không hợp lệ',
      });
      return;
    }

    // Mã hợp đồng được backend tự động sinh trong service.
    // Không nhận contract_number từ frontend.
    const input: CreateContractInput = {
      room_id: data.room_id.trim(),
      representative_tenant_id:
        data.representative_tenant_id.trim(),
      start_date: data.start_date,
      end_date: data.end_date,
      rental_price: rentalPrice,
      deposit_amount: depositAmount,
      billing_cycle_date: data.billing_cycle_date,
      ...(data.status !== undefined
        ? { status: data.status }
        : {}),
    };

    const id = await createContract(input);

    res.status(201).json({
      message: 'Thêm hợp đồng thành công',
      id,
    });
  } catch (error) {
    console.error('Lỗi thêm hợp đồng:', error);

    res.status(500).json({
      message:
        'Không thể thêm hợp đồng. Vui lòng kiểm tra dữ liệu và cơ sở dữ liệu.',
    });
  }
}

// 4. Cập nhật hợp đồng.
export async function updateExistingContract(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        message: 'Vui lòng cung cấp ID hợp đồng',
      });
      return;
    }

    const data = req.body as UpdateContractInput;

    if (
      !data ||
      typeof data !== 'object' ||
      Array.isArray(data) ||
      Object.keys(data).length === 0
    ) {
      res.status(400).json({
        message: 'Vui lòng cung cấp thông tin cần cập nhật',
      });
      return;
    }

    // Kiểm tra hợp đồng có tồn tại hay không.
    const currentContract = await getContractById(id);

    if (!currentContract) {
      res.status(404).json({
        message: 'Không tìm thấy hợp đồng',
      });
      return;
    }

    // Kiểm tra phòng nếu có cập nhật.
    if (
      data.room_id !== undefined &&
      (typeof data.room_id !== 'string' ||
        !data.room_id.trim())
    ) {
      res.status(400).json({
        message: 'Mã phòng không hợp lệ',
      });
      return;
    }

    // Kiểm tra khách thuê nếu có cập nhật.
    if (
      data.representative_tenant_id !== undefined &&
      (typeof data.representative_tenant_id !== 'string' ||
        !data.representative_tenant_id.trim())
    ) {
      res.status(400).json({
        message: 'Mã khách thuê không hợp lệ',
      });
      return;
    }

    // Kiểm tra ngày bắt đầu.
    if (
      data.start_date !== undefined &&
      !isValidDate(data.start_date)
    ) {
      res.status(400).json({
        message: 'Ngày bắt đầu không hợp lệ',
      });
      return;
    }

    // Kiểm tra ngày kết thúc.
    if (
      data.end_date !== undefined &&
      !isValidDate(data.end_date)
    ) {
      res.status(400).json({
        message: 'Ngày kết thúc không hợp lệ',
      });
      return;
    }

    // Kết hợp ngày mới và ngày hiện tại để kiểm tra khoảng thời gian.
    const startDate =
      data.start_date ?? currentContract.start_date;

    const endDate =
      data.end_date ?? currentContract.end_date;

    if (endDate < startDate) {
      res.status(400).json({
        message: 'Ngày kết thúc phải sau hoặc bằng ngày bắt đầu',
      });
      return;
    }

    // Kiểm tra ngày lập hóa đơn.
    if (
      data.billing_cycle_date !== undefined &&
      !isValidDate(data.billing_cycle_date)
    ) {
      res.status(400).json({
        message:
          'Ngày lập hóa đơn không hợp lệ. Định dạng yêu cầu: YYYY-MM-DD.',
      });
      return;
    }

    // Kiểm tra tiền thuê.
    if (data.rental_price !== undefined) {
      const rentalPrice = Number(data.rental_price);

      if (
        data.rental_price === null ||
       
        !Number.isFinite(rentalPrice) ||
        rentalPrice < 0
      ) {
        res.status(400).json({
          message: 'Tiền thuê phải là số không âm',
        });
        return;
      }
    }

    // Kiểm tra tiền cọc.
    if (data.deposit_amount !== undefined) {
      const depositAmount = Number(data.deposit_amount);

      if (
        data.deposit_amount === null ||
      
        !Number.isFinite(depositAmount) ||
        depositAmount < 0
      ) {
        res.status(400).json({
          message: 'Tiền cọc phải là số không âm',
        });
        return;
      }
    }

    // Kiểm tra trạng thái.
    if (
      data.status !== undefined &&
      !isValidStatus(data.status)
    ) {
      res.status(400).json({
        message: 'Trạng thái hợp đồng không hợp lệ',
      });
      return;
    }

    // Tạo dữ liệu cập nhật.
    // Không cho phép cập nhật contract_number.
    const updateData: UpdateContractInput = {};

    if (data.room_id !== undefined) {
      updateData.room_id = data.room_id.trim();
    }

    if (data.representative_tenant_id !== undefined) {
      updateData.representative_tenant_id =
        data.representative_tenant_id.trim();
    }

    if (data.start_date !== undefined) {
      updateData.start_date = data.start_date;
    }

    if (data.end_date !== undefined) {
      updateData.end_date = data.end_date;
    }

    if (data.rental_price !== undefined) {
      updateData.rental_price = Number(data.rental_price);
    }

    if (data.deposit_amount !== undefined) {
      updateData.deposit_amount = Number(data.deposit_amount);
    }

    if (data.billing_cycle_date !== undefined) {
      updateData.billing_cycle_date = data.billing_cycle_date;
    }

    if (data.status !== undefined) {
      updateData.status = data.status;
    }

    const updated = await updateContract(id, updateData);

    if (!updated) {
      res.status(404).json({
        message: 'Không tìm thấy hợp đồng cần cập nhật',
      });
      return;
    }

    res.status(200).json({
      message: 'Cập nhật hợp đồng thành công',
    });
  } catch (error) {
    console.error('Lỗi cập nhật hợp đồng:', error);

    res.status(500).json({
      message: 'Không thể cập nhật hợp đồng',
    });
  }
}

// 5. Xóa hợp đồng.
export async function removeContract(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        message: 'Vui lòng cung cấp ID hợp đồng',
      });
      return;
    }

    const deleted = await deleteContract(id);

    if (!deleted) {
      res.status(404).json({
        message: 'Không tìm thấy hợp đồng cần xóa',
      });
      return;
    }

    res.status(200).json({
      message: 'Xóa hợp đồng thành công',
    });
  } catch (error) {
    console.error('Lỗi xóa hợp đồng:', error);

    res.status(500).json({
      message:
        'Không thể xóa hợp đồng. Hợp đồng có thể đang được dữ liệu khác tham chiếu.',
    });
  }}
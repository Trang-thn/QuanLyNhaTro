
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
} from '../types/contract';

// 1. Lấy danh sách hợp đồng, hỗ trợ tìm theo số phòng và trạng thái
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

// 2. Lấy thông tin chi tiết hợp đồng theo ID
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

// 3. Thêm hợp đồng mới
export async function createNewContract(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const data = req.body as CreateContractInput;

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
      data.rental_price === undefined ||
      data.deposit_amount === undefined ||
      !data.status ||
      data.billing_cycle_day === undefined
    ) {
      res.status(400).json({
        message: 'Vui lòng nhập đầy đủ thông tin hợp đồng',
      });
      return;
    }

    const rentalPrice = Number(data.rental_price);
    const depositAmount = Number(data.deposit_amount);
    const billingCycleDay = Number(data.billing_cycle_day);

    if (
      !Number.isFinite(rentalPrice) ||
      !Number.isFinite(depositAmount) ||
      rentalPrice < 0 ||
      depositAmount < 0
    ) {
      res.status(400).json({
        message: 'Tiền thuê và tiền cọc phải là số không âm',
      });
      return;
    }

    if (
      !Number.isInteger(billingCycleDay) ||
      billingCycleDay < 1 ||
      billingCycleDay > 31
    ) {
      res.status(400).json({
        message: 'Ngày thanh toán phải nằm trong khoảng từ 1 đến 31',
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

    const id = await createContract({
      ...data,
      contract_number: data.contract_number.trim(),
      rental_price: rentalPrice,
      deposit_amount: depositAmount,
      billing_cycle_day: billingCycleDay,
    });

    res.status(201).json({
      message: 'Thêm hợp đồng thành công',
      id,
    });
  } catch (error) {
    console.error('Lỗi thêm hợp đồng:', error);
    res.status(500).json({
      message: 'Không thể thêm hợp đồng. Vui lòng kiểm tra dữ liệu và cơ sở dữ liệu.',
    });
  }
}

// 4. Cập nhật hợp đồng
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

    if (!data || Object.keys(data).length === 0) {
      res.status(400).json({
        message: 'Vui lòng cung cấp thông tin cần cập nhật',
      });
      return;
    }

    if (
      data.contract_number !== undefined &&
      (typeof data.contract_number !== 'string' ||
        !data.contract_number.trim())
    ) {
      res.status(400).json({
        message: 'Số hợp đồng không được để trống',
      });
      return;
    }

    if (
      data.rental_price !== undefined &&
      (!Number.isFinite(Number(data.rental_price)) ||
        Number(data.rental_price) < 0)
    ) {
      res.status(400).json({
        message: 'Tiền thuê phải là số không âm',
      });
      return;
    }

    if (
      data.deposit_amount !== undefined &&
      (!Number.isFinite(Number(data.deposit_amount)) ||
        Number(data.deposit_amount) < 0)
    ) {
      res.status(400).json({
        message: 'Tiền cọc phải là số không âm',
      });
      return;
    }

    if (data.billing_cycle_day !== undefined) {
      const day = Number(data.billing_cycle_day);

      if (!Number.isInteger(day) || day < 1 || day > 31) {
        res.status(400).json({
          message: 'Ngày thanh toán phải nằm trong khoảng từ 1 đến 31',
        });
        return;
      }
    }

    if (
      data.start_date !== undefined &&
      Number.isNaN(new Date(data.start_date).getTime())
    ) {
      res.status(400).json({
        message: 'Ngày bắt đầu không hợp lệ',
      });
      return;
    }

    if (
      data.end_date !== undefined &&
      Number.isNaN(new Date(data.end_date).getTime())
    ) {
      res.status(400).json({
        message: 'Ngày kết thúc không hợp lệ',
      });
      return;
    }

    // Nếu chỉ sửa một trong hai ngày, lấy ngày còn lại từ hợp đồng hiện tại.
    if (
      data.start_date !== undefined ||
      data.end_date !== undefined
    ) {
      const currentContract = await getContractById(id);

      if (!currentContract) {
        res.status(404).json({
          message: 'Không tìm thấy hợp đồng',
        });
        return;
      }

      const startDate = new Date(
        data.start_date ?? currentContract.start_date,
      );
      const endDate = new Date(
        data.end_date ?? currentContract.end_date,
      );

      if (endDate < startDate) {
        res.status(400).json({
          message: 'Ngày kết thúc phải sau hoặc bằng ngày bắt đầu',
        });
        return;
      }
    }

    const updateData: UpdateContractInput = { ...data };

    if (data.contract_number !== undefined) {
      updateData.contract_number = data.contract_number.trim();
    }

    if (data.rental_price !== undefined) {
      updateData.rental_price = Number(data.rental_price);
    }

    if (data.deposit_amount !== undefined) {
      updateData.deposit_amount = Number(data.deposit_amount);
    }

    if (data.billing_cycle_day !== undefined) {
      updateData.billing_cycle_day = Number(data.billing_cycle_day);
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

// 5. Xóa hợp đồng
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
      message: 'Không thể xóa hợp đồng. Hợp đồng có thể đang được dữ liệu khác tham chiếu.',
    });
  }
}

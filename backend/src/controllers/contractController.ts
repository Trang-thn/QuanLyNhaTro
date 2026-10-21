import { Request, Response } from 'express';
import * as tenantService from '../services/tenant';

export async function createContract(req: Request, res: Response): Promise<void> {
  try {
    const contract = await tenantService.createContractService(req.body);
    res.status(201).json({ success: true, message: 'Lập hợp đồng thành công', data: contract });
  } catch (error: any) {
    console.error('Failed to create contract:', error);
    res.status(400).json({ success: false, message: error.message || 'Lỗi lập hợp đồng' });
  }
}

export async function terminateContract(req: Request, res: Response): Promise<void> {
  try {
    const result = await tenantService.terminateContractService(req.params.id);
    res.status(200).json({ success: true, message: 'Thanh lý hợp đồng thành công', data: result });
  } catch (error: any) {
    console.error('Failed to terminate contract:', error);
    res.status(400).json({ success: false, message: error.message || 'Lỗi thanh lý hợp đồng' });
  }
}
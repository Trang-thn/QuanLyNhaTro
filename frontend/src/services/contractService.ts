import api from './api';

export interface Contract {
  id: string;
  room_id: string;
  room_number?: string;
  representative_tenant_id: string; // Trưởng phòng / Người đại diện
  representative_name?: string;
  rental_price: number;
  deposit_amount: number;
  start_date: string;
  end_date: string;
  billing_cycle_day: number; // Ngày chốt tiền (VD: ngày 01)
  status: 'ACTIVE' | 'EXPIRED' | 'TERMINATED';
  note?: string;
}

export interface RenewContractPayload {
  new_end_date: string;
  new_price?: number;
}

export interface TerminateContractPayload {
  termination_date: string;
  reason?: string;
  refund_deposit_amount?: number;
}

export const contractService = {
  // Lấy danh sách hợp đồng
  getAll: async (): Promise<Contract[]> => {
    const res = await api.get('/contracts');
    return res.data;
  },

  // Lấy chi tiết hợp đồng
  getById: async (id: string): Promise<Contract> => {
    const res = await api.get(`/contracts/${id}`);
    return res.data;
  },

  // Tạo hợp đồng thuê phòng mới
  create: async (data: Omit<Contract, 'id' | 'status'>): Promise<Contract> => {
    const res = await api.post('/contracts', data);
    return res.data;
  },

  // Gia hạn hợp đồng (Kết nối với RenewModal.tsx)
  renew: async (id: string, payload: RenewContractPayload): Promise<Contract> => {
    const res = await api.post(`/contracts/${id}/renew`, payload);
    return res.data;
  },

  // Chấm dứt hợp đồng trước hạn (Kết nối với ContractTerminationModal.tsx)
  terminate: async (id: string, payload: TerminateContractPayload): Promise<Contract> => {
    const res = await api.post(`/contracts/${id}/terminate`, payload);
    return res.data;
  },

  // Lấy lịch sử hợp đồng của một phòng
  getByRoomId: async (roomId: string): Promise<Contract[]> => {
    const res = await api.get(`/contracts/room/${roomId}`);
    return res.data;
  },
};
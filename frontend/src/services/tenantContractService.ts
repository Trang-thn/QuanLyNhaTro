import api from './api';
import { Tenant } from './tenantService';
import { Contract } from './contractService';

export interface RoomDetailWithContract {
  room_id: string;
  room_number: string;
  floor: number;
  room_type: string;
  current_contract: Contract | null;
  tenants: (Tenant & { is_representative: boolean; join_date: string })[];
  contract_history: Contract[];
}

export interface AddMemberPayload {
  tenant_id: string;
  contract_id: string;
  is_representative?: boolean;
}

export const tenantContractService = {
  // Lấy toàn bộ thông tin phòng, thành viên & hợp đồng hiện tại (Cho TenantContractsPage)
  getRoomContractDetails: async (roomId: string): Promise<RoomDetailWithContract> => {
    const res = await api.get(`/room-contracts/${roomId}`);
    return res.data;
  },

  // Thêm thành viên vào phòng/hợp đồng (Dùng cho MemberList)
  addMemberToContract: async (payload: AddMemberPayload): Promise<void> => {
    await api.post('/room-contracts/members', payload);
  },

  // Xóa/Mời thành viên ra khỏi phòng
  removeMemberFromContract: async (contractId: string, tenantId: string): Promise<void> => {
    await api.delete(`/room-contracts/${contractId}/members/${tenantId}`);
  },

  // Lấy thông tin cá nhân + Phòng thuê của Tenant hiện tại (Cho TenantProfile.tsx & GET /api/v1/users/me)
  getMyProfileAndRoom: async (): Promise<{
    userProfile: any;
    tenantInfo: Tenant | null;
    contractInfo: Contract | null;
    roomMembers: Tenant[];
  }> => {
    const res = await api.get('/users/me');
    return res.data;
  },
};
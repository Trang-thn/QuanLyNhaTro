import { apiRequest } from './api';
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
  getRoomContractDetails: (roomId: string) => 
    apiRequest<RoomDetailWithContract>(`/room-contracts/${roomId}`),

  // Thêm thành viên vào phòng/hợp đồng (Dùng cho MemberList)
  addMemberToContract: (payload: AddMemberPayload) => 
    apiRequest<void>('/room-contracts/members', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // Xóa/Mời thành viên ra khỏi phòng
  removeMemberFromContract: (contractId: string, tenantId: string) => 
    apiRequest<void>(`/room-contracts/${contractId}/members/${tenantId}`, {
      method: 'DELETE',
    }),

  // Lấy thông tin cá nhân + Phòng thuê của Tenant hiện tại (Cho TenantProfile.tsx & GET /api/v1/users/me)
  getMyProfileAndRoom: () => 
    apiRequest<{
      userProfile: any;
      tenantInfo: Tenant | null;
      contractInfo: Contract | null;
      roomMembers: Tenant[];
    }>('/users/me'),
};
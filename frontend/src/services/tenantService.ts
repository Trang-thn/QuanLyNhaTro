import api from './api';

export interface Tenant {
  id: string;
  user_id?: string | null;
  full_name: string;
  phone_number: string;
  identity_card_number: string; // CCCD / CMND
  email?: string;
  permanent_address?: string;
  emergency_contact?: string;
  status: 'ACTIVE' | 'INACTIVE';
  created_at?: string;
}

export const tenantService = {
  // Lấy danh sách tất cả khách thuê
  getAll: async (): Promise<Tenant[]> => {
    const res = await api.get('/tenants');
    return res.data;
  },

  // Lấy chi tiết khách thuê theo ID
  getById: async (id: string): Promise<Tenant> => {
    const res = await api.get(`/tenants/${id}`);
    return res.data;
  },

  // Tìm khách thuê theo CCCD (Phục vụ liên kết tự động khi Đăng ký)
  getByCCCD: async (cccd: string): Promise<Tenant | null> => {
    const res = await api.get(`/tenants/cccd/${cccd}`);
    return res.data;
  },

  // Tạo mới hồ sơ khách thuê (Admin tạo)
  create: async (data: Omit<Tenant, 'id'>): Promise<Tenant> => {
    const res = await api.post('/tenants', data);
    return res.data;
  },

  // Cập nhật thông tin khách thuê
  update: async (id: string, data: Partial<Tenant>): Promise<Tenant> => {
    const res = await api.put(`/tenants/${id}`, data);
    return res.data;
  },

  // Xóa khách thuê
  delete: async (id: string): Promise<void> => {
    await api.delete(`/tenants/${id}`);
  },
};
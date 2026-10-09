import { apiRequest } from './api'; // Dùng Destructuring import {}

export interface Tenant {
  id: string;
  user_id?: string | null;
  full_name: string;
  phone_number: string;
  identity_card_number: string;
  email?: string;
  permanent_address?: string;
  emergency_contact?: string;
  status: 'ACTIVE' | 'INACTIVE';
  created_at?: string;
}

export const tenantService = {
  getAll: () => apiRequest<Tenant[]>('/tenants'),
  getById: (id: string) => apiRequest<Tenant>(`/tenants/${id}`),
  getByCCCD: (cccd: string) => apiRequest<Tenant>(`/tenants/cccd/${cccd}`),
  create: (data: Omit<Tenant, 'id'>) => apiRequest<Tenant>('/tenants', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Tenant>) => apiRequest<Tenant>(`/tenants/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => apiRequest<void>(`/tenants/${id}`, { method: 'DELETE' }),
};
import { apiRequest } from './api'

export interface PendingTenantRegistration {
  id: string
  userId: string
  identityCardNumber: string
  fullName: string
  username: string
  email: string | null
  phoneNumber: string | null
  createdAt: string
}

export async function getPendingTenantRegistrations(): Promise<PendingTenantRegistration[]> {
  const result = await apiRequest<{ requests: PendingTenantRegistration[] }>('/admin/tenant-registrations')
  return result.requests
}

export function approveTenantRegistration(requestId: string): Promise<{ tenantId: string }> {
  return apiRequest(`/admin/tenant-registrations/${encodeURIComponent(requestId)}/approve`, { method: 'POST' })
}

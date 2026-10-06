import { apiRequest } from './api'
import { invoices, contracts, maintenanceRequests, rooms } from '../data/mockData'
import type { TenantDashboardData } from '../types/tenantDashboard'

const mockTenantDashboardData: TenantDashboardData = {
  contractId: 'ct-001',
  invoices,
  contracts,
  maintenanceRequests,
  rooms,
}

export const initialTenantDashboardData = mockTenantDashboardData

export async function getTenantDashboardData(): Promise<TenantDashboardData> {
  try {
    return await apiRequest<TenantDashboardData>('/tenant/dashboard')
  } catch {
    return mockTenantDashboardData
  }
}

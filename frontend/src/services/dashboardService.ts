import { apiRequest } from './api'
import { rooms, invoices, contracts, maintenanceRequests, tenants } from '../data/mockData'
import type { DashboardData } from '../types/dashboard'

const mockDashboardData: DashboardData = {
  rooms,
  invoices,
  contracts,
  maintenanceRequests,
  tenants,
  revenueData: [
    { month: 'Tháng 5', revenue: 52000000, expense: 15000000 },
    { month: 'Tháng 6', revenue: 58000000, expense: 18000000 },
    { month: 'Tháng 7', revenue: 45000000, expense: 22000000 },
    { month: 'Tháng 8', revenue: 62000000, expense: 20000000 },
    { month: 'Tháng 9', revenue: 70000000, expense: 12000000 },
    { month: 'Tháng 10', revenue: 68000000, expense: 14000000 },
  ],
  revenueThisMonth: 145500000,
}

export const initialDashboardData = mockDashboardData

export async function getDashboardData(): Promise<DashboardData> {
  try {
    return await apiRequest<DashboardData>('/dashboard/overview')
  } catch {
    return mockDashboardData
  }
}

export type DashboardRoom = typeof import('../data/mockData').rooms[number]
export type DashboardInvoice = typeof import('../data/mockData').invoices[number]
export type DashboardContract = typeof import('../data/mockData').contracts[number]
export type DashboardMaintenanceRequest = typeof import('../data/mockData').maintenanceRequests[number]
export type DashboardTenant = typeof import('../data/mockData').tenants[number]
export interface DashboardRevenuePoint {
  month: string
  revenue: number
  expense: number
}

export interface DashboardData {
  rooms: DashboardRoom[]
  invoices: DashboardInvoice[]
  contracts: DashboardContract[]
  maintenanceRequests: DashboardMaintenanceRequest[]
  tenants: DashboardTenant[]
  revenueData: DashboardRevenuePoint[]
  revenueThisMonth: number
}

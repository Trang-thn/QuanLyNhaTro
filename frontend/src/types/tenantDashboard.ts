export type TenantDashboardInvoice = typeof import('../data/mockData').invoices[number]
export type TenantDashboardContract = typeof import('../data/mockData').contracts[number]
export type TenantDashboardMaintenanceRequest = typeof import('../data/mockData').maintenanceRequests[number]
export type TenantDashboardRoom = typeof import('../data/mockData').rooms[number]

export interface TenantDashboardData {
  contractId: string
  invoices: TenantDashboardInvoice[]
  contracts: TenantDashboardContract[]
  maintenanceRequests: TenantDashboardMaintenanceRequest[]
  rooms: TenantDashboardRoom[]
}

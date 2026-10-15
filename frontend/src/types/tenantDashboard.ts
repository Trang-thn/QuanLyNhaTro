import type { DashboardContract, DashboardInvoice, DashboardMaintenanceRequest, DashboardRoom } from './dashboard'

export type TenantDashboardInvoice = DashboardInvoice
export type TenantDashboardContract = DashboardContract
export type TenantDashboardMaintenanceRequest = DashboardMaintenanceRequest
export type TenantDashboardRoom = DashboardRoom

export interface TenantDashboardData {
  contractId: string
  invoices: TenantDashboardInvoice[]
  contracts: TenantDashboardContract[]
  maintenanceRequests: TenantDashboardMaintenanceRequest[]
  rooms: TenantDashboardRoom[]
}

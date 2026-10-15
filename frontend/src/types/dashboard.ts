export type RoomStatus = 'TRONG' | 'DANG_THUE' | 'BAO_TRI'
export type InvoiceStatus = 'CHUA_THANH_TOAN' | 'THANH_TOAN_MOT_PHAN' | 'DA_THANH_TOAN'
export type ContractStatus = 'HIEU_LUC' | 'KHONG_HIEU_LUC' | 'DA_THANH_LY'
export type MaintenanceStatus = 'TIEP_NHAN' | 'DANG_XU_LY' | 'HOAN_THANH'

export interface DashboardRoom {
  id: string
  room_number: string
  room_type_id: string
  status: RoomStatus
  floor: number
  amenity_ids: string[]
}

export interface DashboardInvoice {
  id: string
  invoice_code: string
  contract_id: string
  room_id: string
  billing_month: number
  billing_year: number
  room_price: number
  electricity_cost: number
  water_cost: number
  other_service_cost: number
  total_amount: number
  paid_amount: number
  status: InvoiceStatus
  due_date: string
}

export interface DashboardContract {
  id: string
  contract_number: string
  room_id: string
  representative_tenant_id: string
  start_date: string
  end_date: string
  rental_price: number
  deposit_amount: number
  status: ContractStatus
  billing_cycle_day: number
}

export interface DashboardMaintenanceRequest {
  id: string
  room_id: string
  tenant_id: string | null
  title: string
  description: string
  status: MaintenanceStatus
  cost: number
  created_at: string
}

export interface DashboardTenant {
  id: string
  full_name: string | null
  identity_card_number: string
  issue_place: string | null
  permanent_address: string | null
  emergency_contact: string | null
  phone: string | null
  email: string | null
}

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

import { apiRequest } from './api'
import type { TenantDashboardData } from '../types/tenantDashboard'

type NumericValue = number | string | null
type Contract = TenantDashboardData['contracts'][number]
type Invoice = TenantDashboardData['invoices'][number]
type MaintenanceRequest = TenantDashboardData['maintenanceRequests'][number]
type Room = TenantDashboardData['rooms'][number]

interface TenantDashboardResponse {
  contractId: string
  contracts: Array<Omit<Contract, 'rental_price' | 'deposit_amount'> & { rental_price: NumericValue; deposit_amount: NumericValue }>
  invoices: Array<Omit<Invoice, 'room_price' | 'electricity_cost' | 'water_cost' | 'other_service_cost' | 'total_amount' | 'paid_amount'> & {
    room_price: NumericValue
    electricity_cost: NumericValue
    water_cost: NumericValue
    other_service_cost: NumericValue
    total_amount: NumericValue
    paid_amount: NumericValue
  }>
  maintenanceRequests: Array<Omit<MaintenanceRequest, 'cost'> & { cost: NumericValue }>
  rooms: Array<Omit<Room, 'amenity_ids' | 'floor'> & { amenity_ids?: string[]; floor: number | null }>
}

const toNumber = (value: NumericValue): number => {
  const parsed = Number(value ?? 0)
  return Number.isFinite(parsed) ? parsed : 0
}

export async function getTenantDashboardData(): Promise<TenantDashboardData> {
  const response = await apiRequest<TenantDashboardResponse>('/tenant/dashboard')
  return {
    contractId: response.contractId,
    contracts: response.contracts.map((contract) => ({
      ...contract,
      rental_price: toNumber(contract.rental_price),
      deposit_amount: toNumber(contract.deposit_amount),
    })),
    invoices: response.invoices.map((invoice) => ({
      ...invoice,
      room_price: toNumber(invoice.room_price),
      electricity_cost: toNumber(invoice.electricity_cost),
      water_cost: toNumber(invoice.water_cost),
      other_service_cost: toNumber(invoice.other_service_cost),
      total_amount: toNumber(invoice.total_amount),
      paid_amount: toNumber(invoice.paid_amount),
    })),
    maintenanceRequests: response.maintenanceRequests.map((request) => ({ ...request, cost: toNumber(request.cost) })),
    rooms: response.rooms.map((room) => ({ ...room, floor: room.floor ?? 0, amenity_ids: room.amenity_ids ?? [] })),
  }
}

import { apiRequest } from './api'
import type {
  DashboardContract,
  DashboardData,
  DashboardInvoice,
  DashboardMaintenanceRequest,
  DashboardRoom,
  DashboardTenant,
} from '../types/dashboard'

type NumericValue = number | string | null

interface DashboardOverviewResponse {
  rooms: Array<Omit<DashboardRoom, 'floor' | 'amenity_ids'> & { floor: number | null; amenity_ids: string[] | string }>
  tenants: Array<DashboardTenant>
  contracts: Array<Omit<DashboardContract, 'rental_price' | 'deposit_amount' | 'billing_cycle_day'> & {
    rental_price: NumericValue
    deposit_amount: NumericValue
    billing_cycle_day: number | null
  }>
  invoices: Array<Omit<DashboardInvoice, 'room_price' | 'electricity_cost' | 'water_cost' | 'other_service_cost' | 'total_amount' | 'paid_amount'> & {
    room_price: NumericValue
    electricity_cost: NumericValue
    water_cost: NumericValue
    other_service_cost: NumericValue
    total_amount: NumericValue
    paid_amount: NumericValue
  }>
  maintenanceRequests: Array<Omit<DashboardMaintenanceRequest, 'cost'> & { cost: NumericValue }>
  revenueData: Array<{ month: string; revenue: NumericValue; expense: NumericValue }>
  revenueThisMonth: NumericValue
}

function toNumber(value: NumericValue): number {
  const parsed = Number(value ?? 0)
  return Number.isFinite(parsed) ? parsed : 0
}

export async function getDashboardData(): Promise<DashboardData> {
  const response = await apiRequest<DashboardOverviewResponse>('/dashboard/overview')

  return {
    rooms: response.rooms.map((room) => ({
      ...room,
      floor: room.floor ?? 0,
      amenity_ids: Array.isArray(room.amenity_ids)
        ? room.amenity_ids
        : room.amenity_ids ? room.amenity_ids.split(',') : [],
    })),
    tenants: response.tenants,
    contracts: response.contracts.map((contract) => ({
      ...contract,
      rental_price: toNumber(contract.rental_price),
      deposit_amount: toNumber(contract.deposit_amount),
      billing_cycle_day: contract.billing_cycle_day ?? 1,
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
    maintenanceRequests: response.maintenanceRequests.map((request) => ({
      ...request,
      cost: toNumber(request.cost),
    })),
    revenueData: response.revenueData.map((point) => ({
      month: point.month,
      revenue: toNumber(point.revenue),
      expense: toNumber(point.expense),
    })),
    revenueThisMonth: toNumber(response.revenueThisMonth),
  }
}

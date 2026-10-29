
import type { ContractStatus } from './dashboard'

export interface TenantContractProfile {
  id: string
  full_name: string | null
  date_of_birth: string | null
  identity_card_number: string
  issue_place: string | null
  permanent_address: string | null
  emergency_contact: string | null
  phone: string | null
  email: string | null
  gender: 'NAM' | 'NU' | 'KHAC' | null
  avatar: string | null
}

export interface TenantRentalContract {
  id: string
  contract_number: string
  room_id: string
  room_number?: string
  start_date: string
  end_date: string
  rental_price: number
  deposit_amount: number
  status: ContractStatus
  billing_cycle_day: number
}

export interface TenantContractData {
  profile: TenantContractProfile
  contracts: TenantRentalContract[]
}

export interface UpdateTenantProfileRequest {
  full_name?: string | null
  date_of_birth?: string | null
  phone?: string | null
  email?: string | null
  permanent_address?: string | null
  emergency_contact?: string | null
  avatar?: string | null
}
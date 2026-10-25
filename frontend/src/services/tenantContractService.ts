
import { apiRequest } from './api'
import type { ContractStatus } from '../types/dashboard'
import type {
  TenantContractProfile,
  TenantRentalContract,
  TenantContractData,
} from '../types/tenantContract'

type NumericValue = number | string | null
type ApiRecord = Record<string, unknown>

interface TenantRentalContractResponse extends ApiRecord {
  id: number | string
  code?: string
  contract_number?: string
  room_id?: number | string
  room_name?: string
  room_number?: string
  start_date: string
  end_date: string
  rental_price: NumericValue
  deposit_amount: NumericValue
  status: string
  billing_cycle_day?: number
  note?: string | null
}

interface TenantContractDataResponse {
  profile: ApiRecord
  contracts: TenantRentalContractResponse[]
}

function toNumber(value: NumericValue): number {
  const parsed = Number(value ?? 0)
  return Number.isFinite(parsed) ? parsed : 0
}

function toStringValue(value: unknown): string {
  return value === null || value === undefined ? '' : String(value)
}

function toStringOrNull(value: unknown): string | null {
  if (value === null || value === undefined || value === '') {
    return null
  }
  return String(value)
}

function normalizeGender(
  value: unknown,
): TenantContractProfile['gender'] {
  if (value === 'NAM' || value === 'NU' || value === 'KHAC') {
    return value
  }

  if (value === 'Nam') return 'NAM'
  if (value === 'Nữ') return 'NU'
  if (value === 'Khác') return 'KHAC'

  return null
}

function normalizeProfile(raw: ApiRecord): TenantContractProfile {
  return {
    id: toStringValue(raw.id),
    full_name: toStringOrNull(raw.full_name ?? raw.name),
    date_of_birth: toStringOrNull(
      raw.date_of_birth ?? raw.birthday,
    ),
    identity_card_number: toStringValue(
      raw.identity_card_number ?? raw.citizen_id,
    ),
    issue_place: toStringOrNull(raw.issue_place),
    permanent_address: toStringOrNull(
      raw.permanent_address ?? raw.address,
    ),
    emergency_contact: toStringOrNull(raw.emergency_contact),
    phone: toStringOrNull(raw.phone),
    email: toStringOrNull(raw.email),
    gender: normalizeGender(raw.gender),
    avatar: toStringOrNull(raw.avatar),
  }
}

function normalizeStatus(status: string): ContractStatus {
  switch (status) {
    case 'Đã thanh lý':
    case 'DA_THANH_LY':
      return 'DA_THANH_LY' as ContractStatus

    case 'Không hiệu lực':
    case 'KHONG_HIEU_LUC':
      return 'KHONG_HIEU_LUC' as ContractStatus

    case 'Có hiệu lực':
    case 'Đang thuê':
    case 'HIEU_LUC':
      return 'HIEU_LUC' as ContractStatus

    default:
      return status as ContractStatus
  }
}

function normalizeContract(
  raw: TenantRentalContractResponse,
): TenantRentalContract {
  return {
    id: toStringValue(raw.id),
    contract_number: toStringValue(
      raw.contract_number ?? raw.code,
    ),
    room_id: toStringValue(raw.room_id),
    room_number: toStringValue(
      raw.room_number ?? raw.room_name ?? raw.room_id,
    ),
    start_date: raw.start_date,
    end_date: raw.end_date,
    rental_price: toNumber(raw.rental_price),
    deposit_amount: toNumber(raw.deposit_amount),
    status: normalizeStatus(raw.status),
    billing_cycle_day: raw.billing_cycle_day ?? 1,
  }
}

export async function getTenantContractData(): Promise<TenantContractData> {
  const response = await apiRequest<TenantContractDataResponse>(
    '/tenant-contracts/me',
  )

  return {
    profile: normalizeProfile(response.profile),
    contracts: response.contracts.map(normalizeContract),
  }
}

export async function getTenantProfile(): Promise<TenantContractProfile> {
  const response = await apiRequest<ApiRecord>(
    '/tenant-contracts/me/profile',
  )

  return normalizeProfile(response)
}

export async function getMyContracts(): Promise<TenantRentalContract[]> {
  const response = await apiRequest<TenantRentalContractResponse[]>(
    '/tenant-contracts/me/contracts',
  )

  return response.map(normalizeContract)
}

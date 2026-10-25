
import { apiRequest } from './api'
import type {
  Tenant as TenantType,
  CreateTenantRequest,
  UpdateTenantRequest,
} from '../types/tenant'

export type Tenant = TenantType

type ApiRecord = Record<string, unknown>

export interface TenantInput {
  name: string
  phone?: string
  email?: string
  citizen_id?: string
  birthday?: string
  gender?: string
  address?: string
  room_id?: number | null
}

export interface TenantListResponse {
  data: Tenant[]
  total?: number
  page?: number
  limit?: number
}

function toStringOrNull(value: unknown): string | null {
  if (value === null || value === undefined || value === '') return null
  return String(value)
}

function toStringValue(value: unknown): string {
  return value === null || value === undefined ? '' : String(value)
}

function normalizeGender(
  value: unknown,
): TenantType['gender'] {
  if (value === 'NAM' || value === 'NU' || value === 'KHAC') {
    return value
  }

  if (value === 'Nam') return 'NAM'
  if (value === 'Nữ') return 'NU'
  if (value === 'Khác') return 'KHAC'

  return null
}

function normalizeTenant(raw: ApiRecord): TenantType {
  return {
    id: toStringValue(raw.id),
    full_name: toStringOrNull(raw.full_name ?? raw.name),
    date_of_birth: toStringOrNull(raw.date_of_birth ?? raw.birthday),
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
    ...(raw.created_at !== undefined
      ? { created_at: toStringValue(raw.created_at) }
      : {}),
    ...(raw.updated_at !== undefined
      ? { updated_at: toStringValue(raw.updated_at) }
      : {}),
  }
}

function toApiInput(
  input: CreateTenantRequest | UpdateTenantRequest,
): Record<string, unknown> {
  const result: Record<string, unknown> = {}

  if ('full_name' in input) result.name = input.full_name
  if ('date_of_birth' in input) result.birthday = input.date_of_birth
  if ('identity_card_number' in input) {
  result.identity_card_number = input.identity_card_number
}
  if ('issue_place' in input) result.issue_place = input.issue_place
  if ('permanent_address' in input) {
    result.address = input.permanent_address
  }
  if ('emergency_contact' in input) {
    result.emergency_contact = input.emergency_contact
  }
  if ('phone' in input) result.phone = input.phone
  if ('email' in input) result.email = input.email
  if ('gender' in input) result.gender = input.gender
  if ('avatar' in input) result.avatar = input.avatar

  return result
}

export async function getTenants(): Promise<TenantType[]> {
  const response = await apiRequest<
    ApiRecord[] | { data?: ApiRecord[]; tenants?: ApiRecord[] }
  >('/tenantqlkt')

  const rows = Array.isArray(response)
    ? response
    : response.data ?? response.tenants ?? []

  return rows.map(normalizeTenant)
}

export async function getTenantById(id: string): Promise<TenantType> {
  const response = await apiRequest<ApiRecord>(`/tenantqlkt/${id}`)
  return normalizeTenant(response)
}

export async function createTenant(
  input: CreateTenantRequest,
): Promise<TenantType> {
  const response = await apiRequest<ApiRecord>('/tenantqlkt', {
    method: 'POST',
    body: JSON.stringify(toApiInput(input)),
  })

  return normalizeTenant(response)
}

export async function updateTenant(
  id: string,
  input: UpdateTenantRequest,
): Promise<TenantType> {
  const response = await apiRequest<ApiRecord>(`/tenantqlkt/${id}`, {
    method: 'PUT',
    body: JSON.stringify(toApiInput(input)),
  })

  return normalizeTenant(response)
}

export async function deleteTenant(id: string): Promise<void> {
  await apiRequest<void>(`/tenantqlkt/${id}`, {
    method: 'DELETE',
  })
}


export interface Tenant {
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
  created_at?: string
  updated_at?: string
}

export interface CreateTenantRequest {
  full_name: string
  date_of_birth?: string | null
  identity_card_number: string
  issue_place?: string | null
  permanent_address?: string | null
  emergency_contact?: string | null
  phone?: string | null
  email?: string | null
  gender?: 'NAM' | 'NU' | 'KHAC' | null
  avatar?: string | null
}

export interface UpdateTenantRequest {
  full_name?: string | null
  date_of_birth?: string | null
  identity_card_number?: string
  issue_place?: string | null
  permanent_address?: string | null
  emergency_contact?: string | null
  phone?: string | null
  email?: string | null
  gender?: 'NAM' | 'NU' | 'KHAC' | null
  avatar?: string | null
}

export interface TenantListResponse {
  tenants: Tenant[]
  total: number
}

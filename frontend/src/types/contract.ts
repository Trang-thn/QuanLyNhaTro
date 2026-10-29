
export type ContractStatus =
  | 'HIEU_LUC'
  | 'KHONG_HIEU_LUC'
  | 'DA_THANH_LY'

export interface Contract {
  id: string
  contract_number: string

  room_id: string
  representative_tenant_id: string

  room_number?: string | null
  tenant_name?: string | null
  tenant_phone?: string | null
  phone?: string | null
  email?: string | null

  start_date: string
  end_date: string

  rental_price: number
  deposit_amount: number

  status: ContractStatus
  billing_cycle_date: string

  created_at?: string
  updated_at?: string
}

export interface CreateContractRequest {
 room_id: string
  representative_tenant_id: string

  start_date: string
  end_date: string

  rental_price: number
  deposit_amount: number

  billing_cycle_date: string
  status?: ContractStatus
}

export interface UpdateContractRequest {
 room_id?: string
  representative_tenant_id?: string

  start_date?: string
  end_date?: string

  rental_price?: number
  deposit_amount?: number

  billing_cycle_date?: string
  status?: ContractStatus
}

export interface ContractListResponse {
  contracts: Contract[]
  total: number
}

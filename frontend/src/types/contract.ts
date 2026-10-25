
export type ContractStatus =
  | 'HIEU_LUC'
  | 'KHONG_HIEU_LUC'
  | 'DA_THANH_LY'

export interface Contract {
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

  // Thông tin bổ sung phục vụ hiển thị giao diện
  room_number?: string
  tenant_name?: string
  tenant_phone?: string

  created_at?: string
  updated_at?: string
}

export interface CreateContractRequest {
  contract_number?: string
  room_id: string
  representative_tenant_id: string
  start_date: string
  end_date: string
  rental_price: number
  deposit_amount: number
  billing_cycle_day: number
}

export interface UpdateContractRequest {
  contract_number?: string
  room_id?: string
  representative_tenant_id?: string
  start_date?: string
  end_date?: string
  rental_price?: number
  deposit_amount?: number
  billing_cycle_day?: number
  status?: ContractStatus
}

export interface ContractListResponse {
  contracts: Contract[]
  total: number
}

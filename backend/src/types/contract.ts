
export type ContractStatus =
  | 'HIEU_LUC'
  | 'KHONG_HIEU_LUC'
  | 'DA_THANH_LY'

export interface Contract {
  id: string
  contract_number: string
  room_id: string
  room_number: string | null
  representative_tenant_id: string
  tenant_name: string | null
  phone: string | null
  email: string | null
  start_date: string
  end_date: string
  rental_price: number
  deposit_amount: number
  status: ContractStatus
  billing_cycle_date: string
}

export interface CreateContractInput {
  room_id: string
  representative_tenant_id: string
  start_date: string
  end_date: string
  rental_price: number
  deposit_amount: number
  status?: ContractStatus
  billing_cycle_date: string
}

export type UpdateContractInput =
  Partial<CreateContractInput>

export interface ContractFilters {
  roomNumber?: string
  status?: string
}

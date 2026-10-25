
import { apiRequest } from './api'

export type ContractStatus =
  | 'Đang thuê'
  | 'Sắp hết hạn'
  | 'Đã thanh lý'

type NumericValue = number | string | null

export interface Contract {
  // ID hợp đồng là chuỗi
  id: string

  code: string
  tenant_id: number
  tenant_name?: string
  room_id: number
  room_name?: string
  start_date: string
  end_date: string
  rental_price: number
  deposit_amount: number
  status: ContractStatus
  billing_cycle_day?: number
  note?: string | null
  created_at?: string
  updated_at?: string
}

export interface ContractInput {
  tenant_id: number
  room_id: number
  start_date: string
  end_date: string
  rental_price: number
  deposit_amount: number
  billing_cycle_day?: number
  note?: string
}

interface ContractResponse
  extends Omit<Contract, 'rental_price' | 'deposit_amount'> {
  rental_price: NumericValue
  deposit_amount: NumericValue
}

/**
 * Chuyển giá trị tiền thành number.
 */
function toNumber(value: NumericValue): number {
  const parsed = Number(value ?? 0)
  return Number.isFinite(parsed) ? parsed : 0
}

/**
 * Chuẩn hóa dữ liệu hợp đồng từ API.
 */
function normalizeContract(contract: ContractResponse): Contract {
  return {
    ...contract,
    id: String(contract.id),
    rental_price: toNumber(contract.rental_price),
    deposit_amount: toNumber(contract.deposit_amount),
  }
}

/**
 * Lấy danh sách hợp đồng.
 */
export async function getContracts(): Promise<Contract[]> {
  const response = await apiRequest<ContractResponse[]>('/contracts')

  return response.map(normalizeContract)
}

/**
 * Lấy thông tin hợp đồng theo ID chuỗi.
 */
export async function getContractById(
  id: string,
): Promise<Contract> {
  const response = await apiRequest<ContractResponse>(
    `/contracts/${encodeURIComponent(id)}`,
  )

  return normalizeContract(response)
}

/**
 * Thêm hợp đồng mới.
 */
export async function createContract(
  input: ContractInput,
): Promise<Contract> {
  const response = await apiRequest<ContractResponse>('/contracts', {
    method: 'POST',
    body: JSON.stringify(input),
  })

  return normalizeContract(response)
}

/**
 * Cập nhật hợp đồng theo ID chuỗi.
 */
export async function updateContract(
  id: string,
  input: Partial<ContractInput>,
): Promise<Contract> {
  const response = await apiRequest<ContractResponse>(
    `/contracts/${encodeURIComponent(id)}`,
    {
      method: 'PUT',
      body: JSON.stringify(input),
    },
  )

  return normalizeContract(response)
}

/**
 * Thanh lý hợp đồng theo ID chuỗi.
 */
export async function liquidateContract(
  id: string,
  note?: string,
): Promise<Contract> {
  const response = await apiRequest<ContractResponse>(
    `/contracts/${encodeURIComponent(id)}/liquidate`,
    {
      method: 'PATCH',
      body: JSON.stringify({ note }),
    },
  )

  return normalizeContract(response)
}

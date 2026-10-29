
import { apiRequest } from './api'

import type {
  Contract,
  ContractStatus,
  CreateContractRequest,
  UpdateContractRequest,
} from '../types/contract'

export type { Contract, ContractStatus } from '../types/contract'

type NumericValue = number | string | null | undefined

interface ContractApiResponse {
  id: string | number
  contract_number: string

  room_id: string | number
  representative_tenant_id: string | number

  room_number?: string | null
  tenant_name?: string | null
  phone?: string | null
  tenant_phone?: string | null
  email?: string | null

  start_date: string
  end_date: string

  rental_price: NumericValue
  deposit_amount: NumericValue

  status: ContractStatus
  billing_cycle_date: string

  created_at?: string
  updated_at?: string
}

interface CreateContractResponse {
  message: string
  id: string | number
}

interface MessageResponse {
  message: string
}

function toNumber(value: NumericValue): number {
  const number = Number(value ?? 0)
  return Number.isFinite(number) ? number : 0
}

function normalizeContract(data: ContractApiResponse): Contract {
  return {
    ...data,
    id: String(data.id),
    room_id: String(data.room_id),
    representative_tenant_id: String(
      data.representative_tenant_id,
    ),
    room_number: data.room_number ?? null,
    tenant_name: data.tenant_name ?? null,
    phone: data.phone ?? data.tenant_phone ?? null,
    tenant_phone: data.tenant_phone ?? data.phone ?? null,
    rental_price: toNumber(data.rental_price),
    deposit_amount: toNumber(data.deposit_amount),
  }
}

// Lấy danh sách hợp đồng
export async function getContracts(): Promise<Contract[]> {
  const response = await apiRequest<ContractApiResponse[]>(
    '/contracts',
  )

  return response.map(normalizeContract)
}

// Lấy chi tiết một hợp đồng
export async function getContractById(
  id: string,
): Promise<Contract> {
  const response = await apiRequest<ContractApiResponse>(
    `/contracts/${encodeURIComponent(id)}`,
  )

  return normalizeContract(response)
}

// Tạo hợp đồng mới
// Backend trả về { message, id }, không phải toàn bộ hợp đồng.
export async function createContract(
  input: CreateContractRequest,
): Promise<CreateContractResponse> {
  return apiRequest<CreateContractResponse>('/contracts', {
    method: 'POST',
    body: JSON.stringify(input),
  })}

// Cập nhật hợp đồng
// Backend sử dụng PATCH và chỉ trả về { message }.
export async function updateContract(
  id: string,
  input: UpdateContractRequest,
): Promise<MessageResponse> {
  return apiRequest<MessageResponse>(
    `/contracts/${encodeURIComponent(id)}`,
    {
      method: 'PATCH',
      body: JSON.stringify(input),
    },
  )}

// Thanh lý hợp đồng thông qua PATCH trạng thái.
// Backend hiện chưa có route riêng /liquidate.
export async function liquidateContract(
  id: string,
  _note?: string,
): Promise<MessageResponse> {
  return updateContract(id, {
    status: 'DA_THANH_LY',
  })
}

// Xóa hợp đồng
export async function deleteContract(
  id: string,
): Promise<MessageResponse> {
  return apiRequest<MessageResponse>(
    `/contracts/${encodeURIComponent(id)}`,
    {
      method: 'DELETE',
    },
  )}

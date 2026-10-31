
import { randomUUID } from 'node:crypto'
import type { RowDataPacket } from 'mysql2'
import { pool } from '../config/database'

import type {
  Contract,
  ContractStatus,
  CreateContractInput,
  UpdateContractInput,
  ContractFilters,
} from '../types/contract'

 interface ContractRow extends RowDataPacket {
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
  rental_price: number | string
  deposit_amount: number | string
  status: string
  billing_cycle_date: string
}

 const CONTRACT_SELECT = `
  SELECT
    c.id,
    c.contract_number,
    c.room_id,
    r.room_number,
    c.representative_tenant_id,
    u.full_name AS tenant_name,
    u.phone_number AS phone,
    u.email,
    DATE_FORMAT(c.start_date, '%Y-%m-%d') AS start_date,
    DATE_FORMAT(c.end_date, '%Y-%m-%d') AS end_date,
    c.rental_price,
    c.deposit_amount,
    c.status,
    DATE_FORMAT(c.billing_cycle_date, '%Y-%m-%d') AS billing_cycle_date
  FROM contracts c
  LEFT JOIN rooms r ON r.id = c.room_id
  LEFT JOIN tenants t ON t.id = c.representative_tenant_id
  LEFT JOIN users u ON u.id = t.user_id
`

function toContractStatus(status: string): ContractStatus {
  if (
    status === 'HIEU_LUC' ||
    status === 'KHONG_HIEU_LUC' ||
    status === 'DA_THANH_LY'
  ) {
    return status
  }

  throw new Error(`Trạng thái hợp đồng không hợp lệ: ${status}`)
}

function mapContract(row: ContractRow): Contract {
  return {
    id: row.id,
    contract_number: row.contract_number,
    room_id: row.room_id,
    room_number: row.room_number,
    representative_tenant_id: row.representative_tenant_id,
    tenant_name: row.tenant_name,
    phone: row.phone,
    email: row.email,
    start_date: String(row.start_date).slice(0, 10),
    end_date: String(row.end_date).slice(0, 10),
    rental_price: Number(row.rental_price),
    deposit_amount: Number(row.deposit_amount),
    status: toContractStatus(row.status),
    billing_cycle_date: String(row.billing_cycle_date).slice(0, 10),
  }
}

function generateContractNumber(): string {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const suffix = randomUUID().replace(/-/g, '').slice(0, 8).toUpperCase()

  return `HD-${year}${month}${day}-${suffix}`
}

export async function getAllContracts(
  filters: ContractFilters = {},
): Promise<Contract[]> {
  let sql = CONTRACT_SELECT
  const conditions: string[] = []
  const values: (string | number)[] = []

  if (filters.roomNumber?.trim()) {
    conditions.push('r.room_number LIKE ?')
    values.push(`%${filters.roomNumber.trim()}%`)
  }

  if (filters.status?.trim()) {
    conditions.push('c.status = ?')
    values.push(filters.status.trim())
 }

  if (conditions.length > 0) {
    sql += ` WHERE ${conditions.join(' AND ')}`
  }

  sql += ' ORDER BY c.start_date DESC'

  const [rows] = await pool.execute<ContractRow[]>(sql, values)
  return rows.map(mapContract)
}

 export async function getContractById(
  id: string,
): Promise<Contract | null> {
  const [rows] = await pool.execute<ContractRow[]>(
    `${CONTRACT_SELECT} WHERE c.id = ? LIMIT 1`,
    [id],
  )

  if (rows.length === 0) {
    return null
  }

  return mapContract(rows[0])
}

 export async function createContract(
  data: CreateContractInput,
): Promise<string> {
  const id = randomUUID()
  const contractNumber = generateContractNumber()
  const status = data.status ?? 'HIEU_LUC'

  const sql = `
    INSERT INTO contracts (
      id,
      contract_number,
      room_id,
      representative_tenant_id,
      start_date,
      end_date,
      rental_price,
      deposit_amount,
      status,
      billing_cycle_date
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `

  await pool.execute(sql, [
    id,
    contractNumber,
    data.room_id,
    data.representative_tenant_id,
    data.start_date,
    data.end_date,
    data.rental_price,
    data.deposit_amount,
    status,
    data.billing_cycle_date,
  ])

  return id
}

   export async function updateContract(
  id: string,
  data: UpdateContractInput,
): Promise<boolean> {
  const columnMap: Record<string, string> = {
    room_id: 'room_id',
    representative_tenant_id: 'representative_tenant_id',
    start_date: 'start_date',
    end_date: 'end_date',
    rental_price: 'rental_price',
    deposit_amount: 'deposit_amount',
    status: 'status',
    billing_cycle_date: 'billing_cycle_date',
  }

  const updates: string[] = []
  const values: (string | number)[] = []

  for (const [key, column] of Object.entries(columnMap)) {
    const value = data[key as keyof UpdateContractInput]

    if (value !== undefined) {
      updates.push(`${column} = ?`)
      values.push(value as string | number)
    }
  }

  if (updates.length === 0) {
    return false
  }

  values.push(id)

  const [result] = await pool.execute(
    `UPDATE contracts SET ${updates.join(', ')} WHERE id = ?`,
    values,
  )

  return (result as { affectedRows: number }).affectedRows > 0
}

export async function deleteContract(id: string): Promise<boolean> {
  const [result] = await pool.execute(
    'DELETE FROM contracts WHERE id = ?',
    [id],
  )

  return (result as { affectedRows: number }).affectedRows > 0
}

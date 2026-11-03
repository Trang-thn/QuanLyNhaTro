export type TenantInvoiceStatus = 'CHUA_THANH_TOAN' | 'THANH_TOAN_MOT_PHAN' | 'DA_THANH_TOAN' | 'QUA_HAN'

export interface TenantInvoice {
  id: string
  invoice_code: string
  room_number: string
  tenant_name: string | null
  billing_month: number
  billing_year: number
  room_price: number
  electricity_cost: number
  water_cost: number
  other_service_cost: number
  total_amount: number
  paid_amount: number
  status: TenantInvoiceStatus
  due_date: string
  old_electricity_kwh: number | null
  new_electricity_kwh: number | null
  old_water_m3: number | null
  new_water_m3: number | null
}

export interface TenantInvoicePayment {
  id: string
  invoice_id: string
  payment_date: string
  amount_paid: number
  payment_method: string
  transaction_note: string | null
}

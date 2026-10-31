export type InvoiceStatus = 'CHUA_THANH_TOAN' | 'THANH_TOAN_MOT_PHAN' | 'DA_THANH_TOAN' | 'QUA_HAN'

export interface InvoiceItem {
  id: string
  invoice_code: string
  contract_id: string
  utility_reading_id: string | null
  room_id: string
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
  status: InvoiceStatus
  due_date: string
  old_electricity_kwh: number | null
  new_electricity_kwh: number | null
  old_water_m3: number | null
  new_water_m3: number | null
  electricity_price_per_kwh: number | null
  water_price_per_m3: number | null
}

export type InvoicePaymentRecord = { amount: number; method: string; date: string }
export type InvoicePaymentHistory = Record<string, InvoicePaymentRecord[]>

export const INVOICE_NAVY_COLOR = '#0d2137'
export const INVOICE_AMBER_COLOR = '#f59e0b'

export const invoiceStatusConfig: Record<InvoiceStatus, { label: string; bg: string; color: string; border: string }> = {
  DA_THANH_TOAN: { label: 'Đã thanh toán', bg: '#ecfdf5', color: '#065f46', border: '#a7f3d0' },
  THANH_TOAN_MOT_PHAN: { label: 'Thanh toán một phần', bg: '#fff7ed', color: '#9a3412', border: '#fed7aa' },
  CHUA_THANH_TOAN: { label: 'Chưa thanh toán', bg: '#f9fafb', color: '#6b7280', border: '#e5e7eb' },
  QUA_HAN: { label: 'Quá hạn', bg: '#fef2f2', color: '#991b1b', border: '#fecaca' },
}

export function getInvoiceReadings(inv: InvoiceItem) {
  const prevElec = inv.old_electricity_kwh ?? 0
  const newElec = inv.new_electricity_kwh ?? prevElec
  const prevWater = inv.old_water_m3 ?? 0
  const newWater = inv.new_water_m3 ?? prevWater
  return {
    prevElec, newElec, elecKwh: newElec - prevElec,
    prevWater, newWater, waterM3: newWater - prevWater,
  }
}

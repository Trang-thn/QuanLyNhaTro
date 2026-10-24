import { invoices, contracts } from'../../data/mockData'
export type InvoiceStatus = 'CHUA_THANH_TOAN' | 'THANH_TOAN_MOT_PHAN' | 'DA_THANH_TOAN' | 'QUA_HAN'

export type InvoiceItem = typeof invoices[0]

export type InvoicePaymentRecord = {
  amount: number
  method: string
  date: string
}

export type InvoicePaymentHistory = Record<string, InvoicePaymentRecord[]>

// Hằng số giao diện
export const INVOICE_NAVY_COLOR = '#0d2137'
export const INVOICE_AMBER_COLOR = '#f59e0b'

export const invoiceStatusConfig: Record<string, { label: string; bg: string; color: string; border: string }> = {
  DA_THANH_TOAN:      { label: 'Đã thanh toán',        bg: '#ecfdf5', color: '#065f46', border: '#a7f3d0' },
  THANH_TOAN_MOT_PHAN:{ label: 'Thanh toán một phần',  bg: '#fff7ed', color: '#9a3412', border: '#fed7aa' },
  CHUA_THANH_TOAN:    { label: 'Chưa thanh toán',       bg: '#f9fafb', color: '#6b7280', border: '#e5e7eb' },
  QUA_HAN:            { label: 'Quá hạn',               bg: '#fef2f2', color: '#991b1b', border: '#fecaca' },
}

// Các hàm bổ trợ
export function getInvoiceReadings(inv: typeof invoices[0]) {
  const elecKwh    = Math.round(inv.electricity_cost / 3500)
  const waterM3    = Math.round(inv.water_cost / 15000)
  const prevElec   = inv.room_id === '1' ? 1200 : 800 + Number(inv.room_id) * 30
  const prevWater  = inv.room_id === '1' ? 45   : 30  + Number(inv.room_id) * 2
  return {
    prevElec, newElec: prevElec + elecKwh, elecKwh,
    prevWater, newWater: prevWater + waterM3, waterM3,
  }
}

export function getInvoiceContract(inv: typeof invoices[0]) {
  return contracts.find(c => c.id === inv.contract_id)
}
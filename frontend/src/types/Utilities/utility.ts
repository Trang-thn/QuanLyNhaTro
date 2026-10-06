export const AMBER = '#f59e0b'
export const NAVY = '#0d2137'

export type Status = 'co_hoa_don' | 'da_nhap' | 'chua_nhap'

export interface UtilityRow {
  id: string
  tenantName: string
  room: string
  prevElec: number | null
  newElec: number | null
  prevWater: number | null
  newWater: number | null
  dateRecorded: string | null
  status: Status
}

export const statusConfig: Record<Status, { label: string; bg: string; color: string; border: string }> = {
  co_hoa_don: { label: 'Đã có hóa đơn', bg: '#ecfdf5', color: '#065f46', border: '#a7f3d0' },
  da_nhap:    { label: 'Đã nhập',        bg: '#eff6ff', color: '#1e40af', border: '#bfdbfe' },
  chua_nhap:  { label: 'Chưa nhập',      bg: '#f9fafb', color: '#6b7280', border: '#e5e7eb' },
}
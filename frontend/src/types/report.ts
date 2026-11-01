export type ReportType = 'cashflow' | 'debt' | 'utilities' | 'occupancy'
export interface ReportColumn { key: string; label: string; format?: 'currency' | 'date' | 'number' }
export interface ReportData {
  type: ReportType
  title: string
  generatedAt: string
  period: { month: number; year: number } | null
  summary: Array<{ label: string; value: string | number; format?: 'currency' | 'number' }>
  columns: ReportColumn[]
  rows: Array<Record<string, string | number | null>>
  note?: string
}

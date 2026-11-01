import { apiDownload, apiRequest } from './api'
import type { ReportData, ReportType } from '../types/report'

const query = (type: ReportType, period?: string) => `${type}${period ? `?period=${encodeURIComponent(period)}` : ''}`
export const getReport = (type: ReportType, period?: string) => apiRequest<ReportData>(`/reports/${query(type, period)}`)

export async function downloadReportExcel(type: ReportType, period?: string): Promise<void> {
  const blob = await apiDownload(`/reports/${type}/excel${period ? `?period=${encodeURIComponent(period)}` : ''}`)
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `${type}-${period ?? new Date().toISOString().slice(0, 10)}.xlsx`
  anchor.click()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

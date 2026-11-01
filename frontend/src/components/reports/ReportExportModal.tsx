import { useEffect, useMemo, useState } from 'react'
import { downloadReportExcel, getReport } from '../../services/reportService'
import type { ReportData, ReportType } from '../../types/report'

const options: Array<{ type: ReportType; label: string }> = [
  { type: 'cashflow', label: 'Doanh thu và dòng tiền' },
  { type: 'debt', label: 'Công nợ hóa đơn' },
  { type: 'utilities', label: 'Điện nước và mức tiêu thụ' },
  { type: 'occupancy', label: 'Lấp đầy và khách thuê' },
]
const currentMonth = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}` }
const currency = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 })
const display = (value: string | number | null, format?: string) => value == null ? '—' : format === 'currency' && typeof value === 'number' ? currency.format(value) : format === 'date' && typeof value === 'string' ? new Date(`${value}T00:00:00`).toLocaleDateString('vi-VN') : String(value)

export default function ReportExportModal({ onClose }: { onClose: () => void }) {
  const [type, setType] = useState<ReportType>('cashflow')
  const [month, setMonth] = useState(currentMonth)
  const [report, setReport] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const period = type === 'cashflow' || type === 'utilities' ? month : undefined
  const selected = useMemo(() => options.find(o => o.type === type)!, [type])

  useEffect(() => { setReport(null); setError(null) }, [type, month])
  const preview = async () => {
    setLoading(true); setError(null)
    try { setReport(await getReport(type, period)) }
    catch (e) { setError(e instanceof Error ? e.message : 'Không tải được báo cáo.') }
    finally { setLoading(false) }
  }
  const exportExcel = async () => {
    setBusy(true); setError(null)
    try { await downloadReportExcel(type, period) }
    catch (e) { setError(e instanceof Error ? e.message : 'Không tải được tệp Excel.') }
    finally { setBusy(false) }
  }
  const print = () => window.print()

  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-3 sm:p-6" onClick={onClose}>
    <section className="report-modal flex max-h-[94vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl" onClick={e => e.stopPropagation()}>
      <header className="flex items-center justify-between border-b px-5 py-4 sm:px-7">
        <div><h2 className="text-lg font-bold text-[#0d2137]">Xuất báo cáo</h2><p className="text-sm text-gray-500">Chọn báo cáo, xem trước, sau đó tải Excel hoặc in/lưu PDF.</p></div>
        <button onClick={onClose} className="rounded-lg px-3 py-2 text-gray-500 hover:bg-gray-100" aria-label="Đóng">✕</button>
      </header>
      <div className="report-print-content flex-1 overflow-auto p-5 sm:p-7">
        <div className="report-controls mb-5 flex flex-wrap items-end gap-3">
          <label className="flex min-w-56 flex-1 flex-col gap-1 text-sm font-medium text-gray-700">Loại báo cáo
            <select value={type} onChange={e => setType(e.target.value as ReportType)} className="rounded-lg border border-gray-300 px-3 py-2">
              {options.map(option => <option key={option.type} value={option.type}>{option.label}</option>)}
            </select>
          </label>
          {period && <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">Tháng báo cáo<input type="month" value={month} onChange={e => setMonth(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2" /></label>}
          {!report && <button onClick={preview} disabled={loading} className="rounded-lg bg-[#0d2137] px-4 py-2.5 font-semibold text-white disabled:opacity-60">{loading ? 'Đang tải…' : 'Xem trước'}</button>}
        </div>
        {error && <div role="alert" className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"><span>{error}</span><button onClick={preview} className="font-semibold underline">Thử lại</button></div>}
        {report && <article className="report-document">
          <div className="mb-5"><h1 className="text-2xl font-bold text-[#0d2137]">{report.title}</h1><p className="mt-1 text-sm text-gray-500">{report.period ? `Kỳ ${String(report.period.month).padStart(2, '0')}/${report.period.year}` : `Chốt lúc ${new Date(report.generatedAt).toLocaleString('vi-VN')}`}</p>{report.note && <p className="mt-2 text-xs text-gray-500">{report.note}</p>}</div>
          <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">{report.summary.map(item => <div key={item.label} className="rounded-xl border border-gray-200 bg-slate-50 p-3"><div className="text-xs text-gray-500">{item.label}</div><div className="mt-1 break-words font-bold text-[#0d2137]">{typeof item.value === 'number' && item.format === 'currency' ? currency.format(item.value) : item.value}</div></div>)}</div>
          <div className="overflow-x-auto rounded-lg border border-gray-200"><table className="w-full min-w-max border-collapse text-left text-sm"><thead><tr className="bg-[#0d2137] text-white">{report.columns.map(column => <th key={column.key} className="px-3 py-2.5 font-semibold">{column.label}</th>)}</tr></thead><tbody>{report.rows.length ? report.rows.map((row, index) => <tr key={index} className="border-t border-gray-100 odd:bg-white even:bg-slate-50">{report.columns.map(column => <td key={column.key} className="px-3 py-2.5">{display(row[column.key], column.format)}</td>)}</tr>) : <tr><td colSpan={report.columns.length} className="p-8 text-center text-gray-500">Không có dữ liệu trong kỳ này.</td></tr>}</tbody></table></div>
        </article>}
      </div>
      <footer className="report-controls flex flex-wrap justify-between gap-2 border-t bg-slate-50 px-5 py-4 sm:px-7">
        <div>{report && <button onClick={() => setReport(null)} className="rounded-lg border border-gray-300 bg-white px-4 py-2 font-semibold text-gray-700">Chọn lại</button>}</div>
        <div className="flex flex-wrap gap-2">{report && <><button onClick={exportExcel} disabled={busy} className="rounded-lg bg-amber-500 px-4 py-2 font-semibold text-white disabled:opacity-60">{busy ? 'Đang tạo…' : 'Tải Excel'}</button><button onClick={print} className="rounded-lg bg-[#0d2137] px-4 py-2 font-semibold text-white">In / Lưu PDF</button></>}<button onClick={onClose} className="rounded-lg border border-gray-300 bg-white px-4 py-2 font-semibold text-gray-700">Đóng</button></div>
      </footer>
      <div className="print-only hidden"><span>{selected.label}</span></div>
    </section>
  </div>
}

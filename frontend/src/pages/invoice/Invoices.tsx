import { useEffect, useMemo, useState } from 'react'
import { formatVND } from '../../data/mockData'
import { apiRequest } from '../../services/api'
import { INVOICE_NAVY_COLOR, InvoiceItem, InvoicePaymentHistory, InvoiceStatus } from '../../types/invoice/invoice'
import { InvoiceStatusBadge } from '../../components/invoice/InvoiceStatusBadge'
import { InvoiceSidebarItem } from '../../components/invoice/InvoiceSidebarItem'
import { InvoiceReadingsTable } from '../../components/invoice/InvoiceReadingsTable'
import { InvoiceCostBreakdown } from '../../components/invoice/InvoiceCostBreakdown'
import { InvoicePaymentHistorySection } from '../../components/invoice/InvoicePaymentHistorySection'
import { InvoicePaymentForm } from '../../components/invoice/InvoicePaymentForm'
import { InvoiceExportModal } from '../../components/invoice/InvoiceExportModal'

type PaymentRow = { amount_paid: number; payment_method: string; payment_date: string }

export default function Invoices() {
  const [invoices, setInvoices] = useState<InvoiceItem[]>([])
  const [selectedId, setSelectedId] = useState('')
  const [search, setSearch] = useState('')
  const [monthFilter, setMonthFilter] = useState('all')
  const [yearFilter, setYearFilter] = useState('all')
  const [showExport, setShowExport] = useState(false)
  const [payHistory, setPayHistory] = useState<InvoicePaymentHistory>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    apiRequest<{ data: InvoiceItem[] }>('/invoices')
      .then(result => {
        if (cancelled) return
        setInvoices(result.data)
        setSelectedId(current => current || result.data[0]?.id || '')
        setError('')
      })
      .catch((err: Error) => { if (!cancelled) setError(err.message || 'Không tải được hóa đơn') })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [reloadKey])

  const periodFiltered = useMemo(() => invoices.filter(invoice =>
    (monthFilter === 'all' || invoice.billing_month === Number(monthFilter)) &&
    (yearFilter === 'all' || invoice.billing_year === Number(yearFilter))), [invoices, monthFilter, yearFilter])

  const selected = periodFiltered.find(invoice => invoice.id === selectedId) ?? periodFiltered[0]

  useEffect(() => {
    if (!selected) return
    let cancelled = false
    apiRequest<{ data: PaymentRow[] }>(`/invoices/${selected.id}/payments`)
      .then(result => {
        if (cancelled) return
        const methodLabels: Record<string, string> = {
          TIEN_MAT: 'Tiền mặt', CHUYEN_KHOAN: 'Chuyển khoản', VI_DIEN_TU: 'Ví điện tử',
        }
        setPayHistory(previous => ({
          ...previous,
          [selected.id]: result.data.map(payment => ({
            amount: Number(payment.amount_paid),
            method: methodLabels[payment.payment_method] ?? payment.payment_method,
            date: new Date(payment.payment_date.replace(' ', 'T')).toLocaleString('vi-VN'),
          })),
        }))
      })
      .catch((err: Error) => { if (!cancelled) setError(err.message || 'Không tải được lịch sử thanh toán') })
    return () => { cancelled = true }
  }, [selected?.id, reloadKey])

  const filtered = useMemo(() => periodFiltered.filter(invoice => !search ||
    invoice.invoice_code.toLowerCase().includes(search.toLowerCase()) ||
    invoice.room_number.toLowerCase().includes(search.toLowerCase()) ||
    (invoice.tenant_name ?? '').toLowerCase().includes(search.toLowerCase())), [periodFiltered, search])

  const availableYears = useMemo(() => {
    const currentYear = new Date().getFullYear()
    const nearbyYears = Array.from({ length: 11 }, (_, index) => currentYear + 5 - index)
    return Array.from(new Set([...nearbyYears, ...invoices.map(invoice => invoice.billing_year)]))
      .sort((a, b) => b - a)
  }, [invoices])

  const history = selected ? (payHistory[selected.id] ?? []) : []
  const totalPaid = selected?.paid_amount ?? 0
  const remaining = selected ? Math.max(0, selected.total_amount - totalPaid) : 0
  const status: InvoiceStatus = selected?.status ?? 'CHUA_THANH_TOAN'
  const statusCounts: Array<{ label: string; status: InvoiceStatus; color: string }> = [
    { label: 'Chưa thanh toán', status: 'CHUA_THANH_TOAN', color: '#64748b' },
    { label: 'Thanh toán một phần', status: 'THANH_TOAN_MOT_PHAN', color: '#d97706' },
    { label: 'Đã thanh toán', status: 'DA_THANH_TOAN', color: '#059669' },
    { label: 'Quá hạn', status: 'QUA_HAN', color: '#dc2626' },
  ]

  async function handlePay(payAmount: string, payMethod: string, payNote: string) {
    if (!selected || !payAmount) return
    const amount = Number(payAmount.replace(/\D/g, ''))
    if (!Number.isSafeInteger(amount) || amount <= 0) return
    const methods: Record<string, string> = {
      'Tiền mặt': 'TIEN_MAT', 'Chuyển khoản': 'CHUYEN_KHOAN', 'Ví điện tử': 'VI_DIEN_TU',
    }
    try {
      await apiRequest(`/invoices/${selected.id}/payments`, {
        method: 'POST',
        body: JSON.stringify({ amount_paid: amount, payment_method: methods[payMethod] ?? 'TIEN_MAT', transaction_note: payNote }),
      })
      setReloadKey(key => key + 1)
    } catch (err) {
      alert((err as Error).message || 'Không thể ghi nhận thanh toán')
      throw err
    }
  }

  async function handleReopenInvoice() {
    if (!selected || selected.paid_amount > 0 || !['CHUA_THANH_TOAN', 'QUA_HAN'].includes(selected.status)) return
    const confirmed = window.confirm(
      `Mở lại kỳ ${selected.billing_month}/${selected.billing_year} để sửa chỉ số? Hóa đơn chưa thanh toán sẽ được tạm ẩn cho đến khi chốt kỳ lại.`,
    )
    if (!confirmed) return
    try {
      await apiRequest(`/invoices/${selected.id}/reopen`, { method: 'POST' })
      setReloadKey(key => key + 1)
    } catch (err) {
      alert((err as Error).message || 'Không thể mở lại kỳ')
    }
  }

  return (
    <div className="flex h-full overflow-hidden gap-0 -m-6 min-h-0" style={{ height: 'calc(100vh - 60px)' }}>
      <div className="flex flex-col shrink-0 bg-white border-r border-gray-100 overflow-hidden" style={{ width: 280 }}>
        <div className="px-4 py-3 border-b border-gray-100">
          <h2 className="font-bold text-sm" style={{ color: INVOICE_NAVY_COLOR }}>Hóa đơn và thanh toán</h2>
          <p className="text-[11px] text-gray-400">Quản lý hóa đơn</p>
        </div>
        <div className="px-3 py-2 border-b border-gray-100">
          <input value={search} onChange={event => setSearch(event.target.value)} placeholder="Tìm theo mã, phòng, người thuê..."
            className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-amber-400 bg-gray-50" />
          <div className="grid grid-cols-2 gap-2 mt-2">
            <select aria-label="Lọc hóa đơn theo tháng" value={monthFilter} onChange={event => setMonthFilter(event.target.value)}
              className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-amber-400">
              <option value="all">Tất cả tháng</option>
              {Array.from({ length: 12 }, (_, index) => index + 1).map(month => (
                <option key={month} value={month}>Tháng {month}</option>
              ))}
            </select>
            <select aria-label="Lọc hóa đơn theo năm" value={yearFilter} onChange={event => setYearFilter(event.target.value)}
              className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-amber-400">
              <option value="all">Tất cả năm</option>
              {availableYears.map(year => <option key={year} value={year}>{year}</option>)}
            </select>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.map(invoice => <InvoiceSidebarItem key={invoice.id} inv={{ ...invoice, displayStatus: invoice.status }}
            isSelected={invoice.id === selected?.id} onSelect={setSelectedId} />)}
          {!loading && filtered.length === 0 && <p className="p-4 text-sm text-gray-400 text-center">Chưa có hóa đơn</p>}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto bg-white min-w-0">
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 p-5 border-b border-gray-100">
          {statusCounts.map(item => (
            <div key={item.status} className="rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
              <p className="text-xs text-gray-500">{item.label}</p>
              <p className="mt-1 text-xl font-bold" style={{ color: item.color }}>
                {periodFiltered.filter(invoice => invoice.status === item.status).length}
              </p>
              <p className="text-[11px] text-gray-400">hóa đơn</p>
            </div>
          ))}
        </div>
        {loading && <p className="p-6 text-sm text-gray-500">Đang tải hóa đơn...</p>}
        {!loading && error && <p role="alert" className="p-6 text-sm text-red-600">{error}</p>}
        {!loading && !error && !selected && <p className="p-6 text-sm text-gray-500">Chưa có hóa đơn trong hệ thống.</p>}
        {selected && (
          <>
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center gap-3 flex-wrap">
                <h3 className="font-bold text-base" style={{ color: INVOICE_NAVY_COLOR }}>Hóa đơn tháng {selected.billing_month}/{selected.billing_year}</h3>
                <InvoiceStatusBadge status={status} />
              </div>
              <div className="flex items-center gap-2">
                {selected.paid_amount === 0 && ['CHUA_THANH_TOAN', 'QUA_HAN'].includes(selected.status) && (
                  <button onClick={handleReopenInvoice}
                    className="px-3 py-2 rounded-lg border border-amber-300 text-amber-800 text-xs font-semibold hover:bg-amber-50">
                    Mở lại kỳ
                  </button>
                )}
                <button onClick={() => setShowExport(true)} className="px-3 py-2 rounded-lg text-white text-xs font-semibold" style={{ background: INVOICE_NAVY_COLOR }}>Xuất hóa đơn</button>
              </div>
            </div>
            <div className="px-6 py-4 space-y-5">
              <p className="text-sm text-gray-500">Phòng <strong className="text-gray-800">{selected.room_number}</strong> &nbsp;
                <strong className="text-gray-800">{selected.tenant_name || '—'}</strong> &nbsp;|&nbsp; Mã hóa đơn: {selected.invoice_code}</p>
              <InvoiceReadingsTable selected={selected} />
              <InvoiceCostBreakdown selected={selected} totalPaid={totalPaid} remaining={remaining} />
              <InvoicePaymentHistorySection selected={selected} history={history} />
              {remaining > 0 && <InvoicePaymentForm remaining={remaining} onPay={handlePay} />}
            </div>
          </>
        )}
      </div>
      {showExport && selected && <InvoiceExportModal inv={selected} onClose={() => setShowExport(false)} />}
    </div>
  )
}

import { useEffect, useMemo, useState } from 'react'
import { TenantInvoiceDetail } from '../../components/tenantInvoice/TenantInvoiceDetail'
import { TenantInvoiceList } from '../../components/tenantInvoice/TenantInvoiceList'
import { TenantInvoicePaymentHistory } from '../../components/tenantInvoice/TenantInvoicePaymentHistory'
import { getTenantInvoicePayments, getTenantInvoices } from '../../services/tenantInvoiceService'
import type { TenantInvoice, TenantInvoicePayment } from '../../types/tenantInvoice'

export default function TenantInvoices() {
  const [invoices, setInvoices] = useState<TenantInvoice[]>([])
  const [selectedId, setSelectedId] = useState('')
  const [month, setMonth] = useState('all')
  const [year, setYear] = useState('all')
  const [payments, setPayments] = useState<TenantInvoicePayment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [paymentsLoading, setPaymentsLoading] = useState(false)
  const [paymentsError, setPaymentsError] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')
    getTenantInvoices()
      .then(data => {
        if (cancelled) return
        setInvoices(data)
        setSelectedId(current => data.some(invoice => invoice.id === current) ? current : data[0]?.id ?? '')
      })
      .catch((err: Error) => { if (!cancelled) setError(err.message || 'Không tải được hóa đơn') })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  const years = useMemo(() => [...new Set(invoices.map(invoice => invoice.billing_year))].sort((a, b) => b - a), [invoices])
  const filteredInvoices = useMemo(() => invoices.filter(invoice =>
    (month === 'all' || invoice.billing_month === Number(month)) &&
    (year === 'all' || invoice.billing_year === Number(year))), [invoices, month, year])
  const selected = filteredInvoices.find(invoice => invoice.id === selectedId) ?? filteredInvoices[0]

  useEffect(() => {
    if (!selected) { setPayments([]); setPaymentsError(''); return }
    let cancelled = false
    setPaymentsLoading(true)
    setPaymentsError('')
    getTenantInvoicePayments(selected.id)
      .then(data => { if (!cancelled) setPayments(data) })
      .catch((err: Error) => { if (!cancelled) setPaymentsError(err.message || 'Không tải được lịch sử thanh toán') })
      .finally(() => { if (!cancelled) setPaymentsLoading(false) })
    return () => { cancelled = true }
  }, [selected?.id])

  return <div className="-m-6 min-h-full bg-[#f5f7fa] p-4 md:p-6">
    <div className="mx-auto max-w-[1500px]">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="text-xl font-bold text-[#0d2137]">Hóa đơn và thanh toán</h1><p className="mt-1 text-xs text-slate-500">Theo dõi hóa đơn và tình trạng thanh toán của bạn.</p></div>
        <div className="flex gap-2">
          <label className="sr-only" htmlFor="tenant-invoice-month">Lọc tháng</label>
          <select id="tenant-invoice-month" value={month} onChange={event => setMonth(event.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-amber-400">
            <option value="all">Tất cả tháng</option>{Array.from({ length: 12 }, (_, index) => <option key={index + 1} value={index + 1}>Tháng {index + 1}</option>)}
          </select>
          <label className="sr-only" htmlFor="tenant-invoice-year">Lọc năm</label>
          <select id="tenant-invoice-year" value={year} onChange={event => setYear(event.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-amber-400">
            <option value="all">Tất cả năm</option>{years.map(item => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
      </div>

      {error && !loading && <div role="alert" className="mb-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      <div className="grid min-h-[600px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:grid-cols-[280px_minmax(0,1fr)]">
        <TenantInvoiceList invoices={filteredInvoices} selectedId={selected?.id ?? ''} onSelect={setSelectedId} />
        <main className="min-w-0 overflow-y-auto">
          {loading ? <p className="p-6 text-sm text-slate-500">Đang tải hóa đơn...</p>
            : error ? null
              : selected ? <><TenantInvoiceDetail invoice={selected} /><TenantInvoicePaymentHistory payments={payments} loading={paymentsLoading} error={paymentsError} /></>
                : <p className="p-6 text-sm text-slate-400">Chưa có hóa đơn trong thời gian đã chọn.</p>}
        </main>
      </div>
    </div>
  </div>
}

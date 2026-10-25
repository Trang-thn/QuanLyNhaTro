import { useState } from 'react'
import { invoices, getTenantName, getRoomNumber } from'../../data/mockData'
import {
  INVOICE_NAVY_COLOR,
  getInvoiceContract,
  InvoicePaymentHistory,
} from '../../types/invoice/invoice'

import { InvoiceStatusBadge } from '../../components/invoice/InvoiceStatusBadge'
import { InvoiceSidebarItem } from '../../components/invoice/InvoiceSidebarItem'
import { InvoiceReadingsTable } from '../../components/invoice/InvoiceReadingsTable'
import { InvoiceCostBreakdown } from '../../components/invoice/InvoiceCostBreakdown'
import { InvoicePaymentHistorySection } from '../../components/invoice/InvoicePaymentHistorySection'
import { InvoicePaymentForm } from '../../components/invoice/InvoicePaymentForm'
import { InvoiceExportModal } from '../../components/invoice/InvoiceExportModal'
export default function Invoices() {
  const [selectedId, setSelectedId] = useState<string>(invoices[0]?.id ?? '')
  const [search, setSearch]         = useState('')
  const [showExport, setShowExport] = useState(false)
  const [payHistory, setPayHistory] = useState<InvoicePaymentHistory>({})

  const today = new Date()
  const enriched = invoices.map(inv => {
    const due = new Date(inv.due_date)
    const isOverdue = inv.status !== 'DA_THANH_TOAN' && due < today
    return { ...inv, displayStatus: isOverdue ? 'QUA_HAN' : inv.status }
  })

  const filtered = enriched.filter(inv => {
    if (!search) return true
    const contract = getInvoiceContract(inv)
    const tenant = contract ? getTenantName(contract.representative_tenant_id) : ''
    return (
      inv.invoice_code.toLowerCase().includes(search.toLowerCase()) ||
      getRoomNumber(inv.room_id).toLowerCase().includes(search.toLowerCase()) ||
      tenant.toLowerCase().includes(search.toLowerCase())
    )
  })

  const selected = enriched.find(i => i.id === selectedId) ?? enriched[0]
  const selContract = selected ? getInvoiceContract(selected) : null
  const selTenant   = selContract ? getTenantName(selContract.representative_tenant_id) : '—'
  const selRoom     = selected ? getRoomNumber(selected.room_id) : '—'
  const selStatus   = selected?.displayStatus ?? 'CHUA_THANH_TOAN'
  const history     = selected ? (payHistory[selected.id] ?? []) : []
  const totalPaid   = selected ? selected.paid_amount + history.reduce((s, h) => s + h.amount, 0) : 0
  const remaining   = selected ? selected.total_amount - totalPaid : 0

  function handlePay(payAmount: string, payMethod: string, _payNote: string) {
    if (!selected || !payAmount) return
    const amount = parseInt(payAmount.replace(/\D/g, ''), 10)
    if (isNaN(amount) || amount <= 0) return
    const now = new Date()
    const dateStr = `${String(now.getDate()).padStart(2,'0')}/${String(now.getMonth()+1).padStart(2,'0')}/${now.getFullYear()}`
    setPayHistory(prev => ({
      ...prev,
      [selected.id]: [...(prev[selected.id] ?? []), { amount, method: payMethod, date: dateStr }],
    }))
  }

  return (
    <div className="flex h-full overflow-hidden gap-0 -m-6 min-h-0" style={{ height: 'calc(100vh - 60px)' }}>
      {/* Danh sách bên trái */}
      <div className="flex flex-col shrink-0 bg-white border-r border-gray-100 overflow-hidden" style={{ width: 280 }}>
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-sm" style={{ color: INVOICE_NAVY_COLOR }}>Hóa đơn và thanh toán</h2>
            <p className="text-[11px] text-gray-400">Quản lý hóa đơn</p>
          </div>
          <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-500 hover:bg-gray-50 transition">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
            </svg>
            Lọc
          </button>
        </div>

        <div className="px-3 py-2 border-b border-gray-100">
          <div className="relative">
            <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Tìm kiếm nhanh..."
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-amber-400 bg-gray-50"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filtered.map(inv => (
            <InvoiceSidebarItem
              key={inv.id}
              inv={inv}
              isSelected={inv.id === selectedId}
              onSelect={setSelectedId}
            />
          ))}
        </div>
      </div>

      {/* Chi tiết bên phải */}
      {selected && (
        <div className="flex-1 overflow-y-auto bg-white min-w-0">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
            <div className="flex items-center gap-3 flex-wrap">
              <h3 className="font-bold text-base" style={{ color: INVOICE_NAVY_COLOR }}>
                Hóa đơn tháng {selected.billing_month}/{selected.billing_year}
              </h3>
              <InvoiceStatusBadge status={selStatus} />
            </div>
            <button
              onClick={() => setShowExport(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-white text-xs font-semibold transition shrink-0"
              style={{ background: INVOICE_NAVY_COLOR }}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Xuất hóa đơn
            </button>
          </div>

          <div className="px-6 py-4 space-y-5">
            <p className="text-sm text-gray-500">
              Phòng <strong className="text-gray-800">{selRoom}</strong> &nbsp;
              <strong className="text-gray-800">{selTenant}</strong> &nbsp;|&nbsp; Mã thanh toán: {selected.invoice_code}
            </p>

            <InvoiceReadingsTable selected={selected} />

            <InvoiceCostBreakdown
              selected={selected}
              totalPaid={totalPaid}
              remaining={remaining}
            />

            <InvoicePaymentHistorySection
              selected={selected}
              history={history}
            />

            {remaining > 0 && (
              <InvoicePaymentForm
                remaining={remaining}
                onPay={handlePay}
              />
            )}
          </div>
        </div>
      )}

      {showExport && selected && (
        <InvoiceExportModal inv={selected} onClose={() => setShowExport(false)} />
      )}
    </div>
  )
}
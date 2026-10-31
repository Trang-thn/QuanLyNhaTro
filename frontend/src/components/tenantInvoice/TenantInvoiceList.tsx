import type { TenantInvoice } from '../../types/tenantInvoice'
import { TenantInvoiceStatusBadge } from './TenantInvoiceStatusBadge'

const money = (value: number) => new Intl.NumberFormat('vi-VN').format(value) + 'đ'
const date = (value: string) => new Date(`${value}T00:00:00`).toLocaleDateString('vi-VN')

interface Props {
  invoices: TenantInvoice[]
  selectedId: string
  onSelect: (id: string) => void
}

export function TenantInvoiceList({ invoices, selectedId, onSelect }: Props) {
  return <aside className="flex min-h-0 flex-col border-b border-slate-200 bg-white lg:border-b-0 lg:border-r">
    <div className="border-b border-slate-100 px-4 py-3">
      <h2 className="text-sm font-bold text-[#0d2137]">Hóa đơn của tôi</h2>
      <p className="mt-0.5 text-[11px] text-slate-400">{invoices.length} hóa đơn</p>
    </div>
    <div className="min-h-0 flex-1 overflow-y-auto">
      {invoices.map(invoice => <button key={invoice.id} type="button" onClick={() => onSelect(invoice.id)} className={`w-full border-b border-slate-100 px-4 py-3 text-left transition hover:bg-amber-50/60 ${selectedId === invoice.id ? 'border-l-[3px] border-l-amber-500 bg-[#fff8ef]' : ''}`}>
        <div className="flex items-start justify-between gap-2"><span className="text-[11px] text-slate-500">Tháng {invoice.billing_month}/{invoice.billing_year}</span><strong className="text-xs text-[#0d2137]">{money(invoice.total_amount)}</strong></div>
        <p className="mt-1 truncate text-xs text-slate-600">Phòng {invoice.room_number}</p>
        <p className="mt-1 truncate text-[10px] text-slate-400">{invoice.invoice_code} · Hạn {date(invoice.due_date)}</p>
        <div className="mt-2"><TenantInvoiceStatusBadge status={invoice.status} /></div>
      </button>)}
      {!invoices.length && <p className="p-4 text-center text-sm text-slate-400">Không có hóa đơn trong thời gian đã chọn.</p>}
    </div>
  </aside>
}

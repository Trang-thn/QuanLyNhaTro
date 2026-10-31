import type { TenantInvoiceStatus } from '../../types/tenantInvoice'

const config: Record<TenantInvoiceStatus, { label: string; style: string }> = {
  DA_THANH_TOAN: { label: 'Đã thanh toán', style: 'border-emerald-200 bg-emerald-50 text-emerald-700' },
  THANH_TOAN_MOT_PHAN: { label: 'Thanh toán một phần', style: 'border-amber-200 bg-amber-50 text-amber-700' },
  CHUA_THANH_TOAN: { label: 'Chưa thanh toán', style: 'border-slate-200 bg-slate-50 text-slate-600' },
  QUA_HAN: { label: 'Quá hạn', style: 'border-red-200 bg-red-50 text-red-700' },
}

export function TenantInvoiceStatusBadge({ status }: { status: TenantInvoiceStatus }) {
  const item = config[status]
  return <span className={`inline-flex whitespace-nowrap rounded-full border px-2 py-0.5 text-[11px] font-semibold ${item.style}`}>{item.label}</span>
}

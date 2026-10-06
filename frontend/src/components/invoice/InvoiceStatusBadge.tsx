import { invoiceStatusConfig } from '../../types/invoice/invoice'

export function InvoiceStatusBadge({ status }: { status: string }) {
  const s = invoiceStatusConfig[status] ?? invoiceStatusConfig.CHUA_THANH_TOAN
  return (
    <span
      className="px-2.5 py-1 rounded-full text-[11px] font-semibold border"
      style={{ background: s.bg, color: s.color, borderColor: s.border }}
    >
      {s.label}
    </span>
  )
}
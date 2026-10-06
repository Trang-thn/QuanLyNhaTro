import { InvoiceItem, INVOICE_NAVY_COLOR, getInvoiceContract }from '../../types/invoice/invoice'
import { getTenantName, getRoomNumber, formatVND } from'../../data/mockData'
import { InvoiceStatusBadge } from './InvoiceStatusBadge'

interface InvoiceSidebarItemProps {
  inv: InvoiceItem & { displayStatus: string }
  isSelected: boolean
  onSelect: (id: string) => void
}

export function InvoiceSidebarItem({ inv, isSelected, onSelect }: InvoiceSidebarItemProps) {
  const c = getInvoiceContract(inv)
  const tenant = c ? getTenantName(c.representative_tenant_id) : '—'
  const room = getRoomNumber(inv.room_id)

  return (
    <button
      onClick={() => onSelect(inv.id)}
      className="w-full text-left px-4 py-3 border-b border-gray-50 transition"
      style={{
        background: isSelected ? '#f0f7ff' : 'white',
        borderLeft: isSelected ? `3px solid ${INVOICE_NAVY_COLOR}` : '3px solid transparent'
      }}
      onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = '#f9fafb' }}
      onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'white' }}
    >
      <div className="flex justify-between items-start mb-0.5">
        <span className="text-[11px] text-gray-400">Tháng {inv.billing_month}/{inv.billing_year}</span>
      </div>
      <div className="flex justify-between items-center mb-1">
        <span className="font-bold text-sm" style={{ color: INVOICE_NAVY_COLOR }}>{formatVND(inv.total_amount)}</span>
      </div>
      <p className="text-xs text-gray-600 font-medium">{room} {tenant}</p>
      <p className="text-[11px] text-gray-400 mt-0.5">{inv.invoice_code} | Tạo {inv.due_date.split('-').reverse().join('/')}</p>
      <div className="mt-1.5">
        <InvoiceStatusBadge status={inv.displayStatus} />
      </div>
    </button>
  )
}
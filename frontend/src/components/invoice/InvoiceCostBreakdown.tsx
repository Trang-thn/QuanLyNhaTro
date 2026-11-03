import { InvoiceItem, INVOICE_NAVY_COLOR } from '../../types/invoice/invoice'
import { formatVND } from '../../data/mockData'
interface InvoiceCostBreakdownProps {
  selected: InvoiceItem
  totalPaid: number
  remaining: number
}

export function InvoiceCostBreakdown({ selected, totalPaid, remaining }: InvoiceCostBreakdownProps) {
  return (
    <section>
      <h4 className="font-semibold text-sm mb-2" style={{ color: INVOICE_NAVY_COLOR }}>Chi phí</h4>
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <div className="divide-y divide-gray-100">
          {[
            { label: 'Tiền phòng',               value: selected.room_price },
            { label: 'Tiền điện',                value: selected.electricity_cost },
            { label: 'Tiền nước',                value: selected.water_cost },
            { label: 'Dịch vụ khác (wifi, rác...)', value: selected.other_service_cost },
          ].map(row => (
            <div key={row.label} className="flex justify-between items-center px-4 py-2.5">
              <span className="text-sm text-gray-600">{row.label}</span>
              <span className="text-sm font-medium text-gray-700">{formatVND(row.value)}</span>
            </div>
          ))}
          <div className="flex justify-between items-center px-4 py-3" style={{ background: '#f8fafc' }}>
            <span className="font-bold text-sm" style={{ color: INVOICE_NAVY_COLOR }}>Tổng cộng</span>
            <span className="font-bold text-base" style={{ color: INVOICE_NAVY_COLOR }}>{formatVND(selected.total_amount)}</span>
          </div>
          <div className="flex justify-between items-center px-4 py-2.5">
            <span className="text-sm text-gray-500">Đã trả</span>
            <span className="text-sm font-semibold text-emerald-600">{formatVND(totalPaid)}</span>
          </div>
          <div className="flex justify-between items-center px-4 py-2.5">
            <span className="text-sm font-bold text-red-500">Còn nợ</span>
            <span className="text-base font-bold text-red-500">{formatVND(Math.max(0, remaining))}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
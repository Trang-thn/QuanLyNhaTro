import { InvoiceItem, InvoicePaymentRecord, INVOICE_NAVY_COLOR } from '../../types/invoice/invoice'
import { formatVND } from'../../data/mockData'

interface InvoicePaymentHistorySectionProps {
  selected: InvoiceItem
  history: InvoicePaymentRecord[]
}

export function InvoicePaymentHistorySection({ selected, history }: InvoicePaymentHistorySectionProps) {
  return (
    <section>
      <h4 className="font-semibold text-sm mb-2" style={{ color: INVOICE_NAVY_COLOR }}>Lịch sử thanh toán</h4>
      <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
        {selected.paid_amount > 0 && (
          <div className="flex items-center justify-between px-4 py-3">
            <div>
              <p className="text-sm font-medium text-gray-700">{formatVND(selected.paid_amount)} – Chuyển khoản</p>
              <p className="text-xs text-gray-400">{selected.due_date.split('-').reverse().join('/')}</p>
            </div>
            <span className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">Xác nhận</span>
          </div>
        )}
        {history.map((h, i) => (
          <div key={i} className="flex items-center justify-between px-4 py-3">
            <div>
              <p className="text-sm font-medium text-gray-700">{formatVND(h.amount)} – {h.method}</p>
              <p className="text-xs text-gray-400">{h.date}</p>
            </div>
            <span className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">Xác nhận</span>
          </div>
        ))}
        {selected.paid_amount === 0 && history.length === 0 && (
          <div className="px-4 py-4 text-sm text-gray-400 text-center">Chưa có lịch sử thanh toán</div>
        )}
      </div>
    </section>
  )
}
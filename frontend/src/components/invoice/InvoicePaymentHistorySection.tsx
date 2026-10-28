import { InvoiceItem, InvoicePaymentRecord, INVOICE_NAVY_COLOR } from '../../types/invoice/invoice'
import { formatVND } from '../../data/mockData'

interface InvoicePaymentHistorySectionProps {
  selected: InvoiceItem
  history: InvoicePaymentRecord[]
}

export function InvoicePaymentHistorySection({ selected, history }: InvoicePaymentHistorySectionProps) {
  return (
    <section>
      <h4 className="font-semibold text-sm mb-2" style={{ color: INVOICE_NAVY_COLOR }}>Lịch sử thanh toán</h4>
      <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
        {history.map((payment, index) => (
          <div key={`${payment.date}-${index}`} className="flex items-center justify-between px-4 py-3">
            <div>
              <p className="text-sm font-medium text-gray-700">{formatVND(payment.amount)} – {payment.method}</p>
              <p className="text-xs text-gray-400">{payment.date}</p>
            </div>
            <span className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">Đã ghi nhận</span>
          </div>
        ))}
        {history.length === 0 && (
          <div className="px-4 py-4 text-sm text-gray-400 text-center">
            {selected.paid_amount > 0 ? 'Khoản đã trả trước đây chưa có chi tiết lịch sử.' : 'Chưa có lịch sử thanh toán'}
          </div>
        )}
      </div>
    </section>
  )
}

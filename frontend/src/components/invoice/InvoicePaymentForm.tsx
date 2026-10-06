import { useState } from 'react'
import { INVOICE_NAVY_COLOR }  from '../../types/invoice/invoice'

interface InvoicePaymentFormProps {
  remaining: number
  onPay: (payAmount: string, payMethod: string, payNote: string) => void
}

export function InvoicePaymentForm({ remaining, onPay }: InvoicePaymentFormProps) {
  const [payAmount, setPayAmount] = useState('')
  const [payMethod, setPayMethod] = useState('Tiền mặt')
  const [payNote, setPayNote]     = useState('')

  function handleSubmit() {
    onPay(payAmount, payMethod, payNote)
    setPayAmount('')
    setPayNote('')
  }

  return (
    <section>
      <h4 className="font-semibold text-sm mb-3" style={{ color: INVOICE_NAVY_COLOR }}>Ghi nhận thanh toán mới</h4>
      <div className="space-y-3">
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1">Số tiền thanh toán (đ)</label>
          <input
            type="text"
            value={payAmount}
            onChange={e => setPayAmount(e.target.value)}
            placeholder={String(remaining)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-amber-400 transition"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1">Hình thức</label>
          <select
            value={payMethod}
            onChange={e => setPayMethod(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-amber-400 transition bg-white"
          >
            <option>Tiền mặt</option>
            <option>Chuyển khoản</option>
            <option>Ví điện tử</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1">Ghi chú</label>
          <textarea
            value={payNote}
            onChange={e => setPayNote(e.target.value)}
            placeholder="Nhập ghi chú..."
            rows={3}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-amber-400 transition resize-none"
          />
        </div>
        <button
          onClick={handleSubmit}
          className="w-full py-3 rounded-xl text-white font-semibold text-sm transition"
          style={{ background: INVOICE_NAVY_COLOR }}
        >
          Ghi nhận thanh toán
        </button>
      </div>
    </section>
  )
}
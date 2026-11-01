import type { TenantInvoicePayment } from '../../types/tenantInvoice'

const money = (value: number) => new Intl.NumberFormat('vi-VN').format(value) + 'đ'
const methods: Record<string, string> = { TIEN_MAT: 'Tiền mặt', CHUYEN_KHOAN: 'Chuyển khoản', VI_DIEN_TU: 'Ví điện tử' }

export function TenantInvoicePaymentHistory({ payments, loading, error }: { payments: TenantInvoicePayment[]; loading: boolean; error: string }) {
  return <section className="px-5 pb-5">
    <h3 className="mb-2 text-sm font-bold text-[#0d2137]">Lịch sử thanh toán</h3>
    <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
      {loading ? <p className="p-4 text-sm text-slate-400">Đang tải lịch sử thanh toán...</p>
        : error ? <p role="alert" className="p-4 text-sm text-red-600">{error}</p>
          : payments.length ? payments.map(payment => <div key={payment.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
            <div><p className="text-sm font-medium text-slate-700">{money(Number(payment.amount_paid))} – {methods[payment.payment_method] ?? payment.payment_method}</p><p className="mt-0.5 text-[11px] text-slate-400">{new Date(payment.payment_date.replace(' ', 'T')).toLocaleString('vi-VN')}</p></div>
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700">Đã ghi nhận</span>
          </div>) : <p className="p-4 text-sm text-slate-400">Chưa có khoản thanh toán nào.</p>}
    </div>
  </section>
}

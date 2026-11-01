import type { TenantInvoice } from '../../types/tenantInvoice'
import { TenantInvoiceStatusBadge } from './TenantInvoiceStatusBadge'

const money = (value: number) => new Intl.NumberFormat('vi-VN').format(value) + 'đ'
const date = (value: string) => new Date(`${value}T00:00:00`).toLocaleDateString('vi-VN')

export function TenantInvoiceDetail({ invoice }: { invoice: TenantInvoice }) {
  const remaining = Math.max(0, invoice.total_amount - invoice.paid_amount)
  const electricityUsed = invoice.old_electricity_kwh == null || invoice.new_electricity_kwh == null ? null : invoice.new_electricity_kwh - invoice.old_electricity_kwh
  const waterUsed = invoice.old_water_m3 == null || invoice.new_water_m3 == null ? null : invoice.new_water_m3 - invoice.old_water_m3

  return <>
    <div className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 bg-white px-5 py-4">
      <div className="flex flex-wrap items-center gap-2"><h2 className="text-base font-bold text-[#0d2137]">Hóa đơn tháng {invoice.billing_month}/{invoice.billing_year}</h2><TenantInvoiceStatusBadge status={invoice.status} /></div>
      <p className="text-xs text-slate-500">Mã hóa đơn: {invoice.invoice_code}</p>
    </div>
    <div className="space-y-5 p-5">
      <p className="text-xs text-slate-500">Phòng <strong className="text-slate-800">{invoice.room_number}</strong>{invoice.tenant_name && <> · <strong className="text-slate-800">{invoice.tenant_name}</strong></>}</p>
      <section>
        <h3 className="mb-2 text-sm font-bold text-[#0d2137]">Chỉ số điện nước</h3>
        <div className="overflow-x-auto rounded-xl border border-slate-200"><table className="w-full min-w-[500px] text-left text-xs"><thead className="bg-slate-50 text-slate-500"><tr><th className="px-3 py-2.5 font-medium">Loại</th><th className="px-3 py-2.5 font-medium">Cũ</th><th className="px-3 py-2.5 font-medium">Mới</th><th className="px-3 py-2.5 font-medium">Dùng</th><th className="px-3 py-2.5 text-right font-medium">Thành tiền</th></tr></thead><tbody className="divide-y divide-slate-100 text-slate-700">
          <tr><td className="px-3 py-3">Điện (kWh)</td><td className="px-3 py-3">{invoice.old_electricity_kwh ?? '—'}</td><td className="px-3 py-3">{invoice.new_electricity_kwh ?? '—'}</td><td className="px-3 py-3 font-semibold">{electricityUsed ?? '—'}</td><td className="px-3 py-3 text-right font-semibold">{money(invoice.electricity_cost)}</td></tr>
          <tr><td className="px-3 py-3">Nước (m³)</td><td className="px-3 py-3">{invoice.old_water_m3 ?? '—'}</td><td className="px-3 py-3">{invoice.new_water_m3 ?? '—'}</td><td className="px-3 py-3 font-semibold">{waterUsed ?? '—'}</td><td className="px-3 py-3 text-right font-semibold">{money(invoice.water_cost)}</td></tr>
        </tbody></table></div>
      </section>
      <section>
        <h3 className="mb-2 text-sm font-bold text-[#0d2137]">Chi phí</h3>
        <div className="overflow-hidden rounded-xl border border-slate-200 text-xs">
          <Cost label="Tiền phòng" value={invoice.room_price} /><Cost label="Tiền điện" value={invoice.electricity_cost} /><Cost label="Tiền nước" value={invoice.water_cost} /><Cost label="Dịch vụ khác" value={invoice.other_service_cost} />
          <div className="flex justify-between bg-slate-50 px-3 py-3 font-bold text-[#0d2137]"><span>Tổng cộng</span><span>{money(invoice.total_amount)}</span></div>
          <div className="flex justify-between border-t border-slate-100 px-3 py-3 text-emerald-700"><span>Đã trả</span><strong>{money(invoice.paid_amount)}</strong></div>
          <div className="flex justify-between border-t border-slate-100 px-3 py-3 font-semibold text-red-600"><span>Còn nợ</span><span>{money(remaining)}</span></div>
          <div className="flex justify-between border-t border-slate-100 px-3 py-3 text-slate-500"><span>Hạn thanh toán</span><span>{date(invoice.due_date)}</span></div>
        </div>
      </section>
    </div>
  </>
}

function Cost({ label, value }: { label: string; value: number }) {
  return <div className="flex justify-between border-b border-slate-100 px-3 py-3 text-slate-600"><span>{label}</span><span className="font-medium">{money(value)}</span></div>
}

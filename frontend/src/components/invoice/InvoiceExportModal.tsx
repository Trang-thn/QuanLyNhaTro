import {
  InvoiceItem,
  INVOICE_NAVY_COLOR,
  INVOICE_AMBER_COLOR,
  invoiceStatusConfig,
  getInvoiceContract,
  getInvoiceReadings
} from '../../types/invoice/invoice'
import { getTenantName, getRoomNumber, formatVND } from '../../data/mockData'

export function InvoiceExportModal({ inv, onClose }: { inv: InvoiceItem; onClose: () => void }) {
  const contract  = getInvoiceContract(inv)
  const tenant    = contract ? getTenantName(contract.representative_tenant_id) : '—'
  const room      = getRoomNumber(inv.room_id)
  const r         = getInvoiceReadings(inv)
  const remaining = inv.total_amount - inv.paid_amount
  const s         = invoiceStatusConfig[inv.status] ?? invoiceStatusConfig.CHUA_THANH_TOAN

  const rows = [
    { khoang: 'Tiền phòng',    chitiet: '—',                                                                             thanh: inv.room_price },
    { khoang: 'Tiền điện',     chitiet: `${r.prevElec} đến ${r.newElec} (${r.elecKwh} kWh × 3.500 đ)`,                     thanh: inv.electricity_cost },
    { khoang: 'Tiền nước',     chitiet: `${r.prevWater} đến ${r.newWater} (${r.waterM3} m³ × 15.000 đ)`,                   thanh: inv.water_cost },
    { khoang: 'Dịch vụ khác',  chitiet: 'Wifi, rác',                                                                     thanh: inv.other_service_cost },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={onClose}>
      {/* Thêm max-h-[90vh], flex flex-col và overflow-hidden để giới hạn chiều cao modal */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[440px] max-h-[90vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
        
        {/* Header cố định */}
        <div className="px-6 pt-5 pb-3 text-center border-b border-gray-100 shrink-0">
          <h3 className="font-bold text-base" style={{ color: INVOICE_NAVY_COLOR }}>
            Hóa đơn tiền phòng tháng {inv.billing_month}/{inv.billing_year}
          </h3>
          <p className="text-xs mt-0.5" style={{ color: INVOICE_AMBER_COLOR }}>{inv.invoice_code}</p>
        </div>

        {/* Phần nội dung có thể cuộn dọc khi bị tràn màn hình (overflow-y-auto) */}
        <div className="px-6 py-4 space-y-3 overflow-y-auto flex-1">
          <div className="space-y-2">
            {[
              { label: 'Phòng', value: room },
              { label: 'Người thuê', value: tenant },
              { label: 'Hạn thanh toán', value: inv.due_date.split('-').reverse().join('/') },
            ].map(f => (
              <div key={f.label} className="flex justify-between items-center py-1.5 border-b border-dashed border-gray-200">
                <span className="text-sm text-gray-500">{f.label}</span>
                <span className="text-sm font-semibold text-gray-800">{f.value}</span>
              </div>
            ))}
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500 rounded-l">Khoản</th>
                <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500">Chi tiết</th>
                <th className="text-right px-3 py-2 text-xs font-semibold text-gray-500 rounded-r">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(row => (
                <tr key={row.khoang} className="border-b border-gray-50">
                  <td className="px-3 py-2 text-gray-700 font-medium whitespace-nowrap">{row.khoang}</td>
                  <td className="px-3 py-2 text-gray-400 text-xs">{row.chitiet}</td>
                  <td className="px-3 py-2 text-right font-medium text-gray-700 whitespace-nowrap">{formatVND(row.thanh)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pt-1 space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold" style={{ color: INVOICE_NAVY_COLOR }}>Tổng cộng</span>
              <span className="text-base font-bold" style={{ color: INVOICE_NAVY_COLOR }}>{formatVND(inv.total_amount)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Đã trả</span>
              <span className="text-sm font-semibold text-emerald-600">{formatVND(inv.paid_amount)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold" style={{ color: INVOICE_AMBER_COLOR }}>Còn nợ</span>
              <span className="text-sm font-bold" style={{ color: INVOICE_AMBER_COLOR }}>{formatVND(remaining)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-gray-500">Trạng thái</span>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold border"
              style={{ background: s.bg, color: s.color, borderColor: s.border }}>{s.label}</span>
          </div>
          {inv.paid_amount > 0 && (
            <div className="text-xs text-gray-400 border-t border-gray-100 pt-2">
              {inv.due_date.split('-').reverse().join('/')} &nbsp;|&nbsp; Chuyển khoản &nbsp;|&nbsp; {formatVND(inv.paid_amount)}
            </div>
          )}
        </div>

        {/* Footer cố định */}
        <div className="px-6 py-3 border-t border-gray-100 flex gap-2 shrink-0 bg-white">
          <button onClick={onClose} className="px-3 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition">Đóng</button>
          <button className="px-3 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition flex-1">Sao chép để gửi khách</button>
          <button className="px-3 py-2 rounded-lg text-white text-sm font-semibold transition flex-1" style={{ background: INVOICE_NAVY_COLOR }}
            onClick={() => window.print()}>
            In hoặc lưu PDF
          </button>
        </div>
      </div>
    </div>
  )
}
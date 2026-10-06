import { formatVND } from '../../data/mockData'
import type { TenantDashboardData } from '../../types/tenantDashboard'
import TenantWelcomeBanner from './TenantWelcomeBanner'

const AMBER = '#f59e0b'
const NAVY = '#0d2137'

interface Props { data: TenantDashboardData; linked?: boolean }

export default function TenantDashboardView({ data, linked = true }: Props) {
  const { invoices, contracts, maintenanceRequests, rooms } = data
  const tenantContractId = data.contractId
  const tenantContract = contracts.find(c => c.id === tenantContractId)
  const tenantRoom = tenantContract ? rooms.find(r => r.id === tenantContract.room_id) : null
  const tenantInvoices = invoices.filter(i => i.contract_id === tenantContractId).slice(0, 2)
  const tenantIncidents = maintenanceRequests.filter(m => m.room_id === tenantRoom?.id)
  const pendingIncidents = tenantIncidents.filter(m => m.status !== 'HOAN_THANH')
  const currentInvoice = tenantInvoices[0]
  if (!linked) {
    return (
      <div className="space-y-4">
        {/* Warning banner */}
        <div className="flex items-center gap-3 p-4 rounded-xl border border-amber-200" style={{ background: '#fef9ec' }}>
          <div className="w-5 h-5 shrink-0 flex items-center justify-center rounded text-xs" style={{ background: '#fef3c7' }}>⚠</div>
          <p className="text-sm text-amber-800 flex-1">Tài khoản chưa liên kết với Hợp đồng phòng trọ nào. Vui lòng kiểm tra lại CCCD hoặc liên hệ Chủ trọ.</p>
          <button className="text-sm font-semibold px-3 py-1.5 rounded-lg border border-amber-400 text-amber-700 hover:bg-amber-50 shrink-0">Liên hệ Chủ trọ</button>
          <button className="text-sm font-semibold px-3 py-1.5 rounded-lg text-white shrink-0" style={{ background: AMBER }}>Cập nhật CCCD</button>
        </div>

        {/* Empty state */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-24 h-24 rounded-full flex items-center justify-center" style={{ background: '#fff3e0', border: '2px dashed #f59e0b' }}>
            <svg className="w-10 h-10" style={{ color: AMBER }} fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
          </div>
          <div className="text-center">
            <p className="font-semibold text-gray-700 mb-1">Chờ kết nối phòng trọ</p>
            <p className="text-sm text-gray-400 max-w-sm">Hệ thống chưa tìm thấy hợp đồng nào khớp với số CCCD đăng ký của bạn. Vui lòng cập nhật đúng số CCCD hoặc yêu cầu chủ trọ thêm bạn vào danh sách thành viên phòng.</p>
          </div>
        </div>

        {/* Empty info cards */}
        <div className="grid grid-cols-3 gap-4">
          {['Thông tin phòng', 'Hợp đồng', 'Hóa đơn tháng này'].map(label => (
            <div key={label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <p className="text-sm text-gray-400 mb-2">{label}</p>
              <p className="text-sm text-gray-300">- -</p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <TenantWelcomeBanner />

      {/* 4 metric cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Room info */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-gray-400">Thông tin phòng</p>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          </div>
          <p className="text-xl font-bold mb-0.5" style={{ color: NAVY }}>Phòng P101</p>
          <p className="text-xs text-gray-400">Tầng 1 · Loại VIP</p>
        </div>
        {/* Contract expiry */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-gray-400">Thời hạn hợp đồng</p>
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
          </div>
          <p className="text-xl font-bold mb-0.5" style={{ color: NAVY }}>Còn 6 tháng</p>
          <p className="text-xs text-gray-400">Hết hạn: 31/12/2026</p>
        </div>
        {/* Invoice */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-gray-400">Hóa đơn tháng này</p>
            <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
          </div>
          <p className="text-xl font-bold mb-0.5" style={{ color: NAVY }}>
            {currentInvoice ? formatVND(currentInvoice.total_amount) : '—'}
          </p>
          <p className="text-xs text-gray-400">Trạng thái: <span className="text-red-500 font-medium">Chưa đóng</span></p>
        </div>
        {/* Incidents */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-gray-400">Sự cố báo cáo</p>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          </div>
          <p className="text-xl font-bold mb-0.5" style={{ color: NAVY }}>{pendingIncidents.length} sự cố</p>
          <p className="text-xs text-gray-400">Trạng thái: <span className="text-amber-600 font-medium">Đang xử lý</span></p>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Recent invoices */}
        <div className="xl:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-sm" style={{ color: NAVY }}>Hóa đơn gần đây</h3>
            <button className="text-xs font-semibold" style={{ color: AMBER }}>Xem tất cả</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  {['Kỳ hóa đơn', 'Dịch vụ', 'Tổng tiền', 'Trạng thái'].map(h => (
                    <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tenantInvoices.map((inv, i) => (
                  <tr key={inv.id} className={`border-t border-gray-50 hover:bg-gray-50 ${i % 2 === 0 ? '' : 'bg-gray-50/30'}`}>
                    <td className="px-4 py-3 text-xs text-gray-600 font-medium">Tháng {inv.billing_month.toString().padStart(2, '0')}/{inv.billing_year}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">Tiền phòng, điện, nước, internet</td>
                    <td className="px-4 py-3 text-xs font-semibold text-gray-700">{formatVND(inv.total_amount)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${inv.status === 'DA_THANH_TOAN' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                        {inv.status === 'DA_THANH_TOAN' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment reminder */}
        <div className="rounded-xl p-5 flex flex-col gap-3" style={{ background: '#fef3c7' }}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: AMBER }}>
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <p className="font-bold text-sm" style={{ color: '#92400e' }}>Nhắc nhở đóng tiền</p>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: '#92400e' }}>
            Hạn thanh toán hóa đơn Tháng 05/2026 là ngày <strong>05/05/2026</strong>. Vui lòng thanh toán đúng hạn để tránh phát sinh phí phạt.
          </p>
          <button className="w-full py-2.5 rounded-lg text-white font-semibold text-sm" style={{ background: AMBER }}>
            Thanh toán ngay
          </button>
        </div>
      </div>
    </div>
  )
}

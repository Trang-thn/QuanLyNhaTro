import { formatVND } from '../../data/mockData'
import type { TenantDashboardData } from '../../types/tenantDashboard'
import TenantWelcomeBanner from './TenantWelcomeBanner'

const AMBER = '#f59e0b'
const NAVY = '#0d2137'

interface Props { data: TenantDashboardData; linked?: boolean; tenantName?: string }

export default function TenantDashboardView({ data, linked = true, tenantName }: Props) {
  const { invoices, contracts, maintenanceRequests, rooms } = data
  const tenantContractId = data.contractId
  const tenantContract = contracts.find(c => c.id === tenantContractId)
  const tenantRoom = tenantContract ? rooms.find(r => r.id === tenantContract.room_id) : null
  const tenantInvoices = invoices.filter(i => i.contract_id === tenantContractId).slice(0, 2)
  const tenantIncidents = maintenanceRequests.filter(m => m.room_id === tenantRoom?.id)
  const pendingIncidents = tenantIncidents.filter(m => m.status !== 'HOAN_THANH')
  const currentInvoice = tenantInvoices[0]
  const dueDate = tenantContract?.end_date ? new Date(tenantContract.end_date) : null
  const now = new Date()
  const monthsRemaining = dueDate ? Math.max(0, (dueDate.getFullYear() - now.getFullYear()) * 12 + dueDate.getMonth() - now.getMonth()) : null
  const invoiceStatusLabel = currentInvoice?.status === 'DA_THANH_TOAN'
    ? 'Đã thanh toán'
    : currentInvoice?.status === 'THANH_TOAN_MOT_PHAN' ? 'Thanh toán một phần' : 'Chưa thanh toán'
  if (!linked) {
    return (
      <div className="space-y-4">
        {/* Warning banner */}
        <div className="flex items-center gap-3 p-4 rounded-xl border border-amber-200" style={{ background: '#fef9ec' }}>
          <div className="w-5 h-5 shrink-0 flex items-center justify-center rounded text-xs" style={{ background: '#fef3c7' }}>⚠</div>
          <p className="text-sm text-amber-800 flex-1">Tài khoản chưa được liên kết với hợp đồng phòng trọ nào. Vui lòng kiểm tra lại CCCD hoặc liên hệ Chủ trọ.</p>
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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
      <TenantWelcomeBanner roomNumber={tenantRoom?.room_number} tenantName={tenantName} />

      {/* 4 metric cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Room info */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-gray-400">Thông tin phòng</p>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          </div>
          <p className="text-xl font-bold mb-0.5" style={{ color: NAVY }}>{tenantRoom ? `Phòng ${tenantRoom.room_number}` : 'Chưa có phòng'}</p>
          <p className="text-xs text-gray-400">{tenantRoom ? `Tầng ${tenantRoom.floor}` : 'Chưa liên kết hợp đồng'}</p>
        </div>
        {/* Contract expiry */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-gray-400">Thời hạn hợp đồng</p>
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
          </div>
          <p className="text-xl font-bold mb-0.5" style={{ color: NAVY }}>{monthsRemaining === null ? '-' : `Còn ${monthsRemaining} tháng`}</p>
          <p className="text-xs text-gray-400">{dueDate ? `Hết hạn: ${dueDate.toLocaleDateString('vi-VN')}` : 'Chưa có hợp đồng'}</p>
        </div>
        {/* Invoice */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-gray-400">Hóa đơn gần nhất</p>
            <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
          </div>
          <p className="text-xl font-bold mb-0.5" style={{ color: NAVY }}>
            {currentInvoice ? formatVND(currentInvoice.total_amount) : '—'}
          </p>
          <p className="text-xs text-gray-400">Trạng thái: <span className="text-red-500 font-medium">{currentInvoice ? invoiceStatusLabel : 'Chưa có hóa đơn'}</span></p>
        </div>
        {/* Incidents */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-gray-400">Sự cố báo cáo</p>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          </div>
          <p className="text-xl font-bold mb-0.5" style={{ color: NAVY }}>{pendingIncidents.length} sự cố</p>
          <p className="text-xs text-gray-400">Trạng thái: <span className="text-amber-600 font-medium">{pendingIncidents.length ? 'Đang xử lý' : 'Không có yêu cầu đang xử lý'}</span></p>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Recent invoices */}
        <div className="xl:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-sm" style={{ color: NAVY }}>Hóa đơn gần đây</h3>
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

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="border-b border-gray-100 px-5 py-4"><h3 className="text-sm font-semibold" style={{ color: NAVY }}>Sự cố gần đây</h3></div>
          <div className="space-y-2 p-3">
            {tenantIncidents.length === 0 && <p className="p-3 text-xs text-gray-500">Bạn chưa gửi sự cố nào.</p>}
            {tenantIncidents.slice(0, 4).map(incident => <div key={incident.id} className="rounded-lg border border-gray-100 p-3">
              <div className="flex items-start justify-between gap-2"><p className="text-sm font-medium text-gray-800">{incident.title}</p><span className="shrink-0 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">{incident.status === 'HOAN_THANH' ? 'Hoàn thành' : incident.status === 'DANG_XU_LY' ? 'Đang xử lý' : 'Tiếp nhận'}</span></div>
              <p className="mt-1 text-xs text-gray-400">{new Date(incident.created_at).toLocaleDateString('vi-VN')}</p>
            </div>)}
          </div>
        </div>
      </div>
    </div>
  )
}

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts'
import { formatVND } from '../../data/mockData'
import type { DashboardData } from '../../types/dashboard'
import DashboardHeader from './DashboardHeader'

const NAVY = '#0d2137'
const AMBER = '#f59e0b'

const statusLabel: Record<string, string> = {
  DA_THANH_TOAN: 'Đã thanh toán',
  THANH_TOAN_MOT_PHAN: 'Thanh toán một phần',
  CHUA_THANH_TOAN: 'Chưa thanh toán',
}

export default function DashboardView({ data }: { data: DashboardData }) {
  const { rooms, invoices, contracts, maintenanceRequests, tenants, revenueData } = data
  const getRoomNumber = (id: string) => rooms.find(room => room.id === id)?.room_number ?? '-'
  const getTenantName = (id: string) => tenants.find(tenant => tenant.id === id)?.full_name ?? '-'
  const totalRooms = rooms.length
  const occupied = rooms.filter(r => r.status === 'DANG_THUE').length
  const vacant = rooms.filter(r => r.status === 'TRONG').length
  const unpaidInvoices = invoices.filter(i => i.status !== 'DA_THANH_TOAN')
  const totalDebt = unpaidInvoices.reduce((s, i) => s + (i.total_amount - i.paid_amount), 0)
  const overdueCount = unpaidInvoices.filter(i => i.due_date < '2026-10-01').length
  const pendingMaintenance = maintenanceRequests.filter(m => m.status !== 'HOAN_THANH').length
  const occupancyPct = Math.round((occupied / totalRooms) * 100)

  const occupancyData = [
    { name: 'Đang thuê', value: occupied },
    { name: 'Phòng trống', value: vacant },
  ]

  const overdueInvoices = invoices.filter(i => i.status !== 'DA_THANH_TOAN').slice(0, 3)
  const expiringContracts = contracts.filter(c => c.status === 'HIEU_LUC').slice(0, 3)

  return (
    <div className="space-y-5">
      <DashboardHeader />

      {/* 4 KPI cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Revenue */}
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Doanh thu tháng</p>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">+12.5%</span>
          </div>
          <p className="text-2xl font-bold mb-1" style={{ color: NAVY }}>{new Intl.NumberFormat('vi-VN').format(data.revenueThisMonth)} VNĐ</p>
          <p className="text-xs text-gray-400">Dòng tiền thực thu trong tháng</p>
        </div>
        {/* Occupancy */}
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Tỷ lệ lấp đầy</p>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">+4%</span>
          </div>
          <p className="text-2xl font-bold mb-1" style={{ color: NAVY }}>{occupancyPct}% ({occupied}/{totalRooms} phòng)</p>
          <p className="text-xs text-gray-400">{occupied} Đang thuê · {vacant} Phòng trống · 0 Bảo trì</p>
        </div>
        {/* Debt */}
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Công nợ chưa thu</p>
            {overdueCount > 0 && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-600">▲ {overdueCount} Quá hạn</span>
            )}
          </div>
          <p className="text-2xl font-bold mb-1" style={{ color: '#e53e3e' }}>{formatVND(totalDebt)}</p>
          <p className="text-xs text-gray-400">Cần nhắc nhở thanh toán</p>
        </div>
        {/* Maintenance */}
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Sự cố &amp; Bảo trì</p>
            <button className="text-xs font-semibold" style={{ color: AMBER }}>Xem danh sách →</button>
          </div>
          <p className="text-2xl font-bold mb-1" style={{ color: NAVY }}>{pendingMaintenance} Yêu cầu</p>
          <p className="text-xs text-gray-400">2 Mới tiếp nhận · {pendingMaintenance - 2} Đang sửa chữa</p>
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Dual bar chart */}
        <div className="xl:col-span-2 bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm" style={{ color: NAVY }}>Biểu đồ doanh thu &amp; Chi phí 6 tháng gần nhất</h3>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm" style={{ background: AMBER }} />
                <span className="text-gray-500">Doanh thu (VNĐ)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm" style={{ background: NAVY }} />
                <span className="text-gray-500">Chi phí (VNĐ)</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={revenueData} barGap={4} barSize={22}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={v => `${(v / 1000000).toFixed(0)}Tr`} tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip
                formatter={(v, name) => [formatVND(Number(v)), name === 'revenue' ? 'Doanh thu' : 'Chi phí']}
                contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }}
              />
              <Bar dataKey="revenue" fill={AMBER} radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" fill={NAVY} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Donut chart */}
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <h3 className="font-semibold text-sm mb-4" style={{ color: NAVY }}>Cơ cấu trạng thái phòng</h3>
          <div className="relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={occupancyData} cx="50%" cy="50%" innerRadius={52} outerRadius={72} paddingAngle={3} dataKey="value">
                  <Cell fill="#10b981" />
                  <Cell fill={AMBER} />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold" style={{ color: NAVY }}>{occupancyPct}%</span>
              <span className="text-xs text-gray-400">Đang thuê</span>
            </div>
          </div>
          <div className="space-y-2 mt-3">
            {[
              { label: 'Đang thuê', value: `${occupied} Phòng (${occupancyPct}%)`, color: '#10b981' },
              { label: 'Phòng trống', value: `${vacant} Phòng (${100 - occupancyPct}%)`, color: AMBER },
            ].map(d => (
              <div key={d.label} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                  <span className="text-gray-600">{d.label}</span>
                </div>
                <span className="font-semibold text-gray-700">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Overdue invoices */}
        <div className="xl:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-sm" style={{ color: NAVY }}>Hóa đơn chờ thu tiền / Quá hạn</h3>
            <button className="text-xs font-semibold" style={{ color: AMBER }}>Xem tất cả hóa đơn →</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  {['Số phòng', 'Khách thuê', 'Kỳ HĐ', 'Tổng tiền', 'Hạn đóng', 'Trạng thái', 'Hành động'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {overdueInvoices.map((inv, i) => {
                  const contract = contracts.find(c => c.id === inv.contract_id)
                  const tenantName = contract ? getTenantName(contract.representative_tenant_id) : '-'
                  const isOverdue = inv.due_date < '2026-10-01'
                  return (
                    <tr key={inv.id} className={`border-t border-gray-50 hover:bg-gray-50 ${i % 2 === 0 ? '' : 'bg-gray-50/30'}`}>
                      <td className="px-4 py-3 font-semibold text-sm" style={{ color: NAVY }}>{getRoomNumber(inv.room_id)}</td>
                      <td className="px-4 py-3 text-gray-700 text-xs">{tenantName}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">T{inv.billing_month}/{inv.billing_year}</td>
                      <td className="px-4 py-3 font-medium text-gray-800 text-xs">{formatVND(inv.total_amount)}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: isOverdue ? '#e53e3e' : '#6b7280' }}>{inv.due_date.split('-').reverse().join('/')}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${isOverdue ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-700'}`}>
                          {isOverdue ? `Quá hạn ${Math.floor((new Date('2026-10-01').getTime() - new Date(inv.due_date).getTime()) / 86400000)} ngày` : statusLabel[inv.status]}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button className="px-2.5 py-1 rounded text-xs font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50">Gửi HĐ</button>
                          {isOverdue && (
                            <button className="px-2.5 py-1 rounded text-xs font-semibold text-white" style={{ background: '#e53e3e' }}>Nhắc nợ</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Expiring contracts */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-sm" style={{ color: NAVY }}>Hợp đồng sắp hết hạn (30 ngày)</h3>
          </div>
          <div className="p-3 space-y-2">
            {expiringContracts.map(c => {
              const tenantName = getTenantName(c.representative_tenant_id)
              const room = getRoomNumber(c.room_id)
              return (
                <div key={c.id} className="flex items-start justify-between p-3 rounded-lg border border-gray-100 hover:border-amber-200 transition">
                  <div>
                    <p className="font-semibold text-sm" style={{ color: NAVY }}>{room} · {tenantName.split(' ').slice(-2).join(' ')}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Hạn HĐ: {c.end_date.split('-').reverse().join('/')}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">Sắp hết hạn</span>
                    <div className="flex gap-1">
                      <button className="text-[11px] px-2 py-0.5 rounded border border-gray-200 text-gray-600">Gia hạn HĐ</button>
                      <button className="text-[11px] px-2 py-0.5 rounded border border-gray-200 text-gray-600">Báo trả</button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

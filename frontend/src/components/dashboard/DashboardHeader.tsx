const NAVY = '#0d2137'

export default function DashboardHeader() {
  return <div className="flex flex-wrap items-end justify-between gap-3">
    <div>
      <h2 className="text-xl font-bold" style={{ color: NAVY }}>Tổng quan hoạt động</h2>
      <p className="mt-1 text-sm text-gray-500">Số liệu vận hành và tài chính cập nhật từ hệ thống.</p>
    </div>
    <p className="text-xs text-gray-400">Một cơ sở · dữ liệu hiện tại</p>
  </div>
}

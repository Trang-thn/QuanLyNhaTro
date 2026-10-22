const AMBER = '#f59e0b'
const NAVY = '#0d2137'

export default function DashboardHeader() {
  return (
    <div className="flex items-start justify-between flex-wrap gap-3">
      <div>
        <h2 className="text-xl font-bold" style={{ color: NAVY }}>Báo cáo &amp; Tổng quan hoạt động</h2>
        <p className="text-sm text-gray-400 mt-0.5">Thống kê tổng hợp tình trạng vận hành nhà trọ cập nhật mới nhất</p>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <select className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 bg-white focus:outline-none focus:border-amber-400">
          <option>Tháng này (10/2026)</option>
          <option>Tháng 9/2026</option>
          <option>Tháng 8/2026</option>
        </select>
        <select className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 bg-white focus:outline-none focus:border-amber-400">
          <option>Tất cả nhà trọ</option>
        </select>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white text-sm font-semibold" style={{ background: AMBER }}>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Xuất báo cáo (Excel/PDF)
        </button>
      </div>
    </div>
  )
}

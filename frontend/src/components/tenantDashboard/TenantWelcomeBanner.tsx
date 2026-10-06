export default function TenantWelcomeBanner() {
  return (
    <div className="flex items-center justify-between bg-white rounded-xl border border-gray-100 shadow-sm px-6 py-5">
      <div>
        <h2 className="text-xl font-bold text-gray-800">Xin chào, Nguyễn Văn A!</h2>
        <p className="text-sm text-gray-400 mt-0.5">Chào mừng bạn quay lại hệ thống quản lý phòng thuê.</p>
      </div>
      <span className="px-3 py-1.5 rounded-full text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200">
        Đã kết nối · P101
      </span>
    </div>
  )
}

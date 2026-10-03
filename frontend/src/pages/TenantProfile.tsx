import { useState } from 'react'

const AMBER = '#f59e0b'
const NAVY = '#0d2137'

export default function TenantProfile() {
  const [activeTab, setActiveTab] = useState<'profile' | 'room'>('profile')

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold mb-4" style={{ color: NAVY }}>Thông tin cá nhân &amp; Phòng thuê</h2>

        {/* Tabs */}
        <div className="flex gap-2 mb-5">
          <button
            onClick={() => setActiveTab('profile')}
            className="px-4 py-2 rounded-lg text-sm font-semibold transition"
            style={{ background: activeTab === 'profile' ? AMBER : 'white', color: activeTab === 'profile' ? 'white' : '#4b5563', border: '1px solid #e5e7eb' }}>
            Hồ sơ cá nhân
          </button>
          <button
            onClick={() => setActiveTab('room')}
            className="px-4 py-2 rounded-lg text-sm font-semibold transition"
            style={{ background: activeTab === 'room' ? AMBER : 'white', color: activeTab === 'room' ? 'white' : '#4b5563', border: '1px solid #e5e7eb' }}>
            Thông tin phòng &amp; Thành viên
          </button>
        </div>

        {activeTab === 'profile' && (
          <div className="space-y-4">
            {/* Profile header card */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-100 bg-gray-100 flex items-center justify-center text-gray-400 text-xl">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold" style={{ color: NAVY }}>Nguyễn Văn A</h3>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold text-emerald-700 bg-emerald-50 mt-1">
                    ✓ Đã xác thực CCCD
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-5">
                <p className="font-semibold text-sm mb-4" style={{ color: NAVY }}>Thông tin chi tiết</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                  {[
                    { label: 'Họ và tên', value: 'Nguyễn Văn A' },
                    { label: 'Số CCCD/CMND', value: '012345678901 (Ngày cấp: 10/05/2021 · Nơi cấp: Cục CSQLHC)' },
                    { label: 'Số điện thoại', value: '0987654321' },
                    { label: 'Địa chỉ Email', value: 'nguyenvana@gmail.com' },
                    { label: 'Địa chỉ thường trú', value: 'Số 123, Đường ABC, Quận XYZ, TP. Hà Nội', wide: true },
                    { label: 'Liên hệ khẩn cấp', value: 'Bà Nguyễn Thị B (Mẹ · 0912345678)' },
                  ].map(f => (
                    <div key={f.label} className={(f as { wide?: boolean }).wide ? 'md:col-span-2' : ''}>
                      <p className="text-xs text-gray-400 mb-0.5">{f.label}</p>
                      <p className="font-medium text-gray-800">{f.value}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {activeTab === 'room' && (
          <div className="space-y-4">
            {/* Room info */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold" style={{ color: NAVY }}>Phòng P101 (Tầng 1 · Loại: VIP)</h3>
                  <p className="text-sm text-gray-400 mt-0.5">Thời hạn: 01/01/2026 · 31/12/2026 (Còn 6 tháng)</p>
                </div>
                <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Đang hiệu lực</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Cost details */}
                <div className="border border-gray-100 rounded-xl p-4">
                  <p className="font-semibold text-sm mb-3" style={{ color: NAVY }}>Chi tiết Chi phí &amp; Quy định</p>
                  <div className="space-y-2.5 text-sm">
                    {[
                      { label: 'Giá thuê', value: '3.500.000đ/tháng' },
                      { label: 'Tiền đặt cọc', value: '3.500.000đ' },
                      { label: 'Ngày chốt hóa đơn', value: 'Ngày 01 hàng tháng' },
                    ].map(f => (
                      <div key={f.label} className="flex justify-between">
                        <span className="text-gray-500">{f.label}</span>
                        <span className="font-semibold text-gray-800">{f.value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-400 mb-2">Tiện nghi đi kèm</p>
                    <div className="flex flex-wrap gap-2">
                      {['WiFi', 'Điều hòa', 'Tủ lạnh', 'Bình nóng lạnh', 'Máy giặt'].map(a => (
                        <span key={a} className="px-2.5 py-1 rounded-full text-xs border border-gray-200 text-gray-600">{a}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Room members */}
                <div className="border border-gray-100 rounded-xl p-4">
                  <p className="font-semibold text-sm mb-3" style={{ color: NAVY }}>Thành viên cùng phòng</p>
                  <table className="w-full text-sm">
                    <thead>
                      <tr>
                        {['Họ tên / SĐT', 'Vai trò', 'Ngày vào'].map(h => (
                          <th key={h} className="text-left text-xs font-semibold text-gray-400 pb-2">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: 'Nguyễn Văn A', phone: '0987654321', role: 'Trưởng phòng', date: '01/01/2026', isLead: true },
                        { name: 'Lê Văn Nam', phone: '0912123123', role: 'Thành viên', date: '15/01/2026', isLead: false },
                      ].map(m => (
                        <tr key={m.name} className="border-t border-gray-50">
                          <td className="py-2.5">
                            <p className="font-medium text-gray-800">{m.name}</p>
                            <p className="text-xs text-gray-400">{m.phone}</p>
                          </td>
                          <td className="py-2.5">
                            <span className={`text-xs font-semibold ${m.isLead ? '' : 'text-gray-500'}`} style={m.isLead ? { color: AMBER } : {}}>
                              {m.role}
                            </span>
                          </td>
                          <td className="py-2.5 text-xs text-gray-500">{m.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

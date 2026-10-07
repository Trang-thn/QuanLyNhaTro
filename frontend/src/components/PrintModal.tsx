import { Member } from '../types/tenantContract';

const NAVY = '#0d2137';
const AMBER = '#f59e0b';

interface PrintModalProps {
  tenants: any[];
  onClose: () => void;
}

export default function PrintModal({ tenants, onClose }: PrintModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(11,11,12,0.55)' }}
      onClick={onClose}
    >
      <div className="bg-white rounded-2xl w-[560px] max-h-[85vh] flex flex-col shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold" style={{ color: NAVY }}>In hợp đồng thuê nhà</h3>
            <p className="text-sm text-gray-400 mt-0.5">HD-2026-001 · Phòng P101</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="border border-gray-200 rounded-xl p-6 space-y-5 bg-white text-sm">
            {/* Header */}
            <div className="text-center border-b pb-5">
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Cộng hòa xã hội chủ nghĩa Việt Nam</p>
              <p className="text-xs text-gray-500 mb-3">Độc lập - Tự do - Hạnh phúc</p>
              <p className="text-xl font-bold" style={{ color: NAVY }}>HỢP ĐỒNG THUÊ NHÀ</p>
              <p className="text-sm text-gray-500 mt-1">Số: HD-2026-001</p>
            </div>

            {/* Các bên */}
            <div className="space-y-3">
              <p className="font-semibold" style={{ color: NAVY }}>Các bên tham gia hợp đồng</p>
              <div className="pl-4 space-y-2 text-gray-700">
                <p><span className="font-semibold">BÊN CHO THUÊ (Bên A):</span> Công ty TNHH Quản lý Nhà trọ XYZ</p>
                <p><span className="font-semibold">BÊN THUÊ (Bên B):</span> Nguyễn Văn A · CCCD: 012345678901</p>
              </div>
            </div>

            {/* Điều khoản */}
            <div className="space-y-3">
              <p className="font-semibold" style={{ color: NAVY }}>Điều khoản hợp đồng</p>
              <div className="rounded-xl border border-gray-100 overflow-hidden">
                {[
                  { label: 'Phòng thuê', value: 'P101 – Tầng 1, Loại VIP' },
                  { label: 'Thời hạn', value: '01/01/2026 → 31/12/2026 (12 tháng)' },
                  { label: 'Giá thuê', value: '3.500.000đ / tháng' },
                  { label: 'Tiền đặt cọc', value: '3.500.000đ (hoàn trả khi kết thúc HĐ)' },
                  { label: 'Ngày chốt tiền', value: 'Ngày 01 hàng tháng' },
                  { label: 'Trạng thái', value: 'Đang hiệu lực' },
                ].map((f, i) => (
                  <div key={f.label} className={`flex px-4 py-3 ${i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                    <span className="text-gray-500 w-44 shrink-0">{f.label}</span>
                    <span className="font-semibold text-gray-800">{f.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Thành viên */}
            <div className="space-y-3">
              <p className="font-semibold" style={{ color: NAVY }}>Thành viên ở cùng</p>
              <table className="w-full border border-gray-100 rounded-xl overflow-hidden text-sm">
                <thead style={{ background: NAVY }}>
                  <tr>
                    {['Họ và tên', 'Số CCCD', 'Vai trò', 'Ngày vào'].map(h => (
                      <th key={h} className="text-left px-3 py-2.5 text-white text-xs font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tenants.map((m, i) => (
                    <tr key={m.name} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-3 py-2.5 font-medium text-gray-800">{m.name}</td>
                      <td className="px-3 py-2.5 text-gray-600">{m.cccd}</td>
                      <td className="px-3 py-2.5">
                        <span className="text-xs font-semibold" style={{ color: m.role === 'Trưởng phòng' ? AMBER : '#6b7280' }}>
                          {m.role}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-gray-500">{m.joinDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Chữ ký */}
            <div className="grid grid-cols-2 gap-8 pt-4 border-t border-gray-100">
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">Bên A (Chủ nhà)</p>
                <p className="font-semibold text-gray-800 mt-10">Công ty TNHH XYZ</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">Bên B (Khách thuê)</p>
                <p className="font-semibold text-gray-800 mt-10">Nguyễn Văn A</p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition">
            Đóng
          </button>
          <button
            onClick={() => window.print()}
            className="px-5 py-2 rounded-lg text-white text-sm font-semibold transition flex items-center gap-2"
            style={{ background: NAVY }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            In hoặc lưu PDF
          </button>
        </div>
      </div>
    </div>
  );
}
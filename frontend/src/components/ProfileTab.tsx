const NAVY = '#0d2137';

const profileFields = [
  { label: 'Họ và tên', value: 'Nguyễn Văn A' },
  { label: 'Số CCCD/CMND', value: '012345678901 (Ngày cấp: 10/05/2021 · Nơi cấp: Cục CSQLHC)' },
  { label: 'Số điện thoại', value: '0987654321' },
  { label: 'Địa chỉ Email', value: 'nguyenvana@gmail.com' },
  { label: 'Địa chỉ thường trú', value: 'Số 123, Đường ABC, Quận XYZ, TP. Hà Nội', wide: true },
  { label: 'Liên hệ khẩn cấp', value: 'Bà Nguyễn Thị B (Mẹ · 0912345678)' },
];

export default function ProfileTab() {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        {/* Avatar & Tên */}
        <div className="flex items-center gap-4 mb-5">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-100 bg-gray-100 flex items-center justify-center text-gray-400 text-xl">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold" style={{ color: NAVY }}>Nguyễn Văn A</h3>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold text-emerald-700 bg-emerald-50 mt-1">
              ✓ Đã xác thực CCCD
            </span>
          </div>
        </div>

        {/* Danh sách thông tin */}
        <div className="border-t border-gray-100 pt-5">
          <p className="font-semibold text-sm mb-4" style={{ color: NAVY }}>Thông tin chi tiết</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
            {profileFields.map((f) => (
              <div key={f.label} className={f.wide ? 'md:col-span-2' : ''}>
                <p className="text-xs text-gray-400 mb-0.5">{f.label}</p>
                <p className="font-medium text-gray-800">{f.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
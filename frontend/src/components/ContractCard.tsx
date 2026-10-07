const NAVY = '#0d2137';
const AMBER = '#f59e0b';

export default function ContractCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header band */}
      <div className="px-6 py-4 flex items-center justify-between" style={{ background: NAVY }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.12)' }}>
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <p className="text-white font-bold text-base">HD-2026-001</p>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>Mã hợp đồng</p>
          </div>
        </div>
        <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-400 text-white">Đang hiệu lực</span>
      </div>

      {/* Info grid */}
      <div className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 pb-5 border-b border-gray-100">
          {[
            { label: 'Phòng thuê', value: 'P101 – Tầng 1' },
            { label: 'Loại phòng', value: 'VIP' },
            { label: 'Ngày bắt đầu', value: '01/01/2026' },
            { label: 'Ngày kết thúc', value: '31/12/2026' },
          ].map(f => (
            <div key={f.label}>
              <p className="text-xs text-gray-400 mb-0.5">{f.label}</p>
              <p className="font-semibold text-gray-800 text-sm">{f.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 pt-5">
          {[
            { label: 'Giá thuê / tháng', value: '3.500.000đ' },
            { label: 'Tiền đặt cọc', value: '3.500.000đ' },
            { label: 'Ngày chốt tiền', value: 'Ngày 01 hàng tháng' },
            { label: 'Còn lại', value: '3 tháng' },
          ].map(f => (
            <div key={f.label}>
              <p className="text-xs text-gray-400 mb-0.5">{f.label}</p>
              <p className="font-semibold text-gray-800 text-sm">{f.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-6 pb-5">
        <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
          <span>Tiến độ hợp đồng</span>
          <span style={{ color: AMBER }}>75% đã qua</span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full rounded-full" style={{ width: '75%', background: AMBER }} />
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>01/01/2026</span>
          <span>31/12/2026</span>
        </div>
      </div>
    </div>
  );
}
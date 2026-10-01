import { useState } from 'react'

const AMBER = '#f59e0b'
const NAVY = '#0d2137'

type Modal = 'renew' | 'print' | null

interface Member { name: string; cccd: string; role: string; joinDate: string }
interface HistoryItem { room: string; from: string; to: string; status: 'active' | 'ended'; contractId: string }

const members: Member[] = [
  { name: 'Nguyễn Văn A', cccd: '012345678901', role: 'Trưởng phòng', joinDate: '01/01/2026' },
  { name: 'Lê Văn Nam', cccd: '034567890123', role: 'Thành viên', joinDate: '15/01/2026' },
]

const history: HistoryItem[] = [
  { room: 'P002', from: '03/2024', to: '12/2024', status: 'ended', contractId: 'HD-2024-003' },
  { room: 'P101', from: '01/2026', to: 'Hiện tại', status: 'active', contractId: 'HD-2026-001' },
]

function RenewModal({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) {
  const [newEnd, setNewEnd] = useState('2027-12-31')
  const [note, setNote] = useState('')
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(11,11,12,0.55)' }} onClick={onClose}>
      <div className="bg-white rounded-2xl w-[480px] shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="px-6 py-5 border-b border-gray-100">
          <h3 className="text-base font-bold" style={{ color: NAVY }}>Gia hạn hợp đồng</h3>
          <p className="text-sm text-gray-400 mt-0.5">Yêu cầu gia hạn hợp đồng thuê phòng</p>
        </div>
        <div className="px-6 py-5 space-y-4">
          {/* Current info */}
          <div className="rounded-xl p-4 border border-gray-100" style={{ background: '#f8fafc' }}>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                { label: 'Mã hợp đồng', value: 'HD-2026-001' },
                { label: 'Phòng', value: 'P101' },
                { label: 'Ngày bắt đầu', value: '01/01/2026' },
                { label: 'Ngày kết thúc hiện tại', value: '31/12/2026' },
              ].map(f => (
                <div key={f.label}>
                  <p className="text-xs text-gray-400 mb-0.5">{f.label}</p>
                  <p className="font-semibold text-gray-800">{f.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Ngày kết thúc mới <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={newEnd}
              onChange={e => setNewEnd(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Ghi chú yêu cầu</label>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              rows={3}
              placeholder="Lý do gia hạn hoặc ghi chú thêm..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-amber-400 resize-none"
            />
          </div>

          <div className="rounded-lg px-4 py-3 text-sm" style={{ background: '#fffbeb', border: '1px solid #fde68a' }}>
            <p className="font-semibold text-amber-800 mb-0.5">Lưu ý</p>
            <p className="text-amber-700">Yêu cầu gia hạn sẽ được gửi đến chủ nhà để xét duyệt. Bạn sẽ nhận thông báo khi có kết quả.</p>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition">
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 rounded-lg text-white text-sm font-semibold transition"
            style={{ background: AMBER }}
          >
            Gửi yêu cầu gia hạn
          </button>
        </div>
      </div>
    </div>
  )
}

function PrintModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(11,11,12,0.55)' }} onClick={onClose}>
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
          {/* Document preview */}
          <div className="border border-gray-200 rounded-xl p-6 space-y-5 bg-white text-sm">
            {/* Header */}
            <div className="text-center border-b pb-5">
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Cộng hòa xã hội chủ nghĩa Việt Nam</p>
              <p className="text-xs text-gray-500 mb-3">Độc lập - Tự do - Hạnh phúc</p>
              <p className="text-xl font-bold" style={{ color: NAVY }}>HỢP ĐỒNG THUÊ NHÀ</p>
              <p className="text-sm text-gray-500 mt-1">Số: HD-2026-001</p>
            </div>

            {/* Parties */}
            <div className="space-y-3">
              <p className="font-semibold" style={{ color: NAVY }}>Các bên tham gia hợp đồng</p>
              <div className="pl-4 space-y-2 text-gray-700">
                <p><span className="font-semibold">BÊN CHO THUÊ (Bên A):</span> Công ty TNHH Quản lý Nhà trọ XYZ</p>
                <p><span className="font-semibold">BÊN THUÊ (Bên B):</span> Nguyễn Văn A · CCCD: 012345678901</p>
              </div>
            </div>

            {/* Contract terms */}
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

            {/* Members */}
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
                  {members.map((m, i) => (
                    <tr key={m.name} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-3 py-2.5 font-medium text-gray-800">{m.name}</td>
                      <td className="px-3 py-2.5 text-gray-600">{m.cccd}</td>
                      <td className="px-3 py-2.5">
                        <span className="text-xs font-semibold" style={{ color: m.role === 'Trưởng phòng' ? AMBER : '#6b7280' }}>{m.role}</span>
                      </td>
                      <td className="px-3 py-2.5 text-gray-500">{m.joinDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Signatures */}
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
  )
}

export default function TenantContracts() {
  const [modal, setModal] = useState<Modal>(null)
  const [toast, setToast] = useState<string | null>(null)

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 3500)
  }

  function handleRenewConfirm() {
    setModal(null)
    showToast('Đã gửi yêu cầu gia hạn thành công')
  }

  return (
    <div className="space-y-5">
      {/* Toast */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl text-white text-sm font-semibold"
          style={{ background: '#22c55e', minWidth: 260 }}>
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          {toast}
        </div>
      )}

      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold" style={{ color: NAVY }}>Hợp đồng của tôi</h2>
          <p className="text-sm text-gray-400 mt-0.5">Xem thông tin hợp đồng thuê phòng và thành viên ở cùng</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setModal('renew')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition border"
            style={{ color: AMBER, borderColor: AMBER }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Gia hạn
          </button>
          <button
            onClick={() => setModal('print')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-white text-sm font-semibold transition"
            style={{ background: NAVY }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            In hợp đồng
          </button>
        </div>
      </div>

      {/* Contract detail card */}
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
              { label: 'Phòng thuê', value: 'P101 – Tầng 1', icon: '🏠' },
              { label: 'Loại phòng', value: 'VIP', icon: '⭐' },
              { label: 'Ngày bắt đầu', value: '01/01/2026', icon: '📅' },
              { label: 'Ngày kết thúc', value: '31/12/2026', icon: '📅' },
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

      {/* Members */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base" style={{ color: NAVY }}>Thành viên ở cùng</h3>
            <p className="text-xs text-gray-400 mt-0.5">{members.length} thành viên trong phòng P101</p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-100">
            {members.length} thành viên
          </span>
        </div>
        <div className="divide-y divide-gray-50">
          {members.map((m, i) => (
            <div key={m.name} className="px-6 py-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                style={{ background: i === 0 ? AMBER : '#94a3b8' }}>
                {m.name.charAt(m.name.lastIndexOf(' ') + 1)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-gray-800 text-sm">{m.name}</p>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={i === 0 ? { background: '#fef3c7', color: AMBER } : { background: '#f1f5f9', color: '#6b7280' }}>
                    {m.role}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">CCCD: {m.cccd}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">Ngày vào</p>
                <p className="text-sm font-semibold text-gray-700">{m.joinDate}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rental history timeline */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-base" style={{ color: NAVY }}>Lịch sử thuê phòng</h3>
          <p className="text-xs text-gray-400 mt-0.5">Toàn bộ lịch sử thuê của bạn</p>
        </div>
        <div className="px-6 py-5">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-4 top-3 bottom-3 w-0.5 bg-gray-100" />
            <div className="space-y-6">
              {history.map((h, i) => (
                <div key={h.contractId} className="relative flex gap-4 pl-10">
                  {/* Dot */}
                  <div className="absolute left-2.5 top-1 w-3 h-3 rounded-full border-2 border-white shrink-0 z-10"
                    style={{ background: h.status === 'active' ? '#22c55e' : '#94a3b8', outline: `2px solid ${h.status === 'active' ? '#22c55e' : '#94a3b8'}`, outlineOffset: '1px' }} />
                  <div className="flex-1 rounded-xl border border-gray-100 p-4" style={{ background: h.status === 'active' ? '#f0fdf4' : '#f8fafc' }}>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-bold text-sm" style={{ color: NAVY }}>Phòng {h.room}</p>
                          {h.status === 'active' && (
                            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">Hiện tại</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{h.from} → {h.to}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400">Mã HĐ</p>
                        <p className="text-xs font-semibold" style={{ color: AMBER }}>{h.contractId}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {modal === 'renew' && <RenewModal onClose={() => setModal(null)} onConfirm={handleRenewConfirm} />}
      {modal === 'print' && <PrintModal onClose={() => setModal(null)} />}
    </div>
  )
}

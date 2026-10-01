import { useState, useRef, useEffect } from 'react'

const NAVY = '#0d2137'
const AMBER = '#f59e0b'

// ── Types ──────────────────────────────────────────────────────────────────
type TenantStatus = 'dang_thue' | 'cho_hop_dong' | 'da_roi_di'

interface RentalHistory {
  room: string
  contract: string
  from: string
  to: string | null
  status: 'da_ket_thuc' | 'dang_thue'
}

interface Tenant {
  id: string
  ho_ten: string
  cccd: string
  ngay_cap: string
  noi_cap: string
  sdt: string
  lien_he_khan_cap: string
  dia_chi: string
  phong: string | null
  tang: string | null
  ngay_vao_o: string
  hop_dong_hien_tai: string | null
  status: TenantStatus
  history: RentalHistory[]
}

// ── Mock data ──────────────────────────────────────────────────────────────
const initialTenants: Tenant[] = [
  {
    id: 'KT-00145', ho_ten: 'Nguyễn Minh Anh', cccd: '079201003421', ngay_cap: '18/06/2021', noi_cap: 'Cục Cảnh sát QLHC về TTXH',
    sdt: '0903 456 789', lien_he_khan_cap: 'Nguyễn Văn Hùng · 0918 322 116', dia_chi: '12 Nguyễn Trãi, Phường Bến Thành, Quận 1, TP.HCM',
    phong: 'P205', tang: 'Tầng 2', ngay_vao_o: '01/07/2024', hop_dong_hien_tai: 'HD-2024-033', status: 'dang_thue',
    history: [
      { room: 'P101', contract: 'HD-2024-001', from: '01/2024', to: '06/2024', status: 'da_ket_thuc' },
      { room: 'P205', contract: 'HD-2024-033', from: '07/2024', to: null, status: 'dang_thue' },
    ],
  },
  {
    id: 'KT-00144', ho_ten: 'Trần Hoàng Nam', cccd: '079199008734', ngay_cap: '10/03/2020', noi_cap: 'CA TP.HCM',
    sdt: '0987 120 456', lien_he_khan_cap: 'Trần Thị Hoa · 0901 234 567', dia_chi: '25 Lê Lợi, Q.1, TP.HCM',
    phong: 'P101', tang: 'Tầng 1', ngay_vao_o: '15/01/2026', hop_dong_hien_tai: 'HD-2026-001', status: 'dang_thue',
    history: [
      { room: 'P101', contract: 'HD-2026-001', from: '01/2026', to: null, status: 'dang_thue' },
    ],
  },
  {
    id: 'KT-00143', ho_ten: 'Lê Thu Trang', cccd: '048202001985', ngay_cap: '22/07/2022', noi_cap: 'CA tỉnh Bình Dương',
    sdt: '0938 774 220', lien_he_khan_cap: 'Lê Văn Bình · 0912 000 111', dia_chi: '5 Đinh Tiên Hoàng, Q.Bình Thạnh, TP.HCM',
    phong: null, tang: null, ngay_vao_o: '28/09/2026', hop_dong_hien_tai: null, status: 'cho_hop_dong',
    history: [],
  },
  {
    id: 'KT-00142', ho_ten: 'Phạm Quốc Bảo', cccd: '079198006512', ngay_cap: '15/01/2019', noi_cap: 'CA TP.HCM',
    sdt: '0912 680 333', lien_he_khan_cap: 'Phạm Thị Lan · 0933 444 555', dia_chi: '88 Cách Mạng Tháng 8, Q.3, TP.HCM',
    phong: 'P305', tang: 'Tầng 3', ngay_vao_o: '01/07/2025', hop_dong_hien_tai: 'HD-2025-010', status: 'dang_thue',
    history: [
      { room: 'P305', contract: 'HD-2025-010', from: '07/2025', to: null, status: 'dang_thue' },
    ],
  },
  {
    id: 'KT-00141', ho_ten: 'Vũ Ngọc Mai', cccd: '001303012740', ngay_cap: '05/05/2020', noi_cap: 'CA Hà Nội',
    sdt: '0966 215 889', lien_he_khan_cap: 'Vũ Đình Dũng · 0988 777 666', dia_chi: '10 Hàng Bông, Hoàn Kiếm, Hà Nội',
    phong: 'P402', tang: 'Tầng 4', ngay_vao_o: '01/09/2024', hop_dong_hien_tai: null, status: 'da_roi_di',
    history: [
      { room: 'P402', contract: 'HD-2024-020', from: '09/2024', to: '03/2026', status: 'da_ket_thuc' },
    ],
  },
  {
    id: 'KT-00140', ho_ten: 'Đỗ Anh Tuấn', cccd: '079200004118', ngay_cap: '12/02/2021', noi_cap: 'CA TP.HCM',
    sdt: '0908 702 611', lien_he_khan_cap: 'Đỗ Thị Nga · 0977 888 999', dia_chi: '3 Nguyễn Đình Chiểu, Q.3, TP.HCM',
    phong: 'P203', tang: 'Tầng 2', ngay_vao_o: '10/06/2024', hop_dong_hien_tai: null, status: 'da_roi_di',
    history: [
      { room: 'P203', contract: 'HD-2024-015', from: '06/2024', to: '12/2025', status: 'da_ket_thuc' },
    ],
  },
]

// ── Status configs ──────────────────────────────────────────────────────────
const statusCfg: Record<TenantStatus, { label: string; bg: string; color: string; border: string }> = {
  dang_thue:     { label: 'Đang thuê',      bg: '#ecfdf5', color: '#065f46', border: '#a7f3d0' },
  cho_hop_dong:  { label: 'Chờ hợp đồng',   bg: '#fff7ed', color: '#9a3412', border: '#fed7aa' },
  da_roi_di:     { label: 'Đã rời đi',       bg: '#f3f4f6', color: '#6b7280', border: '#e5e7eb' },
}

// ── Shared input style ──────────────────────────────────────────────────────
const inputCls = (err?: boolean) =>
  `w-full border rounded-lg px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-offset-0 ${
    err ? 'border-red-400 focus:ring-red-100 bg-red-50/30' : 'border-gray-200 focus:border-amber-400 focus:ring-amber-100'
  }`

// ── Add / Edit form modal ──────────────────────────────────────────────────
interface TenantFormProps {
  mode: 'add' | 'edit'
  initial?: Tenant
  onClose: () => void
  onSave: (t: Omit<Tenant, 'id' | 'phong' | 'tang' | 'ngay_vao_o' | 'hop_dong_hien_tai' | 'status' | 'history'>) => void
}

function TenantFormModal({ mode, initial, onClose, onSave }: TenantFormProps) {
  const [ho_ten, setHoTen]           = useState(initial?.ho_ten ?? '')
  const [cccd, setCccd]             = useState(initial?.cccd ?? '')
  const [ngay_cap, setNgayCap]       = useState(initial?.ngay_cap ?? '')
  const [noi_cap, setNoiCap]         = useState(initial?.noi_cap ?? '')
  const [sdt, setSdt]               = useState(initial?.sdt ?? '')
  const [lhkc, setLhkc]             = useState(initial?.lien_he_khan_cap ?? '')
  const [dia_chi, setDiaChi]         = useState(initial?.dia_chi ?? '')
  const [touched, setTouched]       = useState(false)
  const [success, setSuccess]       = useState(false)

  const errs = {
    ho_ten: !ho_ten.trim(),
    cccd:   cccd.replace(/\s/g,'').length !== 12,
    sdt:    sdt.replace(/\s/g,'').length < 10,
    dia_chi:!dia_chi.trim(),
  }
  const errCount = Object.values(errs).filter(Boolean).length

  function handleSubmit() {
    setTouched(true)
    if (errCount > 0) return
    onSave({ ho_ten, cccd, ngay_cap, noi_cap, sdt, lien_he_khan_cap: lhkc, dia_chi })
    if (mode === 'add') { setSuccess(true); setHoTen(''); setCccd(''); setNgayCap(''); setNoiCap(''); setSdt(''); setLhkc(''); setDiaChi(''); setTouched(false) }
  }

  const isAdd = mode === 'add'
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.4)' }} onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[620px] overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="px-6 pt-6 pb-4 border-b border-gray-100 flex items-start justify-between">
          <div>
            <h3 className="font-bold text-lg" style={{ color: NAVY }}>{isAdd ? 'Thêm khách thuê' : 'Chỉnh sửa thông tin khách thuê'}</h3>
            <p className="text-sm text-gray-400 mt-0.5">{isAdd ? 'Nhập thông tin định danh và liên hệ của khách thuê' : `Cập nhật hồ sơ ${initial?.id}`}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition mt-0.5">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* Success banner */}
          {success && (
            <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-emerald-200 bg-emerald-50">
              <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span className="text-sm font-semibold text-emerald-700">Thêm khách thuê thành công</span>
            </div>
          )}

          {/* Error banner */}
          {touched && errCount > 0 && (
            <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-red-200 bg-red-50">
              <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z" /></svg>
              <span className="text-sm text-red-600">Vui lòng kiểm tra {errCount} trường thông tin chưa hợp lệ.</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Họ tên <span className="text-red-500">*</span></label>
              <input value={ho_ten} onChange={e => setHoTen(e.target.value)} placeholder="Nhập thông tin" className={inputCls(touched && errs.ho_ten)} />
              {touched && errs.ho_ten && <p className="text-xs text-red-500 mt-1">Họ tên là bắt buộc</p>}
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">CCCD <span className="text-red-500">*</span></label>
              <input value={cccd} onChange={e => setCccd(e.target.value)} placeholder="Nhập thông tin" className={inputCls(touched && errs.cccd)} />
              {touched && errs.cccd && <p className="text-xs text-red-500 mt-1">CCCD phải gồm 12 chữ số</p>}
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Ngày cấp</label>
              <input value={ngay_cap} onChange={e => setNgayCap(e.target.value)} placeholder="DD/MM/YYYY" className={inputCls()} />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Nơi cấp</label>
              <input value={noi_cap} onChange={e => setNoiCap(e.target.value)} placeholder="Nhập thông tin" className={inputCls()} />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Số điện thoại</label>
              <input value={sdt} onChange={e => setSdt(e.target.value)} placeholder="Nhập thông tin" className={inputCls(touched && errs.sdt)} />
              {touched && errs.sdt && <p className="text-xs text-red-500 mt-1">Số điện thoại không đúng định dạng</p>}
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Liên hệ khẩn cấp</label>
              <input value={lhkc} onChange={e => setLhkc(e.target.value)} placeholder="Họ tên · Số điện thoại" className={inputCls()} />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Địa chỉ thường trú</label>
            <textarea value={dia_chi} onChange={e => setDiaChi(e.target.value)} placeholder="Nhập thông tin" rows={3}
              className={`${inputCls(touched && errs.dia_chi)} resize-none`} />
            {touched && errs.dia_chi && <p className="text-xs text-red-500 mt-1">Vui lòng nhập địa chỉ thường trú</p>}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex justify-between">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition">Hủy</button>
          <button onClick={handleSubmit} className="px-5 py-2 rounded-lg text-white text-sm font-semibold transition" style={{ background: AMBER }}>
            {isAdd ? 'Thêm khách thuê' : 'Lưu thay đổi'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Detail modal ────────────────────────────────────────────────────────────
function DetailModal({ tenant, onClose, onEdit }: { tenant: Tenant; onClose: () => void; onEdit: () => void }) {
  const s = statusCfg[tenant.status]
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.4)' }} onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[760px]" onClick={e => e.stopPropagation()}>
        <div className="px-6 pt-5 pb-4 border-b border-gray-100 flex items-start justify-between">
          <div>
            <h3 className="font-bold text-lg" style={{ color: NAVY }}>Chi tiết khách thuê</h3>
            <p className="text-sm text-gray-400 mt-0.5">{tenant.id} · Hồ sơ được cập nhật 28/09/2026</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition mt-0.5">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div className="flex gap-4">
            {/* Left info card */}
            <div className="flex-1 border border-gray-100 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold shrink-0" style={{ background: '#fef3c7', color: AMBER }}>
                  {tenant.ho_ten.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-base" style={{ color: NAVY }}>{tenant.ho_ten}</p>
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold border mt-0.5 inline-block"
                    style={{ background: s.bg, color: s.color, borderColor: s.border }}>{s.label}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                <div><p className="text-xs text-gray-400 mb-0.5">CCCD</p><p className="font-medium text-gray-800">{tenant.cccd}</p></div>
                <div><p className="text-xs text-gray-400 mb-0.5">Số điện thoại</p><p className="font-medium text-gray-800">{tenant.sdt}</p></div>
                <div className="col-span-2"><p className="text-xs text-gray-400 mb-0.5">Địa chỉ thường trú</p><p className="font-medium text-gray-800">{tenant.dia_chi}</p></div>
                <div className="col-span-2"><p className="text-xs text-gray-400 mb-0.5">Liên hệ khẩn cấp</p><p className="font-medium text-gray-800">{tenant.lien_he_khan_cap}</p></div>
              </div>
            </div>

            {/* Right stats card */}
            <div className="w-56 rounded-xl p-5 shrink-0" style={{ background: NAVY }}>
              <p className="font-bold text-sm text-white mb-4">Thống kê nhanh</p>
              <div className="space-y-3">
                <div><p className="text-[11px] text-white/50 mb-0.5">Phòng hiện tại</p><p className="text-sm font-bold text-white">{tenant.phong ? `${tenant.phong} · ${tenant.tang}` : '—'}</p></div>
                <div><p className="text-[11px] text-white/50 mb-0.5">Hợp đồng đang hiệu lực</p><p className="text-sm font-bold text-white">{tenant.hop_dong_hien_tai ?? '—'}</p></div>
                <div><p className="text-[11px] text-white/50 mb-0.5">Tổng số hợp đồng đã ký</p><p className="text-sm font-bold text-white">{tenant.history.length.toString().padStart(2,'0')} hợp đồng</p></div>
                <div><p className="text-[11px] text-white/50 mb-0.5">Tổng thời gian thuê</p><p className="text-sm font-bold text-white">02 năm 09 tháng</p></div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="border border-gray-100 rounded-xl p-4" style={{ background: '#fdf6ef' }}>
            <p className="font-semibold text-sm mb-3" style={{ color: NAVY }}>Timeline thuê phòng</p>
            <div className="space-y-2">
              {tenant.history.map((h, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: h.status === 'dang_thue' ? AMBER : NAVY }} />
                  <span className="text-sm font-semibold text-gray-800 w-12">{h.room}</span>
                  <span className="text-sm text-gray-500 flex-1">{h.from} → {h.to ?? 'Hiện tại'}</span>
                  <span className={`text-xs font-semibold ${h.status === 'dang_thue' ? 'text-emerald-600' : 'text-teal-600'}`}>
                    {h.status === 'dang_thue' ? 'Đang thuê' : 'Đã kết thúc'}
                  </span>
                </div>
              ))}
              {tenant.history.length === 0 && <p className="text-sm text-gray-400">Chưa có lịch sử thuê</p>}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex justify-between">
          <button onClick={onEdit} className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition">Sửa thông tin</button>
          <button onClick={onClose} className="px-5 py-2 rounded-lg text-white text-sm font-semibold transition" style={{ background: NAVY }}>Đóng</button>
        </div>
      </div>
    </div>
  )
}

// ── History modal ───────────────────────────────────────────────────────────
function HistoryModal({ tenant, onClose }: { tenant: Tenant; onClose: () => void }) {
  const first = tenant.history[0]
  const last  = tenant.history[tenant.history.length - 1]
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.4)' }} onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[760px]" onClick={e => e.stopPropagation()}>
        <div className="px-6 pt-5 pb-4 border-b border-gray-100 flex items-start justify-between">
          <div>
            <h3 className="font-bold text-lg" style={{ color: NAVY }}>Lịch sử thuê</h3>
            <p className="text-sm text-gray-400 mt-0.5">{tenant.ho_ten} · {tenant.id}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition mt-0.5">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* Timeline bar */}
          {tenant.history.length >= 2 && first && last && (
            <div className="flex items-stretch gap-0 rounded-xl overflow-hidden border border-gray-100" style={{ background: '#fdf6ef' }}>
              <div className="flex-1 px-5 py-4 border-r border-amber-200">
                <p className="text-xs font-semibold text-gray-500 mb-1">{first.from}</p>
                <p className="font-bold text-xl" style={{ color: NAVY }}>{first.room}</p>
                <p className="text-xs text-gray-400">{first.from} → {first.to ?? 'Hiện tại'}</p>
              </div>
              {/* Progress bar connector */}
              <div className="flex items-center px-4">
                <div className="h-1 w-24 rounded-full" style={{ background: AMBER }} />
              </div>
              <div className="flex-1 px-5 py-4">
                <p className="text-xs font-semibold mt-0.5 mb-1" style={{ color: AMBER }}>{last.from}</p>
                <p className="font-bold text-xl" style={{ color: AMBER }}>{last.room}</p>
                <p className="text-xs text-gray-400">{last.from} → {last.to ?? 'Hiện tại'}</p>
              </div>
            </div>
          )}

          {/* History table */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  {['Phòng','Hợp đồng','Thời gian','Trạng thái'].map(h => (
                    <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tenant.history.map((h, i) => (
                  <tr key={i} className="border-t border-gray-100">
                    <td className="px-4 py-3 font-semibold text-gray-800">{h.room}</td>
                    <td className="px-4 py-3 text-gray-600">{h.contract}</td>
                    <td className="px-4 py-3 text-gray-600">{h.from.replace('/','/').padStart(7,'0')} – {h.to ? h.to.replace('/','/') : 'Hiện tại'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                        h.status === 'dang_thue' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-teal-50 text-teal-700 border-teal-200'
                      }`}>
                        {h.status === 'dang_thue' ? 'Đang thuê' : 'Đã kết thúc'}
                      </span>
                    </td>
                  </tr>
                ))}
                {tenant.history.length === 0 && (
                  <tr><td colSpan={4} className="px-4 py-6 text-center text-gray-400 text-sm">Chưa có lịch sử thuê</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex justify-between">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition">Đóng</button>
          <button className="px-5 py-2 rounded-lg text-white text-sm font-semibold transition" style={{ background: AMBER }}>Tạo hợp đồng</button>
        </div>
      </div>
    </div>
  )
}

// ── Delete modal ─────────────────────────────────────────────────────────────
function DeleteModal({ tenant, onClose, onConfirm }: { tenant: Tenant; onClose: () => void; onConfirm: () => void }) {
  const hasContract = !!tenant.hop_dong_hien_tai
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.4)' }} onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[480px]" onClick={e => e.stopPropagation()}>
        <div className="px-6 pt-5 pb-4 border-b border-gray-100 flex items-start justify-between">
          <div>
            <h3 className="font-bold text-lg" style={{ color: NAVY }}>Xóa khách thuê?</h3>
            <p className="text-sm text-gray-400 mt-0.5">Bạn đang xóa hồ sơ {tenant.id}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition mt-0.5">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="px-6 py-5 space-y-3">
          {hasContract && (
            <div className="flex items-start gap-3 px-4 py-3 rounded-xl border border-red-200 bg-red-50">
              <svg className="w-4 h-4 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z" /></svg>
              <div>
                <p className="text-sm font-semibold text-red-700">Không thể xóa khách thuê này</p>
                <p className="text-xs text-red-600 mt-0.5">Dữ liệu đang được sử dụng trong hợp đồng {tenant.hop_dong_hien_tai}. Hãy thanh lý hợp đồng trước khi xóa hồ sơ.</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-amber-200 bg-amber-50">
            <svg className="w-4 h-4 shrink-0" style={{ color: AMBER }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
            <span className="text-sm font-semibold text-amber-800">Dữ liệu đang được sử dụng</span>
          </div>

          <div className="rounded-xl p-4 border border-gray-100" style={{ background: '#fdf6ef' }}>
            <div className="text-xs text-gray-400 mb-0.5">Khách thuê</div>
            <div className="font-bold text-sm text-gray-800 mb-3">{tenant.ho_ten}</div>
            <div className="text-xs text-gray-400 mb-0.5">Phòng hiện tại</div>
            <div className="font-medium text-sm text-gray-800 mb-3">{tenant.phong ?? '—'}</div>
            <div className="text-xs text-gray-400 mb-0.5">Hợp đồng hiệu lực</div>
            <div className="font-bold text-sm text-gray-800">{tenant.hop_dong_hien_tai ?? '—'}</div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex justify-between">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition">Hủy</button>
          <button onClick={onConfirm} className="px-5 py-2 rounded-lg text-white text-sm font-semibold transition" style={{ background: '#ef4444' }}>Xóa khách thuê</button>
        </div>
      </div>
    </div>
  )
}

// ── Row action dropdown ─────────────────────────────────────────────────────
function ActionDropdown({ onDetail, onEdit, onHistory, onDelete }: { onDetail: () => void; onEdit: () => void; onHistory: () => void; onDelete: () => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handler(e: MouseEvent) { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(v => !v)} className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 transition">
        <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24"><circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/></svg>
      </button>
      {open && (
        <div className="absolute right-0 top-8 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-20 w-44">
          {[
            { label: 'Xem chi tiết', icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z', action: onDetail },
            { label: 'Sửa thông tin', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z', action: onEdit },
            { label: 'Xem lịch sử thuê', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', action: onHistory },
          ].map(item => (
            <button key={item.label} onClick={() => { setOpen(false); item.action() }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition">
              <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={item.icon} /></svg>
              {item.label}
            </button>
          ))}
          <div className="border-t border-gray-100 my-1" />
          <button onClick={() => { setOpen(false); onDelete() }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition">
            <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            Xóa
          </button>
        </div>
      )}
    </div>
  )
}

// ── Main page ───────────────────────────────────────────────────────────────
export default function Tenants() {
  const [tenants, setTenants]           = useState<Tenant[]>(initialTenants)
  const [search, setSearch]             = useState('')
  const [filterTab, setFilterTab]       = useState<'all' | TenantStatus>('all')
  const [modal, setModal]               = useState<
    | { type: 'add' }
    | { type: 'edit';    tenant: Tenant }
    | { type: 'detail';  tenant: Tenant }
    | { type: 'history'; tenant: Tenant }
    | { type: 'delete';  tenant: Tenant }
    | null
  >(null)

  const filtered = tenants.filter(t => {
    const q = search.toLowerCase()
    const matchSearch = t.ho_ten.toLowerCase().includes(q) || t.cccd.includes(q) || t.sdt.includes(q)
    const matchTab = filterTab === 'all' || t.status === filterTab
    return matchSearch && matchTab
  })

  function handleAdd(data: Parameters<typeof TenantFormModal>[0]['onSave'] extends (t: infer T) => void ? T : never) {
    const newId = `KT-${String(Math.max(...tenants.map(t => parseInt(t.id.replace('KT-','')))) + 1).padStart(5,'0')}`
    setTenants(prev => [{ id: newId, ...data, phong: null, tang: null, ngay_vao_o: new Date().toLocaleDateString('vi-VN'), hop_dong_hien_tai: null, status: 'cho_hop_dong', history: [] }, ...prev])
  }

  function handleEdit(id: string, data: Parameters<typeof TenantFormModal>[0]['onSave'] extends (t: infer T) => void ? T : never) {
    setTenants(prev => prev.map(t => t.id === id ? { ...t, ...data } : t))
    setModal(null)
  }

  function handleDelete(id: string) {
    setTenants(prev => prev.filter(t => t.id !== id))
    setModal(null)
  }

  const tabs: { key: 'all' | TenantStatus; label: string }[] = [
    { key: 'all',           label: 'Tất cả' },
    { key: 'dang_thue',     label: 'Đang thuê' },
    { key: 'cho_hop_dong',  label: 'Chờ hợp đồng' },
  ]

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
            <span>Tổng quan</span><span>/</span><span className="font-semibold" style={{ color: NAVY }}>Khách thuê</span>
          </div>
          <h2 className="text-2xl font-bold" style={{ color: NAVY }}>Danh sách khách thuê</h2>
        </div>
        <button onClick={() => setModal({ type: 'add' })}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition"
          style={{ background: AMBER }}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
          + Thêm khách thuê
        </button>
      </div>

      {/* Empty state */}
      {tenants.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center" style={{ background: '#fef3c7' }}>
            <svg className="w-10 h-10" style={{ color: AMBER }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </div>
          <div className="text-center">
            <p className="font-bold text-lg text-gray-800 mb-1">Chưa có khách thuê</p>
            <p className="text-sm text-gray-400">Thêm khách thuê đầu tiên để bắt đầu quản lý</p>
          </div>
          <button onClick={() => setModal({ type: 'add' })} className="px-5 py-2.5 rounded-xl text-white font-semibold text-sm" style={{ background: AMBER }}>+ Thêm khách thuê</button>
        </div>
      ) : (
        /* Tenant list table */
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Toolbar */}
          <div className="px-4 py-3 border-b border-gray-100 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm theo Tên / Số CCCD / SDT"
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400 bg-gray-50" />
            </div>
            <div className="flex items-center gap-1.5">
              {tabs.map(tab => (
                <button key={tab.key} onClick={() => setFilterTab(tab.key)}
                  className="px-3 py-1.5 rounded-lg text-sm font-semibold transition"
                  style={filterTab === tab.key ? { background: AMBER, color: 'white' } : { background: 'transparent', color: '#6b7280' }}
                  onMouseEnter={e => { if (filterTab !== tab.key) e.currentTarget.style.background = '#f3f4f6' }}
                  onMouseLeave={e => { if (filterTab !== tab.key) e.currentTarget.style.background = 'transparent' }}>
                  {tab.label}
                </button>
              ))}
            </div>
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition ml-auto">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Xuất dữ liệu
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[900px]">
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  {['Mã khách thuê','Họ tên','CCCD','Số điện thoại','Phòng hiện tại','Ngày vào ở','Trạng thái','Hành động'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 border-b border-gray-100 whitespace-nowrap uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((t, i) => {
                  const s = statusCfg[t.status]
                  return (
                    <tr key={t.id} className={`border-t border-gray-50 hover:bg-gray-50/60 transition-colors ${i % 2 === 1 ? 'bg-gray-50/20' : ''}`}>
                      <td className="px-4 py-3 font-mono text-xs font-semibold text-gray-500">{t.id}</td>
                      <td className="px-4 py-3 font-semibold text-gray-800">{t.ho_ten}</td>
                      <td className="px-4 py-3 text-gray-600 font-mono text-xs">{t.cccd}</td>
                      <td className="px-4 py-3 text-gray-600">{t.sdt}</td>
                      <td className="px-4 py-3 text-gray-600">{t.phong ?? <span className="text-gray-300">—</span>}</td>
                      <td className="px-4 py-3 text-gray-600 text-xs">{t.ngay_vao_o}</td>
                      <td className="px-4 py-3">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold border whitespace-nowrap"
                          style={{ background: s.bg, color: s.color, borderColor: s.border }}>{s.label}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => setModal({ type: 'detail', tenant: t })}
                            className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 transition">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                          </button>
                          <ActionDropdown
                            onDetail={() => setModal({ type: 'detail', tenant: t })}
                            onEdit={() => setModal({ type: 'edit', tenant: t })}
                            onHistory={() => setModal({ type: 'history', tenant: t })}
                            onDelete={() => setModal({ type: 'delete', tenant: t })}
                          />
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-400">Hiển thị 1–{filtered.length} trong tổng số {tenants.length} khách thuê</p>
            <div className="flex items-center gap-1.5">
              <button className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition">Trước</button>
              <button className="w-8 h-8 rounded-lg text-sm font-semibold text-white" style={{ background: AMBER }}>1</button>
              <button className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition">Sau</button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {modal?.type === 'add' && (
        <TenantFormModal mode="add" onClose={() => setModal(null)} onSave={handleAdd} />
      )}
      {modal?.type === 'edit' && (
        <TenantFormModal mode="edit" initial={modal.tenant} onClose={() => setModal(null)}
          onSave={data => handleEdit(modal.tenant.id, data)} />
      )}
      {modal?.type === 'detail' && (
        <DetailModal tenant={modal.tenant} onClose={() => setModal(null)}
          onEdit={() => setModal({ type: 'edit', tenant: modal.tenant })} />
      )}
      {modal?.type === 'history' && (
        <HistoryModal tenant={modal.tenant} onClose={() => setModal(null)} />
      )}
      {modal?.type === 'delete' && (
        <DeleteModal tenant={modal.tenant} onClose={() => setModal(null)}
          onConfirm={() => handleDelete(modal.tenant.id)} />
      )}
    </div>
  )
}

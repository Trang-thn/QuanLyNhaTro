import { useState, useEffect } from 'react'

const AMBER = '#f59e0b'
const NAVY = '#0d2137'

type Status = 'co_hoa_don' | 'da_nhap' | 'chua_nhap'

interface UtilityRow {
  id: string
  tenantName: string
  room: string
  prevElec: number | null
  newElec: number | null
  prevWater: number | null
  newWater: number | null
  dateRecorded: string | null
  status: Status
}

const initialRows: UtilityRow[] = [
  { id: '1', tenantName: 'Nguyễn Văn An',        room: 'P101', prevElec: 1200, newElec: 1285, prevWater: 45, newWater: 52, dateRecorded: '28/09/2026', status: 'co_hoa_don' },
  { id: '2', tenantName: 'Trần Thị Bích',         room: 'P102', prevElec: 980,  newElec: 1042, prevWater: 38, newWater: 38, dateRecorded: '28/09/2026', status: 'da_nhap' },
  { id: '3', tenantName: 'Lê Đức Huy',            room: 'P203', prevElec: 1285, newElec: null,  prevWater: 52, newWater: null, dateRecorded: null, status: 'chua_nhap' },
  { id: '4', tenantName: 'Phạm Minh Châu',        room: 'P204', prevElec: 620,  newElec: null,  prevWater: 30, newWater: null, dateRecorded: null, status: 'chua_nhap' },
  { id: '5', tenantName: 'Nguyễn Ngọc Hà',        room: 'P301', prevElec: 870,  newElec: null,  prevWater: 41, newWater: null, dateRecorded: null, status: 'chua_nhap' },
  { id: '6', tenantName: 'Trần Quốc Long',         room: 'P302', prevElec: 1100, newElec: null,  prevWater: 48, newWater: null, dateRecorded: null, status: 'chua_nhap' },
  { id: '7', tenantName: 'Phòng Gia Bảo (thuê mới)', room: 'P303', prevElec: 0,  newElec: null, prevWater: 0,  newWater: null, dateRecorded: null, status: 'chua_nhap' },
]

const statusConfig: Record<Status, { label: string; bg: string; color: string; border: string }> = {
  co_hoa_don: { label: 'Đã có hóa đơn', bg: '#ecfdf5', color: '#065f46', border: '#a7f3d0' },
  da_nhap:    { label: 'Đã nhập',        bg: '#eff6ff', color: '#1e40af', border: '#bfdbfe' },
  chua_nhap:  { label: 'Chưa nhập',      bg: '#f9fafb', color: '#6b7280', border: '#e5e7eb' },
}

/* ─── Input modal ─── */
interface InputModalProps {
  row: UtilityRow
  mode: 'nhap' | 'sua'
  period: string
  onClose: () => void
  onSave: (id: string, newElec: number, newWater: number, date: string) => void
}

function UtilityModal({ row, mode, period, onClose, onSave }: InputModalProps) {
  const [newElec, setNewElec]   = useState(row.newElec != null ? String(row.newElec) : '')
  const [newWater, setNewWater] = useState(row.newWater != null ? String(row.newWater) : '')
  const [date, setDate]         = useState(row.dateRecorded ?? '')
  const [touched, setTouched]   = useState({ elec: false, water: false, date: false })

  const prevElec  = row.prevElec  ?? 0
  const prevWater = row.prevWater ?? 0
  const elecNum   = parseInt(newElec,  10)
  const waterNum  = parseInt(newWater, 10)
  const elecOk    = !isNaN(elecNum)  && elecNum  >= prevElec
  const waterOk   = !isNaN(waterNum) && waterNum >= prevWater
  const dateOk    = date.trim().length > 0
  const consumption = {
    elec:  elecOk  ? elecNum  - prevElec  : null,
    water: waterOk ? waterNum - prevWater : null,
  }
  const canSave = elecOk && waterOk && dateOk

  const isNhap = mode === 'nhap'
  const title    = isNhap ? 'Nhập chỉ số điện/nước' : 'Sửa chỉ số điện/nước'
  const subtitle = isNhap ? `Chỉ nhập chỉ số mới cho kỳ tháng ${period}` : `Cập nhật bản ghi đã có của kỳ tháng ${period}`
  const btnLabel = isNhap ? 'Lưu chỉ số' : 'Lưu thay đổi'

  function handleSave() {
    setTouched({ elec: true, water: true, date: true })
    if (!canSave) return
    onSave(row.id, elecNum, waterNum, date)
  }

  const inputBase = 'flex-1 border rounded-lg px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-offset-0'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.45)' }} onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[480px] max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        {/* Modal header */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-bold text-lg" style={{ color: NAVY }}>{title}</h3>
              <p className="text-sm text-gray-400 mt-0.5">{subtitle}</p>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition mt-0.5 shrink-0">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Info row */}
          <div className="mt-4 grid grid-cols-4 gap-2 text-xs">
            <div><p className="text-gray-400 mb-0.5">Người thuê</p><p className="font-semibold text-gray-800">{row.tenantName}</p></div>
            <div><p className="text-gray-400 mb-0.5">Phòng</p><p className="font-semibold text-gray-800">{row.room}</p></div>
            <div><p className="text-gray-400 mb-0.5">Kỳ ghi</p><p className="font-semibold text-gray-800">{period.replace('Tháng ', '').replace(' ', '/')}</p></div>
            <div>
              <p className="text-gray-400 mb-0.5">Trạng thái</p>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold"
                style={{ background: statusConfig[row.status].bg, color: statusConfig[row.status].color, border: `1px solid ${statusConfig[row.status].border}` }}>
                {statusConfig[row.status].label}
              </span>
            </div>
          </div>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Electricity section */}
          <section>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: '#fef3c7' }}>
                <svg className="w-3.5 h-3.5" style={{ color: AMBER }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="font-semibold text-sm" style={{ color: NAVY }}>Chỉ số điện</span>
            </div>
            <p className="text-xs text-gray-400 mb-3">Mức tiêu thụ kWh được tự tính từ sự chênh lệch chỉ số.</p>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">Điện cũ</label>
                <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
                  <span className="text-sm text-gray-500 font-medium">{prevElec}</span>
                  <span className="text-xs text-gray-400 ml-1">kWh</span>
                </div>
                <p className="text-[10px] text-gray-400 mt-0.5">Từ trước</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Điện mới <span style={{ color: '#e53e3e' }}>*</span></label>
                <div className={`flex items-center border rounded-lg px-3 py-2 transition focus-within:ring-2 ${touched.elec && !elecOk ? 'border-red-400 focus-within:ring-red-200' : 'border-gray-300 focus-within:ring-amber-200 focus-within:border-amber-400'}`}>
                  <input
                    type="number" placeholder="Nhập chỉ số"
                    value={newElec}
                    onChange={e => setNewElec(e.target.value)}
                    onBlur={() => setTouched(t => ({ ...t, elec: true }))}
                    className="flex-1 text-sm outline-none bg-transparent w-0"
                  />
                  <span className="text-xs text-gray-400 ml-1 shrink-0">kWh</span>
                </div>
                {touched.elec && !elecOk && (
                  <p className="text-[11px] text-red-500 mt-0.5 flex items-center gap-0.5">
                    <span>⚠</span> Vui lòng nhập điện mới!
                  </p>
                )}
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">Tiêu thụ</label>
                <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
                  <span className="text-sm text-gray-500">{consumption.elec != null ? consumption.elec : 'Tự tính'}</span>
                  {consumption.elec != null && <span className="text-xs text-gray-400 ml-1">kWh</span>}
                </div>
                <p className="text-[10px] text-gray-400 mt-0.5">Điện mới − điện cũ</p>
              </div>
            </div>
            <p className="text-[11px] text-gray-400 mt-2">Chỉ nhập số không âm. Chỉ số mới không được nhỏ hơn chỉ số cũ.</p>
          </section>

          {/* Water section */}
          <section>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: '#eff6ff' }}>
                <svg className="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C6 8 4 12 4 14a8 8 0 0016 0c0-2-2-6-8-12z" />
                </svg>
              </div>
              <span className="font-semibold text-sm" style={{ color: NAVY }}>Chỉ số nước</span>
            </div>
            <p className="text-xs text-gray-400 mb-3">Mức tiêu thụ m³ được tự tính từ sự chênh lệch chỉ số.</p>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">Nước cũ</label>
                <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
                  <span className="text-sm text-gray-500 font-medium">{prevWater}</span>
                  <span className="text-xs text-gray-400 ml-1">m³</span>
                </div>
                <p className="text-[10px] text-gray-400 mt-0.5">Từ trước</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Nước mới <span style={{ color: '#e53e3e' }}>*</span></label>
                <div className={`flex items-center border rounded-lg px-3 py-2 transition focus-within:ring-2 ${touched.water && !waterOk ? 'border-red-400 focus-within:ring-red-200' : 'border-gray-300 focus-within:ring-amber-200 focus-within:border-amber-400'}`}>
                  <input
                    type="number" placeholder="Nhập chỉ số"
                    value={newWater}
                    onChange={e => setNewWater(e.target.value)}
                    onBlur={() => setTouched(t => ({ ...t, water: true }))}
                    className="flex-1 text-sm outline-none bg-transparent w-0"
                  />
                  <span className="text-xs text-gray-400 ml-1 shrink-0">m³</span>
                </div>
                {touched.water && !waterOk && (
                  <p className="text-[11px] text-red-500 mt-0.5 flex items-center gap-0.5">
                    <span>⚠</span> Vui lòng nhập nước mới!
                  </p>
                )}
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">Tiêu thụ</label>
                <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
                  <span className="text-sm text-gray-500">{consumption.water != null ? consumption.water : 'Tự tính'}</span>
                  {consumption.water != null && <span className="text-xs text-gray-400 ml-1">m³</span>}
                </div>
                <p className="text-[10px] text-gray-400 mt-0.5">Nước mới − nước cũ</p>
              </div>
            </div>
            <p className="text-[11px] text-gray-400 mt-2">Chỉ nhập số không âm. Chỉ số mới không được nhỏ hơn chỉ số cũ.</p>
          </section>

          {/* Date section */}
          <section>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded-full flex items-center justify-center bg-gray-100">
                <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="font-semibold text-sm" style={{ color: NAVY }}>Ngày ghi</span>
            </div>
            <p className="text-xs text-gray-400 mb-3">Ngày nhân viên thực tế chốt chỉ số.</p>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Ngày ghi <span style={{ color: '#e53e3e' }}>*</span></label>
                <input
                  type="text" placeholder="dd/mm/yyyy"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  onBlur={() => setTouched(t => ({ ...t, date: true }))}
                  className={`w-full border rounded-lg px-3 py-2 text-sm outline-none transition focus:ring-2 ${touched.date && !dateOk ? 'border-red-400 focus:ring-red-200' : 'border-gray-300 focus:ring-amber-200 focus:border-amber-400'}`}
                />
                {touched.date && !dateOk && (
                  <p className="text-[11px] text-red-500 mt-0.5 flex items-center gap-0.5">
                    <span>⚠</span> Vui lòng chọn ngày ghi.
                  </p>
                )}
              </div>
              <div className="flex items-end pb-1">
                <p className="text-xs text-gray-400">Ngày ghi là bắt buộc</p>
              </div>
            </div>
          </section>

          {/* Summary panel */}
          <div className="rounded-xl p-4" style={{ background: '#eff6ff' }}>
            <div className="flex items-center gap-2 mb-1">
              <svg className="w-4 h-4 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs font-semibold text-blue-800">Tổng mức tiêu thụ kỳ này</p>
            </div>
            <p className="text-sm font-bold text-blue-900 ml-6">
              {consumption.elec != null ? consumption.elec : '—'} kWh điện + {consumption.water != null ? consumption.water : '—'} m³ nước
            </p>
            <p className="text-xs text-blue-600 ml-6 mt-0.5">Tự tính tổng chi ở đầu hóa đơn</p>
          </div>

          <p className="text-xs text-gray-400 text-center">Hãy điền popup để khởi tạo dữ liệu thay thế</p>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition">Hủy</button>
          <button onClick={handleSave} className="px-5 py-2 rounded-lg text-white text-sm font-semibold transition" style={{ background: NAVY, opacity: canSave ? 1 : 0.7 }}>
            {btnLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── Main page ─── */
export default function Utilities() {
  const [rows, setRows] = useState<UtilityRow[]>(initialRows)
  const [search, setSearch]   = useState('')
  const [month, setMonth]     = useState('9')
  const [year, setYear]       = useState('2026')
  const [roomFilter, setRoomFilter] = useState('all')
  const [modal, setModal] = useState<{ row: UtilityRow; mode: 'nhap' | 'sua' } | null>(null)

  const entered = rows.filter(r => r.status !== 'chua_nhap').length
  const total   = rows.length
  const period  = `Tháng ${month} ${year}`

  const filtered = rows.filter(r => {
    const q = search.toLowerCase()
    const matchSearch = r.tenantName.toLowerCase().includes(q) || r.room.toLowerCase().includes(q)
    const matchRoom = roomFilter === 'all' || r.room === roomFilter
    return matchSearch && matchRoom
  })

  function handleSave(id: string, newElec: number, newWater: number, date: string) {
    setRows(prev => prev.map(r => {
      if (r.id !== id) return r
      const wasChuaNhap = r.status === 'chua_nhap'
      return { ...r, newElec, newWater, dateRecorded: date, status: wasChuaNhap ? 'da_nhap' : r.status }
    }))
    setModal(null)
  }

  const months = ['1','2','3','4','5','6','7','8','9','10','11','12']
  const years  = ['2025','2026','2027']

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold" style={{ color: NAVY }}>Chỉ số điện/nước</h2>
          <p className="text-sm text-gray-400 mt-0.5">Nhập số điện, nước mới mỗi tháng. Nhập tạo bản ghi mới. Sửa cập nhật bản ghi đã có.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-amber-200 shrink-0" style={{ background: '#fef9ec' }}>
          <svg className="w-4 h-4 shrink-0" style={{ color: AMBER }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z" />
          </svg>
          <span className="text-sm font-semibold" style={{ color: '#92400e' }}>Đã ghi {entered}/{total} phòng</span>
        </div>
      </div>

      {/* Filters + action */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[180px]">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              placeholder="Tìm kiếm theo tên người thuê..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400 bg-gray-50 focus:bg-white transition"
            />
          </div>

          <select value={month} onChange={e => setMonth(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400 bg-white">
            {months.map(m => <option key={m} value={m}>Tháng {m}</option>)}
          </select>

          <select value={year} onChange={e => setYear(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400 bg-white">
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>

          <select value={roomFilter} onChange={e => setRoomFilter(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400 bg-white">
            <option value="all">Tất cả phòng</option>
            {rows.map(r => <option key={r.id} value={r.room}>{r.room}</option>)}
          </select>

          <button
            onClick={() => {
              const firstUnrecorded = rows.find(r => r.status === 'chua_nhap')
              if (firstUnrecorded) setModal({ row: firstUnrecorded, mode: 'nhap' })
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-white text-sm font-semibold transition shrink-0"
            style={{ background: NAVY }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nhập chỉ số
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[900px]">
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['Người thuê', 'Điện cũ', 'Điện mới', 'Dùng (kWh)', 'Nước cũ', 'Nước mới', 'Dùng (m³)', 'Ngày ghi', 'Trạng thái', 'Thao tác'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 border-b border-gray-100 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, i) => {
                const consumption = {
                  elec:  (row.prevElec != null && row.newElec  != null) ? row.newElec  - row.prevElec  : null,
                  water: (row.prevWater != null && row.newWater != null) ? row.newWater - row.prevWater : null,
                }
                const s = statusConfig[row.status]
                const isChua = row.status === 'chua_nhap'

                return (
                  <tr key={row.id} className={`border-t border-gray-50 hover:bg-gray-50/60 transition-colors ${i % 2 === 1 ? 'bg-gray-50/30' : ''}`}>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-800">{row.tenantName}</p>
                      <p className="text-xs text-gray-400">{row.room}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{row.prevElec ?? '—'}</td>
                    <td className="px-4 py-3 text-gray-700 font-medium">{row.newElec ?? <span className="text-gray-300">—</span>}</td>
                    <td className="px-4 py-3">
                      {consumption.elec != null
                        ? <span className="font-semibold" style={{ color: NAVY }}>{consumption.elec}</span>
                        : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{row.prevWater ?? '—'}</td>
                    <td className="px-4 py-3 text-gray-700 font-medium">{row.newWater ?? <span className="text-gray-300">—</span>}</td>
                    <td className="px-4 py-3">
                      {consumption.water != null
                        ? <span className="font-semibold" style={{ color: NAVY }}>{consumption.water}</span>
                        : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{row.dateRecorded ?? <span className="text-gray-300">—</span>}</td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold border whitespace-nowrap"
                        style={{ background: s.bg, color: s.color, borderColor: s.border }}>
                        {s.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setModal({ row, mode: 'nhap' })}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-white text-xs font-semibold transition"
                          style={{ background: isChua ? AMBER : NAVY }}
                        >
                          Nhập
                        </button>
                        <button
                          onClick={() => setModal({ row, mode: 'sua' })}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition hover:bg-gray-50"
                          style={{ color: '#2563eb', borderColor: '#bfdbfe', background: '#eff6ff' }}
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Sửa
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <svg className="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Đã nhập {entered}/{total} phòng. Số còn lại tự tính mỗi của tháng trước.
          </div>
          <p className="text-xs text-gray-400">Hiển thị 1–{filtered.length}/{total} phòng</p>
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <UtilityModal
          row={modal.row}
          mode={modal.mode}
          period={period}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
    </div>
  )
}

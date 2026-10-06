import { useState } from 'react'
import { AMBER, NAVY, statusConfig } from '../../types/Utilities/utility'
import type { UtilityRow }  from '../../types/Utilities/utility'

/* ─── Input modal ─── */
interface InputModalProps {
  row: UtilityRow
  mode: 'nhap' | 'sua'
  period: string
  onClose: () => void
  onSave: (id: string, newElec: number, newWater: number, date: string) => void
}

export default function UtilityModal({ row, mode, period, onClose, onSave }: InputModalProps) {
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
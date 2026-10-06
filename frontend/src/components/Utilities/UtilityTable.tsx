import { AMBER, NAVY, statusConfig } from '../../types/Utilities/utility'
import type { UtilityRow } from '../../types/Utilities/utility'

interface UtilityTableProps {
  filtered: UtilityRow[]
  entered: number
  total: number
  setModal: (modal: { row: UtilityRow; mode: 'nhap' | 'sua' }) => void
}

export default function UtilityTable({ filtered, entered, total, setModal }: UtilityTableProps) {
  return (
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
  )
}
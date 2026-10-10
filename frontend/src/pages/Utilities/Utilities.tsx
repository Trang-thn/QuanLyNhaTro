import { useState, useEffect } from 'react'
import { AMBER, NAVY } from '../../types/Utilities/utility'
import type { UtilityRow } from '../../types/Utilities/utility'
import UtilityModal from '../../components/Utilities/UtilityFormModal'
import UtilityTable from '../../components/Utilities/UtilityTable'

const initialRows: UtilityRow[] = [
  { id: '1', tenantName: 'Nguyễn Văn An',        room: 'P101', prevElec: 1200, newElec: 1285, prevWater: 45, newWater: 52, dateRecorded: '28/09/2026', status: 'co_hoa_don' },
  { id: '2', tenantName: 'Trần Thị Bích',         room: 'P102', prevElec: 980,  newElec: 1042, prevWater: 38, newWater: 38, dateRecorded: '28/09/2026', status: 'da_nhap' },
  { id: '3', tenantName: 'Lê Đức Huy',            room: 'P203', prevElec: 1285, newElec: null,  prevWater: 52, newWater: null, dateRecorded: null, status: 'chua_nhap' },
  { id: '4', tenantName: 'Phạm Minh Châu',        room: 'P204', prevElec: 620,  newElec: null,  prevWater: 30, newWater: null, dateRecorded: null, status: 'chua_nhap' },
  { id: '5', tenantName: 'Nguyễn Ngọc Hà',        room: 'P301', prevElec: 870,  newElec: null,  prevWater: 41, newWater: null, dateRecorded: null, status: 'chua_nhap' },
  { id: '6', tenantName: 'Trần Quốc Long',         room: 'P302', prevElec: 1100, newElec: null,  prevWater: 48, newWater: null, dateRecorded: null, status: 'chua_nhap' },
  { id: '7', tenantName: 'Phòng Gia Bảo (thuê mới)', room: 'P303', prevElec: 0,  newElec: null, prevWater: 0,  newWater: null, dateRecorded: null, status: 'chua_nhap' },
]

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
      <UtilityTable filtered={filtered} entered={entered} total={total} setModal={setModal} />

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
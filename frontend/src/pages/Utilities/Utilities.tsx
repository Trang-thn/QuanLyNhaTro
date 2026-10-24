import { useState, useEffect } from 'react'
import { AMBER, NAVY } from '../../types/Utilities/utility'
import type { UtilityRow, Status } from '../../types/Utilities/utility'
import UtilityModal from '../../components/Utilities/UtilityFormModal'
import UtilityTable from '../../components/Utilities/UtilityTable'
import { saveUtilityReading, updateUtilityReading, fetchUtilityReadings } from '../../services/Utilities'

const statusMap: Record<string, Status> = {
  DA_CO_HOA_DON: 'co_hoa_don',
  DA_NHAP: 'da_nhap',
  CHUA_NHAP: 'chua_nhap',
}
const toNum = (v: any) => (v === null || v === undefined ? null : Number(v))

export default function Utilities() {
  const now = new Date()
  const [rows, setRows] = useState<UtilityRow[]>([])
  const [search, setSearch] = useState('')
  const [month, setMonth] = useState(String(now.getMonth() + 1))
  const [year, setYear] = useState(String(now.getFullYear()))
  const [roomFilter, setRoomFilter] = useState('all')
  const [modal, setModal] = useState<{ row: UtilityRow; mode: 'nhap' | 'sua' } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)
  const [successMessage, setSuccessMessage] = useState('')

  const entered = rows.filter(r => r.status !== 'chua_nhap').length
  const total = rows.length
  const period = `Tháng ${month} ${year}`

  useEffect(() => {
    if (!successMessage) return
    const timeoutId = window.setTimeout(() => setSuccessMessage(''), 3000)
    return () => window.clearTimeout(timeoutId)
  }, [successMessage])

  useEffect(() => {
    let cancelled = false
    async function loadData() {
      setLoading(true)
      setError('')
      try {
        const data = await fetchUtilityReadings({ month: parseInt(month, 10), year: parseInt(year, 10) })
        if (cancelled) return
        setRows(data.map((item: any): UtilityRow => ({
          id: String(item.room_id),
          roomId: item.room_id,
          readingId: item.reading_id ?? null,
          tenantName: item.tenant_name || '',
          room: item.room_number,
          prevElec: toNum(item.old_electricity_kwh),
          newElec: toNum(item.new_electricity_kwh),
          prevWater: toNum(item.old_water_m3),
          newWater: toNum(item.new_water_m3),
          dateRecorded: item.recorded_date ?? null,
          status: statusMap[item.current_status] ?? 'chua_nhap',
        })))
      } catch (e: any) {
        if (!cancelled) {
          setRows([])
          setError(e.message || 'Không tải được dữ liệu điện nước')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    loadData()
    return () => { cancelled = true }
  }, [month, year, reloadKey])

  const filtered = rows.filter(r => {
    const q = search.toLowerCase()
    const matchSearch = r.tenantName.toLowerCase().includes(q) || r.room.toLowerCase().includes(q)
    const matchRoom = roomFilter === 'all' || r.room === roomFilter
    return matchSearch && matchRoom
  })

  async function handleSave(id: string, newElec: number, newWater: number, date: string) {
    const row = rows.find(r => r.id === id)
    if (!row) return
    try {
      if (row.readingId) {
        await updateUtilityReading(row.readingId, {
          new_electricity_kwh: newElec,
          new_water_m3: newWater,
          recorded_date: date,
        })
      } else {
        await saveUtilityReading({
          room_id: row.roomId,
          billing_month: parseInt(month, 10),
          billing_year: parseInt(year, 10),
          old_electricity_kwh: row.prevElec ?? 0,
          new_electricity_kwh: newElec,
          old_water_m3: row.prevWater ?? 0,
          new_water_m3: newWater,
          recorded_date: date,
        })
      }
      setSuccessMessage('Lưu thành công!')
      setModal(null)
      setReloadKey(k => k + 1) // tải lại từ DB để lấy reading_id, trạng thái thật
    } catch (e: any) {
      alert(e.message || 'Không thể lưu vào cơ sở dữ liệu!')
    }
  }

  // ... phần JSX giữ nguyên

  const months = ['1','2','3','4','5','6','7','8','9','10','11','12']
  const years  = ['2025','2026','2027']

  return (
    <div className="space-y-5">
      {successMessage && (
        <div
          role="status"
          className="fixed top-5 right-5 z-[60] flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-lg"
        >
          <svg className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          {successMessage}
        </div>
      )}

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
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-white text-sm font-semibold transition shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
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

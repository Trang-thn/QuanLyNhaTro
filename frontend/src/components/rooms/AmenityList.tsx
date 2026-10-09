import { useState, useRef, useEffect } from 'react'
import type { Amenity } from '../../types/rooms'
import type { Room } from '../../types/rooms'

const AMBER = '#f59e0b'

// ── Row context menu ───────────────────────────────────────────────────────

interface RowMenuProps {
  amenity: Amenity
  onEdit: (a: Amenity) => void
  onDelete: (a: Amenity) => void
}

function RowMenu({ amenity, onEdit, onDelete }: RowMenuProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const down = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', down)
    document.addEventListener('keydown', key)
    return () => {
      document.removeEventListener('mousedown', down)
      document.removeEventListener('keydown', key)
    }
  }, [open])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(v => !v)}
        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        aria-label="Thao tác"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="5" r="1.5" />
          <circle cx="12" cy="12" r="1.5" />
          <circle cx="12" cy="19" r="1.5" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-30 w-36"
          onClick={e => e.stopPropagation()}
        >
          <button
            onClick={() => { setOpen(false); onEdit(amenity) }}
            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Sửa
          </button>
          <div className="my-1 border-t border-gray-100" />
          <button
            onClick={() => { setOpen(false); onDelete(amenity) }}
            className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
          >
            Xóa
          </button>
        </div>
      )}
    </div>
  )
}

// ── AmenityList tab content ────────────────────────────────────────────────

interface Props {
  amenities: Amenity[]
  rooms: Room[]
  onAdd: () => void
  onEdit: (a: Amenity) => void
  onDelete: (a: Amenity) => void
}

export function AmenityList({ amenities, rooms, onAdd, onEdit, onDelete }: Props) {
  const [search, setSearch] = useState('')

  const filtered = amenities.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase())
  )

  function roomCount(amenityId: string) {
    if (rooms.some(room => room.amenity_ids === undefined)) return null
    return rooms.filter(room => (room.amenity_ids ?? []).includes(amenityId)).length
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Search bar + Add button */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 hover:border-gray-300 transition">
          <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Tìm kiếm tiện nghi..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 text-sm text-gray-700 outline-none bg-transparent placeholder:text-gray-400"
          />
          {search && (
            <button onClick={() => setSearch('')} className="text-gray-400 hover:text-gray-600 transition">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold shadow-sm transition hover:brightness-95 active:scale-95 shrink-0"
          style={{ background: AMBER }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Thêm tiện nghi
        </button>
      </div>

      {/* Table */}
      {amenities.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-16 gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: '#fef3c7' }}>
            <svg className="w-7 h-7 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <div className="text-center">
            <p className="font-bold text-gray-800">Chưa có tiện nghi</p>
            <p className="text-sm text-gray-400 mt-1">Thêm tiện nghi đầu tiên để bắt đầu.</p>
          </div>
          <button
            onClick={onAdd}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition hover:brightness-95"
            style={{ background: AMBER }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Thêm tiện nghi
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[1fr_2fr_140px_56px] px-5 py-3 border-b border-gray-100 bg-gray-50">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Tên tiện nghi</span>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Mô tả</span>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Số phòng sử dụng</span>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">Thao tác</span>
          </div>

          {/* Rows */}
          {filtered.length === 0 ? (
            <div className="py-10 text-center text-sm text-gray-400">
              Không tìm thấy tiện nghi nào
            </div>
          ) : (
            filtered.map((a, idx) => (
              <div
                key={a.id}
                className={`grid grid-cols-[1fr_2fr_140px_56px] items-center px-5 py-4 hover:bg-gray-50 transition-colors ${idx !== filtered.length - 1 ? 'border-b border-gray-100' : ''}`}
              >
                <span className="text-sm font-semibold text-gray-800">{a.name}</span>
                <span className="text-sm text-gray-500 truncate pr-4">{a.description ?? '—'}</span>
                <span className="text-sm text-gray-500">
                  {roomCount(a.id)} phòng
                </span>
                <div className="flex justify-end">
                  <RowMenu amenity={a} onEdit={onEdit} onDelete={onDelete} />
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

import { useState } from 'react'
import type { Amenity, Room } from '../../types/rooms'

const NAVY = '#0d2137'
const AMBER = '#f59e0b'

interface Props {
  room: Room
  allAmenities: Amenity[]
  onClose: () => void
  onSave: (updatedAmenityIds: string[]) => void
}

export function AmenityAssignModal({ room, allAmenities, onClose, onSave }: Props) {
  const [selected, setSelected] = useState<string[]>([...room.amenity_ids])
  const [search, setSearch] = useState('')

  function toggle(id: string) {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    )
  }

  const filtered = allAmenities.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
        style={{ maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-base font-bold" style={{ color: NAVY }}>
            Tiện nghi phòng {room.room_number}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search */}
        <div className="px-6 pt-4 flex-shrink-0">
          <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3.5 py-2.5 hover:border-gray-300 transition">
            <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Tìm tiện nghi..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 text-sm text-gray-700 outline-none bg-transparent placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Amenity list */}
        <div className="px-6 py-3 overflow-y-auto flex-1">
          {allAmenities.length === 0 ? (
            <p className="text-sm text-gray-400 italic text-center py-8">
              Chưa có tiện nghi nào trong hệ thống
            </p>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-gray-400 italic text-center py-6">
              Không tìm thấy tiện nghi nào
            </p>
          ) : (
            <div className="space-y-1">
              {filtered.map(a => {
                const isSelected = selected.includes(a.id)
                return (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => toggle(a.id)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition text-left hover:bg-gray-50"
                    style={{ background: isSelected ? '#fffbeb' : undefined }}
                  >
                    {/* Amber checkbox */}
                    <div
                      className="w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition"
                      style={{
                        borderColor: isSelected ? AMBER : '#d1d5db',
                        background: isSelected ? AMBER : 'white',
                      }}
                    >
                      {isSelected && (
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {a.name}
                    </span>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-gray-100 flex-shrink-0">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 font-medium hover:bg-gray-50 transition"
          >
            Hủy
          </button>
          <button
            onClick={() => onSave(selected)}
            className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold transition hover:brightness-95"
            style={{ background: AMBER }}
          >
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  )
}

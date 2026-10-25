import { formatVND } from '../../data/mockData'
import type { Amenity } from '../../types/rooms'
import type { Room } from '../../types/rooms'

const NAVY = '#0d2137'

const STATUS_CONFIG: Record<string, { label: string; bg: string; color: string }> = {
  DANG_THUE: { label: 'Đang thuê', bg: '#dbeafe', color: '#1d4ed8' },
  TRONG: { label: 'Trống', bg: '#dcfce7', color: '#16a34a' },
  BAO_TRI: { label: 'Bảo trì', bg: '#fef3c7', color: '#d97706' },
}

interface Props {
  room: Room
  onClose: () => void
  allAmenities: Amenity[]
}

export function RoomDetailModal({ room, onClose, allAmenities }: Props) {
  const statusCfg = room.status ? STATUS_CONFIG[room.status] ?? { label: room.status, bg: '#f3f4f6', color: '#6b7280' } : { label: 'Ch\u01b0a x\u00e1c \u0111\u1ecbnh', bg: '#f3f4f6', color: '#6b7280' }
  const roomAmenities = (room.amenity_ids ?? [])
    .map(id => allAmenities.find(a => a.id === id))
    .filter(Boolean) as Amenity[]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="text-lg font-bold" style={{ color: NAVY }}>Chi tiết phòng</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
            aria-label="Đóng"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 space-y-5">
          {/* Room number + status */}
          <div className="flex items-center gap-3">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: '#f0f4f8' }}
            >
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill={NAVY}>
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
            </div>
            <div>
              <p className="text-xl font-bold" style={{ color: NAVY }}>{room.room_number}</p>
              <div className="flex items-center gap-2 mt-1">
                {room.room_type_name && (
                  <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-500">
                    {room.room_type_name}
                  </span>
                )}
                <span
                  className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
                  style={{ background: statusCfg.bg, color: statusCfg.color }}
                >
                  {statusCfg.label}
                </span>
              </div>
            </div>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-xl p-3.5">
              <p className="text-xs text-gray-400 mb-1">Tầng</p>
              <p className="font-semibold text-gray-800">Tầng {room.floor ?? '-'}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3.5">
              <p className="text-xs text-gray-400 mb-1">Diện tích</p>
              <p className="font-semibold text-gray-800">{room.area ?? '?'}m²</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3.5">
              <p className="text-xs text-gray-400 mb-1">Loại phòng</p>
              <p className="font-semibold text-gray-800">{room.room_type_name ?? '—'}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3.5">
              <p className="text-xs text-gray-400 mb-1">Giá thuê</p>
              <p className="font-semibold" style={{ color: '#d97706' }}>
                {room.price != null ? formatVND(room.price) : '—'}/tháng
              </p>
            </div>
          </div>

          {/* Amenities */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Tiện nghi</p>
            {room.amenity_ids === undefined ? (
              <p className="text-sm text-gray-400 italic">Amenity data is not provided by the rooms API.</p>
            ) : roomAmenities.length === 0 ? (
              <p className="text-sm text-gray-400 italic">Chưa có tiện nghi</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {roomAmenities.map(a => (
                  <span
                    key={a.id}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 text-gray-600 bg-gray-50"
                  >
                    {a.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 font-medium hover:bg-gray-50 transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import type { Room, RoomStatus } from '../../types/rooms'

const NAVY = '#0d2137'
const AMBER = '#f59e0b'

const MANUAL_STATUS_OPTIONS: { value: RoomStatus; label: string; desc: string; bg: string; color: string; ring: string }[] = [
  { value: 'TRONG', label: 'Trống', desc: 'Phòng chưa có hợp đồng còn hiệu lực', bg: '#dcfce7', color: '#16a34a', ring: '#16a34a' },
  { value: 'BAO_TRI', label: 'Bảo trì', desc: 'Phòng đang trong thời gian bảo trì', bg: '#fef3c7', color: '#d97706', ring: '#d97706' },
]

interface Props {
  room: Room
  onClose: () => void
  onSave: (newStatus: RoomStatus) => void
}

export function RoomStatusModal({ room, onClose, onSave }: Props) {
  const hasActiveContract = room.has_active_contract ?? room.status === 'DANG_THUE'
  const [selected, setSelected] = useState<RoomStatus>(room.status === 'BAO_TRI' ? 'BAO_TRI' : 'TRONG')

  function handleConfirm() {
    if (selected === room.status) {
      onClose()
      return
    }
    onSave(selected)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={event => event.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold" style={{ color: NAVY }}>Cập nhật trạng thái</h2>
            <p className="text-xs text-gray-400 mt-0.5">{room.room_number}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition" aria-label="Đóng">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {hasActiveContract ? (
          <div className="px-6 py-6">
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
              <p className="font-semibold text-blue-800">Phòng đang thuê</p>
              <p className="mt-1 text-sm text-blue-700">
                Hợp đồng còn hiệu lực nên trạng thái do hợp đồng quản lý. Phòng sẽ trở về trạng thái Trống khi hợp đồng hết hạn, được thanh lý hoặc xóa.
              </p>
            </div>
          </div>
        ) : (
          <div className="px-6 py-5 space-y-3">
            <p className="text-sm text-gray-500 mb-4">Chọn trạng thái cho phòng chưa có hợp đồng còn hiệu lực</p>
            {MANUAL_STATUS_OPTIONS.map(option => {
              const isActive = selected === option.value
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSelected(option.value)}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border-2 transition text-left"
                  style={{ borderColor: isActive ? option.ring : '#e5e7eb', background: isActive ? `${option.bg}40` : 'white' }}
                >
                  <span className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0" style={{ borderColor: isActive ? option.ring : '#d1d5db' }}>
                    {isActive && <span className="w-2.5 h-2.5 rounded-full" style={{ background: option.ring }} />}
                  </span>
                  <span className="flex-1">
                    <span className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-800">{option.label}</span>
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: option.bg, color: option.color }}>{option.label}</span>
                    </span>
                    <span className="block text-xs text-gray-400 mt-0.5">{option.desc}</span>
                  </span>
                </button>
              )
            })}
          </div>
        )}

        <div className="flex gap-3 px-6 pb-6">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 font-medium hover:bg-gray-50 transition">
            {hasActiveContract ? 'Đóng' : 'Hủy'}
          </button>
          {!hasActiveContract && (
            <button onClick={handleConfirm} className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold transition hover:brightness-95" style={{ background: AMBER }}>
              Xác nhận
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

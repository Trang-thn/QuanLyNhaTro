import { formatVND } from '../../data/mockData'
import type { Room } from '../../types/rooms'

const NAVY = '#0d2137'

const STATUS_CONFIG: Record<string, { label: string; bg: string; color: string }> = {
  DANG_THUE: { label: 'Đang thuê', bg: '#dbeafe', color: '#1d4ed8' },
  TRONG: { label: 'Trống', bg: '#dcfce7', color: '#16a34a' },
  BAO_TRI: { label: 'Bảo trì', bg: '#fef3c7', color: '#d97706' },
}
// ── DELETE WARNING (step 2 — final confirmation) ──

interface DeleteWarningProps {
  room: Room
  onClose: () => void
  onConfirm: () => void
}

export function RoomDeleteWarningModal({ room, onClose, onConfirm }: DeleteWarningProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" role="alertdialog" aria-modal="true" aria-labelledby="room-delete-warning-title" aria-describedby="room-delete-warning-description">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg"
        onClick={e => e.stopPropagation()}
      >
        {/* Icon */}
        <div className="flex items-center gap-4 px-6 pt-7 pb-5 text-left">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center shrink-0">
            <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <div>
            <h3 id="room-delete-warning-title" className="text-base font-bold text-gray-800 mb-2">Xác nhận xóa phòng</h3>
            <p id="room-delete-warning-description" className="text-sm text-gray-500 leading-relaxed">
              Bạn có chắc chắn muốn xóa phòng{' '}
              <span className="font-semibold text-gray-700">{room.room_number}</span>?
              Hành động này không thể hoàn tác.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 pb-6">
          <button
            onClick={onClose}
            className="min-w-28 px-5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 font-medium hover:bg-gray-50 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="min-w-28 px-5 py-2.5 rounded-xl text-white text-sm font-semibold bg-red-500 hover:bg-red-600 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
          >
            Xóa phòng
          </button>
        </div>
      </div>
    </div>
  )
}

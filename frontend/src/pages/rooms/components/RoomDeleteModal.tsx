import { roomTypes, formatVND } from '../../../data/mockData'
import type { Room } from '../types'

const NAVY = '#0d2137'

const STATUS_CONFIG: Record<string, { label: string; bg: string; color: string }> = {
  DANG_THUE: { label: 'Đang thuê', bg: '#dbeafe', color: '#1d4ed8' },
  TRONG:     { label: 'Trống',     bg: '#dcfce7', color: '#16a34a' },
  BAO_TRI:   { label: 'Bảo trì',   bg: '#fef3c7', color: '#d97706' },
}

// ── ROOM DELETE (step 1 — show room info + proceed to warning) ──

interface Props {
  room: Room
  onClose: () => void
  onProceed: () => void
}

export function RoomDeleteModal({ room, onClose, onProceed }: Props) {
  const rt = roomTypes.find(t => t.id === room.room_type_id)
  const statusCfg = STATUS_CONFIG[room.status] ?? STATUS_CONFIG.TRONG

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="text-lg font-bold" style={{ color: NAVY }}>Xóa phòng</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Room info */}
        <div className="px-6 py-5">
          <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-4 mb-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: '#fee2e2' }}
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#ef4444">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-base" style={{ color: NAVY }}>{room.room_number}</span>
                {rt && (
                  <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-200 text-gray-500">
                    {rt.name}
                  </span>
                )}
                <span
                  className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
                  style={{ background: statusCfg.bg, color: statusCfg.color }}
                >
                  {statusCfg.label}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Tầng {room.floor} • {rt?.area_sqm ?? '?'}m² • {rt ? formatVND(rt.base_price) : '—'}/tháng
              </p>
            </div>
          </div>

          <p className="text-sm text-gray-500">
            Bạn đang thực hiện xóa phòng này khỏi hệ thống. Vui lòng xác nhận để tiếp tục.
          </p>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 pb-6">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 font-medium hover:bg-gray-50 transition"
          >
            Hủy
          </button>
          <button
            onClick={onProceed}
            className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold bg-red-500 hover:bg-red-600 transition"
          >
            Tiếp tục xóa
          </button>
        </div>
      </div>
    </div>
  )
}

// ── DELETE WARNING (step 2 — final confirmation) ──

interface DeleteWarningProps {
  room: Room
  onClose: () => void
  onConfirm: () => void
}

export function RoomDeleteWarningModal({ room, onClose, onConfirm }: DeleteWarningProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm"
        onClick={e => e.stopPropagation()}
      >
        {/* Icon */}
        <div className="flex flex-col items-center px-6 pt-8 pb-5 text-center">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-4">
            <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-gray-800 mb-2">Xác nhận xóa phòng</h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            Bạn có chắc chắn muốn xóa phòng{' '}
            <span className="font-semibold text-gray-700">{room.room_number}</span>?
            Hành động này không thể hoàn tác.
          </p>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 pb-6">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 font-medium hover:bg-gray-50 transition"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold bg-red-500 hover:bg-red-600 transition"
          >
            Xóa phòng
          </button>
        </div>
      </div>
    </div>
  )
}

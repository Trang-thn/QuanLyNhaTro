import type { Amenity } from '../../types/rooms'

const AMBER = '#f59e0b'

// ── DELETE confirmation (178:891) ──────────────────────────────────────────
// Shown when amenity is NOT in use — direct confirm/cancel

interface DeleteProps {
  amenity: Amenity
  onClose: () => void
  onConfirm: () => void
}

export function AmenityDeleteModal({ onClose, onConfirm }: DeleteProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm"
        onClick={e => e.stopPropagation()}
      >
        {/* Icon + text */}
        <div className="flex flex-col items-center px-6 pt-8 pb-5 text-center">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">Xóa tiện nghi?</h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            Bạn có chắc chắn muốn xóa tiện nghi này không? Hành động này không thể hoàn tác.
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
            Xóa
          </button>
        </div>
      </div>
    </div>
  )
}

// ── DELETE WARNING (178:1086) ──────────────────────────────────────────────
// Shown when amenity IS in use — cannot delete, info only

interface WarningProps {
  onClose: () => void
}

export function AmenityDeleteWarningModal({ onClose }: WarningProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm"
        onClick={e => e.stopPropagation()}
      >
        {/* Icon + text */}
        <div className="flex flex-col items-center px-6 pt-8 pb-5 text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: '#fef3c7' }}>
            <svg className="w-8 h-8" style={{ color: AMBER }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">Không thể xóa tiện nghi</h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            Tiện nghi này đang được sử dụng bởi một hoặc nhiều phòng. Vui lòng gỡ tiện nghi khỏi tất cả các phòng trước khi xóa.
          </p>
        </div>

        {/* Single button */}
        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl text-white text-sm font-semibold transition hover:brightness-95"
            style={{ background: AMBER }}
          >
            Đã hiểu
          </button>
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import type { Room, RoomStatus } from '../types'

const NAVY = '#0d2137'
const AMBER = '#f59e0b'

const STATUS_OPTIONS: { value: RoomStatus; label: string; desc: string; bg: string; color: string; ring: string }[] = [
  {
    value: 'TRONG',
    label: 'Trống',
    desc: 'Phòng chưa có người thuê',
    bg: '#dcfce7',
    color: '#16a34a',
    ring: '#16a34a',
  },
  {
    value: 'DANG_THUE',
    label: 'Đang thuê',
    desc: 'Phòng đang có người thuê',
    bg: '#dbeafe',
    color: '#1d4ed8',
    ring: '#1d4ed8',
  },
  {
    value: 'BAO_TRI',
    label: 'Bảo trì',
    desc: 'Phòng đang trong thời gian bảo trì',
    bg: '#fef3c7',
    color: '#d97706',
    ring: '#d97706',
  },
]

interface Props {
  room: Room
  onClose: () => void
  onSave: (newStatus: RoomStatus) => void
  onNeedWarning: (newStatus: RoomStatus) => void
}

export function RoomStatusModal({ room, onClose, onSave, onNeedWarning }: Props) {
  const [selected, setSelected] = useState<RoomStatus>(room.status)

  function handleConfirm() {
    if (selected === room.status) {
      onClose()
      return
    }
    // Show warning when changing FROM DANG_THUE (may have active contract)
    if (room.status === 'DANG_THUE') {
      onNeedWarning(selected)
    } else {
      onSave(selected)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold" style={{ color: NAVY }}>Cập nhật trạng thái</h2>
            <p className="text-xs text-gray-400 mt-0.5">{room.room_number}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Status options */}
        <div className="px-6 py-5 space-y-3">
          <p className="text-sm text-gray-500 mb-4">Chọn trạng thái mới cho phòng</p>
          {STATUS_OPTIONS.map(opt => {
            const isActive = selected === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSelected(opt.value)}
                className="w-full flex items-center gap-4 p-4 rounded-xl border-2 transition text-left"
                style={{
                  borderColor: isActive ? opt.ring : '#e5e7eb',
                  background: isActive ? opt.bg + '40' : 'white',
                }}
              >
                {/* Radio indicator */}
                <div
                  className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition"
                  style={{
                    borderColor: isActive ? opt.ring : '#d1d5db',
                  }}
                >
                  {isActive && (
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ background: opt.ring }}
                    />
                  )}
                </div>

                {/* Label + badge */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-800">{opt.label}</span>
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-semibold"
                      style={{ background: opt.bg, color: opt.color }}
                    >
                      {opt.label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{opt.desc}</p>
                </div>
              </button>
            )
          })}
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
            onClick={handleConfirm}
            className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold transition hover:brightness-95"
            style={{ background: AMBER }}
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  )
}

// ── STATUS WARNING ──────────────────────────────────────────────

interface StatusWarningProps {
  room: Room
  newStatus: RoomStatus
  onClose: () => void
  onConfirm: () => void
}

const STATUS_LABEL: Record<RoomStatus, string> = {
  TRONG: 'Trống',
  DANG_THUE: 'Đang thuê',
  BAO_TRI: 'Bảo trì',
}

export function RoomStatusWarningModal({ room, newStatus, onClose, onConfirm }: StatusWarningProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm"
        onClick={e => e.stopPropagation()}
      >
        {/* Icon */}
        <div className="flex flex-col items-center px-6 pt-8 pb-5 text-center">
          <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center mb-4">
            <svg className="w-7 h-7 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-gray-800 mb-2">Xác nhận thay đổi trạng thái</h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            Phòng <span className="font-semibold text-gray-700">{room.room_number}</span> đang{' '}
            <span className="font-semibold text-blue-600">Đang thuê</span>. Bạn có chắc muốn chuyển sang{' '}
            <span className="font-semibold text-gray-700">{STATUS_LABEL[newStatus]}</span>?
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
            className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold transition hover:brightness-95 bg-amber-500"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  )
}

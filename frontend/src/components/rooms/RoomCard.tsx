import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import type { Room, RoomMenuAction } from '../../types/rooms'
import { amenities as allAmenities, formatVND } from '../../data/mockData'
import { useAnchoredMenu } from './useAnchoredMenu'

const STATUS_CONFIG: Record<string, { label: string; bg: string; color: string }> = {
  DANG_THUE: { label: 'Đang thuê', bg: '#dbeafe', color: '#1d4ed8' },
  TRONG: { label: 'Trống', bg: '#dcfce7', color: '#16a34a' },
  BAO_TRI: { label: 'Bảo trì', bg: '#fef3c7', color: '#d97706' },
}

const ROOM_TYPE_SHORT: Record<string, string> = {
  'Phòng đơn': 'Đơn',
  'Phòng đôi': 'Đôi',
  'Studio': 'Studio',
  'VIP': 'VIP',
}

function AmenityIcon({ name }: { name: string }) {
  if (name === 'Wifi') return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12.55a11 11 0 0 1 14.08 0" />
      <path d="M1.42 9a16 16 0 0 1 21.16 0" />
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
      <circle cx="12" cy="20" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
  if (name === 'Điều hòa') return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="9" rx="2" />
      <path d="M7 11h.01M12 11h.01M17 11h.01" />
      <path d="M7 16v3M12 16v3M17 16v3" />
    </svg>
  )
  if (name === 'Nóng lạnh') return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3C8.928 6.857 9.776 4.946 12 3c.5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  )
  if (name === 'Tủ lạnh') return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <path d="M5 10h14M10 5v4" />
    </svg>
  )
  if (name === 'Máy giặt') return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="2" />
      <circle cx="12" cy="13" r="4" />
      <path d="M7 6h.01M10 6h.01" />
    </svg>
  )
  if (name === 'Ban công') return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
  if (name === 'Bếp riêng') return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 3v4M10 3v4M15 3v4M20 3v4" />
      <rect x="3" y="7" width="18" height="14" rx="2" />
      <circle cx="8" cy="13" r="2" />
      <circle cx="16" cy="13" r="2" />
    </svg>
  )
  if (name === 'Gác xép') return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4 9 2 9 12 2 22 9 20 9" />
      <path d="M4 9v10a1 1 0 0 0 1 1h5v-4h4v4h5a1 1 0 0 0 1-1V9" />
    </svg>
  )
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v4M12 16h.01" />
    </svg>
  )
}

const MENU_ITEMS: { label: string; action: RoomMenuAction }[] = [
  { label: 'Xem chi tiết', action: 'detail' },
  { label: 'Sửa phòng', action: 'edit' },
  { label: 'Cập nhật trạng thái', action: 'status' },
]

interface Props {
  room: Room
  onAction: (room: Room, action: RoomMenuAction) => void
}

export function RoomCard({ room, onAction }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const menuPopupRef = useRef<HTMLDivElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const menuStyle = useAnchoredMenu(menuOpen, menuButtonRef, 240, 192, true)

  const statusCfg = room.status ? STATUS_CONFIG[room.status] ?? { label: room.status, bg: '#f3f4f6', color: '#6b7280' } : { label: 'Ch\u01b0a x\u00e1c \u0111\u1ecbnh', bg: '#f3f4f6', color: '#6b7280' }

  const roomAmenities = (room.amenity_ids ?? [])
    .flatMap(id => {
      const found = allAmenities.find(a => a.id === id)
      return found ? [found] : []
    })
    .slice(0, 3)

  useEffect(() => {
    if (!menuOpen) return
    const handler = (e: MouseEvent) => {
      const target = e.target as Node
      if (!menuRef.current?.contains(target) && !menuPopupRef.current?.contains(target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [menuOpen])

  useEffect(() => {
    if (!menuOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false)
        menuButtonRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [menuOpen])

  return (
    <article className="min-w-0 bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 flex flex-col gap-4 transition-colors hover:border-blue-200">
      {/* Header: room number + type badge + status badge */}
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="font-bold text-lg leading-tight tracking-tight" style={{ color: '#0d2137' }}>
          {room.room_number}
        </h2>
        {room.room_type_name && (
          <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-500 shrink-0">
            {ROOM_TYPE_SHORT[room.room_type_name ?? ''] ?? room.room_type_name}
          </span>
        )}
        <div className="flex-1 min-w-2" />
        <span
          className="px-2.5 py-1 rounded-full text-xs font-semibold shrink-0"
          style={{ background: statusCfg.bg, color: statusCfg.color }}
        >
          {statusCfg.label}
        </span>
      </div>

      {/* Price */}
      {room.price != null && (
        <p className="font-bold text-lg leading-snug" style={{ color: '#b45309', fontVariantNumeric: 'tabular-nums' }}>
          {formatVND(room.price)}/tháng
        </p>
      )}

      {/* Floor + Area */}
      <p className="text-sm text-gray-600 leading-relaxed">
        Tầng {room.floor ?? '-'} <span aria-hidden="true" className="mx-1 text-gray-300">•</span> Diện tích: {room.area ?? '?'}m²
      </p>

      {/* Divider */}
      <div className="border-t border-gray-100" />

      {/* Amenity icons + context menu trigger */}
      <div className="flex items-center justify-between gap-3">
        <div role="group" aria-label="Tiện nghi phòng" className="flex min-w-0 items-center gap-2 text-gray-500">
          {roomAmenities.map(a => (
            <span key={a.id} title={a.name} role="img" aria-label={a.name}>
              <AmenityIcon name={a.name} />
            </span>
          ))}
        </div>

        <div className="relative" ref={menuRef}>
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMenuOpen(v => !v)}
            aria-expanded={menuOpen}
            aria-haspopup="true"
            className="p-2 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors"
            title="Thao tác"
            aria-label="Mở menu thao tác"
          >
            {/* Edit/pencil icon */}
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>

          {menuOpen && (
            createPortal(<div
              ref={menuPopupRef}
              style={{ ...menuStyle, maxWidth: 'calc(100vw - 2rem)' }}
              className="rounded-xl border border-gray-200 bg-white py-1 shadow-lg"
              onClick={e => e.stopPropagation()}
            >
              {MENU_ITEMS.map(item => (
                <button
                  key={item.action}
                  onClick={() => { setMenuOpen(false); onAction(room, item.action) }}
                  type="button"
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:bg-blue-50 transition-colors"
                >
                  {item.label}
                </button>
              ))}
              <div className="my-1 border-t border-gray-100" />
              <button
                onClick={() => { setMenuOpen(false); onAction(room, 'delete') }}
                type="button"
                className="w-full text-left px-4 py-2.5 text-sm text-red-700 hover:bg-red-50 focus-visible:outline-none focus-visible:bg-red-50 transition-colors"
              >
                Xóa phòng
              </button>
            </div>, document.body)
          )}
        </div>
      </div>
    </article>
  )
}

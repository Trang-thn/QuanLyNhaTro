import { useState, useRef, useEffect } from 'react'
import { roomTypes } from '../../data/mockData'

const NAVY = '#0d2137'

interface Props {
  value: string
  onChange: (id: string) => void
  error?: string
  showArea?: boolean
}

export function RoomTypeDropdown({ value, onChange, error, showArea = false }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const selected = roomTypes.find(t => t.id === value)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open])

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-sm transition text-left
          ${error
            ? 'border-red-400 bg-red-50'
            : open
              ? 'border-gray-400 bg-white'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
      >
        <span className={selected ? 'text-gray-800' : 'text-gray-400'}>
          {selected
            ? showArea ? `${selected.name} — ${selected.area_sqm}m²` : selected.name
            : 'Chọn loại phòng'}
        </span>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform shrink-0 ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-40">
          {roomTypes.map(t => {
            const isSelected = t.id === value
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => { onChange(t.id); setOpen(false) }}
                className="w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between"
                style={{
                  background: isSelected ? '#f0f4f8' : undefined,
                  color: isSelected ? NAVY : '#374151',
                  fontWeight: isSelected ? 600 : 400,
                }}
                onMouseEnter={e => {
                  if (!isSelected) (e.currentTarget as HTMLElement).style.background = '#f9fafb'
                }}
                onMouseLeave={e => {
                  if (!isSelected) (e.currentTarget as HTMLElement).style.background = ''
                }}
              >
                <span>{showArea ? `${t.name} — ${t.area_sqm}m²` : t.name}</span>
                {isSelected && (
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            )
          })}
        </div>
      )}

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
}

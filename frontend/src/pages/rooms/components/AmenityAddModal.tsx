import { useState } from 'react'
import type { Amenity } from '../types'

const NAVY = '#0d2137'
const AMBER = '#f59e0b'

interface Props {
  onClose: () => void
  onSave: (amenity: Amenity) => void
}

export function AmenityAddModal({ onClose, onSave }: Props) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [nameError, setNameError] = useState('')

  function handleSubmit() {
    const trimmedName = name.trim()
    if (!trimmedName) {
      setNameError('Vui lòng nhập tên tiện nghi')
      return
    }
    onSave({
      id: Date.now().toString(),
      name: trimmedName,
      description: description.trim() || undefined,
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="text-lg font-bold" style={{ color: NAVY }}>Thêm tiện nghi</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <div className="px-6 py-5 space-y-4">
          {/* Tên tiện nghi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Tên tiện nghi <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Nhập tên tiện nghi (ví dụ: Tủ lạnh)"
              value={name}
              autoFocus
              onChange={e => {
                setName(e.target.value)
                setNameError('')
              }}
              onKeyDown={e => { if (e.key === 'Enter') handleSubmit() }}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition
                ${nameError ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-[#0d2137]'}`}
            />
            {nameError && <p className="mt-1 text-xs text-red-500">{nameError}</p>}
          </div>

          {/* Mô tả */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Mô tả</label>
            <textarea
              placeholder="Nhập mô tả ngắn về thiết bị tiện nghi..."
              value={description}
              rows={3}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#0d2137] text-sm outline-none transition resize-none"
            />
          </div>
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
            onClick={handleSubmit}
            className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold transition hover:brightness-95"
            style={{ background: AMBER }}
          >
            Thêm tiện nghi
          </button>
        </div>
      </div>
    </div>
  )
}

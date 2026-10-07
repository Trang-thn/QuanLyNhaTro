import { useState } from 'react'
import { amenities as allAmenities } from '../../data/mockData'
import type { Room } from '../../types/rooms'
import { RoomTypeDropdown } from './RoomTypeDropdown'

const NAVY = '#0d2137'
const AMBER = '#f59e0b'

interface FormData {
  room_number: string
  floor: string
  room_type_id: string
  price: string
  area: string
  amenity_ids: string[]
}

interface FormErrors {
  room_number?: string
  floor?: string
  room_type_id?: string
  price?: string
  area?: string
}

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {}

  if (!data.room_number.trim()) {
    errors.room_number = 'Vui lòng nhập tên phòng'
  }

  const floorNum = parseInt(data.floor, 10)
  if (!data.floor.trim()) {
    errors.floor = 'Vui lòng nhập số tầng'
  } else if (isNaN(floorNum) || floorNum < 1 || String(floorNum) !== data.floor.trim()) {
    errors.floor = 'Tầng phải là số nguyên dương'
  }

  if (!data.room_type_id) {
    errors.room_type_id = 'Vui lòng chọn loại phòng'
  }

  const priceNum = Number(data.price.replace(/\D/g, ''))
  if (!data.price.trim()) {
    errors.price = 'Vui lòng nhập giá phòng'
  } else if (isNaN(priceNum) || priceNum <= 0) {
    errors.price = 'Giá phòng phải là số dương'
  }

  const areaNum = parseFloat(data.area)
  if (!data.area.trim()) {
    errors.area = 'Vui lòng nhập diện tích'
  } else if (isNaN(areaNum) || areaNum <= 0) {
    errors.area = 'Diện tích phải là số dương'
  }

  return errors
}

interface Props {
  onClose: () => void
  onSave: (room: Room) => void
}

export function RoomAddModal({ onClose, onSave }: Props) {
  const [form, setForm] = useState<FormData>({
    room_number: '',
    floor: '',
    room_type_id: '',
    price: '',
    area: '',
    amenity_ids: [],
  })
  const [errors, setErrors] = useState<FormErrors>({})

  function handleSubmit() {
    const errs = validate(form)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    onSave({
      id: Date.now().toString(),
      room_number: form.room_number.trim().toUpperCase(),
      floor: parseInt(form.floor, 10),
      room_type_id: form.room_type_id,
      status: 'TRONG',
      amenity_ids: form.amenity_ids,
      price: Number(form.price.replace(/\D/g, '')),
      area: parseFloat(form.area),
    })
  }

  function toggleAmenity(id: string) {
    setForm(f => ({
      ...f,
      amenity_ids: f.amenity_ids.includes(id)
        ? f.amenity_ids.filter(a => a !== id)
        : [...f.amenity_ids, id],
    }))
  }

  const inputClass = (err?: string) =>
    `w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition
     ${err ? 'border-red-400 bg-red-50 focus:border-red-500' : 'border-gray-200 focus:border-[#0d2137]'}`

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
        style={{ maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-lg font-bold" style={{ color: NAVY }}>Thêm phòng</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form body */}
        <div className="px-6 py-5 space-y-4 overflow-y-auto flex-1">

          {/* Tên phòng */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Tên phòng <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Nhập số phòng (ví dụ: P101)"
              value={form.room_number}
              onChange={e => {
                setForm(f => ({ ...f, room_number: e.target.value }))
                setErrors(er => ({ ...er, room_number: undefined }))
              }}
              className={inputClass(errors.room_number)}
            />
            {errors.room_number && <p className="mt-1 text-xs text-red-500">{errors.room_number}</p>}
          </div>

          {/* Tầng */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Tầng <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="Nhập tầng (ví dụ: 1)"
              value={form.floor}
              onChange={e => {
                setForm(f => ({ ...f, floor: e.target.value }))
                setErrors(er => ({ ...er, floor: undefined }))
              }}
              className={inputClass(errors.floor)}
            />
            {errors.floor && <p className="mt-1 text-xs text-red-500">{errors.floor}</p>}
          </div>

          {/* Loại phòng */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Loại phòng <span className="text-red-500">*</span>
            </label>
            <RoomTypeDropdown
              value={form.room_type_id}
              onChange={id => {
                setForm(f => ({ ...f, room_type_id: id }))
                setErrors(er => ({ ...er, room_type_id: undefined }))
              }}
              error={errors.room_type_id}
            />
          </div>

          {/* Giá phòng + Diện tích — độc lập, nhập tay */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Giá phòng <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="đ/tháng"
                value={form.price}
                onChange={e => {
                  setForm(f => ({ ...f, price: e.target.value }))
                  setErrors(er => ({ ...er, price: undefined }))
                }}
                className={inputClass(errors.price)}
              />
              {errors.price && <p className="mt-1 text-xs text-red-500">{errors.price}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Diện tích (m²) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                inputMode="decimal"
                placeholder="m²"
                value={form.area}
                onChange={e => {
                  setForm(f => ({ ...f, area: e.target.value }))
                  setErrors(er => ({ ...er, area: undefined }))
                }}
                className={inputClass(errors.area)}
              />
              {errors.area && <p className="mt-1 text-xs text-red-500">{errors.area}</p>}
            </div>
          </div>

          {/* Tiện nghi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tiện nghi</label>
            <div className="flex flex-wrap gap-2">
              {allAmenities.map(a => {
                const selected = form.amenity_ids.includes(a.id)
                return (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => toggleAmenity(a.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition
                      ${selected
                        ? 'border-transparent text-white'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                    style={selected ? { background: NAVY, borderColor: NAVY } : {}}
                  >
                    {a.name}
                  </button>
                )
              })}
            </div>
          </div>
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
            onClick={handleSubmit}
            className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold transition hover:brightness-95"
            style={{ background: AMBER }}
          >
            Thêm phòng
          </button>
        </div>
      </div>
    </div>
  )
}

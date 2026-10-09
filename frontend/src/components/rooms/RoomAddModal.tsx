import { useState } from 'react'
import { amenities as allAmenities } from '../../data/mockData'
import type { RoomDraft, RoomTypeApiDTO } from '../../types/rooms'
import { RoomTypeDropdown } from './RoomTypeDropdown'

const NAVY = '#0d2137'
const AMBER = '#f59e0b'

interface FormData {
  room_number: string
  floor: string
  room_type_id: string
  amenity_ids: string[]
}

interface FormErrors {
  room_number?: string
  floor?: string
  room_type_id?: string
  price?: string
  area?: string
}

function validate(data: FormData, selectedType?: RoomTypeApiDTO): FormErrors {
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

  const priceNum = selectedType?.base_price == null ? NaN : Number(selectedType.base_price)
  if (!selectedType || !Number.isFinite(priceNum) || priceNum <= 0) errors.price = 'Loại phòng chưa có giá hợp lệ từ API'
  const areaNum = selectedType?.area_sqm == null ? NaN : Number(selectedType.area_sqm)
  if (!Number.isFinite(areaNum) || areaNum <= 0) errors.area = 'Loại phòng chưa có diện tích hợp lệ từ API'

  return errors
}

interface Props {
  onClose: () => void
  onSave: (room: RoomDraft) => void
  roomTypes: RoomTypeApiDTO[]
  loadingTypes?: boolean
  roomTypesError?: string | null
}

export function RoomAddModal({ onClose, onSave, roomTypes, loadingTypes = false, roomTypesError }: Props) {
  const [form, setForm] = useState<FormData>({
    room_number: '',
    floor: '',
    room_type_id: '',
    amenity_ids: [],
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const selectedType = roomTypes.find(type => type.id === form.room_type_id)

  function handleSubmit() {
    const errs = validate(form, selectedType)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    onSave({
      room_number: form.room_number.trim().toUpperCase(),
      floor: parseInt(form.floor, 10),
      room_type_id: form.room_type_id,
      status: 'TRONG',
      amenity_ids: form.amenity_ids,
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
              roomTypes={roomTypes}
              value={form.room_type_id}
              onChange={id => {
                setForm(f => ({ ...f, room_type_id: id }))
                setErrors(er => ({ ...er, room_type_id: undefined, price: undefined, area: undefined }))
              }}
              error={errors.room_type_id}
              loading={loadingTypes}
              loadError={roomTypesError}
            />
          </div>

          {/* Giá phòng và diện tích lấy từ loại phòng đã chọn */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Giá phòng <span className="text-red-500">*</span>
              </label>
              <input type="text" readOnly aria-readonly="true" placeholder={form.room_type_id ? 'Giá chưa có từ API' : 'Chọn loại phòng'} value={selectedType?.base_price != null && Number.isFinite(Number(selectedType.base_price)) ? `${new Intl.NumberFormat('vi-VN').format(Number(selectedType.base_price))} đ/tháng` : ''} className={`${inputClass(errors.price)} bg-gray-50`} />
              {errors.price && <p className="mt-1 text-xs text-red-500">{errors.price}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Diện tích (m²) <span className="text-red-500">*</span>
              </label>
              <input type="text" readOnly aria-readonly="true" placeholder={form.room_type_id ? 'Diện tích chưa có từ API' : 'Chọn loại phòng'} value={selectedType?.area_sqm != null && Number.isFinite(Number(selectedType.area_sqm)) ? `${selectedType.area_sqm} m²` : ''} className={`${inputClass(errors.area)} bg-gray-50`} />
              {errors.area && <p className="mt-1 text-xs text-red-500">{errors.area}</p>}
            </div>
          </div>
          <p className="text-xs text-gray-500">Giá phòng và diện tích hiển thị theo loại phòng; API tạo phòng chỉ lưu mã loại phòng.</p>

          {/* Tiện nghi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tiện nghi</label>
            <p className="mb-2 text-xs text-gray-500">{'Ti\u1ec7n nghi ch\u01b0a \u0111\u01b0\u1ee3c l\u01b0u v\u00ec backend ch\u01b0a c\u00f3 API ti\u1ec7n nghi ph\u00f2ng.'}</p>
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

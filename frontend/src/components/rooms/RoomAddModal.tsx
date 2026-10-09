import { useEffect, useState } from 'react'
import { amenities as allAmenities } from '../../data/mockData'
import type { RoomDraft, RoomTypeApiDTO } from '../../types/rooms'
import { RoomTypeDropdown } from './RoomTypeDropdown'

const NAVY = '#0d2137'
const AMBER = '#f59e0b'

interface FormData {
  room_number: string
  floor: string
  room_type_id: string
  new_type_name: string
  new_type_price: string
  new_type_area: string
  new_type_description: string
  amenity_ids: string[]
}

interface FormErrors {
  room_number?: string
  floor?: string
  room_type_id?: string
  new_type_name?: string
  price?: string
  area?: string
}

type TypeMode = 'existing' | 'new'

function parsePrice(value: string) {
  const digits = value.trim().replace(/[.,\s]/g, '')
  return /^\d+$/.test(digits) ? Number(digits) : NaN
}

function parseArea(value: string) {
  return value.trim() ? Number(value.trim().replace(',', '.')) : null
}

function validate(data: FormData, mode: TypeMode, selectedType?: RoomTypeApiDTO): FormErrors {
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

  if (mode === 'existing') {
    if (!data.room_type_id) errors.room_type_id = 'Vui lòng chọn loại phòng'
    const priceNum = selectedType?.base_price == null ? NaN : Number(selectedType.base_price)
    if (!selectedType || !Number.isFinite(priceNum) || priceNum <= 0) errors.price = 'Loại phòng chưa có giá hợp lệ từ API'
  } else {
    if (!data.new_type_name.trim()) errors.new_type_name = 'Vui lòng nhập tên loại phòng'
    else if (data.new_type_name.trim().length > 100) errors.new_type_name = 'Tên loại phòng tối đa 100 ký tự'
    const priceNum = parsePrice(data.new_type_price)
    if (!data.new_type_price.trim()) errors.price = 'Vui lòng nhập giá cơ bản'
    else if (!Number.isFinite(priceNum) || priceNum <= 0 || priceNum > 9999999999.99) errors.price = 'Giá cơ bản phải là số dương hợp lệ'
    const areaNum = parseArea(data.new_type_area)
    if (areaNum !== null && (!Number.isFinite(areaNum) || areaNum <= 0 || areaNum > 999.99)) errors.area = 'Diện tích phải lớn hơn 0 và tối đa 999,99 m²'
  }

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
    new_type_name: '',
    new_type_price: '',
    new_type_area: '',
    new_type_description: '',
    amenity_ids: [],
  })
  const [typeMode, setTypeMode] = useState<TypeMode>(() => roomTypes.length > 0 ? 'existing' : 'new')
  const [errors, setErrors] = useState<FormErrors>({})
  const selectedType = roomTypes.find(type => type.id === form.room_type_id)

  useEffect(() => {
    if (!loadingTypes && roomTypes.length === 0) setTypeMode('new')
  }, [loadingTypes, roomTypes.length])

  function handleSubmit() {
    const errs = validate(form, typeMode, selectedType)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    const roomDraft = {
      room_number: form.room_number.trim().toUpperCase(),
      floor: parseInt(form.floor, 10),
      status: 'TRONG',
      amenity_ids: form.amenity_ids,
    }
    if (typeMode === 'new') {
      const area = parseArea(form.new_type_area)
      onSave({
        ...roomDraft,
        new_room_type: {
          name: form.new_type_name.trim(),
          base_price: parsePrice(form.new_type_price),
          ...(area === null ? {} : { area_sqm: area }),
          ...(form.new_type_description.trim() ? { description: form.new_type_description.trim() } : {}),
        },
      })
    } else {
      onSave({ ...roomDraft, room_type_id: form.room_type_id })
    }
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

          {/* Chọn loại phòng có sẵn hoặc tạo mới ngay trong form */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Loại phòng <span className="text-red-500">*</span>
            </label>
            <div className="mb-3 grid grid-cols-2 rounded-xl bg-gray-100 p-1">
              <button type="button" disabled={loadingTypes || !!roomTypesError || roomTypes.length === 0} aria-pressed={typeMode === 'existing'} onClick={() => setTypeMode('existing')} className={`rounded-lg px-3 py-2 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-40 ${typeMode === 'existing' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500'}`}>
                Chọn loại có sẵn
              </button>
              <button type="button" aria-pressed={typeMode === 'new'} onClick={() => setTypeMode('new')} className={`rounded-lg px-3 py-2 text-xs font-medium transition ${typeMode === 'new' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500'}`}>
                Tạo loại mới
              </button>
            </div>
            {roomTypesError && <p role="alert" className="mb-3 text-xs text-red-600">Không tải được danh sách loại phòng; hãy kiểm tra kết nối và thử lại trước khi lưu.</p>}

            {typeMode === 'existing' ? (
              <>
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
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">Giá cơ bản</label>
                    <input type="text" readOnly aria-readonly="true" placeholder={form.room_type_id ? 'Giá chưa có từ API' : 'Chọn loại phòng'} value={selectedType?.base_price != null && Number.isFinite(Number(selectedType.base_price)) ? `${new Intl.NumberFormat('vi-VN').format(Number(selectedType.base_price))} đ/tháng` : ''} className={`${inputClass(errors.price)} bg-gray-50`} />
                    {errors.price && <p className="mt-1 text-xs text-red-500">{errors.price}</p>}
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">Diện tích (m²)</label>
                    <input type="text" readOnly aria-readonly="true" placeholder={form.room_type_id ? 'Chưa khai báo' : 'Chọn loại phòng'} value={selectedType?.area_sqm != null && Number.isFinite(Number(selectedType.area_sqm)) ? `${selectedType.area_sqm} m²` : ''} className={`${inputClass(errors.area)} bg-gray-50`} />
                  </div>
                </div>
                <p className="mt-2 text-xs text-gray-500">Giá và diện tích lấy từ loại phòng đã chọn.</p>
              </>
            ) : (
              <div className="space-y-3 rounded-xl border border-gray-200 p-3">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Tên loại phòng <span className="text-red-500">*</span></label>
                  <input type="text" maxLength={100} placeholder="Ví dụ: Phòng studio" value={form.new_type_name} onChange={e => { setForm(f => ({ ...f, new_type_name: e.target.value })); setErrors(er => ({ ...er, new_type_name: undefined })) }} className={inputClass(errors.new_type_name)} />
                  {errors.new_type_name && <p className="mt-1 text-xs text-red-500">{errors.new_type_name}</p>}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">Giá cơ bản <span className="text-red-500">*</span></label>
                    <input type="text" inputMode="numeric" placeholder="đ/tháng" value={form.new_type_price} onChange={e => { setForm(f => ({ ...f, new_type_price: e.target.value })); setErrors(er => ({ ...er, price: undefined })) }} className={inputClass(errors.price)} />
                    {errors.price && <p className="mt-1 text-xs text-red-500">{errors.price}</p>}
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">Diện tích (m²)</label>
                    <input type="text" inputMode="decimal" placeholder="Có thể để trống" value={form.new_type_area} onChange={e => { setForm(f => ({ ...f, new_type_area: e.target.value })); setErrors(er => ({ ...er, area: undefined })) }} className={inputClass(errors.area)} />
                    {errors.area && <p className="mt-1 text-xs text-red-500">{errors.area}</p>}
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Mô tả</label>
                  <textarea rows={2} placeholder="Không bắt buộc" value={form.new_type_description} onChange={e => setForm(f => ({ ...f, new_type_description: e.target.value }))} className="w-full resize-none rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#0d2137]" />
                </div>
                <p className="text-xs text-gray-500">Loại phòng mới sẽ được lưu cùng phòng trong một thao tác. Tên và giá là bắt buộc theo schema.</p>
              </div>
            )}
          </div>

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

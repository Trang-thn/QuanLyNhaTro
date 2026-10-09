import { useState, type FormEvent } from 'react'
import type { Room, RoomTypeApiDTO, CreateRoomTypeRequest, UpdateRoomTypeRequest, TypeDraft } from '../../types/rooms'

interface Props {
  roomTypes: RoomTypeApiDTO[]
  rooms: Room[]
  loading: boolean
  error: string | null
  onCreate: (input: CreateRoomTypeRequest) => Promise<boolean>
  onUpdate: (id: string, input: UpdateRoomTypeRequest) => Promise<boolean>
  onDelete: (id: string) => Promise<boolean>
}


const emptyDraft: TypeDraft = { name: '', base_price: '', area_sqm: '', description: '' }

export function RoomTypeManagement({ roomTypes, rooms, loading, error, onCreate, onUpdate, onDelete }: Props) {
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState<RoomTypeApiDTO | null | undefined>(undefined)
  const [draft, setDraft] = useState<TypeDraft>(emptyDraft)
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)

  const filteredTypes = roomTypes.filter(type => type.name.toLowerCase().includes(search.toLowerCase()))
  const formatPrice = (value: number | string | null) => value == null ? 'Chưa có giá' : `${new Intl.NumberFormat('vi-VN').format(Number(value))} đ/tháng`

  function openCreate() {
    setDraft(emptyDraft)
    setFormError('')
    setEditing(null)
  }

  function openEdit(type: RoomTypeApiDTO) {
    setDraft({ name: type.name, base_price: type.base_price == null ? '' : String(type.base_price), area_sqm: type.area_sqm == null ? '' : String(type.area_sqm), description: type.description ?? '' })
    setFormError('')
    setEditing(type)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const name = draft.name.trim()
    const price = Number(draft.base_price)
    const area = draft.area_sqm.trim() ? Number(draft.area_sqm.replace(',', '.')) : null
    if (!name || name.length > 100) { setFormError('Tên loại phòng là bắt buộc và tối đa 100 ký tự.'); return }
    if (!Number.isFinite(price) || price <= 0 || price > 9999999999.99) { setFormError('Giá cơ bản phải là số dương hợp lệ.'); return }
    if (area !== null && (!Number.isFinite(area) || area <= 0 || area > 999.99)) { setFormError('Diện tích phải lớn hơn 0 và tối đa 999,99 m².'); return }

    const input: CreateRoomTypeRequest = { name, base_price: price, area_sqm: area, description: draft.description.trim() || null }
    setSaving(true)
    const succeeded = editing
      ? await onUpdate(editing.id, input)
      : await onCreate(input)
    setSaving(false)
    if (succeeded) setEditing(undefined)
  }

  async function handleDelete(type: RoomTypeApiDTO) {
    const usageCount = rooms.filter(room => room.room_type_id === type.id).length
    if (usageCount > 0) return
    if (!window.confirm(`Xóa loại phòng “${type.name}”?`)) return
    setSaving(true)
    await onDelete(type.id)
    setSaving(false)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5">
          <input value={search} onChange={event => setSearch(event.target.value)} placeholder="Tìm loại phòng..." className="w-full text-sm outline-none" />
        </div>
        <button type="button" onClick={openCreate} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-white" style={{ background: '#f59e0b' }}>
          Thêm loại phòng
        </button>
      </div>

      {error && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      {loading ? (
        <div role="status" className="rounded-xl bg-white py-12 text-center text-sm text-gray-500">Đang tải loại phòng...</div>
      ) : roomTypes.length === 0 ? (
        <div className="rounded-xl border border-gray-100 bg-white py-12 text-center text-sm text-gray-500">Chưa có loại phòng. Hãy thêm loại đầu tiên hoặc tạo ngay trong form thêm phòng.</div>
      ) : filteredTypes.length === 0 ? (
        <div className="rounded-xl border border-gray-100 bg-white py-12 text-center text-sm text-gray-500">Không tìm thấy loại phòng phù hợp.</div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="grid grid-cols-[1.2fr_1fr_0.8fr_1.5fr_150px] gap-3 border-b bg-gray-50 px-5 py-3 text-xs font-semibold uppercase text-gray-500">
            <span>Tên loại phòng</span><span>Giá cơ bản</span><span>Diện tích</span><span>Mô tả</span><span className="text-right">Thao tác</span>
          </div>
          {filteredTypes.map(type => {
            const usageCount = rooms.filter(room => room.room_type_id === type.id).length
            return (
              <div key={type.id} className="grid grid-cols-[1.2fr_1fr_0.8fr_1.5fr_150px] items-center gap-3 border-b px-5 py-4 text-sm last:border-b-0">
                <span className="font-medium text-gray-800">{type.name}</span>
                <span className="text-gray-600">{formatPrice(type.base_price)}</span>
                <span className="text-gray-600">{type.area_sqm == null ? 'Chưa khai báo' : `${type.area_sqm} m²`}</span>
                <span className="truncate text-gray-500">{type.description || '—'}</span>
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => openEdit(type)} className="text-sm font-medium text-blue-700">Sửa</button>
                  <button type="button" disabled={saving || usageCount > 0} title={usageCount > 0 ? `Đang được ${usageCount} phòng sử dụng` : 'Xóa loại phòng'} onClick={() => void handleDelete(type)} className="text-sm font-medium text-red-600 disabled:cursor-not-allowed disabled:text-gray-300">Xóa</button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {editing !== undefined && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget && !saving) setEditing(undefined) }}>
          <form onSubmit={event => void handleSubmit(event)} className="w-full max-w-md space-y-4 rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">{editing ? 'Sửa loại phòng' : 'Thêm loại phòng'}</h2>
              <button type="button" disabled={saving} onClick={() => setEditing(undefined)} aria-label="Đóng" className="text-gray-400">×</button>
            </div>
            <label className="block text-sm font-medium text-gray-700">Tên loại phòng *
              <input required maxLength={100} value={draft.name} onChange={event => setDraft(previous => ({ ...previous, name: event.target.value }))} className="mt-1 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 font-normal" />
            </label>
            <label className="block text-sm font-medium text-gray-700">Giá cơ bản/tháng *
              <input required type="number" min="0.01" max="9999999999.99" step="0.01" value={draft.base_price} onChange={event => setDraft(previous => ({ ...previous, base_price: event.target.value }))} className="mt-1 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 font-normal" />
            </label>
            <label className="block text-sm font-medium text-gray-700">Diện tích (m²)
              <input type="number" min="0.01" max="999.99" step="0.01" value={draft.area_sqm} onChange={event => setDraft(previous => ({ ...previous, area_sqm: event.target.value }))} className="mt-1 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 font-normal" />
            </label>
            <label className="block text-sm font-medium text-gray-700">Mô tả
              <textarea rows={3} value={draft.description} onChange={event => setDraft(previous => ({ ...previous, description: event.target.value }))} className="mt-1 w-full resize-none rounded-xl border border-gray-200 px-3.5 py-2.5 font-normal" />
            </label>
            {formError && <p role="alert" className="text-sm text-red-600">{formError}</p>}
            <div className="flex gap-3 pt-1">
              <button type="button" disabled={saving} onClick={() => setEditing(undefined)} className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm text-gray-600">Hủy</button>
              <button type="submit" disabled={saving} className="flex-1 rounded-xl py-2.5 text-sm font-semibold text-white disabled:opacity-60" style={{ background: '#f59e0b' }}>{saving ? 'Đang lưu...' : editing ? 'Lưu thay đổi' : 'Thêm loại phòng'}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

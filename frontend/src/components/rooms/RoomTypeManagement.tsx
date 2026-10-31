import { useEffect, useRef, useState, type FormEvent } from 'react'
import { createPortal } from 'react-dom'
import type { Room, RoomTypeApiDTO, CreateRoomTypeRequest, UpdateRoomTypeRequest, TypeDraft } from '../../types/rooms'
import { useAnchoredMenu } from './useAnchoredMenu'

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

interface RowMenuProps {
  type: RoomTypeApiDTO
  deleteDisabled: boolean
  deleteTitle: string
  onEdit: (type: RoomTypeApiDTO) => void
  onDelete: (type: RoomTypeApiDTO) => void
}

function RowMenu({ type, deleteDisabled, deleteTitle, onEdit, onDelete }: RowMenuProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const menuStyle = useAnchoredMenu(open, triggerRef, 120, 144, true)

  useEffect(() => {
    if (!open) return
    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node
      if (!rootRef.current?.contains(target) && !menuRef.current?.contains(target)) setOpen(false)
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  return (
    <div ref={rootRef}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(current => !current)}
        aria-label={`Thao tác loại phòng ${type.name}`}
        aria-haspopup="true"
        aria-expanded={open}
        className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        <svg aria-hidden="true" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="5" r="1.5" />
          <circle cx="12" cy="12" r="1.5" />
          <circle cx="12" cy="19" r="1.5" />
        </svg>
      </button>
      {open && createPortal(
        <div ref={menuRef} style={menuStyle} className="rounded-xl border border-gray-100 bg-white py-1 shadow-lg">
          <button
            type="button"
            onClick={() => { setOpen(false); onEdit(type) }}
            className="w-full px-4 py-2.5 text-left text-sm text-gray-700 transition hover:bg-gray-50"
          >
            Sửa
          </button>
          <div className="my-1 border-t border-gray-100" />
          <button
            type="button"
            disabled={deleteDisabled}
            title={deleteTitle}
            onClick={() => { setOpen(false); onDelete(type) }}
            className="w-full px-4 py-2.5 text-left text-sm text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:bg-white"
          >
            Xóa
          </button>
        </div>,
        document.body,
      )}
    </div>
  )
}

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
    <div className="flex h-full min-h-0 flex-col gap-4">
      <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 transition focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
          <svg aria-hidden="true" className="h-4 w-4 shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input aria-label="Tìm loại phòng" value={search} onChange={event => setSearch(event.target.value)} placeholder="Tìm loại phòng..." className="w-full min-w-0 bg-transparent text-sm outline-none" />
        </div>
        <button type="button" onClick={openCreate} className="w-full rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 sm:w-auto" style={{ background: '#f59e0b' }}>
          Thêm loại phòng
        </button>
      </div>

      {error && <div role="alert" className="shrink-0 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        {loading ? (
          <div role="status" className="rounded-xl bg-white py-12 text-center text-sm text-gray-500">Đang tải loại phòng...</div>
        ) : roomTypes.length === 0 ? (
          <div className="rounded-xl border border-gray-100 bg-white py-12 text-center text-sm text-gray-500">Chưa có loại phòng. Hãy thêm loại đầu tiên hoặc tạo ngay trong form thêm phòng.</div>
        ) : filteredTypes.length === 0 ? (
          <div className="rounded-xl border border-gray-100 bg-white py-12 text-center text-sm text-gray-500">Không tìm thấy loại phòng phù hợp.</div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-sm">
            <div className="min-w-[760px]">
              <div className="grid grid-cols-[1.2fr_1fr_0.8fr_1.5fr_64px] gap-3 border-b border-gray-100 bg-gray-50 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 ">
                <span>Tên loại phòng</span><span>Giá cơ bản</span><span>Diện tích</span><span>Mô tả</span><span className="text-right">Thao tác</span>
              </div>
              {filteredTypes.map(type => {
                const usageCount = rooms.filter(room => room.room_type_id === type.id).length
                return (
                  <div key={type.id} className="grid grid-cols-[1.2fr_1fr_0.8fr_1.5fr_64px] items-center gap-3 border-b border-gray-100 px-5 py-4 text-sm last:border-b-0">
                    <span className="font-medium text-gray-800">{type.name}</span>
                    <span className="text-gray-600">{formatPrice(type.base_price)}</span>
                    <span className="text-gray-600">{type.area_sqm == null ? 'Chưa khai báo' : `${type.area_sqm} m²`}</span>
                    <span className="truncate text-gray-500">{type.description || '—'}</span>
                    <div className="flex justify-end">
                      <RowMenu
                        type={type}
                        deleteDisabled={saving || usageCount > 0}
                        deleteTitle={usageCount > 0 ? `Đang được ${usageCount} phòng sử dụng` : 'Xóa loại phòng'}
                        onEdit={openEdit}
                        onDelete={candidate => void handleDelete(candidate)}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

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

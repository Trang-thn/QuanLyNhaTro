import { useState, useCallback, useEffect, useRef } from 'react'
import { amenities as initialAmenities, rooms as previewRoomSeeds, roomTypes as previewRoomTypeSeeds } from '../../data/mockData'
import type { Room, RoomFilter, RoomMenuAction, RoomStatus, Amenity, RoomDraft, RoomApiDTO, RoomTypeApiDTO, RoomListFilters, CreateRoomTypeRequest, UpdateRoomTypeRequest } from '../../types/rooms'
import { RoomApiError, createRoom, createRoomType, deleteRoom, deleteRoomType, getRoom, listRoomTypes, listRooms, updateRoom, updateRoomStatus, updateRoomType } from '../../services/roomService'
import { RoomCard } from '../../components/rooms/RoomCard'
import { RoomEmptyState } from '../../components/rooms/RoomEmptyState'
import { FilterDropdown } from '../../components/rooms/FilterDropdown'
import { AmenityList } from '../../components/rooms/AmenityList'
import { RoomAddModal } from '../../components/rooms/RoomAddModal'
import { RoomEditModal } from '../../components/rooms/RoomEditModal'
import { RoomDetailModal } from '../../components/rooms/RoomDetailModal'
import { RoomStatusModal, RoomStatusWarningModal } from '../../components/rooms/RoomStatusModal'
import { RoomDeleteModal, RoomDeleteWarningModal } from '../../components/rooms/RoomDeleteModal'
import { AmenityAddModal } from '../../components/rooms/AmenityAddModal'
import { AmenityEditModal } from '../../components/rooms/AmenityEditModal'
import { AmenityDeleteModal, AmenityDeleteWarningModal } from '../../components/rooms/AmenityDeleteModal'
import { RoomTypeManagement } from '../../components/rooms/RoomTypeManagement'

const AMBER = '#f59e0b'
const NAVY = '#0d2137'

type Notice = { type: 'success' | 'error' | 'info'; message: string }
type ActiveModal =
  | { kind: 'none' }
  | { kind: 'add' }
  | { kind: 'edit'; room: Room }
  | { kind: 'detail'; room: Room }
  | { kind: 'status'; room: Room }
  | { kind: 'status_warning'; room: Room; newStatus: RoomStatus }
  | { kind: 'delete'; room: Room }
  | { kind: 'delete_warning'; room: Room }
  | { kind: 'amenity_add' }
  | { kind: 'amenity_edit'; amenity: Amenity }
  | { kind: 'amenity_delete'; amenity: Amenity }
  | { kind: 'amenity_delete_warning'; amenity: Amenity }

function numericValue(value: number | string | null | undefined) {
  if (value == null || value === '') return null
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

function mapApiRoom(room: RoomApiDTO): Room {
  return {
    id: room.id,
    room_number: room.room_number,
    room_type_id: room.room_type_id,
    room_type_name: room.room_type_name ?? null,
    status: room.status,
    floor: room.floor,
    description: room.description,
    created_at: room.created_at,
    price: numericValue(room.base_price),
    area: numericValue(room.area_sqm),
    // The rooms API does not return amenity assignments.
  }
}

function getErrorMessage(error: unknown) {
  if (error instanceof RoomApiError) return error.message
  return 'Unexpected error while loading room data.'
}

function mapPreviewRoom(seed: (typeof previewRoomSeeds)[number]): Room {
  const roomType = previewRoomTypeSeeds.find(type => type.id === seed.room_type_id)
  return {
    id: seed.id,
    room_number: seed.room_number,
    room_type_id: seed.room_type_id,
    room_type_name: roomType?.name ?? null,
    status: seed.status,
    floor: seed.floor,
    description: null,
    created_at: null,
    amenity_ids: [...seed.amenity_ids],
    price: roomType?.base_price ?? null,
    area: roomType?.area_sqm ?? null,
  }
}

export default function RoomPage() {
  const devPreview = import.meta.env.DEV === true && window.location.pathname === '/dev/rooms'
  const [rooms, setRooms] = useState<Room[]>(() => devPreview ? previewRoomSeeds.map(mapPreviewRoom) : [])
  const [roomTypes, setRoomTypes] = useState<RoomTypeApiDTO[]>(() => devPreview ? previewRoomTypeSeeds : [])
  const [amenities, setAmenities] = useState<Amenity[]>(initialAmenities)
  const [activeTab, setActiveTab] = useState<'rooms' | 'types' | 'amenities'>('rooms')
  const [filter, setFilter] = useState<RoomFilter>({ status: 'ALL', floor: 'ALL', type: 'ALL', search: '' })
  const [modal, setModal] = useState<ActiveModal>({ kind: 'none' })
  const [loadingRooms, setLoadingRooms] = useState(!devPreview)
  const [roomLoadError, setRoomLoadError] = useState<string | null>(null)
  const [roomTypesError, setRoomTypesError] = useState<string | null>(null)
  const [loadingTypes, setLoadingTypes] = useState(!devPreview)
  const [detailLoading, setDetailLoading] = useState(false)
  const [notice, setNotice] = useState<Notice | null>(null)
  const typesRequested = useRef(false)
  const lastRoomQuery = useRef('')
  const roomsRequestId = useRef(0)

  const currentQuery: RoomListFilters = {
    page: 1,
    limit: 100,
    floor: filter.floor === 'ALL' ? undefined : Number(filter.floor),
    status: filter.status === 'ALL' ? undefined : filter.status,
  }
  const queryKey = `${currentQuery.floor ?? ''}|${currentQuery.status ?? ''}`

  const fetchRooms = useCallback(async (query: RoomListFilters, preserveCurrentOrder = false) => {
    if (devPreview) return true
    const requestId = ++roomsRequestId.current
    setLoadingRooms(true)
    try {
      const response = await listRooms(query)
      if (requestId !== roomsRequestId.current) return false
      const freshRooms = response.data.map(mapApiRoom)
      setRooms(previous => {
        if (!preserveCurrentOrder) return freshRooms
        const freshById = new Map(freshRooms.map(room => [room.id, room]))
        const keptRooms = previous.flatMap(room => {
          const freshRoom = freshById.get(room.id)
          return freshRoom ? [freshRoom] : []
        })
        const existingIds = new Set(keptRooms.map(room => room.id))
        return [...keptRooms, ...freshRooms.filter(room => !existingIds.has(room.id))]
      })
      setRoomLoadError(null)
      return true
    } catch (error) {
      if (requestId !== roomsRequestId.current) return false
      const message = getErrorMessage(error)
      setRoomLoadError(message)
      setNotice({ type: 'error', message })
      return false
    } finally {
      if (requestId === roomsRequestId.current) setLoadingRooms(false)
    }
  }, [devPreview])

  const fetchRoomTypes = useCallback(async () => {
    if (devPreview) return true
    setLoadingTypes(true)
    try {
      setRoomTypes(await listRoomTypes())
      setRoomTypesError(null)
      return true
    } catch (error) {
      const message = getErrorMessage(error)
      setRoomTypesError(message)
      setNotice({ type: 'error', message })
      return false
    } finally {
      setLoadingTypes(false)
    }
  }, [devPreview])

  useEffect(() => {
    if (devPreview || typesRequested.current) return
    typesRequested.current = true
    void fetchRoomTypes()
  }, [devPreview, fetchRoomTypes])

  useEffect(() => {
    if (devPreview || lastRoomQuery.current === queryKey) return
    lastRoomQuery.current = queryKey
    void fetchRooms(currentQuery)
  }, [devPreview, fetchRooms, queryKey])

  const floors = [...new Set(rooms.map(room => room.floor).filter((floor): floor is number => floor !== null))].sort((a, b) => a - b)

  const filteredRooms = rooms.filter(room => {
    if (filter.status !== 'ALL' && room.status !== filter.status) return false
    if (filter.floor !== 'ALL' && String(room.floor) !== filter.floor) return false
    if (filter.type !== 'ALL' && room.room_type_id !== filter.type) return false
    if (filter.search && !room.room_number.toLowerCase().includes(filter.search.toLowerCase())) return false
    return true
  })

  const closeModal = useCallback(() => setModal({ kind: 'none' }), [])
  const handleAddRoom = useCallback(() => setModal({ kind: 'add' }), [])

  const handleMenuAction = useCallback((room: Room, action: RoomMenuAction) => {
    if (action === 'detail' && devPreview) {
      setModal({ kind: 'detail', room })
    } else if (action === 'detail') {
      setDetailLoading(true)
      void getRoom(room.id)
        .then(data => setModal({ kind: 'detail', room: mapApiRoom(data) }))
        .catch(error => setNotice({ type: 'error', message: getErrorMessage(error) }))
        .finally(() => setDetailLoading(false))
    } else if (action === 'edit') setModal({ kind: 'edit', room })
    else if (action === 'status') setModal({ kind: 'status', room })
    else if (action === 'delete') setModal({ kind: 'delete', room })
  }, [devPreview])

  const handleSaveAdd = useCallback(async (draft: RoomDraft) => {
    if (devPreview) {
      const selectedType: RoomTypeApiDTO | undefined = draft.new_room_type
        ? { id: `preview-type-${Date.now()}`, ...draft.new_room_type, area_sqm: draft.new_room_type.area_sqm ?? null, description: draft.new_room_type.description ?? null }
        : roomTypes.find(type => type.id === draft.room_type_id)
      if (!selectedType) {
        setNotice({ type: 'error', message: 'Vui lòng chọn hoặc tạo loại phòng hợp lệ.' })
        return
      }
      if (draft.new_room_type) setRoomTypes(previous => [...previous, selectedType])
      setRooms(previous => [...previous, { id: `preview-${Date.now()}`, room_number: draft.room_number, room_type_id: selectedType.id, room_type_name: selectedType.name, status: draft.status, floor: draft.floor, description: null, created_at: null, amenity_ids: draft.amenity_ids, price: numericValue(selectedType.base_price), area: numericValue(selectedType.area_sqm) }])
      setModal({ kind: 'none' })
      setNotice({ type: 'success', message: 'Development preview only: changes are kept in page memory and are not sent to the backend.' })
      return
    }
    try {
      const createdRoom = await createRoom({
        room_number: draft.room_number,
        ...(draft.new_room_type ? { new_room_type: draft.new_room_type } : { room_type_id: draft.room_type_id }),
        status: draft.status,
        floor: draft.floor,
      })
      if (draft.new_room_type && createdRoom.room_type_id) {
        const createdType: RoomTypeApiDTO = {
          id: createdRoom.room_type_id,
          name: createdRoom.room_type_name ?? draft.new_room_type.name,
          base_price: createdRoom.base_price ?? draft.new_room_type.base_price,
          area_sqm: createdRoom.area_sqm ?? draft.new_room_type.area_sqm ?? null,
          description: draft.new_room_type.description ?? null,
        }
        setRoomTypes(previous => previous.some(type => type.id === createdType.id) ? previous : [...previous, createdType].sort((a, b) => a.name.localeCompare(b.name)))
      }
      const typesRefreshed = draft.new_room_type ? await fetchRoomTypes() : true
      const refreshed = await fetchRooms(currentQuery, true)
      setModal({ kind: 'none' })
      setNotice({
        type: refreshed && typesRefreshed ? 'success' : 'info',
        message: refreshed && typesRefreshed
          ? 'Room created. The new room type is now available for later rooms; amenity selections are not saved because no amenity API is available.'
          : 'Room created, but one of the room or room type lists could not be refreshed.',
      })
    } catch (error) {
      setNotice({ type: 'error', message: getErrorMessage(error) })
    }
  }, [currentQuery.floor, currentQuery.status, devPreview, fetchRoomTypes, fetchRooms, roomTypes])

  const handleSaveEdit = useCallback(async (draft: RoomDraft, roomId: string) => {
    if (devPreview) {
      const selectedType = roomTypes.find(type => type.id === draft.room_type_id)
      setRooms(previous => previous.map(room => room.id === roomId ? { ...room, room_number: draft.room_number, room_type_id: draft.room_type_id ?? null, room_type_name: selectedType?.name ?? null, status: draft.status, floor: draft.floor, amenity_ids: draft.amenity_ids, price: numericValue(selectedType?.base_price), area: numericValue(selectedType?.area_sqm) } : room))
      setModal({ kind: 'none' })
      setNotice({ type: 'success', message: 'Development preview only: changes are kept in page memory and are not sent to the backend.' })
      return
    }
    try {
      await updateRoom(roomId, { room_number: draft.room_number, room_type_id: draft.room_type_id, floor: draft.floor })
      const refreshed = await fetchRooms(currentQuery, true)
      setModal({ kind: 'none' })
      setNotice({
        type: 'success',
        message: refreshed
          ? 'Room updated. Price and area remain controlled by its room type; amenity selections are not saved.'
          : 'Room updated, but the room list could not be refreshed.',
      })
    } catch (error) {
      setNotice({ type: 'error', message: getErrorMessage(error) })
    }
  }, [currentQuery.floor, currentQuery.status, devPreview, fetchRooms, roomTypes])

  const handleCreateRoomType = useCallback(async (input: CreateRoomTypeRequest) => {
    if (devPreview) {
      const created: RoomTypeApiDTO = { id: `preview-type-${Date.now()}`, ...input, area_sqm: input.area_sqm ?? null, description: input.description ?? null }
      setRoomTypes(previous => [...previous, created].sort((a, b) => a.name.localeCompare(b.name)))
      setNotice({ type: 'success', message: 'Development preview only: room type was added in page memory and is not sent to the backend.' })
      return true
    }
    try {
      const created = await createRoomType(input)
      setRoomTypes(previous => [...previous, created].sort((a, b) => a.name.localeCompare(b.name)))
      setNotice({ type: 'success', message: 'Room type created.' })
      return true
    } catch (error) {
      setNotice({ type: 'error', message: getErrorMessage(error) })
      return false
    }
  }, [devPreview])

  const handleUpdateRoomType = useCallback(async (id: string, input: UpdateRoomTypeRequest) => {
    if (devPreview) {
      const updated = roomTypes.find(type => type.id === id)
      if (!updated) return false
      const nextType = { ...updated, ...input }
      setRoomTypes(previous => previous.map(type => type.id === id ? nextType : type).sort((a, b) => a.name.localeCompare(b.name)))
      setRooms(previous => previous.map(room => room.room_type_id === id ? { ...room, room_type_name: nextType.name, price: numericValue(nextType.base_price), area: numericValue(nextType.area_sqm) } : room))
      setNotice({ type: 'success', message: 'Development preview only: room type changes are kept in page memory.' })
      return true
    }
    try {
      const updated = await updateRoomType(id, input)
      setRoomTypes(previous => previous.map(type => type.id === id ? updated : type).sort((a, b) => a.name.localeCompare(b.name)))
      const roomsRefreshed = await fetchRooms(currentQuery, true)
      setNotice({ type: roomsRefreshed ? 'success' : 'info', message: roomsRefreshed ? 'Room type updated.' : 'Room type updated, but the room list could not be refreshed.' })
      return true
    } catch (error) {
      setNotice({ type: 'error', message: getErrorMessage(error) })
      return false
    }
  }, [currentQuery.floor, currentQuery.status, devPreview, fetchRooms, roomTypes])

  const handleDeleteRoomType = useCallback(async (id: string) => {
    if (devPreview) {
      if (rooms.some(room => room.room_type_id === id)) {
        setNotice({ type: 'error', message: 'Cannot delete a room type assigned to a room.' })
        return false
      }
      setRoomTypes(previous => previous.filter(type => type.id !== id))
      setNotice({ type: 'success', message: 'Development preview only: room type was removed from page memory.' })
      return true
    }
    try {
      await deleteRoomType(id)
      setRoomTypes(previous => previous.filter(type => type.id !== id))
      setNotice({ type: 'success', message: 'Room type deleted.' })
      return true
    } catch (error) {
      setNotice({ type: 'error', message: getErrorMessage(error) })
      return false
    }
  }, [devPreview, rooms])

  const handleSaveStatus = useCallback(async (room: Room, newStatus: RoomStatus) => {
    if (devPreview) {
      setRooms(previous => previous.map(item => item.id === room.id ? { ...item, status: newStatus } : item))
      setModal({ kind: 'none' })
      setNotice({ type: 'success', message: 'Development preview only: changes are kept in page memory and are not sent to the backend.' })
      return
    }
    try {
      await updateRoomStatus(room.id, newStatus)
      const refreshed = await fetchRooms(currentQuery, true)
      setModal({ kind: 'none' })
      setNotice({ type: refreshed ? 'success' : 'error', message: refreshed ? 'Room status updated.' : 'Status updated, but the room list could not be refreshed.' })
    } catch (error) {
      setNotice({ type: 'error', message: getErrorMessage(error) })
    }
  }, [currentQuery.floor, currentQuery.status, devPreview, fetchRooms])

  const handleConfirmDelete = useCallback(async (room: Room) => {
    if (devPreview) {
      setRooms(previous => previous.filter(item => item.id !== room.id))
      setModal({ kind: 'none' })
      setNotice({ type: 'success', message: 'Development preview only: changes are kept in page memory and are not sent to the backend.' })
      return
    }
    try {
      await deleteRoom(room.id)
      const refreshed = await fetchRooms(currentQuery, true)
      setModal({ kind: 'none' })
      setNotice({ type: refreshed ? 'success' : 'error', message: refreshed ? 'Room deleted.' : 'Room deleted, but the room list could not be refreshed.' })
    } catch (error) {
      setNotice({ type: 'error', message: getErrorMessage(error) })
    }
  }, [currentQuery.floor, currentQuery.status, devPreview, fetchRooms])

  const handleSaveAddAmenity = useCallback((amenity: Amenity) => {
    setAmenities(prev => [...prev, amenity])
    setModal({ kind: 'none' })
  }, [])

  const handleSaveEditAmenity = useCallback((updated: Amenity) => {
    setAmenities(prev => prev.map(amenity => amenity.id === updated.id ? updated : amenity))
    setModal({ kind: 'none' })
  }, [])

  const handleConfirmDeleteAmenity = useCallback((amenity: Amenity) => {
    setAmenities(prev => prev.filter(item => item.id !== amenity.id))
    setModal({ kind: 'none' })
  }, [])

  const retryLoading = useCallback(() => {
    void fetchRoomTypes()
    void fetchRooms(currentQuery)
  }, [currentQuery.floor, currentQuery.status, fetchRoomTypes, fetchRooms])

  return (
    <div className="flex flex-col gap-5">
      {devPreview && (
        <div role="status" className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
          Development preview: mock data only. No API requests are sent from this route.
        </div>
      )}
      {notice && (
        <div
          role={notice.type === 'error' ? 'alert' : 'status'}
          className={`fixed top-4 right-4 z-[60] max-w-lg rounded-xl border px-4 py-3 text-sm shadow-lg ${notice.type === 'error' ? 'border-red-200 bg-red-50 text-red-700' : notice.type === 'success' ? 'border-green-200 bg-green-50 text-green-700' : 'border-blue-200 bg-blue-50 text-blue-700'}`}
        >
          <div className="flex items-start justify-between gap-4">
            <span>{notice.message}</span>
            <button type="button" onClick={() => setNotice(null)} aria-label="Dismiss">x</button>
          </div>
        </div>
      )}
      {notice?.type === 'error' && (
        <button type="button" onClick={retryLoading} className="fixed top-16 right-4 z-[60] rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow">
          Retry room data
        </button>
      )}
      {detailLoading && <div role="status" className="fixed top-4 left-1/2 z-[60] rounded-lg bg-white px-4 py-2 text-sm shadow">Loading room details...</div>}
      {activeTab === 'amenities' && (
        <div role="status" className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Amenity management currently uses page-local mock data; no amenity API is available.
        </div>
      )}
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm" aria-label="Breadcrumb">
        <span className="text-gray-400">Tổng quan</span>
        <span className="text-gray-300">/</span>
        <span className="font-semibold" style={{ color: NAVY }}>Phòng trọ</span>
      </nav>

      {/* Tab bar + action button */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-0.5 p-1 rounded-lg" style={{ background: '#f3f4f6' }}>
          <button
            onClick={() => setActiveTab('rooms')}
            className="px-4 py-1.5 rounded-md text-sm font-medium transition-all"
            style={{
              background: activeTab === 'rooms' ? NAVY : 'transparent',
              color: activeTab === 'rooms' ? 'white' : '#6b7280',
            }}
          >
            Danh sách phòng
          </button>
          <button
            onClick={() => setActiveTab('amenities')}
            className="px-4 py-1.5 rounded-md text-sm font-medium transition-all"
            style={{
              background: activeTab === 'amenities' ? NAVY : 'transparent',
              color: activeTab === 'amenities' ? 'white' : '#6b7280',
            }}
          >
            Tiện nghi
          </button>
          <button
            onClick={() => setActiveTab('types')}
            className="px-4 py-1.5 rounded-md text-sm font-medium transition-all"
            style={{
              background: activeTab === 'types' ? NAVY : 'transparent',
              color: activeTab === 'types' ? 'white' : '#6b7280',
            }}
          >
            Loại phòng
          </button>
        </div>

        {activeTab === 'rooms' && (
          <button
            onClick={handleAddRoom}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold shadow-sm transition hover:brightness-95 active:scale-95"
            style={{ background: AMBER }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Thêm phòng mới
          </button>
        )}
      </div>

      {/* ── TAB: Danh sách phòng ── */}
      {activeTab === 'rooms' && (
        <>
          {/* Filter bar */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4 flex flex-wrap items-center gap-3">
            <FilterDropdown
              value={filter.status}
              onChange={v => setFilter(f => ({ ...f, status: v }))}
              options={[
                { value: 'ALL', label: 'Trạng thái: Tất cả' },
                { value: 'DANG_THUE', label: 'Đang thuê' },
                { value: 'TRONG', label: 'Trống' },
                { value: 'BAO_TRI', label: 'Bảo trì' },
              ]}
            />
            <FilterDropdown
              value={filter.floor}
              onChange={v => setFilter(f => ({ ...f, floor: v }))}
              options={[
                { value: 'ALL', label: 'Tầng: Tất cả' },
                ...floors.map(fl => ({ value: String(fl), label: `Tầng ${fl}` })),
              ]}
            />
            <FilterDropdown
              value={filter.type}
              onChange={v => setFilter(f => ({ ...f, type: v }))}
              options={[
                { value: 'ALL', label: 'Loại phòng: Tất cả' },
                ...roomTypes.map(t => ({ value: t.id, label: t.name })),
              ]}
            />
            <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 flex-1 min-w-[180px] hover:border-gray-300 transition">
              <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Nhập số phòng..."
                value={filter.search}
                onChange={e => setFilter(f => ({ ...f, search: e.target.value }))}
                className="flex-1 text-sm text-gray-700 outline-none bg-transparent placeholder:text-gray-400"
              />
              {filter.search && (
                <button onClick={() => setFilter(f => ({ ...f, search: '' }))} className="text-gray-400 hover:text-gray-600 transition">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Room grid / Empty states */}
          {loadingRooms ? (
            <div role="status" className="py-12 text-center text-sm text-gray-500">Loading rooms...</div>
          ) : roomLoadError && rooms.length === 0 ? (
            <div role="alert" className="rounded-xl border border-red-200 bg-red-50 py-12 text-center text-sm text-red-700">Room data could not be loaded. Use retry to request it again.</div>
          ) : rooms.length === 0 ? (
            <RoomEmptyState onAdd={() => setModal({ kind: 'add' })} />
          ) : filteredRooms.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-16 gap-3">
              <svg className="w-10 h-10 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-sm text-gray-400">Không tìm thấy phòng nào phù hợp với bộ lọc</p>
              <button
                onClick={() => setFilter({ status: 'ALL', floor: 'ALL', type: 'ALL', search: '' })}
                className="text-xs font-medium transition"
                style={{ color: AMBER }}
              >
                Xóa bộ lọc
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRooms.map(room => (
                <RoomCard key={room.id} room={room} onAction={handleMenuAction} />
              ))}
            </div>
          )}
        </>
      )}

      {/* ── TAB: Tiện nghi ── */}
      {activeTab === 'amenities' && (
        <AmenityList
          amenities={amenities}
          rooms={rooms}
          onAdd={() => setModal({ kind: 'amenity_add' })}
          onEdit={a => setModal({ kind: 'amenity_edit', amenity: a })}
          onDelete={a => {
            const inUse = rooms.some(r => (r.amenity_ids ?? []).includes(a.id))
            if (inUse) {
              setModal({ kind: 'amenity_delete_warning', amenity: a })
            } else {
              setModal({ kind: 'amenity_delete', amenity: a })
            }
          }}
        />
      )}

      {/* ── Room modals ── */}

      {modal.kind === 'add' && (
        <RoomAddModal onClose={closeModal} onSave={handleSaveAdd} roomTypes={roomTypes} loadingTypes={loadingTypes} roomTypesError={roomTypesError} />
      )}

      {activeTab === 'types' && (
        <RoomTypeManagement
          roomTypes={roomTypes}
          rooms={rooms}
          loading={loadingTypes}
          error={roomTypesError}
          onCreate={handleCreateRoomType}
          onUpdate={handleUpdateRoomType}
          onDelete={handleDeleteRoomType}
        />
      )}
      {modal.kind === 'edit' && (
        <RoomEditModal room={modal.room} onClose={closeModal} roomTypes={roomTypes} loadingTypes={loadingTypes} roomTypesError={roomTypesError} onSave={draft => handleSaveEdit(draft, modal.room.id)} />
      )}
      {modal.kind === 'detail' && (
        <RoomDetailModal
          room={modal.room}
          onClose={closeModal}
          allAmenities={amenities}
        />
      )}
      {modal.kind === 'status' && (
        <RoomStatusModal
          room={modal.room}
          onClose={closeModal}
          onSave={newStatus => handleSaveStatus(modal.room, newStatus)}
          onNeedWarning={newStatus => setModal({ kind: 'status_warning', room: modal.room, newStatus })}
        />
      )}
      {modal.kind === 'status_warning' && (
        <RoomStatusWarningModal
          room={modal.room}
          newStatus={modal.newStatus}
          onClose={closeModal}
          onConfirm={() => handleSaveStatus(modal.room, modal.newStatus)}
        />
      )}
      {modal.kind === 'delete' && (
        <RoomDeleteModal
          room={modal.room}
          onClose={closeModal}
          onProceed={() => setModal({ kind: 'delete_warning', room: modal.room })}
        />
      )}
      {modal.kind === 'delete_warning' && (
        <RoomDeleteWarningModal
          room={modal.room}
          onClose={closeModal}
          onConfirm={() => handleConfirmDelete(modal.room)}
        />
      )}
      {/* ── Amenity modals ── */}

      {modal.kind === 'amenity_add' && (
        <AmenityAddModal onClose={closeModal} onSave={handleSaveAddAmenity} />
      )}
      {modal.kind === 'amenity_edit' && (
        <AmenityEditModal amenity={modal.amenity} onClose={closeModal} onSave={handleSaveEditAmenity} />
      )}
      {modal.kind === 'amenity_delete' && (
        <AmenityDeleteModal
          amenity={modal.amenity}
          onClose={closeModal}
          onConfirm={() => handleConfirmDeleteAmenity(modal.amenity)}
        />
      )}
      {modal.kind === 'amenity_delete_warning' && (
        <AmenityDeleteWarningModal
          onClose={closeModal}
        />
      )}
    </div>
  )
}

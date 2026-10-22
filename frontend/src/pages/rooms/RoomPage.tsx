import { useState, useCallback, useEffect, useRef } from 'react'
import { amenities as initialAmenities, rooms as previewRoomSeeds, roomTypes as previewRoomTypeSeeds } from '../../data/mockData'
import type { Room, RoomFilter, RoomMenuAction, RoomStatus, Amenity, RoomDraft, RoomApiDTO, RoomTypeApiDTO, RoomListFilters, CreateRoomTypeRequest, UpdateRoomTypeRequest } from '../../types/rooms'
import { RoomApiError, createAmenity, createRoom, createRoomType, deleteAmenity, deleteRoom, deleteRoomType, getRoom, listAmenities, listRoomAmenities, listRoomTypes, listRooms, replaceRoomAmenities, updateAmenity, updateRoom, updateRoomStatus, updateRoomType } from '../../services/roomService'
import { RoomCard } from '../../components/rooms/RoomCard'
import { RoomEmptyState } from '../../components/rooms/RoomEmptyState'
import { FilterDropdown } from '../../components/rooms/FilterDropdown'
import { AmenityList } from '../../components/rooms/AmenityList'
import { RoomAddModal } from '../../components/rooms/RoomAddModal'
import { RoomEditModal } from '../../components/rooms/RoomEditModal'
import { RoomDetailModal } from '../../components/rooms/RoomDetailModal'
import { RoomStatusModal } from '../../components/rooms/RoomStatusModal'
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
    has_active_contract: room.has_active_contract === undefined ? undefined : Boolean(room.has_active_contract),
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
  return 'Đã xảy ra lỗi không mong muốn khi tải dữ liệu phòng.'
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
  const [amenities, setAmenities] = useState<Amenity[]>(() => devPreview ? initialAmenities : [])
  const [activeTab, setActiveTab] = useState<'rooms' | 'types'>('rooms')
  const [amenityManagerOpen, setAmenityManagerOpen] = useState(false)
  const [filter, setFilter] = useState<RoomFilter>({ status: 'ALL', floor: 'ALL', type: 'ALL', search: '' })
  const [roomPage, setRoomPage] = useState(1)
  const [roomPageSize, setRoomPageSize] = useState(12)
  const [modal, setModal] = useState<ActiveModal>({ kind: 'none' })
  const [loadingRooms, setLoadingRooms] = useState(!devPreview)
  const [roomLoadError, setRoomLoadError] = useState<string | null>(null)
  const [roomTypesError, setRoomTypesError] = useState<string | null>(null)
  const [loadingTypes, setLoadingTypes] = useState(!devPreview)
  const [loadingAmenities, setLoadingAmenities] = useState(!devPreview)
  const [amenitiesError, setAmenitiesError] = useState<string | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [notice, setNotice] = useState<Notice | null>(null)
  const amenityManagerTriggerRef = useRef<HTMLButtonElement>(null)
  const amenityManagerCloseRef = useRef<HTMLButtonElement>(null)
  const typesRequested = useRef(false)
  const lastRoomQuery = useRef('')
  const roomsRequestId = useRef(0)

  useEffect(() => {
    if (!notice) return
    const timeoutId = window.setTimeout(() => {
      setNotice(current => current === notice ? null : current)
    }, 3000)
    return () => window.clearTimeout(timeoutId)
  }, [notice])

  useEffect(() => {
    if (!amenityManagerOpen || modal.kind !== 'none') return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setAmenityManagerOpen(false)
        amenityManagerTriggerRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [amenityManagerOpen, modal.kind])

  useEffect(() => {
    if (amenityManagerOpen && modal.kind === 'none') amenityManagerCloseRef.current?.focus()
  }, [amenityManagerOpen, modal.kind])

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

  const fetchAmenities = useCallback(async () => {
    if (devPreview) return true
    setLoadingAmenities(true)
    try {
      setAmenities((await listAmenities()).map(({ id, name, room_count }) => ({ id, name, room_count })))
      setAmenitiesError(null)
      return true
    } catch (error) {
      const message = getErrorMessage(error)
      setAmenitiesError(message)
      setNotice({ type: 'error', message })
      return false
    } finally {
      setLoadingAmenities(false)
    }
  }, [devPreview])

  useEffect(() => {
    if (devPreview || typesRequested.current) return
    typesRequested.current = true
    void fetchRoomTypes()
  }, [devPreview, fetchRoomTypes])

  useEffect(() => {
    void fetchAmenities()
  }, [fetchAmenities])

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
  const roomPageCount = Math.max(1, Math.ceil(filteredRooms.length / roomPageSize))
  const visibleRooms = filteredRooms.slice((roomPage - 1) * roomPageSize, roomPage * roomPageSize)
  const firstVisibleRoom = filteredRooms.length === 0 ? 0 : (roomPage - 1) * roomPageSize + 1
  const lastVisibleRoom = Math.min(roomPage * roomPageSize, filteredRooms.length)

  useEffect(() => {
    setRoomPage(1)
  }, [filter.status, filter.floor, filter.type, filter.search])

  useEffect(() => {
    setRoomPage(current => Math.min(current, roomPageCount))
  }, [roomPageCount])

  const closeModal = useCallback(() => setModal({ kind: 'none' }), [])
  const handleAddRoom = useCallback(() => setModal({ kind: 'add' }), [])

  const handleMenuAction = useCallback((room: Room, action: RoomMenuAction) => {
    if (action === 'detail' && devPreview) {
      setModal({ kind: 'detail', room })
    } else if (action === 'detail') {
      setDetailLoading(true)
      void Promise.all([getRoom(room.id), listRoomAmenities(room.id)])
        .then(([data, assigned]) => setModal({ kind: 'detail', room: { ...mapApiRoom(data), amenity_ids: assigned.map(item => item.id) } }))
        .catch(error => setNotice({ type: 'error', message: getErrorMessage(error) }))
        .finally(() => setDetailLoading(false))
    } else if (action === 'edit' && devPreview) setModal({ kind: 'edit', room })
    else if (action === 'edit') {
      setDetailLoading(true)
      void listRoomAmenities(room.id)
        .then(assigned => setModal({ kind: 'edit', room: { ...room, amenity_ids: assigned.map(item => item.id) } }))
        .catch(error => setNotice({ type: 'error', message: getErrorMessage(error) }))
        .finally(() => setDetailLoading(false))
    }
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
      setNotice({ type: 'success', message: 'Bản xem trước: thay đổi chỉ được giữ trong bộ nhớ trang, chưa gửi lên máy chủ.' })
      return
    }
    try {
      const createdRoom = await createRoom({
        room_number: draft.room_number,
        ...(draft.new_room_type ? { new_room_type: draft.new_room_type } : { room_type_id: draft.room_type_id }),
        status: draft.status,
        floor: draft.floor,
      })
      let assignmentsSaved = true
      try {
        await replaceRoomAmenities(createdRoom.id, draft.amenity_ids)
      } catch (error) {
        assignmentsSaved = false
        setNotice({ type: 'error', message: `Đã tạo phòng nhưng chưa lưu được tiện nghi: ${getErrorMessage(error)}` })
      }
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
      if (assignmentsSaved) void fetchAmenities()
      setModal({ kind: 'none' })
      setNotice({
        type: !assignmentsSaved ? 'error' : refreshed && typesRefreshed ? 'success' : 'info',
        message: !assignmentsSaved
          ? 'Đã tạo phòng nhưng chưa lưu được tiện nghi đã gán. Hãy kiểm tra kết nối rồi thử tải lại.'
          : refreshed && typesRefreshed
            ? 'Tạo phòng thành công.'
            : 'Đã tạo phòng nhưng chưa tải lại được danh sách phòng hoặc loại phòng.',
      })
    } catch (error) {
      setNotice({ type: 'error', message: getErrorMessage(error) })
    }
  }, [currentQuery.floor, currentQuery.status, devPreview, fetchAmenities, fetchRoomTypes, fetchRooms, roomTypes])

  const handleSaveEdit = useCallback(async (draft: RoomDraft, roomId: string) => {
    if (devPreview) {
      const selectedType = roomTypes.find(type => type.id === draft.room_type_id)
      setRooms(previous => previous.map(room => room.id === roomId ? { ...room, room_number: draft.room_number, room_type_id: draft.room_type_id ?? null, room_type_name: selectedType?.name ?? null, status: draft.status, floor: draft.floor, amenity_ids: draft.amenity_ids, price: numericValue(selectedType?.base_price), area: numericValue(selectedType?.area_sqm) } : room))
      setModal({ kind: 'none' })
      setNotice({ type: 'success', message: 'Bản xem trước: thay đổi chỉ được giữ trong bộ nhớ trang, chưa gửi lên máy chủ.' })
      return
    }
    try {
      await updateRoom(roomId, { room_number: draft.room_number, room_type_id: draft.room_type_id, floor: draft.floor })
      try {
        await replaceRoomAmenities(roomId, draft.amenity_ids)
      } catch (error) {
        setModal({ kind: 'none' })
        setNotice({ type: 'error', message: `Đã cập nhật phòng nhưng chưa lưu được tiện nghi đã gán: ${getErrorMessage(error)}` })
        return
      }
      const refreshed = await fetchRooms(currentQuery, true)
      void fetchAmenities()
      setModal({ kind: 'none' })
      setNotice({
        type: 'success',
        message: refreshed
          ? 'Cập nhật thành công.'
          : 'Đã cập nhật phòng nhưng chưa tải lại được danh sách phòng.',
      })
    } catch (error) {
      setNotice({ type: 'error', message: getErrorMessage(error) })
    }
  }, [currentQuery.floor, currentQuery.status, devPreview, fetchAmenities, fetchRooms, roomTypes])

  const handleCreateRoomType = useCallback(async (input: CreateRoomTypeRequest) => {
    if (devPreview) {
      const created: RoomTypeApiDTO = { id: `preview-type-${Date.now()}`, ...input, area_sqm: input.area_sqm ?? null, description: input.description ?? null }
      setRoomTypes(previous => [...previous, created].sort((a, b) => a.name.localeCompare(b.name)))
      setNotice({ type: 'success', message: 'Bản xem trước: loại phòng chỉ được thêm trong bộ nhớ trang, chưa gửi lên máy chủ.' })
      return true
    }
    try {
      const created = await createRoomType(input)
      setRoomTypes(previous => [...previous, created].sort((a, b) => a.name.localeCompare(b.name)))
      setNotice({ type: 'success', message: 'Đã thêm loại phòng.' })
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
      setNotice({ type: 'success', message: 'Bản xem trước: thay đổi loại phòng chỉ được giữ trong bộ nhớ trang.' })
      return true
    }
    try {
      const updated = await updateRoomType(id, input)
      setRoomTypes(previous => previous.map(type => type.id === id ? updated : type).sort((a, b) => a.name.localeCompare(b.name)))
      const roomsRefreshed = await fetchRooms(currentQuery, true)
      setNotice({ type: roomsRefreshed ? 'success' : 'info', message: roomsRefreshed ? 'Đã cập nhật loại phòng.' : 'Đã cập nhật loại phòng nhưng chưa tải lại được danh sách phòng.' })
      return true
    } catch (error) {
      setNotice({ type: 'error', message: getErrorMessage(error) })
      return false
    }
  }, [currentQuery.floor, currentQuery.status, devPreview, fetchRooms, roomTypes])

  const handleDeleteRoomType = useCallback(async (id: string) => {
    if (devPreview) {
      if (rooms.some(room => room.room_type_id === id)) {
        setNotice({ type: 'error', message: 'Không thể xóa loại phòng đang được phòng sử dụng.' })
        return false
      }
      setRoomTypes(previous => previous.filter(type => type.id !== id))
      setNotice({ type: 'success', message: 'Bản xem trước: loại phòng đã được xóa khỏi bộ nhớ trang.' })
      return true
    }
    try {
      await deleteRoomType(id)
      setRoomTypes(previous => previous.filter(type => type.id !== id))
      setNotice({ type: 'success', message: 'Đã xóa loại phòng.' })
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
      setNotice({ type: 'success', message: 'Bản xem trước: thay đổi chỉ được giữ trong bộ nhớ trang, chưa gửi lên máy chủ.' })
      return
    }
    try {
      await updateRoomStatus(room.id, newStatus)
      const refreshed = await fetchRooms(currentQuery, true)
      setModal({ kind: 'none' })
      setNotice({ type: refreshed ? 'success' : 'error', message: refreshed ? 'Đã cập nhật trạng thái phòng.' : 'Đã cập nhật trạng thái nhưng chưa tải lại được danh sách phòng.' })
    } catch (error) {
      setNotice({ type: 'error', message: getErrorMessage(error) })
    }
  }, [currentQuery.floor, currentQuery.status, devPreview, fetchRooms])

  const handleConfirmDelete = useCallback(async (room: Room) => {
    if (devPreview) {
      setRooms(previous => previous.filter(item => item.id !== room.id))
      setModal({ kind: 'none' })
      setNotice({ type: 'success', message: 'Bản xem trước: thay đổi chỉ được giữ trong bộ nhớ trang, chưa gửi lên máy chủ.' })
      return
    }
    try {
      await deleteRoom(room.id)
      const refreshed = await fetchRooms(currentQuery, true)
      setModal({ kind: 'none' })
      setNotice({ type: refreshed ? 'success' : 'error', message: refreshed ? 'Đã xóa phòng.' : 'Đã xóa phòng nhưng chưa tải lại được danh sách phòng.' })
    } catch (error) {
      setNotice({ type: 'error', message: getErrorMessage(error) })
    }
  }, [currentQuery.floor, currentQuery.status, devPreview, fetchRooms])

  const handleSaveAddAmenity = useCallback(async (amenity: Amenity) => {
    if (devPreview) {
      setAmenities(prev => [...prev, { ...amenity, id: `preview-amenity-${Date.now()}` }])
      setModal({ kind: 'none' })
      return
    }
    try {
      const created = await createAmenity({ name: amenity.name })
      setAmenities(prev => [...prev, { ...created, room_count: created.room_count ?? 0 }].sort((a, b) => a.name.localeCompare(b.name)))
      setModal({ kind: 'none' })
      setNotice({ type: 'success', message: 'Đã thêm tiện nghi.' })
    } catch (error) {
      setNotice({ type: 'error', message: getErrorMessage(error) })
    }
  }, [devPreview])

  const handleSaveEditAmenity = useCallback(async (updated: Amenity) => {
    if (devPreview) {
      setAmenities(prev => prev.map(amenity => amenity.id === updated.id ? updated : amenity))
      setModal({ kind: 'none' })
      return
    }
    try {
      const saved = await updateAmenity(updated.id, { name: updated.name })
      setAmenities(prev => prev.map(amenity => amenity.id === saved.id ? { ...saved, room_count: amenity.room_count ?? saved.room_count ?? 0 } : amenity).sort((a, b) => a.name.localeCompare(b.name)))
      setModal({ kind: 'none' })
      setNotice({ type: 'success', message: 'Đã cập nhật tiện nghi.' })
    } catch (error) {
      setNotice({ type: 'error', message: getErrorMessage(error) })
    }
  }, [devPreview])

  const handleConfirmDeleteAmenity = useCallback(async (amenity: Amenity) => {
    if (devPreview) {
      setAmenities(prev => prev.filter(item => item.id !== amenity.id))
      setModal({ kind: 'none' })
      return
    }
    try {
      await deleteAmenity(amenity.id)
      setAmenities(prev => prev.filter(item => item.id !== amenity.id))
      setRooms(prev => prev.map(room => ({ ...room, amenity_ids: room.amenity_ids?.filter(id => id !== amenity.id) })))
      setModal({ kind: 'none' })
      setNotice({ type: 'success', message: 'Đã xóa tiện nghi.' })
    } catch (error) {
      setNotice({ type: 'error', message: getErrorMessage(error) })
    }
  }, [devPreview])

  const retryLoading = useCallback(() => {
    void fetchRoomTypes()
    void fetchRooms(currentQuery)
    void fetchAmenities()
  }, [currentQuery.floor, currentQuery.status, fetchAmenities, fetchRoomTypes, fetchRooms])

  return (
    <div className="flex h-[calc(100vh-108px)] min-h-[320px] flex-col gap-4 overflow-hidden">
      {devPreview && (
        <div role="status" className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
          Bản xem trước: chỉ dùng dữ liệu mẫu, không gửi yêu cầu đến API.
        </div>
      )}
      {notice && (
        <div
          role={notice.type === 'error' ? 'alert' : 'status'}
          className={`fixed top-4 right-4 z-[60] max-w-lg rounded-xl border px-4 py-3 text-sm shadow-lg ${notice.type === 'error' ? 'border-red-200 bg-red-50 text-red-700' : notice.type === 'success' ? 'border-green-200 bg-green-50 text-green-700' : 'border-blue-200 bg-blue-50 text-blue-700'}`}
        >
          <div className="flex items-start justify-between gap-4">
            <span>{notice.message}</span>
            <button type="button" onClick={() => setNotice(null)} aria-label="Đóng thông báo">×</button>
          </div>
        </div>
      )}
      {notice?.type === 'error' && (
        <button type="button" onClick={retryLoading} className="fixed top-16 right-4 z-[60] rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow">
          Tải lại dữ liệu
        </button>
      )}
      {detailLoading && <div role="status" className="fixed top-4 left-1/2 z-[60] rounded-lg bg-white px-4 py-2 text-sm shadow">Đang tải chi tiết phòng…</div>}
      <header className="flex shrink-0 flex-col gap-5">
        {/* <div className="flex flex-col gap-1">
          <nav className="flex items-center gap-1.5 text-xs font-medium text-gray-500" aria-label="Breadcrumb">
            <span>Tổng quan</span>
            <span aria-hidden="true" className="text-gray-300">/</span>
            <span style={{ color: NAVY }}>Phòng trọ</span>
          </nav>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: NAVY }}>Quản lý phòng trọ</h1>
          <p className="text-sm text-gray-500">Theo dõi phòng, tiện nghi và loại phòng trong nhà trọ.</p>
        </div>

        {/* Tab bar + action button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div role="group" aria-label="Khu vực quản lý" className="flex w-full sm:w-auto items-center gap-1 p-1 rounded-xl border border-gray-200 bg-white overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab('rooms')}
              aria-pressed={activeTab === 'rooms'}
              className="shrink-0 px-4 py-2 rounded-lg text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1"
              style={{
                background: activeTab === 'rooms' ? NAVY : 'transparent',
                color: activeTab === 'rooms' ? 'white' : '#6b7280',
              }}
            >
              Danh sách phòng
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('types')}
              aria-pressed={activeTab === 'types'}
              className="shrink-0 px-4 py-2 rounded-lg text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1"
              style={{
                background: activeTab === 'types' ? NAVY : 'transparent',
                color: activeTab === 'types' ? 'white' : '#6b7280',
              }}
            >
              Loại phòng
            </button>
          </div>

          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            {activeTab === 'rooms' && (
              <button
                ref={amenityManagerTriggerRef}
                type="button"
                onClick={() => setAmenityManagerOpen(true)}
                aria-haspopup="dialog"
                aria-expanded={amenityManagerOpen}
                className="inline-flex w-full justify-center rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 sm:w-auto"
              >
                Quản lý tiện nghi
              </button>
            )}
            {activeTab === 'rooms' && (
              <button
                onClick={handleAddRoom}
                className="inline-flex w-full justify-center items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold shadow-sm transition hover:brightness-95 active:scale-[.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 sm:w-auto"
                style={{ background: AMBER }}
              >
                <svg className="w-4 h-4" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                Thêm phòng mới
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ── TAB: Danh sách phòng ── */}
      {activeTab === 'rooms' && (
        <div className="flex min-h-0 flex-1 flex-col gap-4">
          {/* Filter bar */}
          <section aria-label="Tìm kiếm và lọc phòng" className="shrink-0 bg-white rounded-2xl border border-gray-200 px-4 sm:px-5 py-4 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2.5">
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
            <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5 flex-1 min-w-[180px] hover:border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition">
              <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Nhập số phòng..."
                aria-label="Tìm theo số phòng"
                value={filter.search}
                onChange={e => setFilter(f => ({ ...f, search: e.target.value }))}
                className="flex-1 min-w-0 text-sm text-gray-700 outline-none bg-transparent placeholder:text-gray-400"
              />
              {filter.search && (
                <button type="button" aria-label="Xóa nội dung tìm kiếm" onClick={() => setFilter(f => ({ ...f, search: '' }))} className="rounded-md p-1 text-gray-400 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </section>

          {/* Room grid / Empty states */}
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1">
            {loadingRooms ? (
              <div role="status" className="rounded-2xl border border-gray-200 bg-white py-14 text-center text-sm text-gray-600">Đang tải danh sách phòng…</div>
            ) : roomLoadError && rooms.length === 0 ? (
              <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-5 py-12 text-center text-sm text-red-700">Không tải được dữ liệu phòng. Vui lòng thử tải lại.</div>
            ) : rooms.length === 0 ? (
              <RoomEmptyState onAdd={() => setModal({ kind: 'add' })} />
            ) : filteredRooms.length === 0 ? (
              <div className="rounded-2xl border border-gray-200 bg-white flex flex-col items-center justify-center px-5 py-16 gap-3">
                <svg className="w-10 h-10 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <p className="text-sm text-gray-400">Không tìm thấy phòng nào phù hợp với bộ lọc</p>
                <button
                  onClick={() => setFilter({ status: 'ALL', floor: 'ALL', type: 'ALL', search: '' })}
                  className="rounded-lg px-3 py-2 text-sm font-semibold transition hover:bg-amber-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                  style={{ color: AMBER }}
                >
                  Xóa bộ lọc
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 content-start sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-5">
                {visibleRooms.map(room => (
                  <RoomCard key={room.id} room={room} onAction={handleMenuAction} />
                ))}
              </div>
            )}
          </div>
          {!loadingRooms && filteredRooms.length > 0 && (
            <nav aria-label="Phân trang danh sách phòng" className="shrink-0 flex flex-col gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <p aria-live="polite" className="text-sm text-gray-600">
                Đang hiển thị <span className="font-semibold text-gray-900">{firstVisibleRoom}–{lastVisibleRoom}</span> trên <span className="font-semibold text-gray-900">{filteredRooms.length}</span> phòng đã tải
              </p>
              <div className="flex items-center justify-between gap-2 sm:justify-end">
                <label htmlFor="room-page-size" className="text-sm text-gray-600">Mỗi trang</label>
                <select
                  id="room-page-size"
                  value={roomPageSize}
                  onChange={event => { setRoomPageSize(Number(event.target.value)); setRoomPage(1) }}
                  aria-label="Số phòng mỗi trang"
                  className="rounded-lg border border-gray-200 bg-white px-2.5 py-2 text-sm text-gray-700"
                >
                  <option value={12}>12</option>
                  <option value={24}>24</option>
                  <option value={48}>48</option>
                </select>
                <button type="button" onClick={() => setRoomPage(page => Math.max(1, page - 1))} disabled={roomPage <= 1} className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40">Trước</button>
                <span aria-current="page" className="min-w-20 text-center text-sm text-gray-600">Trang {roomPage} / {roomPageCount}</span>
                <button type="button" onClick={() => setRoomPage(page => Math.min(roomPageCount, page + 1))} disabled={roomPage >= roomPageCount} className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40">Sau</button>
              </div>
            </nav>
          )}
        </div>
      )}

      {amenityManagerOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3 sm:p-6"
          onMouseDown={event => {
            if (event.target === event.currentTarget && modal.kind === 'none') {
              setAmenityManagerOpen(false)
              amenityManagerTriggerRef.current?.focus()
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="amenity-manager-title"
            className="max-h-[92vh] w-full max-w-4xl overflow-y-auto overscroll-contain rounded-2xl bg-slate-50 p-4 shadow-2xl sm:p-6"
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 id="amenity-manager-title" className="text-lg font-bold text-[#0d2137] sm:text-xl">Quản lý tiện nghi</h2>
                <p className="mt-1 text-sm text-gray-500">Thêm, đổi tên hoặc xóa tiện nghi dùng cho các phòng.</p>
              </div>
              <button
                ref={amenityManagerCloseRef}
                type="button"
                onClick={() => {
                  setAmenityManagerOpen(false)
                  amenityManagerTriggerRef.current?.focus()
                }}
                aria-label="Đóng quản lý tiện nghi"
                className="rounded-lg p-2 text-gray-500 transition hover:bg-white hover:text-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <svg aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <AmenityList
              amenities={amenities}
              rooms={rooms}
              loading={loadingAmenities}
              error={amenitiesError}
              onAdd={() => setModal({ kind: 'amenity_add' })}
              onEdit={amenity => setModal({ kind: 'amenity_edit', amenity })}
              onDelete={amenity => {
                const inUse = rooms.some(room => (room.amenity_ids ?? []).includes(amenity.id))
                setModal({ kind: inUse ? 'amenity_delete_warning' : 'amenity_delete', amenity })
              }}
            />
          </section>
        </div>
      )}

      {/* ── Room modals ── */}

      {modal.kind === 'add' && (
        <RoomAddModal onClose={closeModal} onSave={handleSaveAdd} roomTypes={roomTypes} amenities={amenities} loadingTypes={loadingTypes} roomTypesError={roomTypesError} />
      )}

      {activeTab === 'types' && (
        <div className="min-h-0 flex-1">
          <RoomTypeManagement
            roomTypes={roomTypes}
            rooms={rooms}
            loading={loadingTypes}
            error={roomTypesError}
            onCreate={handleCreateRoomType}
            onUpdate={handleUpdateRoomType}
            onDelete={handleDeleteRoomType}
          />
        </div>
      )}
      {modal.kind === 'edit' && (
        <RoomEditModal room={modal.room} onClose={closeModal} roomTypes={roomTypes} amenities={amenities} loadingTypes={loadingTypes} roomTypesError={roomTypesError} onSave={draft => handleSaveEdit(draft, modal.room.id)} />
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

import { useState, useCallback } from 'react'
import { rooms as initialRooms, roomTypes, amenities as initialAmenities } from '../../data/mockData'
import type { Room, RoomFilter, RoomMenuAction, RoomStatus, Amenity } from './types'
import { RoomCard } from './components/RoomCard'
import { RoomEmptyState } from './components/RoomEmptyState'
import { FilterDropdown } from './components/FilterDropdown'
import { AmenityList } from './components/AmenityList'
import { RoomAddModal } from './components/RoomAddModal'
import { RoomEditModal } from './components/RoomEditModal'
import { RoomDetailModal } from './components/RoomDetailModal'
import { RoomStatusModal, RoomStatusWarningModal } from './components/RoomStatusModal'
import { RoomDeleteModal, RoomDeleteWarningModal } from './components/RoomDeleteModal'
import { AmenityAddModal } from './components/AmenityAddModal'
import { AmenityEditModal } from './components/AmenityEditModal'
import { AmenityDeleteModal, AmenityDeleteWarningModal } from './components/AmenityDeleteModal'
import { AmenityAssignModal } from './components/AmenityAssignModal'

const AMBER = '#f59e0b'
const NAVY = '#0d2137'

type ActiveModal =
  | { kind: 'none' }
  // Room modals
  | { kind: 'add' }
  | { kind: 'edit'; room: Room }
  | { kind: 'detail'; room: Room }
  | { kind: 'status'; room: Room }
  | { kind: 'status_warning'; room: Room; newStatus: RoomStatus }
  | { kind: 'delete'; room: Room }
  | { kind: 'delete_warning'; room: Room }
  | { kind: 'amenity_assign'; room: Room }
  // Amenity modals
  | { kind: 'amenity_add' }
  | { kind: 'amenity_edit'; amenity: Amenity }
  | { kind: 'amenity_delete'; amenity: Amenity }
  | { kind: 'amenity_delete_warning'; amenity: Amenity }

export default function RoomPage() {
  const [rooms, setRooms] = useState<Room[]>(initialRooms)
  const [amenities, setAmenities] = useState<Amenity[]>(initialAmenities)
  const [activeTab, setActiveTab] = useState<'rooms' | 'amenities'>('rooms')
  const [filter, setFilter] = useState<RoomFilter>({
    status: 'ALL',
    floor: 'ALL',
    type: 'ALL',
    search: '',
  })
  const [modal, setModal] = useState<ActiveModal>({ kind: 'none' })

  const floors = [...new Set(rooms.map(r => r.floor))].sort((a, b) => a - b)

  const filteredRooms = rooms.filter(r => {
    if (filter.status !== 'ALL' && r.status !== filter.status) return false
    if (filter.floor !== 'ALL' && String(r.floor) !== filter.floor) return false
    if (filter.type !== 'ALL' && r.room_type_id !== filter.type) return false
    if (filter.search && !r.room_number.toLowerCase().includes(filter.search.toLowerCase())) return false
    return true
  })

  // ── Room handlers ────────────────────────────────────────────────────────

  const closeModal = useCallback(() => setModal({ kind: 'none' }), [])

  const handleMenuAction = useCallback((room: Room, action: RoomMenuAction) => {
    if (action === 'detail') setModal({ kind: 'detail', room })
    else if (action === 'edit') setModal({ kind: 'edit', room })
    else if (action === 'status') setModal({ kind: 'status', room })
    else if (action === 'delete') setModal({ kind: 'delete', room })
    else if (action === 'amenity') setModal({ kind: 'amenity_assign', room })
  }, [])

  const handleAddRoom = useCallback(() => setModal({ kind: 'add' }), [])

  const handleSaveAdd = useCallback((newRoom: Room) => {
    setRooms(prev => [...prev, newRoom])
    setModal({ kind: 'none' })
  }, [])

  const handleSaveEdit = useCallback((updated: Room) => {
    setRooms(prev => prev.map(r => r.id === updated.id ? updated : r))
    setModal({ kind: 'none' })
  }, [])

  const handleSaveStatus = useCallback((room: Room, newStatus: RoomStatus) => {
    setRooms(prev => prev.map(r => r.id === room.id ? { ...r, status: newStatus } : r))
    setModal({ kind: 'none' })
  }, [])

  const handleConfirmDelete = useCallback((room: Room) => {
    setRooms(prev => prev.filter(r => r.id !== room.id))
    setModal({ kind: 'none' })
  }, [])

  // ── Amenity assign handler (from DETAIL or menu) ─────────────────────────

  const handleSaveAssign = useCallback((room: Room, newIds: string[]) => {
    setRooms(prev => prev.map(r => r.id === room.id ? { ...r, amenity_ids: newIds } : r))
    setModal({ kind: 'none' })
  }, [])

  // ── Amenity CRUD handlers ────────────────────────────────────────────────

  const handleSaveAddAmenity = useCallback((a: Amenity) => {
    setAmenities(prev => [...prev, a])
    setModal({ kind: 'none' })
  }, [])

  const handleSaveEditAmenity = useCallback((updated: Amenity) => {
    setAmenities(prev => prev.map(a => a.id === updated.id ? updated : a))
    setModal({ kind: 'none' })
  }, [])

  const handleConfirmDeleteAmenity = useCallback((amenity: Amenity) => {
    setAmenities(prev => prev.filter(a => a.id !== amenity.id))
    // Also remove from all rooms
    setRooms(prev => prev.map(r => ({
      ...r,
      amenity_ids: r.amenity_ids.filter(id => id !== amenity.id),
    })))
    setModal({ kind: 'none' })
  }, [])

  return (
    <div className="flex flex-col gap-5">
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
          {rooms.length === 0 ? (
            <RoomEmptyState onAdd={handleAddRoom} />
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
            const inUse = rooms.some(r => r.amenity_ids.includes(a.id))
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
        <RoomAddModal onClose={closeModal} onSave={handleSaveAdd} />
      )}
      {modal.kind === 'edit' && (
        <RoomEditModal room={modal.room} onClose={closeModal} onSave={handleSaveEdit} />
      )}
      {modal.kind === 'detail' && (
        <RoomDetailModal
          room={modal.room}
          onClose={closeModal}
          onAssign={() => setModal({ kind: 'amenity_assign', room: modal.room })}
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
      {modal.kind === 'amenity_assign' && (
        <AmenityAssignModal
          room={modal.room}
          allAmenities={amenities}
          onClose={closeModal}
          onSave={ids => handleSaveAssign(modal.room, ids)}
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

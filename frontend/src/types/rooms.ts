export type RoomStatus = 'TRONG' | 'DANG_THUE' | 'BAO_TRI'

export interface Room {
  id: string
  room_number: string
  room_type_id: string
  status: RoomStatus
  floor: number
  amenity_ids: string[]
  price?: number
  area?: number
}

export interface RoomFilter {
  status: string
  floor: string
  type: string
  search: string
}

export type RoomMenuAction = 'detail' | 'edit' | 'status' | 'amenity' | 'delete'

export interface Amenity {
  id: string
  name: string
  description?: string
}

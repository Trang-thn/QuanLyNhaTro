export type RoomStatus = string;

export interface Room {
  id: string;
  room_number: string;
  room_type_id: string | null;
  room_type_name: string | null;
  status: RoomStatus | null;
  floor: number | null;
  description: string | null;
  created_at: string | null;
  amenity_ids?: string[];
  price?: number | null;
  area?: number | null;
}

export interface RoomApiDTO {
  id: string;
  room_number: string;
  room_type_id: string | null;
  status: RoomStatus | null;
  floor: number | null;
  description: string | null;
  created_at: string | null;
  room_type_name?: string | null;
  base_price?: number | string | null;
  area_sqm?: number | string | null;
}

export interface RoomTypeApiDTO {
  id: string;
  name: string;
  base_price: number | string | null;
  area_sqm: number | string | null;
  description: string | null;
}

export interface RoomListApiResponse {
  data: RoomApiDTO[];
  pagination: { page: number; limit: number; total: number };
}

export interface RoomListFilters {
  page?: number;
  limit?: number;
  floor?: number;
  status?: RoomStatus;
}

export interface CreateRoomRequest {
  room_number: string;
  room_type_id?: string | null;
  status?: RoomStatus;
  floor?: number;
  description?: string | null;
}

export type UpdateRoomRequest = Partial<CreateRoomRequest>;

export interface RoomDraft {
  room_number: string;
  room_type_id: string;
  floor: number;
  status: RoomStatus;
  amenity_ids: string[];
}

export interface RoomFilter {
  status: string;
  floor: string;
  type: string;
  search: string;
}

export type RoomMenuAction = 'detail' | 'edit' | 'status' | 'amenity' | 'delete';

export interface Amenity {
  id: string;
  name: string;
  description?: string;
}

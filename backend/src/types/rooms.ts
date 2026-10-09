import type { RowDataPacket } from 'mysql2';

export type RoomStatus = string;

export interface RoomRecord extends RowDataPacket {
  id: string;
  room_number: string;
  room_type_id: string | null;
  status: RoomStatus | null;
  floor: number | null;
  description: string | null;
  created_at: Date;
  room_type_name?: string | null;
  base_price?: string | null;
  area_sqm?: string | null;
}

export interface RoomTypeRecord extends RowDataPacket {
  id: string;
  name: string;
  base_price: string;
  area_sqm: string | null;
  description: string | null;
}

export interface CountQueryRow extends RowDataPacket {
  total: number;
}

export interface CreateRoomInput {
  room_number: string;
  room_type_id?: string | null;
  status?: RoomStatus;
  floor?: number;
  description?: string | null;
}

export type UpdateRoomInput = Partial<CreateRoomInput>;

export interface RoomListFilters {
  page: number;
  limit: number;
  floor?: number;
  status?: RoomStatus;
}

export interface RoomListResponse {
  rows: RoomRecord[];
  total: number;
}

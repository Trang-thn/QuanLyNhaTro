import type { RowDataPacket } from 'mysql2';

export interface AmenityRecord extends RowDataPacket {
  id: string;
  name: string;
  room_count?: number;
}

export interface CreateAmenityInput {
  name: string;
}

export interface UpdateAmenityInput {
  name: string;
}


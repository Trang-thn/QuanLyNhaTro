import type { RowDataPacket } from 'mysql2';

export interface AmenityRecord extends RowDataPacket {
  id: string;
  name: string;
}

export interface CreateAmenityInput {
  name: string;
}

export interface UpdateAmenityInput {
  name: string;
}


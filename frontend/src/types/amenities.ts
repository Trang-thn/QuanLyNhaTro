export interface AmenityApiDTO {
  id: string;
  name: string;
  room_count?: number;
}

export interface CreateAmenityRequest {
  name: string;
}

export type UpdateAmenityRequest = CreateAmenityRequest;

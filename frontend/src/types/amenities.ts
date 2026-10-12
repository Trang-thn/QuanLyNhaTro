export interface AmenityApiDTO {
  id: string;
  name: string;
}

export interface CreateAmenityRequest {
  name: string;
}

export type UpdateAmenityRequest = CreateAmenityRequest;

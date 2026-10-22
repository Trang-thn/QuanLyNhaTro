import { ApiRequestError, apiRequest } from './api';
import { getAuthToken } from './api';
import type {
  CreateRoomRequest,
  CreateRoomTypeRequest,
  RoomApiDTO,
  RoomListApiResponse,
  RoomListFilters,
  RoomTypeApiDTO,
  UpdateRoomRequest,
  UpdateRoomTypeRequest,
} from '../types/rooms';
import type { AmenityApiDTO, CreateAmenityRequest, UpdateAmenityRequest } from '../types/amenities';

export type RoomTokenProvider = () => string | null | Promise<string | null>;

let roomTokenProvider: RoomTokenProvider | null = null;

/** Register the real token getter from the shared auth system when it becomes available. */
export function setRoomTokenProvider(provider: RoomTokenProvider | null) {
  roomTokenProvider = provider;
}

export class RoomApiError extends Error {
  constructor(
    message: string,
    public readonly status: number | null,
    public readonly code: 'AUTH_NOT_CONFIGURED' | 'HTTP_ERROR' | 'NETWORK_ERROR',
  ) {
    super(message);
    this.name = 'RoomApiError';
  }
}

async function requestWithToken<T>(
  path: string,
  init: RequestInit | undefined,
  tokenProvider: RoomTokenProvider | null,
): Promise<T> {
  if (!tokenProvider) {
    throw new RoomApiError(
      'Chưa kết nối nguồn token đăng nhập chung. API phòng chưa được gọi.',
      null,
      'AUTH_NOT_CONFIGURED',
    );
  }

  let token: string | null;
  try {
    token = await tokenProvider();
  } catch {
    throw new RoomApiError('Không lấy được token từ hệ thống đăng nhập.', null, 'AUTH_NOT_CONFIGURED');
  }
  if (!token?.trim()) {
    throw new RoomApiError('Bạn cần đăng nhập bằng hệ thống chung để sử dụng API phòng.', 401, 'AUTH_NOT_CONFIGURED');
  }

  try {
    return await apiRequest<T>(path, {
      ...init,
      headers: { ...init?.headers, Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    if (error instanceof ApiRequestError) {
      throw new RoomApiError(toRoomErrorMessage(error), error.status, 'HTTP_ERROR');
    }
    throw new RoomApiError('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối rồi thử lại.', null, 'NETWORK_ERROR');
  }
}

async function roomRequest<T>(path: string, init?: RequestInit): Promise<T> {
  return requestWithToken(path, init, roomTokenProvider ?? getAuthToken);
}

/** Use the shared token source for other authenticated feature services. */
export function authenticatedApiRequest<T>(path: string, init?: RequestInit) {
  return requestWithToken<T>(path, init, roomTokenProvider);
}

function toRoomErrorMessage(error: ApiRequestError) {
  const message = error.message.toLowerCase();
  if (error.status === 400) return 'Dữ liệu gửi lên chưa hợp lệ. Vui lòng kiểm tra lại thông tin.';
  if (error.status === 401) return 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn. Hãy đăng nhập lại.';
  if (error.status === 403) return 'Tài khoản hiện tại không có quyền thực hiện thao tác này.';
  if (error.status === 404) {
    if (message.includes('amenity')) return 'Không tìm thấy tiện nghi được yêu cầu.';
    if (message.includes('room type')) return 'Không tìm thấy loại phòng được yêu cầu.';
    return 'Không tìm thấy phòng được yêu cầu.';
  }
  if (error.status === 409 && message.includes('amenity name')) {
    return 'Tên tiện nghi đã tồn tại.';
  }
  if (error.status === 409 && message.includes('room type is assigned')) {
    return 'Không thể xóa loại phòng đang được phòng sử dụng.';
  }
  if (error.status === 409 && message.includes('related')) {
    return 'Không thể xóa phòng vì phòng còn dữ liệu liên quan.';
  }
  if (error.status === 409 && message.includes('active contract')) {
    return 'Phòng đang có hợp đồng còn hiệu lực nên không thể đổi trạng thái thủ công.';
  }
  if (error.status === 409) return 'Số phòng đã tồn tại hoặc dữ liệu đang xung đột.';
  if (error.status >= 500) return 'Máy chủ đang gặp sự cố. Vui lòng thử lại sau.';
  return 'Không thể hoàn tất yêu cầu. Vui lòng thử lại.';
}

export async function listRooms(filters: RoomListFilters = {}) {
  const params = new URLSearchParams({ page: String(filters.page ?? 1), limit: String(filters.limit ?? 100) });
  if (filters.floor !== undefined) params.set('floor', String(filters.floor));
  if (filters.status) params.set('status', filters.status);
  return roomRequest<RoomListApiResponse>(`/rooms?${params.toString()}`);
}

export async function listRoomTypes() {
  const response = await roomRequest<{ data: RoomTypeApiDTO[] }>('/rooms/types');
  return response.data;
}

export async function createRoomType(input: CreateRoomTypeRequest) {
  const response = await roomRequest<{ data: RoomTypeApiDTO }>('/rooms/types', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  return response.data;
}

export async function updateRoomType(id: string, input: UpdateRoomTypeRequest) {
  const response = await roomRequest<{ data: RoomTypeApiDTO }>(`/rooms/types/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(input),
  });
  return response.data;
}

export async function deleteRoomType(id: string) {
  await roomRequest<void>(`/rooms/types/${encodeURIComponent(id)}`, { method: 'DELETE' });
}

export async function getRoom(id: string) {
  const response = await roomRequest<{ data: RoomApiDTO }>(`/rooms/${encodeURIComponent(id)}`);
  return response.data;
}

export async function createRoom(input: CreateRoomRequest) {
  const response = await roomRequest<{ data: RoomApiDTO }>('/rooms', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  return response.data;
}

export async function updateRoom(id: string, input: UpdateRoomRequest) {
  const response = await roomRequest<{ data: RoomApiDTO }>(`/rooms/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(input),
  });
  return response.data;
}

export async function updateRoomStatus(id: string, status: string) {
  const response = await roomRequest<{ data: RoomApiDTO }>(`/rooms/${encodeURIComponent(id)}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
  return response.data;
}

export async function deleteRoom(id: string) {
  await roomRequest<void>(`/rooms/${encodeURIComponent(id)}`, { method: 'DELETE' });
}

export async function listAmenities(): Promise<AmenityApiDTO[]> {
  const response = await roomRequest<{ data: AmenityApiDTO[] }>('/amenities');
  return response.data;
}

export async function createAmenity(input: CreateAmenityRequest): Promise<AmenityApiDTO> {
  const response = await roomRequest<{ data: AmenityApiDTO }>('/amenities', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  return response.data;
}

export async function updateAmenity(id: string, input: UpdateAmenityRequest): Promise<AmenityApiDTO> {
  const response = await roomRequest<{ data: AmenityApiDTO }>(`/amenities/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(input),
  });
  return response.data;
}

export async function deleteAmenity(id: string) {
  await roomRequest<void>(`/amenities/${encodeURIComponent(id)}`, { method: 'DELETE' });
}

export async function listRoomAmenities(roomId: string): Promise<AmenityApiDTO[]> {
  const response = await roomRequest<{ data: AmenityApiDTO[] }>(`/rooms/${encodeURIComponent(roomId)}/amenities`);
  return response.data;
}

export async function replaceRoomAmenities(roomId: string, amenityIds: string[]): Promise<AmenityApiDTO[]> {
  const response = await roomRequest<{ data: AmenityApiDTO[] }>(`/rooms/${encodeURIComponent(roomId)}/amenities`, {
    method: 'PUT',
    body: JSON.stringify({ amenity_ids: amenityIds }),
  });
  return response.data;
}

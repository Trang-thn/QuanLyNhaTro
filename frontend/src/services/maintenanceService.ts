import { apiRequest, getAuthToken } from './api';
import type { IssueStatus } from '../types/issues';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api/v1';

export interface MaintenanceApiDTO {
  id: string;
  room_id: string;
  tenant_id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  status: IssueStatus;
  cost: number | string;
  created_at: string;
  room_number: string;
  tenant_name: string;
}

export interface MaintenanceRoomDTO {
  id: string;
  room_number: string;
}

export interface CreateMaintenanceRequest {
  room_id: string;
  title: string;
  description: string;
  image_url?: string;
}

export async function uploadMaintenanceImage(file: File): Promise<string> {
  const token = getAuthToken();
  if (!token) throw new Error('Vui lòng đăng nhập lại trước khi tải ảnh lên.');
  const response = await fetch(`${API_BASE_URL}/maintenance-requests/images`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/octet-stream' },
    body: file,
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(body?.message ?? `Không tải được ảnh (${response.status})`);
  if (typeof body?.data?.image_url !== 'string') throw new Error('Backend không trả về đường dẫn ảnh hợp lệ.');
  return body.data.image_url;
}

export async function deleteUnattachedMaintenanceImage(imageUrl: string): Promise<void> {
  const prefix = '/maintenance-requests/images/';
  if (!imageUrl.startsWith(prefix)) return;
  await apiRequest<void>(imageUrl, { method: 'DELETE' });
}

export async function fetchMaintenanceImage(imageUrl: string): Promise<Blob> {
  const token = getAuthToken();
  if (!token) throw new Error('Vui lòng đăng nhập để xem ảnh sự cố.');
  const response = await fetch(`${API_BASE_URL}${imageUrl}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.message ?? `Không tải được ảnh (${response.status})`);
  }
  return response.blob();
}

export interface UpdateMaintenanceRequest {
  status?: IssueStatus;
  cost?: number;
}

export async function listMaintenanceRequests(status?: IssueStatus) {
  const params = new URLSearchParams();
  if (status) params.set('status', status);
  const serialized = params.toString();
  const query = serialized ? `?${serialized}` : '';
  const response = await apiRequest<{ data: MaintenanceApiDTO[] }>(`/maintenance-requests${query}`);
  return response.data;
}

export async function listTenantMaintenanceRooms() {
  const response = await apiRequest<{ data: MaintenanceRoomDTO[] }>('/maintenance-requests/rooms');
  return response.data;
}

export async function getMaintenanceRequest(id: string) {
  const response = await apiRequest<{ data: MaintenanceApiDTO }>(`/maintenance-requests/${encodeURIComponent(id)}`);
  return response.data;
}

export async function createMaintenanceRequest(input: CreateMaintenanceRequest) {
  const response = await apiRequest<{ data: MaintenanceApiDTO }>('/maintenance-requests', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  return response.data;
}

export async function updateMaintenanceRequest(id: string, input: UpdateMaintenanceRequest) {
  const response = await apiRequest<{ data: MaintenanceApiDTO }>(`/maintenance-requests/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
  return response.data;
}

import { authenticatedApiRequest } from './roomService';
import type { IssueStatus } from '../types/issues';

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
  const response = await authenticatedApiRequest<{ data: MaintenanceApiDTO[] }>(`/maintenance-requests${query}`);
  return response.data;
}

export async function listTenantMaintenanceRooms() {
  const response = await authenticatedApiRequest<{ data: MaintenanceRoomDTO[] }>('/maintenance-requests/rooms');
  return response.data;
}

export async function getMaintenanceRequest(id: string) {
  const response = await authenticatedApiRequest<{ data: MaintenanceApiDTO }>(`/maintenance-requests/${encodeURIComponent(id)}`);
  return response.data;
}

export async function createMaintenanceRequest(input: CreateMaintenanceRequest) {
  const response = await authenticatedApiRequest<{ data: MaintenanceApiDTO }>('/maintenance-requests', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  return response.data;
}

export async function updateMaintenanceRequest(id: string, input: UpdateMaintenanceRequest) {
  const response = await authenticatedApiRequest<{ data: MaintenanceApiDTO }>(`/maintenance-requests/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
  return response.data;
}

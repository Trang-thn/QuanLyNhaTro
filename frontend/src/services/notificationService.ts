import { apiRequest } from './api'
import type { NotificationApiDTO, NotificationRecipient, NotificationRoom } from '../types/notifications'

export interface CreateNotificationRequest {
  title: string
  content: string
  audience: 'ALL' | 'ROOM' | 'TENANT'
  receiver_id?: string
  room_id?: string
}

async function notificationRequest<T>(path: string, init?: RequestInit) {
  return apiRequest<T>(path, init)
}

export async function listSentNotifications() {
  const response = await notificationRequest<{ data: NotificationApiDTO[] }>('/notifications/sent')
  return response.data
}

export async function listInboxNotifications() {
  const response = await notificationRequest<{ data: NotificationApiDTO[] }>('/notifications/inbox')
  return response.data
}

export async function listNotificationRecipients(roomId?: string) {
  const query = roomId ? `?room_id=${encodeURIComponent(roomId)}` : ''
  const response = await notificationRequest<{
    data: { users: NotificationRecipient[]; rooms: NotificationRoom[] }
  }>(`/notifications/recipients${query}`)
  return response.data
}

export async function createNotification(input: CreateNotificationRequest) {
  const response = await notificationRequest<{ data: { count: number } }>('/notifications', {
    method: 'POST',
    body: JSON.stringify(input),
  })
  return response.data
}

export async function markNotificationRead(id: string) {
  await notificationRequest<void>(`/notifications/${encodeURIComponent(id)}/read`, { method: 'PATCH' })
}

export async function deleteNotification(id: string) {
  await notificationRequest<void>(`/notifications/${encodeURIComponent(id)}`, { method: 'DELETE' })
}

export async function deleteAllSentNotifications() {
  const response = await notificationRequest<{ data: { count: number } }>('/notifications/sent', { method: 'DELETE' })
  return response.data
}

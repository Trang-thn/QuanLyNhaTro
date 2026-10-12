import { authenticatedApiRequest } from './roomService'
import { RoomApiError } from './roomService'
import type { NotificationApiDTO, NotificationRecipient, NotificationRoom } from '../types/notifications'

export interface CreateNotificationRequest {
  title: string
  content: string
  receiver_id?: string
  room_id?: string
}

async function notificationRequest<T>(path: string, init?: RequestInit) {
  try {
    return await authenticatedApiRequest<T>(path, init)
  } catch (error) {
    if (error instanceof RoomApiError) {
      if (error.code === 'AUTH_NOT_CONFIGURED') {
        throw new Error('Chưa kết nối token đăng nhập dùng chung; chưa thể gọi API Thông báo.')
      }
      if (error.status === 400) throw new Error('Dữ liệu thông báo không hợp lệ. Vui lòng kiểm tra lại nội dung và người nhận.')
      if (error.status === 401) throw new Error('Phiên đăng nhập không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.')
      if (error.status === 403) throw new Error('Bạn không có quyền thực hiện thao tác này.')
      if (error.status === 404) throw new Error('Không tìm thấy thông báo hoặc đối tượng liên quan.')
      if (error.status === 409) throw new Error('Không có người thuê phù hợp với phạm vi đã chọn. Vui lòng kiểm tra người nhận hoặc phòng.')
      if (error.status !== null && error.status >= 500) throw new Error('Máy chủ đang gặp lỗi. Vui lòng thử lại sau.')
    }
    throw error
  }
}

export async function listSentNotifications() {
  const response = await notificationRequest<{ data: NotificationApiDTO[] }>('/notifications/sent')
  return response.data
}

export async function listInboxNotifications() {
  const response = await notificationRequest<{ data: NotificationApiDTO[] }>('/notifications/inbox')
  return response.data
}

export async function listNotificationRecipients() {
  const response = await notificationRequest<{
    data: { users: NotificationRecipient[]; rooms: NotificationRoom[] }
  }>('/notifications/recipients')
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

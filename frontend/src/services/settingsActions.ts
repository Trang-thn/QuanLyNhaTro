import { apiRequest } from './api'

export interface UpdateProfilePayload {
  email: string
  phoneNumber: string
  permanentAddress: string
  emergencyContact: string
}

export function updateMyProfile(payload: UpdateProfilePayload): Promise<unknown> {
  return apiRequest('/users/me', { method: 'PUT', body: JSON.stringify(payload) })
}

export function changeMyPassword(payload: { currentPassword: string; newPassword: string }): Promise<{ message: string }> {
  return apiRequest('/users/me/password', { method: 'PUT', body: JSON.stringify(payload) })
}

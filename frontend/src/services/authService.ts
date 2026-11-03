import { apiRequest } from './api'

export interface RegisterPayload {
  username: string
  password: string
  fullName: string
  identityCardNumber: string
  phoneNumber: string
  email: string
}

export function registerAccount(payload: RegisterPayload): Promise<{ message: string }> {
  return apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(payload) })
}

export function requestPasswordReset(email: string): Promise<{ message: string }> {
  return apiRequest('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) })
}

export function resetPassword(payload: { email: string; otp: string; newPassword: string }): Promise<{ message: string }> {
  return apiRequest('/auth/reset-password', { method: 'POST', body: JSON.stringify(payload) })
}

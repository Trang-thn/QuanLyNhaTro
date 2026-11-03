import type { AuthCredentials, LoginCredentials, LoginResult } from '../types/login'
import { apiRequest, saveAuthToken } from './api'

export const seedCredentials: AuthCredentials = {
  admin: { username: 'admin', password: '123456' },
  tenant: { username: 'nguyenan', password: '123456' },
}

export async function authenticate(credentials: LoginCredentials): Promise<LoginResult> {
  const result = await apiRequest<LoginResult>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ identifier: credentials.username, password: credentials.password }),
  })
  saveAuthToken(result.token)
  return result
}

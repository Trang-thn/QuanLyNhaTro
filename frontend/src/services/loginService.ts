import type { AuthCredentials, LoginCredentials, LoginPageData, LoginResult } from '../types/login'
import { apiRequest } from './api'

const mockLoginPageData: LoginPageData = {
  productName: 'LANDLORD SAAS',
  demoCredentials: {
    admin: { username: 'admin', password: 'admin123' },
    tenant: { username: 'tenant', password: 'tenant123' },
  },
}

export const initialLoginPageData = mockLoginPageData

export async function getLoginPageData(): Promise<LoginPageData> {
  try {
    return await apiRequest<LoginPageData>('/auth/demo-config')
  } catch {
    return mockLoginPageData
  }
}

export async function authenticate(
  credentials: LoginCredentials,
  demoCredentials: AuthCredentials,
): Promise<LoginResult> {
  try {
    return await apiRequest<LoginResult>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  } catch {
    const matchedRole = (Object.keys(demoCredentials) as Array<keyof AuthCredentials>).find(role => {
      const demo = demoCredentials[role]
      return demo.username === credentials.username && demo.password === credentials.password
    })

    if (matchedRole) return { role: matchedRole }
    throw new Error('Invalid username or password')
  }
}

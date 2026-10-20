export type AuthRole = 'admin' | 'tenant'
export type AuthScreen = 'login' | 'signup' | 'forgot1' | 'forgot2'

export interface LoginCredentials {
  username: string
  password: string
}

export interface LoginFormState extends LoginCredentials {
  remember: boolean
}

export interface LoginResult {
  token: string
  user: {
    id: string
    username: string
    fullName: string
    email: string | null
    phoneNumber: string | null
    role: 'ADMIN' | 'TENANT'
  }
}

export interface AuthCredentials {
  admin: LoginCredentials
  tenant: LoginCredentials
}

export interface LoginPageData {
  productName: string
  demoCredentials: AuthCredentials
}

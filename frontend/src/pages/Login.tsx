import { useState } from 'react'
import LoginView from '../components/login/LoginView'
import { seedCredentials } from '../services/loginService'
import type { AuthScreen } from '../types/login'

interface Props {
  onLogin: (role: 'admin' | 'tenant') => void
}

export default function Login({ onLogin }: Props) {
  const [screen, setScreen] = useState<AuthScreen>('login')
  return <LoginView onLogin={onLogin} screen={screen} onScreenChange={setScreen} credentials={seedCredentials} />
}

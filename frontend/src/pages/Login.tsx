import { useEffect, useState } from 'react'
import LoginView from '../components/login/LoginView'
import { getLoginPageData, initialLoginPageData } from '../services/loginService'
import type { AuthScreen, LoginPageData } from '../types/login'

interface Props {
  onLogin: (role: 'admin' | 'tenant') => void
}

export default function Login({ onLogin }: Props) {
  const [screen, setScreen] = useState<AuthScreen>('login')
  const [pageData, setPageData] = useState<LoginPageData>(initialLoginPageData)

  useEffect(() => {
    getLoginPageData().then(setPageData)
  }, [])

  return <LoginView onLogin={onLogin} screen={screen} onScreenChange={setScreen} credentials={pageData.demoCredentials} />
}

import { useState } from 'react'
import type { AuthCredentials, AuthScreen } from '../../types/login'
import AuthLeft from './AuthLeft'
import LoginForm from './LoginForm'
import ConnectedSignupForm from './ConnectedSignupForm'
import ConnectedForgotStep1 from './ConnectedForgotStep1'
import ConnectedForgotStep2 from './ConnectedForgotStep2'

interface Props {
  onLogin: (role: 'admin' | 'tenant') => void
  screen: AuthScreen
  onScreenChange: (screen: AuthScreen) => void
  credentials: AuthCredentials
}







export default function LoginView({ onLogin, screen, onScreenChange, credentials }: Props) {
  const [resetEmail, setResetEmail] = useState('')
  return (
    <div className="min-h-screen flex">
      <AuthLeft />
      <div className="flex-1 flex items-center justify-center overflow-y-auto py-8 px-4" style={{ background: '#fdf6f0' }}>
        {screen === 'login'   && <LoginForm onLogin={onLogin} onGo={onScreenChange} credentials={credentials} />}
        {screen === 'signup'  && <ConnectedSignupForm onGo={onScreenChange} />}
        {screen === 'forgot1' && <ConnectedForgotStep1 onGo={onScreenChange} email={resetEmail} onEmailChange={setResetEmail} />}
        {screen === 'forgot2' && <ConnectedForgotStep2 onGo={onScreenChange} email={resetEmail} />}
      </div>
    </div>
  )
}

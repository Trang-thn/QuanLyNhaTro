import type { AuthCredentials, AuthScreen } from '../../types/login'
import AuthLeft from './AuthLeft'
import LoginForm from './LoginForm'
import SignupForm from './SignupForm'
import ForgotStep1 from './ForgotStep1'
import ForgotStep2 from './ForgotStep2'

interface Props {
  onLogin: (role: 'admin' | 'tenant') => void
  screen: AuthScreen
  onScreenChange: (screen: AuthScreen) => void
  credentials: AuthCredentials
}







export default function LoginView({ onLogin, screen, onScreenChange, credentials }: Props) {
  return (
    <div className="min-h-screen flex">
      <AuthLeft />
      <div className="flex-1 flex items-center justify-center overflow-y-auto py-8 px-4" style={{ background: '#fdf6f0' }}>
        {screen === 'login'   && <LoginForm onLogin={onLogin} onGo={onScreenChange} credentials={credentials} />}
        {screen === 'signup'  && <SignupForm onGo={onScreenChange} />}
        {screen === 'forgot1' && <ForgotStep1 onGo={onScreenChange} />}
        {screen === 'forgot2' && <ForgotStep2 onGo={onScreenChange} />}
      </div>
    </div>
  )
}

import { useState } from 'react'
import { authenticate } from '../../services/loginService'
import type { AuthCredentials, AuthScreen } from '../../types/login'

export default function LoginForm({ onLogin, onGo, credentials }: { onLogin: (role: 'admin' | 'tenant') => void; onGo: (s: AuthScreen) => void; credentials: AuthCredentials }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const result = await authenticate({ username, password }, credentials)
      onLogin(result.role)
    } catch {
      setError('Tên đăng nhập hoặc mật khẩu không chính xác.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-sm border border-gray-100">
      <p className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: '#f59e0b' }}>HỆ THỐNG QUẢN LÝ NHÀ TRỌ</p>
      <h2 className="text-2xl font-bold mb-1" style={{ color: '#172b4d' }}>Chào mừng trở lại</h2>
      <p className="text-sm text-gray-500 mb-6">Vui lòng đăng nhập để quản lý khu nhà trọ của bạn</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="flex items-center gap-1 text-[13px] font-semibold text-[#1f2937] mb-1.5">
            Tên đăng nhập hoặc Email/SĐT <span style={{ color: '#f59e0b' }}>*</span>
          </label>
          <input type="text" value={username} onChange={e => setUsername(e.target.value)}
            placeholder="Nhập tên đăng nhập, email hoặc SĐT"
            className="w-full px-3 py-2.5 border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:border-[#f59e0b] transition" />
        </div>
        <div>
          <label className="flex items-center gap-1 text-[13px] font-semibold text-[#1f2937] mb-1.5">
            Mật khẩu <span style={{ color: '#f59e0b' }}>*</span>
          </label>
          <div className="relative">
            <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              className="w-full px-3 py-2.5 border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:border-[#f59e0b] transition pr-10" />
            <button type="button" onClick={() => setShowPw(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2">
              <img src="/assets/b905a.svg" alt="" className="w-4 h-4 opacity-40 hover:opacity-70 transition" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)}
              className="w-4 h-4 accent-[#f59e0b]" />
            <span className="text-[13px] text-gray-500">Ghi nhớ đăng nhập</span>
          </label>
          <button type="button" onClick={() => onGo('forgot1')} className="text-[13px] font-semibold" style={{ color: '#f59e0b' }}>
            Quên mật khẩu?
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-100 text-sm text-red-700">
            <span>×</span> {error}
          </div>
        )}

        <button type="submit" disabled={loading}
          className="w-full py-3 rounded-lg text-white font-semibold text-sm transition disabled:opacity-60"
          style={{ background: '#f59e0b' }}>
          {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-5">
        Chưa có tài khoản?{' '}
        <button onClick={() => onGo('signup')} className="font-semibold" style={{ color: '#f59e0b' }}>Đăng ký ngay</button>
      </p>

      <div className="mt-4 p-2.5 rounded-lg bg-amber-50 border border-amber-100">
        <p className="text-xs text-amber-700 text-center">Demo: <strong>admin</strong> / <strong>admin123</strong> · <strong>tenant</strong> / <strong>tenant123</strong></p>
      </div>
    </div>
  )
}


import { useState } from 'react'

type AuthScreen = 'login' | 'signup' | 'forgot1' | 'forgot2'

interface Props {
  onLogin: (role: 'admin' | 'tenant') => void
}

function BuildingIllustration() {
  return (
    <svg viewBox="0 0 260 180" className="w-full max-w-[260px]" fill="none">
      {/* Dark building left */}
      <rect x="10" y="50" width="68" height="120" rx="4" fill="#1e3a5f" />
      <rect x="16" y="58" width="12" height="12" rx="1" fill="#f59e0b" />
      <rect x="34" y="58" width="12" height="12" rx="1" fill="#f59e0b" opacity="0.5" />
      <rect x="52" y="58" width="12" height="12" rx="1" fill="#f59e0b" opacity="0.3" />
      <rect x="16" y="78" width="12" height="12" rx="1" fill="#f59e0b" opacity="0.7" />
      <rect x="34" y="78" width="12" height="12" rx="1" fill="#f59e0b" opacity="0.4" />
      <rect x="52" y="78" width="12" height="12" rx="1" fill="#f59e0b" />
      <rect x="16" y="98" width="12" height="12" rx="1" fill="#f59e0b" opacity="0.3" />
      <rect x="34" y="98" width="12" height="12" rx="1" fill="#f59e0b" />
      <rect x="52" y="98" width="12" height="12" rx="1" fill="#f59e0b" opacity="0.6" />
      <rect x="28" y="140" width="20" height="30" rx="2" fill="#2563ae" />
      {/* Middle tall building */}
      <rect x="88" y="20" width="80" height="150" rx="4" fill="#243b6e" />
      <rect x="96" y="30" width="14" height="14" rx="1" fill="#f59e0b" />
      <rect x="116" y="30" width="14" height="14" rx="1" fill="#f59e0b" opacity="0.6" />
      <rect x="136" y="30" width="14" height="14" rx="1" fill="#f59e0b" opacity="0.3" />
      <rect x="96" y="52" width="14" height="14" rx="1" fill="#f59e0b" opacity="0.5" />
      <rect x="116" y="52" width="14" height="14" rx="1" fill="#f59e0b" />
      <rect x="136" y="52" width="14" height="14" rx="1" fill="#f59e0b" opacity="0.7" />
      <rect x="96" y="74" width="14" height="14" rx="1" fill="#f59e0b" />
      <rect x="116" y="74" width="14" height="14" rx="1" fill="#f59e0b" opacity="0.4" />
      <rect x="136" y="74" width="14" height="14" rx="1" fill="#f59e0b" opacity="0.8" />
      <rect x="96" y="96" width="14" height="14" rx="1" fill="#f59e0b" opacity="0.3" />
      <rect x="116" y="96" width="14" height="14" rx="1" fill="#f59e0b" opacity="0.7" />
      <rect x="136" y="96" width="14" height="14" rx="1" fill="#f59e0b" />
      <rect x="116" y="140" width="24" height="30" rx="2" fill="#1e3a5f" />
      {/* Right building - orange accent top */}
      <rect x="178" y="40" width="72" height="130" rx="4" fill="#2563ae" />
      <rect x="182" y="10" width="64" height="35" rx="4" fill="#f59e0b" opacity="0.9" />
      <polygon points="214,2 250,10 178,10" fill="#f59e0b" />
      <rect x="186" y="52" width="13" height="13" rx="1" fill="white" opacity="0.3" />
      <rect x="206" y="52" width="13" height="13" rx="1" fill="white" opacity="0.5" />
      <rect x="226" y="52" width="13" height="13" rx="1" fill="white" opacity="0.2" />
      <rect x="186" y="72" width="13" height="13" rx="1" fill="white" opacity="0.4" />
      <rect x="206" y="72" width="13" height="13" rx="1" fill="white" opacity="0.2" />
      <rect x="226" y="72" width="13" height="13" rx="1" fill="white" opacity="0.5" />
      <rect x="186" y="92" width="13" height="13" rx="1" fill="white" opacity="0.2" />
      <rect x="206" y="92" width="13" height="13" rx="1" fill="white" opacity="0.6" />
      <rect x="226" y="92" width="13" height="13" rx="1" fill="white" opacity="0.3" />
      <rect x="200" y="140" width="28" height="30" rx="2" fill="#1e3a5f" />
      {/* Ground */}
      <rect x="0" y="168" width="260" height="12" rx="2" fill="#1e3a5f" opacity="0.5" />
    </svg>
  )
}

function AuthLeft() {
  return (
    <div className="hidden lg:flex lg:w-[380px] xl:w-[420px] shrink-0 flex-col justify-between p-10" style={{ background: 'linear-gradient(165deg, #0d1b2a 0%, #1a2c4e 60%, #0f2040 100%)' }}>
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#f59e0b' }}>
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
        </div>
        <div>
          <div className="text-white font-bold text-sm leading-tight tracking-wide">LANDLORD SAAS</div>
          <div className="text-[11px]" style={{ color: 'rgba(255,255,255,0.45)' }}>Hệ thống quản lý nhà trọ số 1</div>
        </div>
      </div>

      {/* Illustration */}
      <div className="flex flex-col items-center gap-6">
        <BuildingIllustration />
        <div className="flex gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: '#1e3a5f', color: '#60a5fa' }}>SaaS Smart Platform</span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: '#1a3a1a', color: '#4ade80' }}>Vietnamese Edition</span>
        </div>
      </div>

      {/* Tagline */}
      <div>
        <p className="text-white text-xl font-bold leading-snug mb-3">
          Kết nối không gian sống · Quản lý trọ thông minh &amp; tiện lợi
        </p>
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>Bảo mật dữ liệu tuyệt đối theo tiêu chuẩn ISO 27001</p>
        <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.25)' }}>© 2024 Landlord SaaS. All rights reserved.</p>
      </div>
    </div>
  )
}

function LoginForm({ onLogin, onGo }: { onLogin: (role: 'admin' | 'tenant') => void; onGo: (s: AuthScreen) => void }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    setTimeout(() => {
      if (username === 'admin' && password === 'admin123') { onLogin('admin') }
      else if (username === 'tenant' && password === 'tenant123') { onLogin('tenant') }
      else { setError('Tên đăng nhập hoặc mật khẩu không chính xác.'); setLoading(false) }
    }, 500)
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

function SignupForm({ onGo }: { onGo: (s: AuthScreen) => void }) {
  const [showPw, setShowPw] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  return (
    <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-sm border border-gray-100">
      <p className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: '#f59e0b' }}>HỆ THỐNG QUẢN LÝ NHÀ TRỌ</p>
      <h2 className="text-2xl font-bold mb-1" style={{ color: '#172b4d' }}>Đăng ký tài khoản Khách thuê</h2>
      <p className="text-sm text-gray-500 mb-6">Tham gia hệ thống để quản lý phòng ở và hợp đồng của bạn</p>

      <div className="space-y-3.5">
        {[
          { label: 'Tên đăng nhập', placeholder: 'Nhập tên đăng nhập mong muốn', type: 'text' },
        ].map(f => (
          <div key={f.label}>
            <label className="flex items-center gap-1 text-[13px] font-semibold text-[#1f2937] mb-1.5">
              {f.label} <span style={{ color: '#f59e0b' }}>*</span>
            </label>
            <input type={f.type} placeholder={f.placeholder}
              className="w-full px-3 py-2.5 border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:border-[#f59e0b] transition" />
          </div>
        ))}
        <div>
          <label className="flex items-center gap-1 text-[13px] font-semibold text-[#1f2937] mb-1.5">
            Mật khẩu <span style={{ color: '#f59e0b' }}>*</span>
          </label>
          <div className="relative">
            <input type={showPw ? 'text' : 'password'} placeholder="Mật khẩu ít nhất 8 ký tự"
              className="w-full px-3 py-2.5 border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:border-[#f59e0b] transition pr-10" />
            <button type="button" onClick={() => setShowPw(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2">
              <img src="/assets/b905a.svg" alt="" className="w-4 h-4 opacity-40" />
            </button>
          </div>
        </div>
        <div>
          <label className="flex items-center gap-1 text-[13px] font-semibold text-[#1f2937] mb-1.5">
            Nhập lại mật khẩu <span style={{ color: '#f59e0b' }}>*</span>
          </label>
          <div className="relative">
            <input type={showConfirm ? 'text' : 'password'} placeholder="Xác nhận lại mật khẩu của bạn"
              className="w-full px-3 py-2.5 border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:border-[#f59e0b] transition pr-10" />
            <button type="button" onClick={() => setShowConfirm(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2">
              <img src="/assets/b905a.svg" alt="" className="w-4 h-4 opacity-40" />
            </button>
          </div>
        </div>
        {[
          { label: 'Họ và tên', placeholder: 'Nhập đầy đủ họ và tên', type: 'text' },
        ].map(f => (
          <div key={f.label}>
            <label className="flex items-center gap-1 text-[13px] font-semibold text-[#1f2937] mb-1.5">
              {f.label} <span style={{ color: '#f59e0b' }}>*</span>
            </label>
            <input type={f.type} placeholder={f.placeholder}
              className="w-full px-3 py-2.5 border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:border-[#f59e0b] transition" />
          </div>
        ))}
        <div>
          <label className="flex items-center gap-1 text-[13px] font-semibold text-[#1f2937] mb-1.5">
            Số CCCD/CMND <span style={{ color: '#f59e0b' }}>*</span>
          </label>
          <input type="text" placeholder="Nhập 12 số CCCD"
            className="w-full px-3 py-2.5 border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:border-[#f59e0b] transition" />
          <div className="mt-1.5 flex items-start gap-1.5 p-2 rounded-lg" style={{ background: '#fef3c7' }}>
            <span className="text-[#f59e0b] text-xs mt-0.5">✓</span>
            <p className="text-[11px]" style={{ color: '#d97706' }}>Quan trọng: Nhập chính xác số CCCD/CMND trên Hợp đồng thuê phòng để hệ thống tự động kết nối dữ liệu phòng ở của bạn.</p>
          </div>
        </div>
        {[
          { label: 'Số điện thoại', placeholder: 'Nhập số điện thoại liên hệ' },
          { label: 'Email', placeholder: 'Nhập địa chỉ email cá nhân' },
        ].map(f => (
          <div key={f.label}>
            <label className="flex items-center gap-1 text-[13px] font-semibold text-[#1f2937] mb-1.5">
              {f.label} <span style={{ color: '#f59e0b' }}>*</span>
            </label>
            <input type="text" placeholder={f.placeholder}
              className="w-full px-3 py-2.5 border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:border-[#f59e0b] transition" />
          </div>
        ))}

        <button className="w-full py-3 rounded-lg text-white font-semibold text-sm" style={{ background: '#f59e0b' }}>
          Đăng ký tài khoản
        </button>
      </div>
      <p className="text-center text-sm text-gray-500 mt-4">
        Đã có tài khoản?{' '}
        <button onClick={() => onGo('login')} className="font-semibold" style={{ color: '#f59e0b' }}>Đăng nhập ngay</button>
      </p>
    </div>
  )
}

function ForgotStep1({ onGo }: { onGo: (s: AuthScreen) => void }) {
  return (
    <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-sm border border-gray-100">
      <button onClick={() => onGo('login')} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-5 transition">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Quay lại Đăng nhập
      </button>
      <p className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: '#f59e0b' }}>HỆ THỐNG QUẢN LÝ NHÀ TRỌ</p>
      <h2 className="text-2xl font-bold mb-1" style={{ color: '#172b4d' }}>Quên mật khẩu?</h2>
      <p className="text-sm text-gray-500 mb-6">Nhập Email hoặc Số điện thoại đã đăng ký để nhận mã xác thực OTP.</p>
      <div className="space-y-4">
        <div>
          <label className="flex items-center gap-1 text-[13px] font-semibold text-[#1f2937] mb-1.5">
            Email / SĐT <span style={{ color: '#f59e0b' }}>*</span>
          </label>
          <input type="text" placeholder="Nhập địa chỉ email hoặc số điện thoại"
            className="w-full px-3 py-2.5 border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:border-[#f59e0b] transition" />
        </div>
        <button onClick={() => onGo('forgot2')} className="w-full py-3 rounded-lg text-white font-semibold text-sm" style={{ background: '#f59e0b' }}>
          Gửi mã OTP
        </button>
      </div>
      <p className="text-center text-sm text-gray-500 mt-5">
        Cần hỗ trợ? Liên hệ <span className="font-bold" style={{ color: '#f59e0b' }}>Hotline 1900 8888</span>
      </p>
    </div>
  )
}

function ForgotStep2({ onGo }: { onGo: (s: AuthScreen) => void }) {
  const [otp, setOtp] = useState(['8', '4', '', '', '', ''])
  const [showPw1, setShowPw1] = useState(false)
  const [showPw2, setShowPw2] = useState(false)

  return (
    <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-sm border border-gray-100">
      <p className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: '#f59e0b' }}>HỆ THỐNG QUẢN LÝ NHÀ TRỌ</p>
      <h2 className="text-xl font-bold mb-1" style={{ color: '#172b4d' }}>Xác thực OTP & Đặt lại mật khẩu</h2>
      <p className="text-sm text-gray-500 mb-5">Vui lòng nhập mã xác thực OTP gửi đến thông tin của bạn và cấu hình mật khẩu mới</p>

      <div className="space-y-4">
        <div>
          <p className="text-[13px] font-semibold text-[#1f2937] mb-2">Mã xác thực OTP</p>
          <div className="flex gap-2 mb-2">
            {otp.map((v, i) => (
              <input key={i} type="text" value={v} maxLength={1}
                onChange={e => { const n = [...otp]; n[i] = e.target.value; setOtp(n) }}
                className={`w-10 h-12 text-center text-lg font-bold border rounded-lg focus:outline-none focus:border-[#f59e0b] transition ${v ? 'border-[#f59e0b] bg-orange-50 text-[#f59e0b]' : 'border-[#e5e7eb]'}`} />
            ))}
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">Mã có hiệu lực trong <span className="text-gray-600 font-medium">01:59</span></span>
            <button className="font-semibold" style={{ color: '#f59e0b' }}>Gửi lại mã</button>
          </div>
        </div>

        <div>
          <label className="flex items-center gap-1 text-[13px] font-semibold text-[#1f2937] mb-1.5">
            Mật khẩu mới <span style={{ color: '#f59e0b' }}>*</span>
          </label>
          <div className="relative">
            <input type={showPw1 ? 'text' : 'password'} placeholder="Nhập mật khẩu mới"
              className="w-full px-3 py-2.5 border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:border-[#f59e0b] transition pr-10" />
            <button type="button" onClick={() => setShowPw1(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2">
              <img src="/assets/b905a.svg" alt="" className="w-4 h-4 opacity-40" />
            </button>
          </div>
        </div>
        <div>
          <label className="flex items-center gap-1 text-[13px] font-semibold text-[#1f2937] mb-1.5">
            Nhập lại mật khẩu mới <span style={{ color: '#f59e0b' }}>*</span>
          </label>
          <div className="relative">
            <input type={showPw2 ? 'text' : 'password'} placeholder="Xác nhận lại mật khẩu mới"
              className="w-full px-3 py-2.5 border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:border-[#f59e0b] transition pr-10" />
            <button type="button" onClick={() => setShowPw2(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2">
              <img src="/assets/b905a.svg" alt="" className="w-4 h-4 opacity-40" />
            </button>
          </div>
        </div>

        <button onClick={() => onGo('login')} className="w-full py-3 rounded-lg text-white font-semibold text-sm" style={{ background: '#f59e0b' }}>
          Xác nhận đặt lại mật khẩu
        </button>
      </div>
    </div>
  )
}

export default function Login({ onLogin }: Props) {
  const [screen, setScreen] = useState<AuthScreen>('login')

  return (
    <div className="min-h-screen flex">
      <AuthLeft />
      <div className="flex-1 flex items-center justify-center overflow-y-auto py-8 px-4" style={{ background: '#fdf6f0' }}>
        {screen === 'login'   && <LoginForm onLogin={onLogin} onGo={setScreen} />}
        {screen === 'signup'  && <SignupForm onGo={setScreen} />}
        {screen === 'forgot1' && <ForgotStep1 onGo={setScreen} />}
        {screen === 'forgot2' && <ForgotStep2 onGo={setScreen} />}
      </div>
    </div>
  )
}

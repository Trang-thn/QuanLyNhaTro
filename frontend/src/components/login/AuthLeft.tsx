import BuildingIllustration from './BuildingIllustration'

export default function AuthLeft() {
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


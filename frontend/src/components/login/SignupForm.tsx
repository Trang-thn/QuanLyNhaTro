import { useState } from 'react'
import type { AuthScreen } from '../../types/login'

export default function SignupForm({ onGo }: { onGo: (s: AuthScreen) => void }) {
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


import { useState } from 'react'
import type { AuthScreen } from '../../types/login'

export default function ForgotStep2({ onGo }: { onGo: (s: AuthScreen) => void }) {
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


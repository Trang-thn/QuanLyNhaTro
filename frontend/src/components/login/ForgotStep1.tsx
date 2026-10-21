import type { AuthScreen } from '../../types/login'

export default function ForgotStep1({ onGo }: { onGo: (s: AuthScreen) => void }) {
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


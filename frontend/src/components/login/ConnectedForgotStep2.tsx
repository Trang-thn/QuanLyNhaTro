import { useState, type FormEvent } from 'react'
import type { AuthScreen } from '../../types/login'
import { resetPassword } from '../../services/authService'

export default function ConnectedForgotStep2({ onGo, email }: { onGo: (screen: AuthScreen) => void; email: string }) {
  const [otp, setOtp] = useState(''); const [newPassword, setNewPassword] = useState(''); const [confirmation, setConfirmation] = useState('')
  const [loading, setLoading] = useState(false); const [error, setError] = useState('')
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setError('')
    if (!/^\d{6}$/.test(otp)) { setError('Mã OTP phải gồm 6 chữ số.'); return }
    if (newPassword.length < 8) { setError('Mật khẩu cần có ít nhất 8 ký tự.'); return }
    if (newPassword !== confirmation) { setError('Mật khẩu xác nhận không khớp.'); return }
    setLoading(true)
    try { await resetPassword({ email, otp, newPassword }); window.alert('Đặt lại mật khẩu thành công'); onGo('login') }
    catch (e) { setError(e instanceof Error ? e.message : 'Không thể đặt lại mật khẩu.') }
    finally { setLoading(false) }
  }
  return <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-sm border border-gray-100">
    <button type="button" onClick={() => onGo('forgot1')} className="mb-5 text-sm text-gray-500">← Quay lại nhập email</button>
    <h2 className="text-xl font-bold mb-1 text-[#172b4d]">Xác thực OTP & đặt lại mật khẩu</h2><p className="text-sm text-gray-500 mb-2">Nhập mã được gửi tới {email}.</p><p className="text-xs text-gray-500 mb-5">Nếu chưa nhận được email, hãy kiểm tra thư mục thư rác. Email không đăng ký hoặc sự cố gửi thư sẽ không được xác nhận riêng.</p>
    <form onSubmit={submit} className="space-y-4">
      <label className="block text-[13px] font-semibold">Mã xác thực OTP *<input required inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ''))} className="mt-1.5 w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm" /></label>
      <label className="block text-[13px] font-semibold">Mật khẩu mới *<input required type="password" autoComplete="new-password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="mt-1.5 w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm" /></label>
      <label className="block text-[13px] font-semibold">Nhập lại mật khẩu mới *<input required type="password" autoComplete="new-password" value={confirmation} onChange={e => setConfirmation(e.target.value)} className="mt-1.5 w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm" /></label>
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}<button disabled={loading} className="w-full py-3 rounded-lg bg-amber-500 text-white font-semibold disabled:opacity-60">{loading ? 'Đang đặt lại...' : 'Đặt lại mật khẩu'}</button>
    </form>
  </div>
}

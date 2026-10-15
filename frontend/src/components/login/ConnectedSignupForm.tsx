import { useState, type FormEvent } from 'react'
import type { AuthScreen } from '../../types/login'
import { registerAccount, type RegisterPayload } from '../../services/authService'

export default function ConnectedSignupForm({ onGo }: { onGo: (screen: AuthScreen) => void }) {
  const [form, setForm] = useState<RegisterPayload>({ username: '', password: '', fullName: '', identityCardNumber: '', phoneNumber: '', email: '' })
  const [confirmation, setConfirmation] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const set = (key: keyof RegisterPayload) => (event: React.ChangeEvent<HTMLInputElement>) => setForm(old => ({ ...old, [key]: event.target.value }))
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setError('')
    if (Object.values(form).some(value => !value.trim())) { setError('Vui lòng điền đầy đủ các trường.'); return }
    if (form.password.length < 8) { setError('Mật khẩu cần có ít nhất 8 ký tự.'); return }
    if (form.password !== confirmation) { setError('Mật khẩu xác nhận không khớp.'); return }
    if (!/^\d{12}$/.test(form.identityCardNumber)) { setError('CCCD phải gồm đúng 12 chữ số.'); return }
    setLoading(true)
    try { await registerAccount(form); window.alert('Đăng ký thành công'); onGo('login') }
    catch (e) { setError(e instanceof Error ? e.message : 'Không thể đăng ký tài khoản.') }
    finally { setLoading(false) }
  }
  const field = (key: keyof RegisterPayload, label: string, type = 'text') => (
    <label key={key} className="block text-[13px] font-semibold text-[#1f2937]">
      {label} <span className="text-amber-500">*</span>
      <input required type={type} value={form[key]} onChange={set(key)} className="mt-1.5 w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm font-normal" />
    </label>
  )
  return <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-sm border border-gray-100">
    <h2 className="text-2xl font-bold mb-1 text-[#172b4d]">Đăng ký tài khoản Khách thuê</h2>
    <p className="text-sm text-gray-500 mb-5">Nhập thông tin để tạo tài khoản</p>
    <form onSubmit={submit} className="space-y-3.5">
      {field('username', 'Tên đăng nhập')}
      {field('password', 'Mật khẩu (tối thiểu 8 ký tự)', 'password')}
      <label className="block text-[13px] font-semibold">Xác nhận mật khẩu *<input required type="password" value={confirmation} onChange={e => setConfirmation(e.target.value)} className="mt-1.5 w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm font-normal" /></label>
      {field('fullName', 'Họ và tên')}{field('identityCardNumber', 'Số CCCD/CMND')}{field('phoneNumber', 'Số điện thoại', 'tel')}{field('email', 'Email', 'email')}
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      <button disabled={loading} className="w-full py-3 rounded-lg text-white font-semibold text-sm disabled:opacity-60 bg-amber-500">{loading ? 'Đang đăng ký...' : 'Đăng ký tài khoản'}</button>
    </form>
    <p className="text-center text-sm text-gray-500 mt-4">Đã có tài khoản? <button onClick={() => onGo('login')} className="font-semibold text-amber-500">Đăng nhập ngay</button></p>
  </div>
}

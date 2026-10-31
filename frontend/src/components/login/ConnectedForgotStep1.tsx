import { useState, type FormEvent } from 'react'
import type { AuthScreen } from '../../types/login'
import { requestPasswordReset } from '../../services/authService'

export default function ConnectedForgotStep1({ onGo, email, onEmailChange }: { onGo: (screen: AuthScreen) => void; email: string; onEmailChange: (email: string) => void }) {
  const [loading, setLoading] = useState(false); const [error, setError] = useState('')
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setError(''); setLoading(true)
    try { await requestPasswordReset(email); onGo('forgot2') }
    catch (e) { setError(e instanceof Error ? e.message : 'Không gửi được mã xác thực.') }
    finally { setLoading(false) }
  }
  return <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-sm border border-gray-100">
    <button onClick={() => onGo('login')} className="mb-5 text-sm text-gray-500">← Quay lại Đăng nhập</button>
    <h2 className="text-2xl font-bold mb-1 text-[#172b4d]">Quên mật khẩu?</h2><p className="text-sm text-gray-500 mb-6">Nhập email đã đăng ký để nhận mã OTP.</p>
    <form onSubmit={submit} className="space-y-4"><label className="block text-[13px] font-semibold">Email *<input required type="email" autoComplete="email" value={email} onChange={e => onEmailChange(e.target.value)} className="mt-1.5 w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm" /></label>
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}<button disabled={loading} className="w-full py-3 rounded-lg bg-amber-500 text-white font-semibold disabled:opacity-60">{loading ? 'Đang gửi...' : 'Gửi mã xác thực'}</button></form>
  </div>
}

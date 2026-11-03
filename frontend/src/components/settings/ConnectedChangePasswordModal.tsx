import { useState, type FormEvent } from 'react'
import { changeMyPassword } from '../../services/settingsActions'

export default function ConnectedChangePasswordModal({ onClose }: { onClose: () => void }) {
  const [currentPassword, setCurrentPassword] = useState(''); const [newPassword, setNewPassword] = useState(''); const [confirmation, setConfirmation] = useState('')
  const [loading, setLoading] = useState(false); const [error, setError] = useState('')
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setError('')
    if (newPassword.length < 8) { setError('Mật khẩu mới cần có ít nhất 8 ký tự.'); return }
    if (newPassword !== confirmation) { setError('Mật khẩu xác nhận không khớp.'); return }
    setLoading(true)
    try { await changeMyPassword({ currentPassword, newPassword }); window.alert('Đổi mật khẩu thành công'); onClose() }
    catch (e) { setError(e instanceof Error ? e.message : 'Không thể đổi mật khẩu.') }
    finally { setLoading(false) }
  }
  const field = (label: string, value: string, change: (value: string) => void) => <label className="block text-sm font-medium text-gray-700">{label}<input required type="password" value={value} onChange={e => change(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" /></label>
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}><form onSubmit={submit} onClick={e => e.stopPropagation()} className="w-full max-w-md space-y-4 rounded-2xl bg-white p-7 shadow-xl">
    <h2 className="text-lg font-bold text-[#172b4d]">Đổi mật khẩu</h2>{field('Mật khẩu hiện tại', currentPassword, setCurrentPassword)}{field('Mật khẩu mới', newPassword, setNewPassword)}{field('Nhập lại mật khẩu mới', confirmation, setConfirmation)}
    {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
    <div className="flex justify-end gap-3"><button type="button" onClick={onClose} className="rounded-lg border px-4 py-2 text-sm">Hủy</button><button disabled={loading} className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">{loading ? 'Đang lưu...' : 'Lưu mật khẩu mới'}</button></div>
  </form></div>
}

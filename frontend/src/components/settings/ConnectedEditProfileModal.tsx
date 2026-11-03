import { useState, type FormEvent } from 'react'
import type { SettingsData } from '../../types/settings'
import { updateMyProfile, type UpdateProfilePayload } from '../../services/settingsActions'

export default function ConnectedEditProfileModal({ data, onClose, onSaved }: { data: SettingsData; onClose: () => void; onSaved: (payload: UpdateProfilePayload) => void }) {
  const [form, setForm] = useState<UpdateProfilePayload>({ email: data.editProfileFields.email, phoneNumber: data.editProfileFields.phone, permanentAddress: data.editProfileFields.address, emergencyContact: data.editProfileFields.emergencyPhone })
  const [loading, setLoading] = useState(false); const [error, setError] = useState('')
  const set = (key: keyof UpdateProfilePayload) => (event: React.ChangeEvent<HTMLInputElement>) => setForm(old => ({ ...old, [key]: event.target.value }))
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setError(''); setLoading(true)
    try { await updateMyProfile(form); window.alert('Cập nhật thông tin thành công'); onSaved(form); onClose() }
    catch (e) { setError(e instanceof Error ? e.message : 'Không thể cập nhật hồ sơ.') }
    finally { setLoading(false) }
  }
  const field = (key: keyof UpdateProfilePayload, label: string, type = 'text') => <label key={key} className="block text-sm font-medium text-gray-700">{label}<input type={type} value={form[key] ?? ''} onChange={set(key)} className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" /></label>
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}><form onSubmit={submit} onClick={e => e.stopPropagation()} className="w-full max-w-xl space-y-4 rounded-2xl bg-white p-7 shadow-xl">
    <h2 className="text-lg font-bold text-[#172b4d]">Cập nhật thông tin cá nhân</h2>
    <p className="text-sm text-gray-500">{data.displayName} · CCCD {data.editProfileFields.identityNumber}</p>
    {field('phoneNumber', 'Số điện thoại', 'tel')}{field('email', 'Email', 'email')}{field('permanentAddress', 'Địa chỉ thường trú')}{field('emergencyContact', 'SĐT liên hệ khẩn cấp', 'tel')}
    {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
    <div className="flex justify-end gap-3"><button type="button" onClick={onClose} className="rounded-lg border px-4 py-2 text-sm">Hủy</button><button disabled={loading} className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">{loading ? 'Đang lưu...' : 'Lưu cập nhật'}</button></div>
  </form></div>
}

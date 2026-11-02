
import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import type { Tenant, CreateTenantRequest } from '../../types/tenant'
import { createTenant, updateTenant, deleteTenant } from '../../services/tenantService'

const AMBER = '#f59e0b'
const NAVY = '#0d2137'
 const emptyForm: CreateTenantRequest = {
  full_name: '', date_of_birth: '', identity_card_number: '', phone: '',
  email: '', permanent_address: '', issue_place: '', emergency_contact: '',
  gender: null, avatar: null,
} 
interface Props {
  tenants: Tenant[]
  onReload: () => void | Promise<void>
}

function getTodayString() {
  const today = new Date()
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
}

function getTenantName(tenant: Tenant) {
  const data = tenant as Tenant & { name?: string }
  return data.full_name?.trim() || data.name?.trim() || 'Chưa cập nhật'
}

export default function TenantManagement({ tenants, onReload }: Props) {
  const [keyword, setKeyword] = useState('')
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null)
  const [detailTenant, setDetailTenant] = useState<Tenant | null>(null)
  const [form, setForm] = useState<CreateTenantRequest>({ ...emptyForm })
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | number | null>(null)
  const [error, setError] = useState('')

  // Tìm kiếm khách hàng theo tên, CCCD, số điện thoại hoặc email
  const filteredTenants = useMemo(() => {
     const value = keyword.trim().toLowerCase()
    if (!value) return tenants

    return tenants.filter((tenant) =>
      [getTenantName(tenant), tenant.identity_card_number, tenant.phone, tenant.email]
        .some((item) => String(item ?? '').toLowerCase().includes(value)),
    )
  }, [tenants, keyword])
   // Mở form thêm khách hàng
  function openCreateForm() {
    setSelectedTenant(null)
    setForm({ ...emptyForm })
    setError('')
    setShowForm(true)
  }
   // Mở form sửa khách hàng
  function openEditForm(tenant: Tenant) {
    setSelectedTenant(tenant)
     setForm({
      full_name: getTenantName(tenant) === 'Chưa cập nhật' ? '' : getTenantName(tenant),
      date_of_birth: tenant.date_of_birth ? String(tenant.date_of_birth).slice(0, 10) : '',
      identity_card_number: tenant.identity_card_number ?? '',
      phone: tenant.phone ?? '',
      email: tenant.email ?? '',
      permanent_address: tenant.permanent_address ?? '',
      issue_place: tenant.issue_place ?? '',
      emergency_contact: tenant.emergency_contact ?? '',
      gender: tenant.gender ?? null,
      avatar: tenant.avatar ?? null,
    })
     setError('')
    setShowForm(true)
  }

  // Đóng form
  function closeForm() {
     if (saving) return
    setShowForm(false)
    setSelectedTenant(null)
    setForm({ ...emptyForm })
    setError('')
  }

  // Cập nhật dữ liệu form
  function updateField<K extends keyof CreateTenantRequest>(field: K, value: CreateTenantRequest[K]) {
    setForm((previous) => ({ ...previous, [field]: value }))
  }

  // Kiểm tra và lưu thông tin khách hàng
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
     if (saving) return
     setError('')

    const fullName = (form.full_name ?? '').trim()
    const identityNumber = (form.identity_card_number ?? '').trim()
    const birthday = (form.date_of_birth ?? '').trim()
    const phone = (form.phone ?? '').trim()
    const issuePlace = (form.issue_place ?? '').trim()
    const gender = form.gender

    if (!fullName) return setError('Vui lòng nhập họ và tên khách hàng.')
    if (!/^\d{12}$/.test(identityNumber)) return setError('CCCD phải gồm đúng 12 chữ số.')
    if (!birthday) return setError('Vui lòng chọn ngày sinh.')
    if (!/^\d{4}-\d{2}-\d{2}$/.test(birthday)) return setError('Ngày sinh không hợp lệ.')

    const birthdayDate = new Date(`${birthday}T00:00:00`)
    if (
      Number.isNaN(birthdayDate.getTime()) ||
      birthdayDate.getFullYear() !== Number(birthday.slice(0, 4)) ||
      birthdayDate.getMonth() + 1 !== Number(birthday.slice(5, 7)) ||
      birthdayDate.getDate() !== Number(birthday.slice(8, 10))
    ) return setError('Ngày sinh không hợp lệ.')

    if (birthday > getTodayString()) return setError('Ngày sinh không được ở trong tương lai.')
    if (!gender) return setError('Vui lòng chọn giới tính.')
    if (!phone) return setError('Vui lòng nhập số điện thoại.')
    if (!/^\d+$/.test(phone)) return setError('Số điện thoại chỉ được chứa chữ số.')
    if (!issuePlace) return setError('Vui lòng nhập nơi cấp CCCD.')

    const payload: CreateTenantRequest = {
       ...form,
      full_name: fullName,
      identity_card_number: identityNumber,
      date_of_birth: birthday,
       phone,
      email: (form.email ?? '').trim(),
      permanent_address: (form.permanent_address ?? '').trim(),
      issue_place: issuePlace,
      emergency_contact: (form.emergency_contact ?? '').trim(),
      gender,
    }

    setSaving(true)
     try {
      if (selectedTenant) await updateTenant(selectedTenant.id, payload)
      else await createTenant(payload)

      await onReload()
       setShowForm(false)
      setSelectedTenant(null)
      setForm({ ...emptyForm })
      setError('')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Không thể lưu thông tin khách hàng. Vui lòng thử lại.')
    } finally {
      setSaving(false)
    }
  }

  // Xóa khách hàng
  async function handleDelete(tenant: Tenant) {
    if (deletingId !== null || saving) return

    if (!window.confirm(`Bạn có chắc muốn xóa khách hàng "${getTenantName(tenant)}" không?`)) return

    setError('')
    setDeletingId(tenant.id)
     try {
      await deleteTenant(tenant.id)
       await onReload()
    } catch (err: unknown) {
      window.alert(err instanceof Error ? err.message : 'Không thể xóa khách hàng. Vui lòng thử lại.')
    } finally {
      setDeletingId(null)
    }
  }

  const inputClass = 'w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500'

  return (
    <div className="space-y-5">
      {/* Tiêu đề */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: NAVY }}>Quản lý khách hàng</h2>
          <p className="mt-1 text-sm text-gray-500">Quản lý hồ sơ và thông tin liên hệ của khách thuê.</p>
        </div>
        <button type="button" onClick={openCreateForm} className="rounded-lg px-4 py-2 font-semibold text-white transition hover:opacity-90" style={{ backgroundColor: AMBER }}>
          + Thêm khách hàng
        </button>
      </div>

      {/* Tìm kiếm */}
      <div className="rounded-xl bg-white p-4 shadow-sm">
        <input type="search" value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="Tìm theo tên, số điện thoại, email hoặc CCCD..." className={inputClass} aria-label="Tìm kiếm khách hàng" />
      </div>

      {/* Danh sách khách hàng */}
      <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
        <table className="w-full min-w-[850px] text-left text-sm">
          <thead style={{ backgroundColor: NAVY, color: '#ffffff' }}>
            <tr>
              <th className="p-4">STT</th>
              <th className="p-4">Họ và tên</th>
              <th className="p-4">Số CCCD</th>
              <th className="p-4">Số điện thoại</th>
              <th className="p-4">Email</th>
              <th className="p-4">Thao tác</th>
            </tr>
          </thead>
           <tbody>
            {filteredTenants.map((tenant, index) => (
              <tr key={tenant.id} className="border-b transition hover:bg-gray-50">
                <td className="p-4">{index + 1}</td>
                <td className="p-4 font-medium">{getTenantName(tenant)}</td>
                <td className="p-4">{tenant.identity_card_number || '—'}</td>
                <td className="p-4">{tenant.phone || '—'}</td>
                <td className="p-4">{tenant.email || '—'}</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setDetailTenant(tenant)} className="rounded-md bg-amber-100 px-3 py-1 text-amber-700 transition hover:bg-amber-200">Chi tiết</button>
                    <button type="button" onClick={() => openEditForm(tenant)} disabled={deletingId !== null || saving} className="rounded-md bg-blue-100 px-3 py-1 text-blue-700 transition hover:bg-blue-200 disabled:opacity-50">Sửa</button>
                    <button type="button" onClick={() => void handleDelete(tenant)} disabled={deletingId !== null || saving} className="rounded-md bg-red-100 px-3 py-1 text-red-700 transition hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-50">
                      {deletingId === tenant.id ? 'Đang xóa...' : 'Xóa'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
             {filteredTenants.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">
                  {keyword.trim() ? 'Không tìm thấy khách hàng phù hợp.' : 'Chưa có khách hàng nào.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Popup chi tiết khách hàng */}
      {detailTenant && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4" onClick={() => setDetailTenant(null)}>
          <div role="dialog" aria-modal="true" aria-labelledby="tenant-detail-title" className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl" onClick={(event) => event.stopPropagation()}>
            <div className="mb-6 flex items-center justify-between gap-3">
              <div>
                <h3 id="tenant-detail-title" className="text-xl font-bold" style={{ color: NAVY }}>Chi tiết khách hàng</h3>
                <p className="mt-1 text-sm text-gray-500">Hồ sơ và thông tin cá nhân của khách thuê.</p>
              </div>
              <button type="button" onClick={() => setDetailTenant(null)} className="rounded-lg px-3 py-2 text-gray-500 hover:bg-gray-100">Đóng ✕</button>
            </div>

             <div className="mb-6 flex items-center gap-4 rounded-xl bg-gray-50 p-4">
              {detailTenant.avatar ? (
                <img src={detailTenant.avatar} alt="Ảnh đại diện khách hàng" className="h-16 w-16 rounded-full object-cover" />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold text-white" style={{ backgroundColor: NAVY }}>
                  {getTenantName(detailTenant).charAt(0).toUpperCase()}
                </div>
              )}
               <div>
                <h4 className="font-bold" style={{ color: NAVY }}>{getTenantName(detailTenant)}</h4>
                <p className="text-sm text-gray-500">Mã khách hàng: {detailTenant.id}</p>
              </div>
            </div>

            <h4 className="mb-4 font-bold" style={{ color: NAVY }}>Thông tin cá nhân</h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><p className="text-sm text-gray-500">Họ và tên</p><p className="mt-1 font-medium">{getTenantName(detailTenant)}</p></div>
              <div><p className="text-sm text-gray-500">Số CCCD/CMND</p><p className="mt-1 font-medium">{detailTenant.identity_card_number || '—'}</p></div>
              <div><p className="text-sm text-gray-500">Ngày sinh</p><p className="mt-1 font-medium">{detailTenant.date_of_birth ? String(detailTenant.date_of_birth).slice(0, 10) : '—'}</p></div>
              <div><p className="text-sm text-gray-500">Giới tính</p><p className="mt-1 font-medium">{detailTenant.gender === 'NAM' ? 'Nam' : detailTenant.gender === 'NU' ? 'Nữ' : detailTenant.gender === 'KHAC' ? 'Khác' : '—'}</p></div>
              <div><p className="text-sm text-gray-500">Số điện thoại</p><p className="mt-1 font-medium">{detailTenant.phone || '—'}</p></div>
              <div><p className="text-sm text-gray-500">Email</p><p className="mt-1 font-medium">{detailTenant.email || '—'}</p></div>
              <div><p className="text-sm text-gray-500">Nơi cấp CCCD</p><p className="mt-1 font-medium">{detailTenant.issue_place || '—'}</p></div>
              <div><p className="text-sm text-gray-500">Liên hệ khẩn cấp</p><p className="mt-1 font-medium">{detailTenant.emergency_contact || '—'}</p></div>
              <div className="sm:col-span-2"><p className="text-sm text-gray-500">Địa chỉ thường trú</p><p className="mt-1 font-medium">{detailTenant.permanent_address || '—'}</p></div>
            </div>

             <div className="mt-6 flex justify-end border-t pt-4">
              <button type="button" onClick={() => setDetailTenant(null)} className="rounded-lg px-5 py-2 font-semibold text-white transition hover:opacity-90" style={{ backgroundColor: NAVY }}>Đóng</button>
            </div>
          </div>
        </div>
      )}

      {/* Popup thêm hoặc sửa khách hàng */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4" onMouseDown={(event) => event.target === event.currentTarget && closeForm()}>
          <div role="dialog" aria-modal="true" aria-labelledby="tenant-form-title" className="my-auto max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
            <h3 id="tenant-form-title" className="mb-5 text-xl font-bold" style={{ color: NAVY }}>
              {selectedTenant ? 'Cập nhật khách hàng' : 'Thêm khách hàng'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                 <label className="space-y-1">
                  <span className="block text-sm font-medium">Họ và tên *</span>
                  <input required autoFocus type="text" className={inputClass} value={form.full_name ?? ''} onChange={(event) => updateField('full_name', event.target.value)} placeholder="Nhập họ và tên" />
                </label>
 
                <label className="space-y-1">
                  <span className="block text-sm font-medium">Số CCCD *</span>
                  <input required type="text" inputMode="numeric" maxLength={12} className={inputClass} value={form.identity_card_number ?? ''} onChange={(event) => updateField('identity_card_number', event.target.value.replace(/\D/g, '').slice(0, 12))} placeholder="Nhập CCCD gồm 12 số" />
                </label>

                 <label className="space-y-1">
                  <span className="block text-sm font-medium">Ngày sinh *</span>
                  <input required type="date" max={getTodayString()} className={inputClass} value={form.date_of_birth ?? ''} onChange={(event) => updateField('date_of_birth', event.target.value)} />
                </label>

                 <label className="space-y-1">
                  <span className="block text-sm font-medium">Giới tính *</span>
                  <select required className={inputClass} value={form.gender ?? ''} onChange={(event) => updateField('gender', event.target.value === '' ? null : event.target.value as 'NAM' | 'NU' | 'KHAC')}>
                    <option value="">-- Chọn giới tính --</option>
                    <option value="NAM">Nam</option>
                    <option value="NU">Nữ</option>
                    <option value="KHAC">Khác</option>
                  </select>
                </label>

                 <label className="space-y-1">
                  <span className="block text-sm font-medium">Số điện thoại *</span>
                  <input required type="tel" inputMode="numeric" className={inputClass} value={form.phone ?? ''} onChange={(event) => updateField('phone', event.target.value.replace(/\D/g, ''))} placeholder="Nhập số điện thoại" />
                </label>

                 <label className="space-y-1">
                  <span className="block text-sm font-medium">Email</span>
                  <input type="email" className={inputClass} value={form.email ?? ''} onChange={(event) => updateField('email', event.target.value)} placeholder="example@email.com" />
                </label>

                 <label className="space-y-1">
                  <span className="block text-sm font-medium">Nơi cấp CCCD *</span>
                  <input required type="text" className={inputClass} value={form.issue_place ?? ''} onChange={(event) => updateField('issue_place', event.target.value)} placeholder="Nhập nơi cấp CCCD" />
                </label>

                 <label className="space-y-1">
                  <span className="block text-sm font-medium">Liên hệ khẩn cấp</span>
                  <input type="text" className={inputClass} value={form.emergency_contact ?? ''} onChange={(event) => updateField('emergency_contact', event.target.value)} placeholder="Nhập thông tin liên hệ" />
                </label>
              </div>

               <label className="block space-y-1">
                <span className="text-sm font-medium">Địa chỉ thường trú</span>
                <textarea rows={3} className={inputClass} value={form.permanent_address ?? ''} onChange={(event) => updateField('permanent_address', event.target.value)} placeholder="Nhập địa chỉ thường trú" />
              </label>

              {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600" role="alert">{error}</p>}

               <div className="flex justify-end gap-3 border-t pt-4">
                <button type="button" onClick={closeForm} disabled={saving} className="rounded-lg border border-gray-300 px-4 py-2 transition hover:bg-gray-100 disabled:opacity-50">Quay lại</button>
                <button type="submit" disabled={saving} className="rounded-lg px-5 py-2 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50" style={{ backgroundColor: NAVY }}>
                  {saving ? 'Đang lưu...' : selectedTenant ? 'Cập nhật' : 'Thêm khách hàng'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

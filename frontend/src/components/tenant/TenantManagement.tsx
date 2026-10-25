import { useMemo, useState, useRef } from 'react'
import type { FormEvent } from 'react'
import type {
  Tenant,
  CreateTenantRequest,
} from '../../types/tenant'

import {
  createTenant,
  updateTenant,
  deleteTenant,
} from '../../services/tenantService'

const AMBER = '#f59e0b'
const NAVY = '#0d2137'

// Dữ liệu mặc định của form
const emptyForm: CreateTenantRequest = {
  full_name: '',
  date_of_birth: '',
  identity_card_number: '',
  phone: '',
  email: '',
  permanent_address: '',
  issue_place: '',
  emergency_contact: '',
  gender: null,
  avatar: null,
}

interface Props {
  tenants: Tenant[]
  onReload: () => void | Promise<void>
}

// Lấy ngày hiện tại theo định dạng YYYY-MM-DD
function getTodayString() {
  const today = new Date()

  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export default function TenantManagement({
  tenants,
  onReload,
}: Props) {
  const [keyword, setKeyword] = useState('')
  const [selectedTenant, setSelectedTenant] =
    useState<Tenant | null>(null)

  const [form, setForm] = useState<CreateTenantRequest>({
    ...emptyForm,
  })

  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)

  const [deletingId, setDeletingId] = useState<
    string | number | null
  >(null)

  const [error, setError] = useState('')

  // Tìm kiếm theo tên, CCCD, số điện thoại hoặc email
  const filteredTenants = useMemo(() => {
    const value = keyword.trim().toLowerCase()

    if (!value) return tenants

    return tenants.filter((tenant) =>
      [
        tenant.full_name,
        tenant.identity_card_number,
        tenant.phone,
        tenant.email,
      ].some((item) =>
        String(item ?? '').toLowerCase().includes(value),
      ),
    )
  }, [tenants, keyword])

  // Mở popup thêm khách hàng
  function openCreateForm() {
    setSelectedTenant(null)
    setForm({ ...emptyForm })
    setError('')
    setShowForm(true)
  }

  // Mở popup sửa khách hàng
  function openEditForm(tenant: Tenant) {
    setSelectedTenant(tenant)

    setForm({
      full_name: tenant.full_name ?? '',
      date_of_birth: tenant.date_of_birth
        ? String(tenant.date_of_birth).slice(0, 10)
        : '',
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

  // Đóng popup
  function closeForm() {
    if (saving) return

    setShowForm(false)
    setSelectedTenant(null)
    setForm({ ...emptyForm })
    setError('')
  }

  // Cập nhật giá trị của một trường
  function updateField<K extends keyof CreateTenantRequest>(
    field: K,
    value: CreateTenantRequest[K],
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }))
  }

  // Kiểm tra dữ liệu và thêm mới hoặc cập nhật khách hàng
  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    if (saving) return

    setError('')

    // Chuẩn hóa dữ liệu
    const fullName = (form.full_name ?? '').trim()
    const identityNumber = (
      form.identity_card_number ?? ''
    ).trim()
    const birthday = (form.date_of_birth ?? '').trim()
    const phone = (form.phone ?? '').trim()
    const issuePlace = (form.issue_place ?? '').trim()
    const gender = form.gender

    // 1. Bắt buộc nhập họ tên
    if (!fullName) {
      setError('Vui lòng nhập họ và tên khách hàng.')
      return
    }

    // 2. CCCD phải có đúng 12 chữ số
    if (!/^\d{12}$/.test(identityNumber)) {
      setError('CCCD phải gồm đúng 12 chữ số.')
      return
    }

    // 3. Bắt buộc nhập ngày sinh
    if (!birthday) {
      setError('Vui lòng chọn ngày sinh.')
      return
    }

    // Kiểm tra ngày sinh có đúng định dạng YYYY-MM-DD
    if (!/^\d{4}-\d{2}-\d{2}$/.test(birthday)) {
      setError('Ngày sinh không hợp lệ.')
      return
    }

    // Kiểm tra ngày có tồn tại thực tế
    const birthdayDate = new Date(`${birthday}T00:00:00`)

    if (
      Number.isNaN(birthdayDate.getTime()) ||
      birthdayDate.getFullYear() !== Number(birthday.slice(0, 4)) ||
      birthdayDate.getMonth() + 1 !== Number(birthday.slice(5, 7)) ||
      birthdayDate.getDate() !== Number(birthday.slice(8, 10))
    ) {
      setError('Ngày sinh không hợp lệ.')
      return
    }

    // Ngày sinh không được ở tương lai
    if (birthday > getTodayString()) {
      setError('Ngày sinh không được ở trong tương lai.')
      return
    }

    // 4. Bắt buộc chọn giới tính
    if (!gender) {
      setError('Vui lòng chọn giới tính.')
      return
    }

    // 5. Bắt buộc nhập số điện thoại
    if (!phone) {
      setError('Vui lòng nhập số điện thoại.')
      return
    }

    // Số điện thoại chỉ được chứa chữ số
    if (!/^\d+$/.test(phone)) {
      setError('Số điện thoại chỉ được chứa chữ số.')
      return
    }

    // 6. Bắt buộc nhập nơi cấp CCCD
    if (!issuePlace) {
      setError('Vui lòng nhập nơi cấp CCCD.')
      return
    }

    // Chuẩn bị dữ liệu gửi lên backend
    const payload: CreateTenantRequest = {
      ...form,
      full_name: fullName,
      identity_card_number: identityNumber,
      date_of_birth: birthday,
      phone,
      email: (form.email ?? '').trim(),
      permanent_address: (
        form.permanent_address ?? ''
      ).trim(),
      issue_place: issuePlace,
      emergency_contact: (
        form.emergency_contact ?? ''
      ).trim(),
      gender,
    }

    setSaving(true)

    try {
      // Gọi API thêm mới hoặc cập nhật
      if (selectedTenant) {
        await updateTenant(selectedTenant.id, payload)
      } else {
        await createTenant(payload)
      }

      // Tải lại danh sách trước khi đóng popup
      await onReload()

      setShowForm(false)
      setSelectedTenant(null)
      setForm({ ...emptyForm })
      setError('')
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'Không thể lưu thông tin khách hàng. Vui lòng thử lại.',
      )
    } finally {
      setSaving(false)
    }
  }

  // Xóa khách hàng
  async function handleDelete(tenant: Tenant) {
    if (deletingId !== null || saving) return

    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa khách hàng "${
        tenant.full_name || tenant.id
      }" không?`,
    )

    if (!confirmed) return

    setError('')
    setDeletingId(tenant.id)

    try {
      await deleteTenant(tenant.id)
      await onReload()
    } catch (err: unknown) {
      window.alert(
        err instanceof Error
          ? err.message
          : 'Không thể xóa khách hàng. Vui lòng thử lại.',
      )
    } finally {
      setDeletingId(null)
    }
  }

  const inputClass =
    'w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500'

  function setCccdReady(arg0: boolean) {
    throw new Error('Function not implemented.')
  }

  return (
    <div className="space-y-5">
      {/* Tiêu đề và nút thêm */}
      <div className="flex flex-wrap items-center justify-between gap-3">
       {} <div>
          <h2
            className="text-2xl font-bold"
            style={{ color: NAVY }}
          >
            Quản lý khách hàng
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Quản lý hồ sơ và thông tin liên hệ của khách thuê.
          </p>
        </div> 

        <button
          type="button"
          onClick={openCreateForm}
          className="rounded-lg px-4 py-2 font-semibold text-white transition hover:opacity-90"
          style={{ backgroundColor: AMBER }}
        >
          + Thêm khách hàng
        </button>
      </div>

      {/* Tìm kiếm */}
      <div className="rounded-xl bg-white p-4 shadow-sm">
        <input
          type="search"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="Tìm theo tên, số điện thoại, email hoặc CCCD..."
          className={inputClass}
          aria-label="Tìm kiếm khách hàng"
        />
      </div>

      {/* Bảng khách hàng */}
      <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
        <table className="w-full min-w-[850px] text-left text-sm">
          <thead
            style={{ backgroundColor: NAVY, color: '#ffffff' }}
          >
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
              <tr
                key={tenant.id}
                className="border-b transition hover:bg-gray-50"
              >
                <td className="p-4">{index + 1}</td>

                <td className="p-4 font-medium">
                  {tenant.full_name || 'Chưa cập nhật'}
                </td>

                <td className="p-4">
                  {tenant.identity_card_number || '—'}
                </td>

                <td className="p-4">
                  {tenant.phone || '—'}
                </td>

                <td className="p-4">
                  {tenant.email || '—'}
                </td>

                <td className="p-4">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => openEditForm(tenant)}
                      disabled={deletingId !== null || saving}
                      className="rounded-md bg-blue-100 px-3 py-1 text-blue-700 transition hover:bg-blue-200 disabled:opacity-50"
                    >
                      Sửa
                    </button>

                    <button
                      type="button"
                      onClick={() => void handleDelete(tenant)}
                      disabled={deletingId !== null || saving}
                      className="rounded-md bg-red-100 px-3 py-1 text-red-700 transition hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {deletingId === tenant.id
                        ? 'Đang xóa...'
                        : 'Xóa'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filteredTenants.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="p-8 text-center text-gray-500"
                >
                  {keyword.trim()
                    ? 'Không tìm thấy khách hàng phù hợp.'
                    : 'Chưa có khách hàng nào.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Popup thêm và sửa khách hàng */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeForm()
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="tenant-form-title"
            className="my-auto max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl"
          >
            <h3
              id="tenant-form-title"
              className="mb-5 text-xl font-bold"
              style={{ color: NAVY }}
            >
              {selectedTenant
                ? 'Cập nhật khách hàng'
                : 'Thêm khách hàng'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Họ tên */}
                <label className="space-y-1">
                  <span className="block text-sm font-medium">
                    Họ và tên *
                  </span>

                  <input
                    required
                    autoFocus
                    className={inputClass}
                    value={form.full_name ?? ''}
                    onChange={(event) =>
                      updateField('full_name', event.target.value)
                    }
                    placeholder="Nhập họ và tên"
                  />
                </label>

                {/* CCCD */}
                <label className="space-y-1">
                  <span className="block text-sm font-medium">
                    Số CCCD *
                  </span>

                 <input
  required
  type="text"
  inputMode="numeric"
  maxLength={12}
  className={inputClass}
  value={form.identity_card_number ?? ''}
  onChange={(event) => {
    const value = event.target.value.replace(/\D/g, '').slice(0, 12)

    updateField('identity_card_number', value)
    setCccdReady(false)

    if (value.length === 12) {
      window.setTimeout(() => {
        setCccdReady(true)
      }, 500)
    }
  }}
  placeholder="Nhập CCCD gồm 12 số"
/>
                </label>

                {/* Ngày sinh */}
                <label className="space-y-1">
                  <span className="block text-sm font-medium">
                    Ngày sinh *
                  </span>

                  <input
                    required
                    type="date"
                    max={getTodayString()}
                    className={inputClass}
                    value={form.date_of_birth ?? ''}
                    onChange={(event) =>
                      updateField('date_of_birth', event.target.value)
                    }
                  />
                </label>

                {/* Giới tính */}
                <label className="space-y-1">
                  <span className="block text-sm font-medium">
                    Giới tính *
                  </span>

                  <select
                    required
                    className={inputClass}
                    value={form.gender ?? ''}
                    onChange={(event) => {
                      const value = event.target.value

                      updateField(
                        'gender',
                        value === ''
                          ? null
                          : (value as 'NAM' | 'NU' | 'KHAC'),
                      )
                    }}
                  >
                    <option value="">-- Chọn giới tính --</option>
                    <option value="NAM">Nam</option>
                    <option value="NU">Nữ</option>
                    <option value="KHAC">Khác</option>
                  </select>
                </label>

                {/* Số điện thoại */}
                <label className="space-y-1">
                  <span className="block text-sm font-medium">
                    Số điện thoại *
                  </span>

                  <input
                    required
                    type="tel"
                    inputMode="numeric"
                    className={inputClass}
                    value={form.phone ?? ''}
                    onChange={(event) => {
                      const value = event.target.value.replace(/\D/g, '')
                      updateField('phone', value)
                    }}
                    placeholder="Nhập số điện thoại"
                  />
                </label>

                {/* Email */}
                <label className="space-y-1">
                  <span className="block text-sm font-medium">
                    Email
                  </span>

                  <input
                    type="email"
                    className={inputClass}
                    value={form.email ?? ''}
                    onChange={(event) =>
                      updateField('email', event.target.value)
                    }
                    placeholder="example@email.com"
                  />
                </label>

                {/* Nơi cấp CCCD */}
                <label className="space-y-1">
                  <span className="block text-sm font-medium">
                    Nơi cấp CCCD *
                  </span>

                  <input
                    required
                    className={inputClass}
                    value={form.issue_place ?? ''}
                    onChange={(event) =>
                      updateField('issue_place', event.target.value)
                    }
                    placeholder="Nhập nơi cấp CCCD"
                  />
                </label>

                {/* Liên hệ khẩn cấp */}
                <label className="space-y-1">
                  <span className="block text-sm font-medium">
                    Liên hệ khẩn cấp
                  </span>

                  <input
                    className={inputClass}
                    value={form.emergency_contact ?? ''}
                    onChange={(event) =>
                      updateField(
                        'emergency_contact',
                        event.target.value,
                      )
                    }
                    placeholder="Nhập thông tin liên hệ"
                  />
                </label>
              </div>

              {/* Địa chỉ thường trú */}
              <label className="block space-y-1">
                <span className="text-sm font-medium">
                  Địa chỉ thường trú
                </span>

                <textarea
                  rows={3}
                  className={inputClass}
                  value={form.permanent_address ?? ''}
                  onChange={(event) =>
                    updateField(
                      'permanent_address',
                      event.target.value,
                    )
                  }
                  placeholder="Nhập địa chỉ thường trú"
                />
              </label>

              {/* Hiển thị lỗi */}
              {error && (
                <p
                  className="rounded-lg bg-red-50 p-3 text-sm text-red-600"
                  role="alert"
                >
                  {error}
                </p>
              )}

              {/* Nút thao tác */}
              <div className="flex justify-end gap-3 border-t pt-4">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="rounded-lg border border-gray-300 px-4 py-2 transition hover:bg-gray-100 disabled:opacity-50"
                >
                  Quay lại
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg px-5 py-2 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  style={{ backgroundColor: NAVY }}
                >
                  {saving
                    ? 'Đang lưu...'
                    : selectedTenant
                      ? 'Cập nhật'
                      : 'Lưu thông tin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

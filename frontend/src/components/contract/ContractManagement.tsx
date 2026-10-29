
import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'

import type {
  Contract,
  CreateContractRequest,
  ContractStatus,
  UpdateContractRequest,
} from '../../types/contract'

import type { RoomApiDTO } from '../../types/rooms'
import type { Tenant } from '../../types/tenant'

import { listRooms } from '../../services/roomService'
import { getTenants } from '../../services/tenantService'

import {
  createContract,
  updateContract,
  liquidateContract,
} from '../../services/contractService'

const NAVY = '#0d2137'
const AMBER = '#f59e0b'

interface Props {
  contracts: Contract[]
  onReload: () => void
}

type ContractForm = CreateContractRequest

const emptyForm: ContractForm = {
  room_id: '',
  representative_tenant_id: '',
  start_date: '',
  end_date: '',
  rental_price: 0,
  deposit_amount: 0,
  billing_cycle_date: '',
}

function statusLabel(status: ContractStatus): string {
  switch (status) {
    case 'HIEU_LUC':
      return 'Có hiệu lực'
   case 'KHONG_HIEU_LUC':
      return 'Không hiệu lực'
   case 'DA_THANH_LY':
      return 'Đã thanh lý'
  default:
      return status
  }
}

function formatDate(value?: string | null): string {
  if (!value) return '—'
  return String(value).slice(0, 10)
}

function formatMoney(value: number | null | undefined): string {
  return Number(value ?? 0).toLocaleString('vi-VN') + ' đ'
}

function toContractInput(
  form: ContractForm,
): CreateContractRequest {
  if (!form.room_id.trim()) {
    throw new Error('Vui lòng chọn phòng.')
  }

  if (!form.representative_tenant_id.trim()) {
    throw new Error('Vui lòng chọn khách thuê.')
  }

  if (!form.start_date || !form.end_date) {
    throw new Error(
      'Vui lòng nhập ngày bắt đầu và ngày kết thúc.',
    )
  }

  if (form.end_date < form.start_date) {
    throw new Error(
      'Ngày kết thúc không được trước ngày bắt đầu.',
    )
  }

  if (!form.billing_cycle_date) {
    throw new Error('Vui lòng nhập ngày lập hóa đơn.')
  }

  if (
    !Number.isFinite(Number(form.rental_price)) ||
    Number(form.rental_price) < 0
  ) {
    throw new Error('Tiền thuê không hợp lệ.')
  }

  if (
    !Number.isFinite(Number(form.deposit_amount)) ||
    Number(form.deposit_amount) < 0
  ) {
    throw new Error('Tiền cọc không hợp lệ.')
 }

  return {
    room_id: form.room_id,
    representative_tenant_id:
      form.representative_tenant_id,
    start_date: form.start_date,
    end_date: form.end_date,
    rental_price: Number(form.rental_price),
    deposit_amount: Number(form.deposit_amount),
    billing_cycle_date: form.billing_cycle_date,
  }
}

export default function ContractManagement({
  contracts,
  onReload,
}: Props) {
  const [keyword, setKeyword] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')

  const [selected, setSelected] = useState<Contract | null>(null)
  const [form, setForm] = useState<ContractForm>({
    ...emptyForm,
  })

  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [rooms, setRooms] = useState<RoomApiDTO[]>([])
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [loadingOptions, setLoadingOptions] = useState(false)

  // Tải danh sách phòng và khách thuê.
  useEffect(() => {
    let cancelled = false

    async function loadOptions() {
      setLoadingOptions(true)

      try {
        const [roomResponse, tenantResponse] =
          await Promise.all([
            listRooms({ page: 1, limit: 100 }),
            getTenants(),
          ])

        if (!cancelled) {
          setRooms(roomResponse.data)
          setTenants(tenantResponse)
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : 'Không thể tải danh sách phòng và khách thuê.',
          )
        }
      } finally {
        if (!cancelled) {
          setLoadingOptions(false)
        }
      }
    }

    void loadOptions()

    return () => {
      cancelled = true
    }
  }, [])

  // Lấy số phòng từ dữ liệu hợp đồng hoặc danh sách phòng.
  function getRoomNumber(contract: Contract): string {
    if (contract.room_number) {
      return String(contract.room_number)
    }

    const room = rooms.find(
      (item) => String(item.id) === String(contract.room_id),
    )

    if (room?.room_number) {
      return String(room.room_number)
    }

    return 'Chưa có số phòng'
  }

  // Lấy tên khách thuê từ dữ liệu hợp đồng hoặc danh sách khách.
  function getTenantName(contract: Contract): string {
    if (contract.tenant_name) {
      return contract.tenant_name
    }

    const tenant = tenants.find(
      (item) =>
        String(item.id) ===
        String(contract.representative_tenant_id),
    )

    if (tenant?.full_name) {
      return tenant.full_name
    }

    return 'Chưa có thông tin người thuê'
  }

  // Tìm kiếm và lọc trạng thái.
  const filteredContracts = useMemo(() => {
    const value = keyword.trim().toLowerCase()

    return contracts.filter((contract) => {
      const contractNumber = String(
        contract.contract_number ?? '',
      ).toLowerCase()

      const roomNumber = String(
        contract.room_number ?? '',
      ).toLowerCase()

      const roomId = String(
        contract.room_id ?? '',
      ).toLowerCase()

      const tenantName = String(
        contract.tenant_name ?? '',
      ).toLowerCase()

      const matchesKeyword =
        !value ||
        contractNumber.includes(value) ||
        roomNumber.includes(value) ||
        roomId.includes(value) ||
        tenantName.includes(value)

      const matchesStatus =
        statusFilter === 'ALL' ||
        contract.status === statusFilter

      return matchesKeyword && matchesStatus
    })
  }, [contracts, keyword, statusFilter])

function openCreateForm() {
    setSelected(null)
    setForm({ ...emptyForm })
    setError('')
    setShowForm(true)
  }

 function openEditForm(contract: Contract) {
    setSelected(contract)

    setForm({
      room_id: String(contract.room_id ?? ''),
      representative_tenant_id: String(
        contract.representative_tenant_id ?? '',
      ),
      start_date: formatDate(contract.start_date) === '—'
        ? ''
        : formatDate(contract.start_date),
      end_date: formatDate(contract.end_date) === '—'
        ? ''
        : formatDate(contract.end_date),
      rental_price: Number(contract.rental_price ?? 0),
      deposit_amount: Number(contract.deposit_amount ?? 0),
      billing_cycle_date:
        formatDate(contract.billing_cycle_date) === '—'
          ? ''
          : formatDate(contract.billing_cycle_date),
    })

    setError('')
    setShowForm(true)
  }

async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    if (saving) return

    setSaving(true)
    setError('')

    try {
      const input = toContractInput(form)

      if (selected) {
        const updateInput: UpdateContractRequest = input
        await updateContract(selected.id, updateInput)
      } else {
        await createContract(input)
      }

      setShowForm(false)
      setSelected(null)
      setForm({ ...emptyForm })

      onReload()
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'Không thể lưu hợp đồng.',
      )
    } finally {
      setSaving(false)
    }
  }

async function handleLiquidate(contract: Contract) {
    if (contract.status === 'DA_THANH_LY') {
      window.alert('Hợp đồng này đã được thanh lý.')
      return
    }

    const confirmed = window.confirm(
      `Bạn có chắc muốn thanh lý hợp đồng ${
        contract.contract_number || contract.id
      }?`,
    )

    if (!confirmed) return

    try {
      await liquidateContract(contract.id)
      onReload()
    } catch (err: unknown) {
      window.alert(
        err instanceof Error
          ? err.message
          : 'Không thể thanh lý hợp đồng.',
      )
    }
  }

  const inputClass =
    'w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-amber-500'

  return (
    <div className="space-y-5">
      {/* Tiêu đề */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2
            className="text-2xl font-bold"
            style={{ color: NAVY }}
          >
            Quản lý hợp đồng
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Theo dõi hợp đồng thuê phòng và thời hạn thuê.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateForm}
          className="rounded-lg px-4 py-2 font-semibold text-white"
          style={{ backgroundColor: AMBER }}
        >
          + Thêm hợp đồng
        </button>
      </div>

      {/* Tìm kiếm và lọc */}
      <div className="grid gap-3 rounded-xl bg-white p-4 shadow-sm md:grid-cols-2">
        <input
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="Tìm mã hợp đồng, số phòng hoặc khách thuê..."
          className={inputClass}
        />

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className={inputClass}
        >
          <option value="ALL">Tất cả trạng thái</option>
          <option value="HIEU_LUC">Có hiệu lực</option>
          <option value="KHONG_HIEU_LUC">Không hiệu lực</option>
          <option value="DA_THANH_LY">Đã thanh lý</option>
        </select>
      </div>

      {/* Bảng hợp đồng */}
      <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
        <table className="w-full min-w-[1100px] text-left text-sm">
          <thead
            style={{
              backgroundColor: NAVY,
              color: 'white',
            }}
          >
            <tr>
              <th className="p-4">STT</th>
              <th className="p-4">Mã hợp đồng</th>
              <th className="p-4">Phòng</th>
              <th className="p-4">Khách thuê đại diện</th>
              <th className="p-4">Ngày bắt đầu</th>
              <th className="p-4">Ngày kết thúc</th>
              <th className="p-4">Tiền thuê</th>
              <th className="p-4">Tiền cọc</th>
              <th className="p-4">Trạng thái</th>
              <th className="p-4">Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {filteredContracts.map((contract, index) => (
              <tr
                key={contract.id}
                className="border-b hover:bg-gray-50"
              >
                <td className="p-4">{index + 1}</td>

                <td className="p-4 font-medium">
                  {contract.contract_number || 'Chưa có mã hợp đồng'}
                </td>

                <td className="p-4">
                  {getRoomNumber(contract)}
                </td>

                <td className="p-4">
                  {getTenantName(contract)}
                </td>

                <td className="p-4">
                  {formatDate(contract.start_date)}
                </td>

                <td className="p-4">
                  {formatDate(contract.end_date)}
                </td>

                <td className="p-4">
                  {formatMoney(contract.rental_price)}
                </td>

                <td className="p-4">
                  {formatMoney(contract.deposit_amount)}
                </td>

                <td className="p-4">
                  <span
                    className={`inline-block rounded-full px-3 py-1 ${
                      contract.status === 'HIEU_LUC'
                        ? 'bg-green-100 text-green-700'
                        : contract.status === 'DA_THANH_LY'
                          ? 'bg-gray-200 text-gray-700'
                          : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {statusLabel(contract.status)}
                  </span>
                </td>

                <td className="p-4">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => openEditForm(contract)}
                      className="rounded-md bg-blue-100 px-3 py-1 text-blue-700"
                    >
                      Sửa
                    </button>

                    <button
                      type="button"
                      onClick={() => void handleLiquidate(contract)}
                      disabled={contract.status === 'DA_THANH_LY'}
                      className="rounded-md bg-red-100 px-3 py-1 text-red-700 disabled:opacity-40"
                    >
                      Thanh lý
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filteredContracts.length === 0 && (
              <tr>
                <td
                  colSpan={10}
                  className="p-8 text-center text-gray-500"
                >
                  Không tìm thấy hợp đồng.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Form thêm và sửa hợp đồng */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="my-auto max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6">
            <h3
              className="mb-5 text-xl font-bold"
              style={{ color: NAVY }}
            >
              {selected ? 'Cập nhật hợp đồng' : 'Thêm hợp đồng'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Mã hợp đồng do backend tạo */}
                <label className="space-y-1">
                  <span className="block text-sm font-medium">
                    Mã hợp đồng
                  </span>

                  <input
                    readOnly
                    className={`${inputClass} bg-gray-100`}
                    value={
                      selected?.contract_number ??
                      'Hệ thống tự tạo khi lưu'
                    }
                  />
                </label>

                {/* Chọn phòng */}
                <label className="space-y-1">
                  <span className="block text-sm font-medium">
                    Phòng thuê *
                  </span>

                  <select
                    required
                    disabled={loadingOptions}
                    className={inputClass}
                    value={form.room_id}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        room_id: event.target.value,
                      })
                    }
                  >
                    <option value="">
                      {loadingOptions
                        ? 'Đang tải phòng...'
                        : 'Chọn phòng'}
                    </option>

                    {rooms.map((room) => (
                      <option key={room.id} value={room.id}>
                        {room.room_number}
                      </option>
                    ))}
                  </select>
                </label>

                {/* Chọn khách thuê */}
                <label className="space-y-1">
                  <span className="block text-sm font-medium">
                    Khách thuê đại diện *
                  </span>

                  <select
                    required
                    disabled={loadingOptions}
                    className={inputClass}
                    value={form.representative_tenant_id}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        representative_tenant_id: event.target.value,
                      })
                    }
                  >
                    <option value="">
                      {loadingOptions
                        ? 'Đang tải khách thuê...'
                        : 'Chọn khách thuê'}
                    </option>

                    {tenants.map((tenant) => (
                      <option key={tenant.id} value={tenant.id}>
                        {tenant.full_name}
                      </option>
                    ))}
                  </select>
                </label>

                {/* Ngày bắt đầu */}
                <label className="space-y-1">
                  <span className="block text-sm font-medium">
                    Ngày bắt đầu *
                  </span>

                  <input
                    required
                    type="date"
                    className={inputClass}
                    value={form.start_date}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        start_date: event.target.value,
                      })
                    }
                  />
                </label>

                {/* Ngày kết thúc */}
                <label className="space-y-1">
                  <span className="block text-sm font-medium">
                    Ngày kết thúc *
                  </span>

                  <input
                    required
                    type="date"
                    min={form.start_date || undefined}
                    className={inputClass}
                    value={form.end_date}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        end_date: event.target.value,
                      })
                    }
                  />
                </label>

                {/* Ngày lập hóa đơn */}
                <label className="space-y-1">
                  <span className="block text-sm font-medium">
                    Ngày lập hóa đơn *
                  </span>

                  <input
                    required
                    type="date"
                    className={inputClass}
                    value={form.billing_cycle_date}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        billing_cycle_date: event.target.value,
                      })
                    }
                  />
                </label>

                {/* Tiền thuê */}
                <label className="space-y-1">
                  <span className="block text-sm font-medium">
                    Tiền thuê (VNĐ) *
                  </span>

                  <input
                    required
                    type="number"
                    min={0}
                    className={inputClass}
                    value={form.rental_price}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        rental_price: Number(event.target.value),
                      })
                    }
                  />
                </label>

                {/* Tiền cọc */}
                <label className="space-y-1">
                  <span className="block text-sm font-medium">
                    Tiền cọc (VNĐ) *
                  </span>

                  <input
                    required
                    type="number"
                    min={0}
                    className={inputClass}
                    value={form.deposit_amount}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        deposit_amount: Number(event.target.value),
                      })
                    }
                  />
                </label>
              </div>

            {error && (
                <p className="text-sm text-red-600" role="alert">
                  {error}
                </p>
              )}

            <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setSelected(null)
                    setError('')
                  }}
                  className="rounded-lg border px-4 py-2"
                >
                  Quay lại
                </button>

                <button
                  type="submit"
                  disabled={saving || loadingOptions}
                  className="rounded-lg px-5 py-2 font-semibold text-white disabled:opacity-50"
                  style={{ backgroundColor: NAVY }}
                >
                  {saving ? 'Đang lưu...' : 'Lưu hợp đồng'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

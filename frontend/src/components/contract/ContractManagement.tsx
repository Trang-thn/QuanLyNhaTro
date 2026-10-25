import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'

import type {
  Contract,
  CreateContractRequest,
  ContractStatus,
} from '../../types/contract'

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

const emptyForm: CreateContractRequest = {
  room_id: '',
  representative_tenant_id: '',
  start_date: '',
  end_date: '',
  rental_price: 0,
  deposit_amount: 0,
  billing_cycle_day: 1,
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

/**
 * Chuyển dữ liệu form sang định dạng mà contractService yêu cầu.
 *
 * Giao diện:
 * representative_tenant_id: string
 * room_id: string
 *
 * Service:
 * tenant_id: number
 * room_id: number
 */
function toContractInput(form: CreateContractRequest) {
  const roomId = Number(form.room_id)
  const tenantId = Number(form.representative_tenant_id)

  if (
    !form.room_id.trim() ||
    !Number.isSafeInteger(roomId) ||
    roomId <= 0
  ) {
    throw new Error('ID phòng phải là số nguyên dương.')
  }

  if (
    !form.representative_tenant_id.trim() ||
    !Number.isSafeInteger(tenantId) ||
    tenantId <= 0
  ) {
    throw new Error('ID khách thuê phải là số nguyên dương.')
  }

  if (!form.start_date || !form.end_date) {
    throw new Error('Vui lòng nhập ngày bắt đầu và ngày kết thúc.')
  }

  if (form.end_date < form.start_date) {
    throw new Error('Ngày kết thúc không được trước ngày bắt đầu.')
  }

  if (
    !Number.isFinite(form.rental_price) ||
    form.rental_price < 0
  ) {
    throw new Error('Tiền thuê không hợp lệ.')
  }

  if (
    !Number.isFinite(form.deposit_amount) ||
    form.deposit_amount < 0
  ) {
    throw new Error('Tiền cọc không hợp lệ.')
  }

  if (
    !Number.isInteger(form.billing_cycle_day) ||
    form.billing_cycle_day < 1 ||
    form.billing_cycle_day > 31
  ) {
    throw new Error('Ngày lập hóa đơn phải từ 1 đến 31.')
  }

  return {
    tenant_id: tenantId,
    room_id: roomId,
    start_date: form.start_date,
    end_date: form.end_date,
    rental_price: form.rental_price,
    deposit_amount: form.deposit_amount,
    billing_cycle_day: form.billing_cycle_day,
  }
}

export default function ContractManagement({
  contracts,
  onReload,
}: Props) {
  const [keyword, setKeyword] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')

  const [selected, setSelected] = useState<Contract | null>(null)

  const [form, setForm] =
    useState<CreateContractRequest>(emptyForm)

  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // Tìm kiếm hợp đồng và lọc trạng thái.
  const filteredContracts = useMemo(() => {
    const value = keyword.trim().toLowerCase()

    return contracts.filter((contract) => {
      const matchesKeyword =
        !value ||
        contract.contract_number.toLowerCase().includes(value) ||
        (contract.room_number ?? '').toLowerCase().includes(value) ||
        contract.room_id.toLowerCase().includes(value)

      const matchesStatus =
        statusFilter === 'ALL' ||
        contract.status === statusFilter

      return matchesKeyword && matchesStatus
    })
  }, [contracts, keyword, statusFilter])

  // Mở form thêm hợp đồng.
  function openCreateForm() {
    setSelected(null)
    setForm({ ...emptyForm })
    setError('')
    setShowForm(true)
  }

  // Mở form chỉnh sửa hợp đồng.
  function openEditForm(contract: Contract) {
    setSelected(contract)

    setForm({
      contract_number: contract.contract_number,
      room_id: contract.room_id,
      representative_tenant_id:
        contract.representative_tenant_id,
      start_date: contract.start_date.slice(0, 10),
      end_date: contract.end_date.slice(0, 10),
      rental_price: contract.rental_price,
      deposit_amount: contract.deposit_amount,
      billing_cycle_day: contract.billing_cycle_day,
    })

    setError('')
    setShowForm(true)
  }

  // Lưu hợp đồng mới hoặc cập nhật hợp đồng.
  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    if (saving) {
      return
    }

    setSaving(true)
    setError('')

    try {
      const input = toContractInput(form)

      if (selected) {
        // ID hợp đồng giữ nguyên kiểu string.
        await updateContract(selected.id, input)
      } else {
        await createContract(input)
      }

      setShowForm(false)
      setSelected(null)

      onReload()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Không thể lưu hợp đồng.',
      )
    } finally {
      setSaving(false)
    }
  }

  // Thanh lý hợp đồng.
  async function handleLiquidate(contract: Contract) {
    if (contract.status === 'DA_THANH_LY') {
      window.alert('Hợp đồng này đã được thanh lý.')
      return
    }

    const confirmed = window.confirm(
      `Bạn có chắc muốn thanh lý hợp đồng ${contract.contract_number}?`,
    )

    if (!confirmed) {
      return
    }

    try {
      // ID hợp đồng là string.
      await liquidateContract(contract.id)

      onReload()
    } catch (err) {
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
      {/* Tiêu đề và nút thêm hợp đồng */}
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

      {/* Tìm kiếm và lọc trạng thái */}
      <div className="grid gap-3 rounded-xl bg-white p-4 shadow-sm md:grid-cols-2">
        <input
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="Tìm mã hợp đồng hoặc số phòng..."
          className={inputClass}
        />

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value)
          }
          className={inputClass}
        >
          <option value="ALL">Tất cả trạng thái</option>
          <option value="HIEU_LUC">Có hiệu lực</option>
          <option value="KHONG_HIEU_LUC">
            Không hiệu lực
          </option>
          <option value="DA_THANH_LY">Đã thanh lý</option>
        </select>
      </div>

      {/* Bảng danh sách hợp đồng */}
      <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
        <table className="w-full min-w-[1050px] text-left text-sm">
          <thead
            style={{ backgroundColor: NAVY, color: 'white' }}
          >
            <tr>
              <th className="p-4">STT</th>
              <th className="p-4">Mã hợp đồng</th>
              <th className="p-4">Phòng</th>
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
                  {contract.contract_number}
                </td>

                <td className="p-4">
                  {contract.room_number ?? contract.room_id}
                </td>

                <td className="p-4">
                  {contract.start_date.slice(0, 10)}
                </td>

                <td className="p-4">
                  {contract.end_date.slice(0, 10)}
                </td>

                <td className="p-4">
                  {contract.rental_price.toLocaleString('vi-VN')} đ
                </td>

                <td className="p-4">
                  {contract.deposit_amount.toLocaleString('vi-VN')} đ
                </td>

                <td className="p-4">
                  <span className="rounded-full bg-gray-100 px-3 py-1">
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
                      onClick={() => handleLiquidate(contract)}
                      disabled={
                        contract.status === 'DA_THANH_LY'
                      }
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
                  colSpan={9}
                  className="p-8 text-center text-gray-500"
                >
                  Không tìm thấy hợp đồng.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Form thêm và chỉnh sửa hợp đồng */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="my-auto max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6">
            <h3
              className="mb-5 text-xl font-bold"
              style={{ color: NAVY }}
            >
              {selected
                ? 'Cập nhật hợp đồng'
                : 'Thêm hợp đồng'}
            </h3>

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Mã hợp đồng */}
                <label className="space-y-1">
                  <span className="block text-sm font-medium">
                    Mã hợp đồng
                  </span>

                  <input
                    className={inputClass}
                    value={form.contract_number ?? ''}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        contract_number: event.target.value,
                      })
                    }
                    placeholder="Để trống nếu hệ thống tự tạo"
                  />
                </label>

                {/* ID phòng */}
                <label className="space-y-1">
                  <span className="block text-sm font-medium">
                    ID phòng *
                  </span>

                  <input
                    required
                    className={inputClass}
                    value={form.room_id}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        room_id: event.target.value,
                      })
                    }
                  />
                </label>

                {/* ID khách thuê */}
                <label className="space-y-1">
                  <span className="block text-sm font-medium">
                    ID khách thuê đại diện *
                  </span>

                  <input
                    required
                    className={inputClass}
                    value={form.representative_tenant_id}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        representative_tenant_id:
                          event.target.value,
                      })
                    }
                  />
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
                    Ngày lập hóa đơn hàng tháng *
                  </span>

                  <input
                    required
                    type="number"
                    min={1}
                    max={31}
                    className={inputClass}
                    value={form.billing_cycle_day}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        billing_cycle_day: Number(
                          event.target.value,
                        ),
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
                        rental_price: Number(
                          event.target.value,
                        ),
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
                        deposit_amount: Number(
                          event.target.value,
                        ),
                      })
                    }
                  />
                </label>
              </div>

              {/* Thông báo lỗi */}
              {error && (
                <p
                  className="text-sm text-red-600"
                  role="alert"
                >
                  {error}
                </p>
              )}

              {/* Nút thao tác */}
              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setError('')
                  }}
                  className="rounded-lg border px-4 py-2"
                >
                  Quay lại
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg px-5 py-2 font-semibold text-white disabled:opacity-50"
                  style={{ backgroundColor: NAVY }}
                >
                  {saving
                    ? 'Đang lưu...'
                    : 'Lưu hợp đồng'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
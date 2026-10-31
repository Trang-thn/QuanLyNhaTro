
import type {
  TenantContractProfile,
  TenantRentalContract,
} from '../../types/tenantContract'

const NAVY = '#0d2137'
const AMBER = '#f59e0b'

interface Props {
  profile: TenantContractProfile
  contracts: TenantRentalContract[]
}

function formatMoney(value: number) {
  return `${value.toLocaleString('vi-VN')} đ`
}

function contractStatus(status: TenantRentalContract['status']) {
  switch (status) {
    case 'HIEU_LUC':
      return 'Có hiệu lực'
    case 'KHONG_HIEU_LUC':
      return 'Không hiệu lực'
    case 'DA_THANH_LY':
      return 'Đã thanh lý'
  }
}

export default function TenantContractView({
  profile,
  contracts,
}: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold" style={{ color: NAVY }}>
          Hồ sơ cá nhân & Hợp đồng thuê
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Thông tin cá nhân và các hợp đồng thuê phòng của bạn.
        </p>
      </div>

      <section className="rounded-xl bg-white p-6 shadow-sm">
        <h3
          className="mb-5 border-b pb-3 text-lg font-bold"
          style={{ color: NAVY }}
        >
          Hồ sơ cá nhân
        </h3>

        <div className="flex flex-col gap-6 sm:flex-row">
          <div className="flex shrink-0 justify-center sm:justify-start">
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt="Ảnh đại diện khách thuê"
                className="h-28 w-28 rounded-full border object-cover"
              />
            ) : (
              <div
                className="flex h-28 w-28 items-center justify-center rounded-full text-3xl font-bold text-white"
                style={{ backgroundColor: NAVY }}
              >
                {(profile.full_name ?? 'K').charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="grid flex-1 gap-4 sm:grid-cols-2">
            <Info label="Họ và tên" value={profile.full_name} />
            <Info label="Số CCCD" value={profile.identity_card_number} />
            <Info label="Ngày sinh" value={profile.date_of_birth} />
            <Info label="Giới tính" value={profile.gender} />
            <Info label="Số điện thoại" value={profile.phone} />
            <Info label="Email" value={profile.email} />
            <Info label="Nơi cấp CCCD" value={profile.issue_place} />
            <Info
              label="Liên hệ khẩn cấp"
              value={profile.emergency_contact}
            />
            <div className="sm:col-span-2">
              <Info
                label="Địa chỉ thường trú"
                value={profile.permanent_address}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-bold" style={{ color: NAVY }}>
          Hợp đồng của tôi
        </h3>

        {contracts.length === 0 ? (
          <div className="rounded-xl bg-white p-8 text-center text-gray-500 shadow-sm">
            Bạn chưa có hợp đồng thuê phòng.
          </div>
        ) : (
          contracts.map((contract) => (
            <article
              key={contract.id}
              className="rounded-xl border-l-4 bg-white p-5 shadow-sm"
              style={{ borderLeftColor: AMBER }}
            >
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <h4 className="font-bold" style={{ color: NAVY }}>
                  Hợp đồng: {contract.contract_number}
                </h4>

                <span className="rounded-full bg-gray-100 px-3 py-1 text-sm">
                  {contractStatus(contract.status)}
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Info
                  label="Phòng thuê"
                  value={contract.room_number ?? contract.room_id}
                />
                <Info label="Ngày bắt đầu" value={contract.start_date} />
                <Info label="Ngày kết thúc" value={contract.end_date} />
                <Info
                  label="Tiền thuê"
                  value={formatMoney(contract.rental_price)}
                />
                <Info
                  label="Tiền đặt cọc"
                  value={formatMoney(contract.deposit_amount)}
                />
                <Info
                  label="Ngày lập hóa đơn"
                  value={`Ngày ${contract.billing_cycle_day} hàng tháng`}
                />
              </div>
            </article>
          ))
        )}
      </section>
    </div>
  )
}

function Info({
  label,
  value,
}: {
  label: string
  value: string | number | null | undefined
}) {
  return (
    <div>
      <p className="mb-1 text-sm text-gray-500">{label}</p>
      <p className="break-words font-medium text-gray-800">
        {value === null || value === undefined || value === ''
          ? 'Chưa cập nhật'
          : value}
      </p>
    </div>
  )
}

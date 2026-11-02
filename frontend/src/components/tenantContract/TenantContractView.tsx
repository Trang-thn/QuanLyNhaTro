
import { useState } from 'react'
import type { TenantProfileData } from '../../types/tenantProfile'
import type { TenantRentalContract } from '../../types/tenantContract'

const NAVY = '#0d2137'
const AMBER = '#f59e0b'

interface Props {
  profile: TenantProfileData
  contracts: TenantRentalContract[]
}

function formatMoney(value: number) {
  return `${value.toLocaleString('vi-VN')} đồng`
}

function formatDate(value?: string | null) {
  if (!value) return 'Chưa cập nhật'

  const date = new Date(`${value.slice(0, 10)}T00:00:00`)

  if (Number.isNaN(date.getTime())) return value

  return date.toLocaleDateString('vi-VN')
}

function contractStatus(status: TenantRentalContract['status']) {
  switch (status) {
    case 'HIEU_LUC':
      return 'Có hiệu lực'
    case 'KHONG_HIEU_LUC':
      return 'Không hiệu lực'
    case 'DA_THANH_LY':
      return 'Đã thanh lý'
    default:
      return 'Chưa xác định'
  }
}

function escapeHtml(value: unknown) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function showValue(value: unknown) {
  return value === null || value === undefined || value === ''
    ? 'Chưa cập nhật'
    : String(value)
}

function getProfileValue(profile: TenantProfileData, label: string) {
  return profile.profileFields.find((field) => field.label === label)?.value
    ?? 'Chưa cập nhật'
}

function createContractHtml(
  profile: TenantProfileData,
  contract: TenantRentalContract,
) {
  const renterName = getProfileValue(profile, 'Họ và tên')

  const fields = [
    ['Họ và tên bên thuê', renterName],
    ['Số CCCD/CMND', getProfileValue(profile, 'Số CCCD/CMND')],
    ['Số điện thoại', getProfileValue(profile, 'Số điện thoại')],
    ['Địa chỉ Email', getProfileValue(profile, 'Địa chỉ Email')],
    ['Địa chỉ thường trú', getProfileValue(profile, 'Địa chỉ thường trú')],
    ['Liên hệ khẩn cấp', getProfileValue(profile, 'Liên hệ khẩn cấp')],
  ]

  const renterRows = fields.map(([label, value]) => `
    <tr>
      <td class="label">${escapeHtml(label)}</td>
      <td>${escapeHtml(showValue(value))}</td>
    </tr>
  `).join('')

  return `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8" />
      <title>Hợp đồng ${escapeHtml(contract.contract_number)}</title>
      <style>
        @page {
          size: A4;
          margin: 20mm;
        }

        body {
          font-family: "Times New Roman", serif;
          font-size: 13pt;
          line-height: 1.5;
          color: #111;
        }

        .national {
          text-align: center;
          font-weight: bold;
          text-transform: uppercase;
        }

        .motto {
          text-align: center;
          font-weight: bold;
          margin-top: 4px;
          margin-bottom: 25px;
        }

        h1 {
          text-align: center;
          font-size: 18pt;
          margin: 18px 0 5px;
        }

        .contract-number {
          text-align: center;
          margin-bottom: 22px;
        }

        p {
          text-align: justify;
          margin: 7px 0;
        }

        h3 {
          font-size: 13pt;
          margin-top: 17px;
          margin-bottom: 5px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 8px;
        }

        td {
          border: 1px solid #777;
          padding: 6px 8px;
          vertical-align: top;
        }

        .label {
          width: 34%;
          font-weight: bold;
        }

        .signatures {
          display: flex;
          justify-content: space-between;
          text-align: center;
          margin-top: 45px;
          gap: 25px;
        }

        .signature {
          width: 50%;
        }

        .signature strong {
          display: block;
          text-transform: uppercase;
        }

        .signature p {
          text-align: center;
        }

        .signature-space {
          height: 90px;
        }

        .note {
          font-style: italic;
          font-size: 11pt;
          margin-top: 25px;
        }

        @media print {
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
        }
      </style>
    </head>

    <body>
      <div class="national">
        CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
      </div>

      <div class="motto">
        Độc lập - Tự do - Hạnh phúc
        <br />
        -------------------------
      </div>

      <h1>HỢP ĐỒNG THUÊ NHÀ</h1>

      <div class="contract-number">
        Số: ${escapeHtml(contract.contract_number)}
      </div>

      <p>
        Hôm nay, ngày ...... tháng ...... năm ........,
        tại ................................................,
        chúng tôi gồm có:
      </p>

      <h3>ĐIỀU 1. THÔNG TIN BÊN CHO THUÊ (BÊN A)</h3>

      <table>
        <tr><td class="label">Họ và tên</td><td></td></tr>
        <tr><td class="label">Số CCCD</td><td></td></tr>
        <tr><td class="label">Địa chỉ</td><td></td></tr>
        <tr><td class="label">Số điện thoại</td><td></td></tr>
      </table>

      <h3>ĐIỀU 2. THÔNG TIN BÊN THUÊ (BÊN B)</h3>

      <table>
        ${renterRows}
      </table>

      <h3>ĐIỀU 3. THÔNG TIN PHÒNG THUÊ</h3>

      <table>
        <tr>
          <td class="label">Mã hợp đồng</td>
          <td>${escapeHtml(contract.contract_number)}</td>
        </tr>
        <tr>
          <td class="label">Phòng thuê</td>
          <td>${escapeHtml(showValue(contract.room_number || contract.room_id))}</td>
        </tr>
        <tr>
          <td class="label">Địa chỉ nhà trọ</td>
          <td>Chưa cập nhật</td>
        </tr>
        <tr>
          <td class="label">Ngày bắt đầu</td>
          <td>${escapeHtml(formatDate(contract.start_date))}</td>
        </tr>
        <tr>
          <td class="label">Ngày kết thúc</td>
          <td>${escapeHtml(formatDate(contract.end_date))}</td>
        </tr>
        <tr>
          <td class="label">Giá thuê mỗi tháng</td>
          <td>${escapeHtml(formatMoney(contract.rental_price))}</td>
        </tr>
        <tr>
          <td class="label">Tiền đặt cọc</td>
          <td>${escapeHtml(formatMoney(contract.deposit_amount))}</td>
        </tr>
        <tr>
          <td class="label">Ngày thanh toán hàng tháng</td>
          <td>Ngày ${escapeHtml(contract.billing_cycle_day)} hàng tháng</td>
        </tr>
      </table>

      <h3>ĐIỀU 4. THỜI HẠN VÀ THANH TOÁN</h3>
      <p>
        Thời hạn thuê từ ngày ${escapeHtml(formatDate(contract.start_date))}
        đến ngày ${escapeHtml(formatDate(contract.end_date))}.
      </p>
      <p>
        Giá thuê là ${escapeHtml(formatMoney(contract.rental_price))}
        mỗi tháng. Tiền đặt cọc là
        ${escapeHtml(formatMoney(contract.deposit_amount))}.
      </p>
      <p>
        Ngày thanh toán hàng tháng: ngày
        ${escapeHtml(contract.billing_cycle_day)}.
      </p>

      <h3>ĐIỀU 5. QUYỀN VÀ NGHĨA VỤ CỦA CÁC BÊN</h3>
      <p>
        Vui lòng đối chiếu và bổ sung nội dung quyền, nghĩa vụ
        theo hợp đồng đã được hai bên thống nhất.
      </p>

      <h3>ĐIỀU 6. CHẤM DỨT HỢP ĐỒNG</h3>
      <p>
        Vui lòng đối chiếu nội dung chấm dứt hợp đồng với văn bản
        hợp đồng chính thức của hai bên.
      </p>

      <p>
        Các bên cần kiểm tra và thống nhất nội dung trước khi ký.
      </p>

      <div class="signatures">
        <div class="signature">
          <strong>BÊN CHO THUÊ</strong>
          <p>(Ký và ghi rõ họ tên)</p>
          <div class="signature-space"></div>
        </div>

        <div class="signature">
          <strong>BÊN THUÊ</strong>
          <p>(Ký và ghi rõ họ tên)</p>
          <div class="signature-space"></div>
          <strong>${escapeHtml(showValue(renterName))}</strong>
        </div>
      </div>

      <p class="note">
        Bản in được tạo từ dữ liệu hiện có trên hệ thống.
        Đây là bản dự thảo để đối chiếu, không thay thế hợp đồng
        chính thức đã được hai bên ký kết.
      </p>

      <script>
        window.onload = function () {
          window.print();
        };
      </script>
    </body>
    </html>
  `
}

export default function TenantContractView({
  profile,
  contracts,
}: Props) {
  const [selectedContract, setSelectedContract] =
    useState<TenantRentalContract | null>(null)

  function exportContract(contract: TenantRentalContract) {
    const printWindow = window.open('', '_blank')

    if (!printWindow) {
      alert('Trình duyệt đã chặn cửa sổ mới. Vui lòng cho phép mở cửa sổ bật lên.')
      return
    }

    printWindow.document.open()
    printWindow.document.write(createContractHtml(profile, contract))
    printWindow.document.close()
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold" style={{ color: NAVY }}>
          Hợp đồng thuê của tôi
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Thông tin các hợp đồng thuê phòng của bạn.
        </p>
       </div>
 
       <section className="space-y-4">
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
                <Info label="Phòng thuê" value={contract.room_number ?? contract.room_id} />
                <Info label="Ngày bắt đầu" value={formatDate(contract.start_date)} />
                <Info label="Ngày kết thúc" value={formatDate(contract.end_date)} />
                <Info label="Tiền thuê" value={formatMoney(contract.rental_price)} />
                <Info label="Tiền đặt cọc" value={formatMoney(contract.deposit_amount)} />
                <Info
                  label="Ngày thanh toán"
                  value={`Ngày ${contract.billing_cycle_day} hàng tháng`}
                />
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedContract(contract)}
                  className="rounded-lg border px-4 py-2 text-sm font-semibold transition hover:bg-gray-50"
                  style={{ color: NAVY, borderColor: NAVY }}
                >
                  Xem chi tiết hợp đồng
                </button>

                <button
                  type="button"
                  onClick={() => exportContract(contract)}
                  className="rounded-lg px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                  style={{ backgroundColor: AMBER }}
                >
                  Xuất file PDF
                </button>
              </div>
            </article>
          ))
        )}
      </section>

      {selectedContract && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedContract(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between gap-3">
              <h3 className="text-xl font-bold" style={{ color: NAVY }}>
                Chi tiết hợp đồng
              </h3>

              <button
                type="button"
                onClick={() => setSelectedContract(null)}
                className="rounded-lg px-3 py-1 text-gray-500 hover:bg-gray-100"
              >
                Đóng ✕
              </button>
            </div>

            <h4 className="mb-3 font-bold" style={{ color: NAVY }}>
              Thông tin hợp đồng
            </h4>

            <div className="grid gap-4 sm:grid-cols-2">
              <Info label="Mã hợp đồng" value={selectedContract.contract_number} />
              <Info label="Trạng thái" value={contractStatus(selectedContract.status)} />
              <Info
                label="Phòng thuê"
                value={selectedContract.room_number ?? selectedContract.room_id}
              />
              <Info label="Ngày bắt đầu" value={formatDate(selectedContract.start_date)} />
              <Info label="Ngày kết thúc" value={formatDate(selectedContract.end_date)} />
              <Info label="Tiền thuê" value={formatMoney(selectedContract.rental_price)} />
              <Info label="Tiền đặt cọc" value={formatMoney(selectedContract.deposit_amount)} />
              <Info
                label="Ngày thanh toán hàng tháng"
                value={`Ngày ${selectedContract.billing_cycle_day}`}
              />
            </div>

            <h4 className="mb-3 mt-6 font-bold" style={{ color: NAVY }}>
              Thông tin khách thuê
            </h4>

            <div className="grid gap-4 sm:grid-cols-2">
              {profile.profileFields.map((field) => (
                <Info key={field.label} label={field.label} value={field.value} />
              ))}
            </div>

            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={() => exportContract(selectedContract)}
                className="rounded-lg px-4 py-2 font-semibold text-white"
                style={{ backgroundColor: AMBER }}
              >
                Xuất file PDF
              </button>

              <button
                type="button"
                onClick={() => setSelectedContract(null)}
                className="rounded-lg border px-4 py-2 font-semibold"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
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


import type { NotificationApiDTO } from '../../types/notifications'

// ================= KIỂU DỮ LIỆU =================

export type ExtensionStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export interface ContractExtensionData {
  type: 'CONTRACT_EXTENSION'
  contractId: string
  contractNumber: string
  tenantUserId: string
  tenantName: string
  currentEndDate: string
  requestedEndDate: string
  reason: string
  status: ExtensionStatus
  reviewedBy: string | null
  reviewedAt: string | null
  rejectionReason: string | null
}

export type InboxNotification = NotificationApiDTO & {
  is_read?: boolean
  sender_name?: string
  room_number?: string | null
}

type ExtensionAction = 'APPROVE' | 'REJECT'

interface ContractExtensionNotificationProps {
  itemId: string
  extension: ContractExtensionData
  roomNumber?: string | null
  sentAt: string
  reviewing: boolean
  onReview: (id: string, action: ExtensionAction) => void
}

// ================= HÀM HỖ TRỢ =================

const EXTENSION_MARKER = '[CONTRACT_EXTENSION_REQUEST]'

export function parseExtensionRequest(
  content: string,
): ContractExtensionData | null {
  if (!content.startsWith(EXTENSION_MARKER)) return null

  try {
    const data = JSON.parse(
      content.slice(EXTENSION_MARKER.length).trim(),
    ) as ContractExtensionData

    if (
      data?.type !== 'CONTRACT_EXTENSION' ||
      !data.contractId ||
      !data.contractNumber ||
      !['PENDING', 'APPROVED', 'REJECTED'].includes(data.status)
    ) {
      return null
    }

    return data
  } catch {
    return null
  }
}

function formatExtensionDate(value: string) {
  if (!value) return ''

  const [year, month, day] = value.slice(0, 10).split('-')

  if (!year || !month || !day) return value

  return `${day}/${month}/${year}`
}

// ================= COMPONENT THÔNG BÁO GIA HẠN =================

export default function ContractExtensionNotification({
  itemId,
  extension,
  roomNumber,
  sentAt,
  reviewing,
  onReview,
}: ContractExtensionNotificationProps) {
  const statusLabel = {
    PENDING: 'Chờ duyệt',
    APPROVED: 'Đã duyệt',
    REJECTED: 'Đã từ chối',
  }[extension.status]

  return (
    <div className="rounded-xl border border-[#eadfc9] bg-white p-5 shadow-sm">

      {/* TIÊU ĐỀ VÀ TRẠNG THÁI */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-base font-bold text-[#1c2534]">
          Yêu cầu gia hạn hợp đồng
        </p>

        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${
            extension.status === 'PENDING'
              ? 'bg-amber-100 text-amber-700'
              : extension.status === 'APPROVED'
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
          }`}
        >
          {statusLabel}
        </span>
      </div>

      {/* THÔNG TIN HỢP ĐỒNG */}
      <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">

        <p>
          <span className="text-[#8c9bae]">Khách thuê:{' '}</span>
          <strong>{extension.tenantName}</strong>
        </p>

        <p>
          <span className="text-[#8c9bae]">Mã hợp đồng:{' '}</span>
          <strong>{extension.contractNumber}</strong>
        </p>

        <p>
          <span className="text-[#8c9bae]">Phòng:{' '}</span>
          <strong>{roomNumber || 'Chưa có thông tin'}</strong>
        </p>

        <p>
          <span className="text-[#8c9bae]">
            Ngày kết thúc hiện tại:{' '}
          </span>
          <strong>
            {formatExtensionDate(extension.currentEndDate)}
          </strong>
        </p>

        <p>
          <span className="text-[#8c9bae]">
            Ngày kết thúc đề xuất:{' '}
          </span>
          <strong className="text-[#d97706]">
            {formatExtensionDate(extension.requestedEndDate)}
          </strong>
        </p>

      </div>

      {/* LÝ DO GIA HẠN */}
      <div className="mt-4 rounded-lg bg-[#faf8f5] p-3">
        <p className="text-xs font-bold text-[#8c9bae]">
          LÝ DO GIA HẠN
        </p>

        <p className="mt-1 whitespace-pre-wrap text-sm text-[#4f5e74]">
          {extension.reason || 'Không có lý do'}
        </p>
      </div>

      {/* LÝ DO TỪ CHỐI */}
      {extension.status === 'REJECTED' &&
        extension.rejectionReason && (
          <p className="mt-3 text-sm text-red-600">
            Lý do từ chối: {extension.rejectionReason}
          </p>
        )}

      {/* NÚT DUYỆT / TỪ CHỐI */}
      {extension.status === 'PENDING' && (
        <div className="mt-4 flex flex-wrap justify-end gap-3">

          <button
            type="button"
            disabled={reviewing}
            onClick={() => onReview(itemId, 'REJECT')}
            className="rounded-lg border border-red-300 px-4 py-2 text-sm font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Từ chối
          </button>

          <button
            type="button"
            disabled={reviewing}
            onClick={() => onReview(itemId, 'APPROVE')}
            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {reviewing ? 'Đang xử lý...' : 'Duyệt yêu cầu'}
          </button>

        </div>
      )}

      {/* THỜI GIAN GỬI */}
      <p className="mt-4 text-xs text-[#8c9bae]">
        Thời gian gửi: {sentAt}
      </p>

    </div>
  )
}

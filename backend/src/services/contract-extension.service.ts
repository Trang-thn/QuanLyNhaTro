
import { randomUUID } from 'node:crypto'
import type { ResultSetHeader, RowDataPacket } from 'mysql2/promise'
import { pool } from '../config/database'
import type { AuthUser } from '../types/auth'
import { NotificationServiceError } from './notification.service'

// ================= KIỂU DỮ LIỆU GIA HẠN =================

const CONTRACT_EXTENSION_MARKER = '[CONTRACT_EXTENSION_REQUEST]'

type ExtensionStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

interface ContractExtensionRequest {
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

interface ExtensionContractRow extends RowDataPacket {
  id: string
  contract_number: string
  room_id: string | null
  end_date: string | Date
  status: string
  tenant_name: string
}

// ================= HÀM HỖ TRỢ =================

function formatSqlDate(value: string | Date): string {
  if (value instanceof Date) {
    return [
      value.getFullYear(),
      String(value.getMonth() + 1).padStart(2, '0'),
      String(value.getDate()).padStart(2, '0'),
    ].join('-')
  }

  return String(value).slice(0, 10)
}

function parseExtensionContent(
  content: string,
): ContractExtensionRequest | null {
  if (!content.startsWith(CONTRACT_EXTENSION_MARKER)) return null

  try {
    const data = JSON.parse(
      content.slice(CONTRACT_EXTENSION_MARKER.length).trim(),
    )

    if (
      data?.type !== 'CONTRACT_EXTENSION' ||
      !data.contractId ||
      !data.tenantUserId ||
      !['PENDING', 'APPROVED', 'REJECTED'].includes(data.status)
    ) {
      return null
    }

    return data as ContractExtensionRequest
  } catch {
    return null
  }
}

function buildExtensionContent(data: ContractExtensionRequest): string {
  return `${CONTRACT_EXTENSION_MARKER}\n${JSON.stringify(data)}`
}

// ================= GỬI YÊU CẦU GIA HẠN =================

/**
 * Khách thuê gửi yêu cầu gia hạn hợp đồng.
 * Thông báo được gửi tới Admin và chính khách thuê để theo dõi kết quả.
 */
export async function createContractExtensionRequest(
  tenant: AuthUser,
  input: {
    contract_id: string
    requested_end_date: string
    reason?: string
  },
) {
  if (tenant.role !== 'TENANT') {
    throw new NotificationServiceError(
      403,
      'Only tenants can request contract extensions',
    )
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.requested_end_date)) {
    throw new NotificationServiceError(
      400,
      'Ngày kết thúc đề xuất không hợp lệ',
    )
  }

  const requestedDate = new Date(`${input.requested_end_date}T00:00:00`)

  if (
    Number.isNaN(requestedDate.getTime()) ||
    formatSqlDate(requestedDate) !== input.requested_end_date
  ) {
    throw new NotificationServiceError(
      400,
      'Ngày kết thúc đề xuất không hợp lệ',
    )
  }

  const reason = (input.reason ?? '').trim()

  if (reason.length > 1000) {
    throw new NotificationServiceError(
      400,
      'Lý do gia hạn không được vượt quá 1000 ký tự',
    )
  }

  const connection = await pool.getConnection()

  try {
    await connection.beginTransaction()

    const [contracts] = await connection.query<ExtensionContractRow[]>(
      `SELECT c.id, c.contract_number, c.room_id, c.end_date, c.status,
              t.full_name AS tenant_name
       FROM contracts c
       JOIN tenants t ON t.user_id = ?
       WHERE c.id = ?
         AND c.status = 'HIEU_LUC'
         AND (
           c.representative_tenant_id = t.id
           OR EXISTS (
             SELECT 1
             FROM contract_members cm
             WHERE cm.contract_id = c.id AND cm.tenant_id = t.id
           )
         )
       LIMIT 1
       FOR UPDATE`,
      [tenant.id, input.contract_id],
    )

    const contract = contracts[0]

    if (!contract) {
      throw new NotificationServiceError(
        404,
        'Không tìm thấy hợp đồng đang thuê của bạn',
      )
    }

    const currentEndDate = formatSqlDate(contract.end_date)

    if (input.requested_end_date <= currentEndDate) {
      throw new NotificationServiceError(
        400,
        'Ngày kết thúc mới phải sau ngày kết thúc hợp đồng hiện tại',
      )
    }

    // Không cho gửi nhiều yêu cầu khi hợp đồng vẫn còn yêu cầu đang chờ duyệt.
    const [existingRequests] = await connection.query<
      (RowDataPacket & { content: string })[]
    >(
      `SELECT content
       FROM notifications
       WHERE sender_id = ?
         AND content LIKE ?
       FOR UPDATE`,
      [tenant.id, `%${contract.id}%`],
    )

    const hasPendingRequest = existingRequests.some(row => {
      const data = parseExtensionContent(row.content)
      return data?.contractId === contract.id && data.status === 'PENDING'
    })

    if (hasPendingRequest) {
      throw new NotificationServiceError(
        409,
        'Hợp đồng này đang có yêu cầu gia hạn chờ Admin xử lý',
      )
    }

    const [admins] = await connection.query<
      (RowDataPacket & { id: string })[]
    >(
      `SELECT id FROM users WHERE role = 'ADMIN' AND is_active = 1`,
    )

    if (admins.length === 0) {
      throw new NotificationServiceError(
        409,
        'Không tìm thấy tài khoản Admin đang hoạt động',
      )
    }

    const request: ContractExtensionRequest = {
      type: 'CONTRACT_EXTENSION',
      contractId: contract.id,
      contractNumber: contract.contract_number,
      tenantUserId: tenant.id,
      tenantName: contract.tenant_name,
      currentEndDate,
      requestedEndDate: input.requested_end_date,
      reason,
      status: 'PENDING',
      reviewedBy: null,
      reviewedAt: null,
      rejectionReason: null,
    }

    const notificationId = randomUUID()

    await connection.query<ResultSetHeader>(
      `INSERT INTO notifications
        (id, title, content, sender_id, receiver_id, audience_type, room_id)
       VALUES (?, ?, ?, ?, ?, 'TENANT', ?)`,
      [
        notificationId,
        'Yêu cầu gia hạn hợp đồng',
        buildExtensionContent(request),
        tenant.id,
        tenant.id,
        contract.room_id,
      ],
    )

    const recipientIds = [
      ...new Set([tenant.id, ...admins.map(admin => admin.id)]),
    ]

    await connection.query<ResultSetHeader>(
      'INSERT INTO notification_recipients (notification_id, user_id) VALUES ?',
      [recipientIds.map(userId => [notificationId, userId])],
    )

    await connection.commit()

    return {
      id: notificationId,
      message: 'Gửi yêu cầu gia hạn thành công',
      status: 'PENDING',
    }
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
}

// ================= DUYỆT / TỪ CHỐI YÊU CẦU GIA HẠN =================

/**
 * Admin duyệt hoặc từ chối yêu cầu gia hạn.
 */
export async function reviewContractExtensionRequest(
  admin: AuthUser,
  notificationId: string,
  input: {
    action: 'APPROVE' | 'REJECT'
    rejection_reason?: string
  },
) {
  if (admin.role !== 'ADMIN') {
    throw new NotificationServiceError(
      403,
      'Only admins can review extension requests',
    )
  }

  const rejectionReason = (input.rejection_reason ?? '').trim()

  if (input.action === 'REJECT' && rejectionReason.length > 1000) {
    throw new NotificationServiceError(
      400,
      'Lý do từ chối không được vượt quá 1000 ký tự',
    )
  }

  const connection = await pool.getConnection()

  try {
    await connection.beginTransaction()

    const [rows] = await connection.query<
      (RowDataPacket & {
        id: string
        content: string
        sender_id: string
        room_id: string | null
      })[]
    >(
      `SELECT n.id, n.content, n.sender_id, n.room_id
       FROM notifications n
       JOIN notification_recipients nr
         ON nr.notification_id = n.id AND nr.user_id = ?
       WHERE n.id = ?
       FOR UPDATE`,
      [admin.id, notificationId],
    )

    const notification = rows[0]

    if (!notification) {
      throw new NotificationServiceError(
        404,
        'Không tìm thấy yêu cầu gia hạn',
      )
    }

    const request = parseExtensionContent(notification.content)

    if (!request || notification.sender_id !== request.tenantUserId) {
      throw new NotificationServiceError(
        400,
        'Thông báo không phải yêu cầu gia hạn hợp lệ',
      )
    }

    if (request.status !== 'PENDING') {
      throw new NotificationServiceError(
        409,
        'Yêu cầu này đã được xử lý trước đó',
      )
    }

    if (input.action === 'APPROVE') {
      const [contracts] = await connection.query<
        (RowDataPacket & {
          end_date: string | Date
          status: string
        })[]
      >(
        `SELECT end_date, status
         FROM contracts
         WHERE id = ?
         FOR UPDATE`,
        [request.contractId],
      )

      const contract = contracts[0]

      if (
        !contract ||
        contract.status !== 'HIEU_LUC' ||
        formatSqlDate(contract.end_date) !== request.currentEndDate
      ) {
        throw new NotificationServiceError(
          409,
          'Hợp đồng đã thay đổi hoặc không còn hiệu lực. Không thể duyệt yêu cầu này',
        )
      }

      if (request.requestedEndDate <= formatSqlDate(contract.end_date)) {
        throw new NotificationServiceError(
          400,
          'Ngày gia hạn không còn hợp lệ',
        )
      }

      await connection.query<ResultSetHeader>(
        'UPDATE contracts SET end_date = ? WHERE id = ?',
        [request.requestedEndDate, request.contractId],
      )

      request.status = 'APPROVED'
    } else {
      request.status = 'REJECTED'
      request.rejectionReason = rejectionReason || null
    }

    request.reviewedBy = admin.id
    request.reviewedAt = new Date().toISOString()
    
   // Cập nhật trạng thái thông báo yêu cầu gia hạn ban đầu
await connection.query<ResultSetHeader>(
  'UPDATE notifications SET content = ? WHERE id = ?',
  [buildExtensionContent(request), notificationId],
)

// Gửi thông báo kết quả cho khách thuê
if (request.status === 'REJECTED') {
  const resultNotificationId = randomUUID()

  await connection.query<ResultSetHeader>(
    `INSERT INTO notifications
      (id, title, content, sender_id, receiver_id, audience_type, room_id)
     VALUES (?, ?, ?, ?, ?, 'TENANT', ?)`,
    [
      resultNotificationId,
      'Yêu cầu gia hạn hợp đồng đã bị từ chối',
      'Yêu cầu gia hạn hợp đồng đã bị từ chối.',
      admin.id,
      request.tenantUserId,
      notification.room_id,
    ],
  )

  await connection.query<ResultSetHeader>(
    `INSERT INTO notification_recipients
      (notification_id, user_id)
     VALUES (?, ?)`,
    [resultNotificationId, request.tenantUserId],
  )
}

await connection.commit()
// Tạo thông báo kết quả gửi cho khách thuê
const resultNotificationId = randomUUID()

const isApproved = request.status === 'APPROVED'

const resultTitle = isApproved
  ? 'Yêu cầu gia hạn hợp đồng đã được duyệt'
  : 'Yêu cầu gia hạn hợp đồng đã bị từ chối'

const resultContent = isApproved
  ? `Yêu cầu gia hạn hợp đồng ${request.contractNumber} của bạn đã được Admin duyệt. Ngày kết thúc hợp đồng mới: ${request.requestedEndDate}.`
  : `Yêu cầu gia hạn hợp đồng ${request.contractNumber} của bạn đã bị Admin từ chối. Lý do: ${request.rejectionReason || 'Không có lý do cụ thể'}.`

// Lưu thông báo kết quả
await connection.query<ResultSetHeader>(
  `INSERT INTO notifications
    (id, title, content, sender_id, receiver_id, audience_type, room_id)
   VALUES (?, ?, ?, ?, ?, 'TENANT', ?)`,
  [
    resultNotificationId,
    resultTitle,
    resultContent,
    admin.id,
    request.tenantUserId,
    notification.room_id,
  ],
)

// Thêm khách thuê vào danh sách người nhận
await connection.query<ResultSetHeader>(
  `INSERT INTO notification_recipients
    (notification_id, user_id)
   VALUES (?, ?)`,
  [resultNotificationId, request.tenantUserId],
)

  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
}

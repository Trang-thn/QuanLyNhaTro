import { RowDataPacket } from 'mysql2'
import { pool } from '../config/database'
import { AuthUser } from '../types/auth'
import { HttpError } from '../utils/httpError'

interface RegistrationRequestRow extends RowDataPacket {
  id: string
  user_id: string
  identity_card_number: string
  full_name: string
  username: string
  email: string | null
  phone_number: string | null
  created_at: string
}

export async function getPendingTenantRegistrations() {
  const [rows] = await pool.query<RegistrationRequestRow[]>(
    `SELECT r.id, r.user_id, r.identity_card_number, r.created_at,
            u.full_name, u.username, u.email, u.phone_number
     FROM tenant_registration_requests r
     INNER JOIN users u ON u.id = r.user_id
     WHERE r.status = 'PENDING' AND u.role = 'TENANT'
     ORDER BY r.created_at ASC`,
  )
  return rows.map((row) => ({
    id: row.id,
    userId: row.user_id,
    identityCardNumber: row.identity_card_number,
    fullName: row.full_name,
    username: row.username,
    email: row.email,
    phoneNumber: row.phone_number,
    createdAt: row.created_at,
  }))
}

export async function approveTenantRegistration(requestId: string, admin: AuthUser) {
  if (!requestId.trim()) throw new HttpError(400, 'requestId is required')

  const connection = await pool.getConnection()
  let committed = false
  try {
    await connection.beginTransaction()
    const [requestRows] = await connection.query<(RowDataPacket & {
      user_id: string
      identity_card_number: string
      status: string
    })[]>(
      `SELECT r.user_id, r.identity_card_number, r.status
       FROM tenant_registration_requests r
       INNER JOIN users u ON u.id = r.user_id
       WHERE r.id = ? AND u.role = 'TENANT'
       FOR UPDATE`,
      [requestId],
    )
    const request = requestRows[0]
    if (!request) throw new HttpError(404, 'Tenant registration request was not found')
    if (request.status !== 'PENDING') throw new HttpError(409, 'Tenant registration request was already reviewed')

    const [linkedRows] = await connection.query<RowDataPacket[]>(
      'SELECT id FROM tenants WHERE user_id = ? FOR UPDATE',
      [request.user_id],
    )
    if (linkedRows.length) throw new HttpError(409, 'This account is already linked to a tenant profile')

    const [tenantRows] = await connection.query<(RowDataPacket & { id: string; user_id: string | null })[]>(
      'SELECT id, user_id FROM tenants WHERE identity_card_number = ? FOR UPDATE',
      [request.identity_card_number],
    )
    const existingTenant = tenantRows[0]
    if (existingTenant?.user_id) {
      throw new HttpError(409, 'This identity card is already linked to another account')
    }

    let tenantId = existingTenant?.id
    if (!tenantId) {
      const [idRows] = await connection.query<RowDataPacket[]>('SELECT UUID() AS id')
      tenantId = String(idRows[0].id)
      await connection.execute(
        `INSERT INTO tenants (id, user_id, identity_card_number)
         VALUES (?, ?, ?)`,
        [tenantId, request.user_id, request.identity_card_number],
      )
    } else {
      await connection.execute('UPDATE tenants SET user_id = ? WHERE id = ?', [request.user_id, tenantId])
    }

    await connection.execute(
      `UPDATE tenant_registration_requests
       SET status = 'APPROVED', tenant_id = ?, reviewed_by = ?, reviewed_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [tenantId, admin.id, requestId],
    )
    await connection.commit()
    committed = true
    return { requestId, userId: request.user_id, tenantId, status: 'APPROVED' as const }
  } catch (error) {
    if (!committed) await connection.rollback()
    if (error instanceof HttpError) throw error
    if ((error as { code?: string }).code === 'ER_DUP_ENTRY') {
      throw new HttpError(409, 'The tenant profile could not be linked because the identity card is already in use')
    }
    throw error
  } finally {
    connection.release()
  }
}

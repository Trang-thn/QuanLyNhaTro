import { randomUUID } from 'node:crypto';
import type { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { pool } from '../config/database';
import type { AuthUser } from '../types/auth';
import type {
  CreateNotificationInput,
  NotificationDTO,
  NotificationRecipientDTO,
  NotificationRoomDTO,
} from '../types/notifications';

export class NotificationServiceError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
    this.name = 'NotificationServiceError';
  }
}

interface NotificationRow extends RowDataPacket, NotificationDTO {}
interface RecipientRow extends RowDataPacket { id: string; name: string; room_id: string | null; room_number: string | null }
interface UserRow extends RowDataPacket { id: string; role: string; is_active: number }
interface RoomRow extends RowDataPacket { id: string }

const ACTIVE_ROOM_MEMBERS = `
  SELECT DISTINCT u.id
  FROM users u
  JOIN tenants t ON t.user_id = u.id
  JOIN contracts c ON c.status = 'HIEU_LUC'
    AND CURDATE() BETWEEN c.start_date AND c.end_date
    AND (c.representative_tenant_id = t.id OR EXISTS (
      SELECT 1 FROM contract_members cm WHERE cm.contract_id = c.id AND cm.tenant_id = t.id
    ))
  WHERE u.role = 'TENANT' AND u.is_active = 1`;

export async function listSentNotifications(user: AuthUser) {
  const [rows] = await pool.query<NotificationRow[]>(
    `SELECT n.id, n.title, n.content, n.is_read, n.created_at,
            n.receiver_id, u.full_name AS receiver_name
     FROM notifications n
     JOIN users u ON u.id = n.receiver_id
     WHERE n.sender_id = ?
     ORDER BY n.created_at DESC, n.id DESC`,
    [user.id],
  );
  return rows;
}

export async function listInboxNotifications(user: AuthUser) {
  const [rows] = await pool.query<NotificationRow[]>(
    `SELECT n.id, n.title, n.content, n.is_read, n.created_at,
            n.receiver_id, s.full_name AS sender_name
     FROM notifications n
     LEFT JOIN users s ON s.id = n.sender_id
     WHERE n.receiver_id = ?
     ORDER BY n.created_at DESC, n.id DESC`,
    [user.id],
  );
  return rows;
}

export async function listNotificationRecipients(): Promise<{
  users: NotificationRecipientDTO[];
  rooms: NotificationRoomDTO[];
}> {
  const [users] = await pool.query<RecipientRow[]>(
    `SELECT u.id, u.full_name AS name, r.id AS room_id, r.room_number
     FROM users u
     LEFT JOIN tenants t ON t.user_id = u.id
     LEFT JOIN contracts c ON c.status = 'HIEU_LUC'
       AND CURDATE() BETWEEN c.start_date AND c.end_date
       AND (c.representative_tenant_id = t.id OR EXISTS (
         SELECT 1 FROM contract_members cm WHERE cm.contract_id = c.id AND cm.tenant_id = t.id
       ))
     LEFT JOIN rooms r ON r.id = c.room_id
     WHERE u.role = 'TENANT' AND u.is_active = 1
     ORDER BY u.full_name, r.room_number`,
  );
  const [rooms] = await pool.query<NotificationRoomDTO[] & RowDataPacket[]>(
    `SELECT DISTINCT r.id, r.room_number
     FROM rooms r JOIN contracts c ON c.room_id = r.id
     WHERE c.status = 'HIEU_LUC' AND CURDATE() BETWEEN c.start_date AND c.end_date
       AND EXISTS (
         SELECT 1 FROM tenants t
         JOIN users u ON u.id = t.user_id
         WHERE u.role = 'TENANT' AND u.is_active = 1
           AND (c.representative_tenant_id = t.id OR EXISTS (
             SELECT 1 FROM contract_members cm WHERE cm.contract_id = c.id AND cm.tenant_id = t.id
           ))
       )
     ORDER BY r.room_number`,
  );

  const grouped = new Map<string, NotificationRecipientDTO>();
  for (const row of users) {
    let recipient = grouped.get(row.id);
    if (!recipient) {
      recipient = { id: row.id, name: row.name, rooms: [] };
      grouped.set(row.id, recipient);
    }
    if (row.room_id && row.room_number && !recipient.rooms.some(room => room.id === row.room_id)) {
      recipient.rooms.push({ id: row.room_id, room_number: row.room_number });
    }
  }
  return { users: [...grouped.values()], rooms };
}

export async function createNotifications(sender: AuthUser, input: CreateNotificationInput) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    let recipientIds: string[];

    if (input.receiver_id && input.room_id) {
      const [rows] = await connection.query<UserRow[]>(
        `SELECT u.id, u.role, u.is_active FROM users u
         JOIN tenants t ON t.user_id = u.id
         JOIN contracts c ON c.room_id = ? AND c.status = 'HIEU_LUC'
           AND CURDATE() BETWEEN c.start_date AND c.end_date
           AND (c.representative_tenant_id = t.id OR EXISTS (
             SELECT 1 FROM contract_members cm WHERE cm.contract_id = c.id AND cm.tenant_id = t.id
           ))
         WHERE u.id = ? AND u.role = 'TENANT' AND u.is_active = 1 LIMIT 1`,
        [input.room_id, input.receiver_id],
      );
      if (!rows[0]) throw new NotificationServiceError(400, 'The selected tenant is not an active member of the selected room');
      recipientIds = [rows[0].id];
    } else if (input.receiver_id) {
      const [rows] = await connection.query<UserRow[]>(
        'SELECT id, role, is_active FROM users WHERE id = ? LIMIT 1',
        [input.receiver_id],
      );
      if (!rows[0] || rows[0].role !== 'TENANT' || !rows[0].is_active) {
        throw new NotificationServiceError(404, 'Active tenant account not found');
      }
      recipientIds = [rows[0].id];
    } else if (input.room_id) {
      const [roomRows] = await connection.query<RoomRow[]>('SELECT id FROM rooms WHERE id = ?', [input.room_id]);
      if (!roomRows[0]) throw new NotificationServiceError(404, 'Room not found');
      const [rows] = await connection.query<(RowDataPacket & { id: string })[]>(
        `${ACTIVE_ROOM_MEMBERS} AND c.room_id = ?`, [input.room_id],
      );
      recipientIds = rows.map(row => row.id);
    } else {
      const [rows] = await connection.query<(RowDataPacket & { id: string })[]>(
        'SELECT id FROM users WHERE role = \'TENANT\' AND is_active = 1',
      );
      recipientIds = rows.map(row => row.id);
    }

    if (recipientIds.length === 0) throw new NotificationServiceError(409, 'No active tenant accounts match the selected audience');

    const values = recipientIds.map(receiverId => [randomUUID(), input.title, input.content, sender.id, receiverId]);
    await connection.query<ResultSetHeader>(
      'INSERT INTO notifications (id, title, content, sender_id, receiver_id) VALUES ?',
      [values],
    );
    await connection.commit();
    return { count: recipientIds.length };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function markNotificationRead(user: AuthUser, id: string) {
  const [result] = await pool.query<ResultSetHeader>(
    'UPDATE notifications SET is_read = TRUE WHERE id = ? AND receiver_id = ? AND is_read = FALSE',
    [id, user.id],
  );
  if (result.affectedRows === 0) {
    const [rows] = await pool.query<(RowDataPacket & { id: string })[]>(
      'SELECT id FROM notifications WHERE id = ? AND receiver_id = ?', [id, user.id],
    );
    if (!rows[0]) throw new NotificationServiceError(404, 'Notification not found');
  }
}

export async function deleteSentNotification(user: AuthUser, id: string) {
  const [result] = await pool.query<ResultSetHeader>(
    'DELETE FROM notifications WHERE id = ? AND sender_id = ?',
    [id, user.id],
  );
  if (result.affectedRows === 0) throw new NotificationServiceError(404, 'Notification not found');
}

export async function deleteAllSentNotifications(user: AuthUser) {
  const [result] = await pool.query<ResultSetHeader>(
    'DELETE FROM notifications WHERE sender_id = ?', [user.id],
  );
  return { count: result.affectedRows };
}

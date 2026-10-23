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
interface RoomRow extends RowDataPacket, NotificationRoomDTO {}
interface RecipientRow extends RowDataPacket, NotificationRecipientDTO {}
interface UserRow extends RowDataPacket { id: string; role: string; is_active: number }

export async function listSentNotifications(user: AuthUser) {
  const [rows] = await pool.query<NotificationRow[]>(
    `SELECT n.id, n.title, n.content, n.audience_type, n.room_id, n.created_at,
            CASE WHEN n.audience_type = 'TENANT' THEN MAX(u.full_name) ELSE NULL END AS receiver_name,
            CASE WHEN n.audience_type = 'TENANT' THEN MAX(nr.user_id) ELSE NULL END AS receiver_id,
            r.room_number, COUNT(nr.user_id) AS recipient_count
     FROM notifications n
     LEFT JOIN rooms r ON r.id = n.room_id
     LEFT JOIN notification_recipients nr ON nr.notification_id = n.id
     LEFT JOIN users u ON u.id = nr.user_id
     WHERE n.sender_id = ?
     GROUP BY n.id, n.title, n.content, n.audience_type, n.room_id, n.created_at, r.room_number
     ORDER BY n.created_at DESC, n.id DESC`,
    [user.id],
  );
  return rows;
}

export async function listInboxNotifications(user: AuthUser) {
  const [rows] = await pool.query<NotificationRow[]>(
    `SELECT n.id, n.title, n.content, n.audience_type, n.room_id,
            nr.is_read, n.created_at, n.receiver_id, s.full_name AS sender_name,
            r.room_number
     FROM notification_recipients nr
     JOIN notifications n ON n.id = nr.notification_id
     LEFT JOIN users s ON s.id = n.sender_id
     LEFT JOIN rooms r ON r.id = n.room_id
     WHERE nr.user_id = ?
     ORDER BY n.created_at DESC, n.id DESC`,
    [user.id],
  );
  return rows;
}

export async function listNotificationRecipients(roomId?: string): Promise<{
  users: NotificationRecipientDTO[];
  rooms: NotificationRoomDTO[];
}> {
  const [rooms] = await pool.query<RoomRow[]>(
    `SELECT DISTINCT r.id, r.room_number
     FROM rooms r JOIN contracts c ON c.room_id = r.id
     WHERE c.status = 'HIEU_LUC' AND CURDATE() BETWEEN c.start_date AND c.end_date
     ORDER BY r.room_number`,
  );

  if (!roomId) return { users: [], rooms };

  const selectedRoom = rooms.find(room => room.id === roomId);
  if (!selectedRoom) throw new NotificationServiceError(404, 'Room not found or has no active contract');

  const [users] = await pool.query<RecipientRow[]>(
    `SELECT DISTINCT u.id, u.full_name AS name
     FROM users u
     JOIN tenants t ON t.user_id = u.id
     JOIN contracts c ON c.room_id = ? AND c.status = 'HIEU_LUC'
       AND CURDATE() BETWEEN c.start_date AND c.end_date
       AND (c.representative_tenant_id = t.id OR EXISTS (
         SELECT 1 FROM contract_members cm WHERE cm.contract_id = c.id AND cm.tenant_id = t.id
       ))
     WHERE u.role = 'TENANT' AND u.is_active = 1
     ORDER BY u.full_name`,
    [roomId],
  );
  return { users, rooms };
}

export async function createNotifications(sender: AuthUser, input: CreateNotificationInput) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    let recipientIds: string[];

    if (input.audience === 'ALL') {
      const [rows] = await connection.query<(RowDataPacket & { id: string })[]>(
        "SELECT id FROM users WHERE role = 'TENANT' AND is_active = 1",
      );
      recipientIds = rows.map(row => row.id);
    } else if (input.audience === 'ROOM') {
      if (!input.room_id) throw new NotificationServiceError(400, 'room_id is required for room notifications');
      const [roomRows] = await connection.query<RoomRow[]>('SELECT id, room_number FROM rooms WHERE id = ?', [input.room_id]);
      if (!roomRows[0]) throw new NotificationServiceError(404, 'Room not found');
      const [rows] = await connection.query<(RowDataPacket & { id: string })[]>(
        `SELECT DISTINCT u.id
         FROM users u
         JOIN tenants t ON t.user_id = u.id
         JOIN contracts c ON c.room_id = ? AND c.status = 'HIEU_LUC'
           AND CURDATE() BETWEEN c.start_date AND c.end_date
           AND (c.representative_tenant_id = t.id OR EXISTS (
             SELECT 1 FROM contract_members cm WHERE cm.contract_id = c.id AND cm.tenant_id = t.id
           ))
         WHERE u.role = 'TENANT' AND u.is_active = 1`,
        [input.room_id],
      );
      recipientIds = rows.map(row => row.id);
    } else {
      if (!input.room_id || !input.receiver_id) {
        throw new NotificationServiceError(400, 'room_id and receiver_id are required for tenant notifications');
      }
      const [rows] = await connection.query<UserRow[]>(
        `SELECT u.id, u.role, u.is_active
         FROM users u
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
    }

    if (recipientIds.length === 0) throw new NotificationServiceError(409, 'No active tenant accounts match the selected audience');

    const notificationId = randomUUID();
    await connection.query<ResultSetHeader>(
      `INSERT INTO notifications (id, title, content, sender_id, receiver_id, audience_type, room_id)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [notificationId, input.title, input.content, sender.id, input.audience === 'TENANT' ? input.receiver_id : null, input.audience, input.room_id ?? null],
    );
    const recipientValues = recipientIds.map(userId => [notificationId, userId]);
    await connection.query<ResultSetHeader>(
      'INSERT INTO notification_recipients (notification_id, user_id) VALUES ?',
      [recipientValues],
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
    'UPDATE notification_recipients SET is_read = TRUE WHERE notification_id = ? AND user_id = ? AND is_read = FALSE',
    [id, user.id],
  );
  if (result.affectedRows === 0) {
    const [rows] = await pool.query<(RowDataPacket & { notification_id: string })[]>(
      'SELECT notification_id FROM notification_recipients WHERE notification_id = ? AND user_id = ?', [id, user.id],
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

import type { Request, Response } from 'express';
import { NotificationServiceError } from '../services/notification.service';
import {
  createNotifications,
  deleteAllSentNotifications,
  deleteSentNotification,
  listInboxNotifications,
  listNotificationRecipients,
  listSentNotifications,
  markNotificationRead,
} from '../services/notification.service';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function handleError(res: Response, error: unknown) {
  if (error instanceof NotificationServiceError) return res.status(error.status).json({ message: error.message });
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const code = String(error.code);
    if (code === 'ER_DUP_ENTRY') return res.status(409).json({ message: 'Duplicate notification data' });
    if (code === 'ER_NO_REFERENCED_ROW_2' || code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(409).json({ message: 'A related database record prevents this operation' });
    }
  }
  return res.status(500).json({ message: 'Unable to process notification request' });
}

function authenticatedUser(req: Request) {
  if (!req.user) throw new NotificationServiceError(401, 'Unauthorized');
  return req.user;
}

export async function getSentNotifications(req: Request, res: Response) {
  try { return res.json({ data: await listSentNotifications(authenticatedUser(req)) }); }
  catch (error) { return handleError(res, error); }
}

export async function getInboxNotifications(req: Request, res: Response) {
  try { return res.json({ data: await listInboxNotifications(authenticatedUser(req)) }); }
  catch (error) { return handleError(res, error); }
}

export async function getNotificationRecipients(_req: Request, res: Response) {
  try { return res.json({ data: await listNotificationRecipients() }); }
  catch (error) { return handleError(res, error); }
}

export async function postNotification(req: Request, res: Response) {
  const body = req.body as Record<string, unknown>;
  const title = typeof body?.title === 'string' ? body.title.trim() : '';
  const content = typeof body?.content === 'string' ? body.content.trim() : '';
  const receiverId = body?.receiver_id;
  const roomId = body?.room_id;
  if (!title || title.length > 200) return res.status(400).json({ message: 'title is required and must be at most 200 characters' });
  if (!content || content.length > 20000) return res.status(400).json({ message: 'content is required and must be at most 20000 characters' });
  if (receiverId !== undefined && (typeof receiverId !== 'string' || !UUID_PATTERN.test(receiverId))) {
    return res.status(400).json({ message: 'receiver_id must be a valid UUID' });
  }
  if (roomId !== undefined && (typeof roomId !== 'string' || !UUID_PATTERN.test(roomId))) {
    return res.status(400).json({ message: 'room_id must be a valid UUID' });
  }
  try {
    const data = await createNotifications(authenticatedUser(req), {
      title, content,
      ...(typeof receiverId === 'string' ? { receiver_id: receiverId } : {}),
      ...(typeof roomId === 'string' ? { room_id: roomId } : {}),
    });
    return res.status(201).json({ data });
  } catch (error) { return handleError(res, error); }
}

export async function patchNotificationRead(req: Request, res: Response) {
  if (!UUID_PATTERN.test(req.params.id)) return res.status(400).json({ message: 'Invalid notification id' });
  try { await markNotificationRead(authenticatedUser(req), req.params.id); return res.status(204).end(); }
  catch (error) { return handleError(res, error); }
}

export async function removeNotification(req: Request, res: Response) {
  if (!UUID_PATTERN.test(req.params.id)) return res.status(400).json({ message: 'Invalid notification id' });
  try { await deleteSentNotification(authenticatedUser(req), req.params.id); return res.status(204).end(); }
  catch (error) { return handleError(res, error); }
}

export async function removeAllSentNotifications(req: Request, res: Response) {
  try { return res.json({ data: await deleteAllSentNotifications(authenticatedUser(req)) }); }
  catch (error) { return handleError(res, error); }
}

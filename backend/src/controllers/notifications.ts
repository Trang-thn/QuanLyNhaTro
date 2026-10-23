import { Request, Response } from 'express';
import * as notificationService from '../services/notification.service';
import type { CreateNotificationInput, NotificationAudience } from '../types/notifications';

const validId = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

function sendError(res: Response, error: unknown) {
  if (error instanceof notificationService.NotificationServiceError) return res.status(error.status).json({ message: error.message });
  console.error('Notifications API error:', error);
  return res.status(500).json({ message: 'Internal server error' });
}

export async function getInboxNotifications(req: Request, res: Response) {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
  try { return res.json({ data: await notificationService.listInboxNotifications(req.user) }); }
  catch (error) { return sendError(res, error); }
}

export async function patchNotificationRead(req: Request, res: Response) {
  if (!validId(req.params.id)) return res.status(400).json({ message: 'Invalid notification id' });
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
  try { await notificationService.markNotificationRead(req.user, req.params.id); return res.status(204).end(); }
  catch (error) { return sendError(res, error); }
}

export async function getSentNotifications(req: Request, res: Response) {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
  try { return res.json({ data: await notificationService.listSentNotifications(req.user) }); }
  catch (error) { return sendError(res, error); }
}

export async function getNotificationRecipients(req: Request, res: Response) {
  const roomId = req.query.room_id;
  if (roomId !== undefined && (typeof roomId !== 'string' || !validId(roomId))) {
    return res.status(400).json({ message: 'room_id must be a UUID' });
  }
  try { return res.json({ data: await notificationService.listNotificationRecipients(roomId as string | undefined) }); }
  catch (error) { return sendError(res, error); }
}

export async function postNotification(req: Request, res: Response) {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) return res.status(400).json({ message: 'Request body must be an object' });
  const body = req.body as Record<string, unknown>;
  const allowed = ['title', 'content', 'audience', 'receiver_id', 'room_id'];
  if (Object.keys(body).some(key => !allowed.includes(key))) return res.status(400).json({ message: 'Request contains unsupported fields' });
  if (typeof body.audience !== 'string' || !['ALL', 'ROOM', 'TENANT'].includes(body.audience)) {
    return res.status(400).json({ message: 'audience must be ALL, ROOM or TENANT' });
  }
  if (typeof body.title !== 'string' || !body.title.trim() || body.title.trim().length > 200) return res.status(400).json({ message: 'title must contain 1 to 200 characters' });
  if (typeof body.content !== 'string' || !body.content.trim()) return res.status(400).json({ message: 'content is required' });
  if (body.receiver_id !== undefined && (typeof body.receiver_id !== 'string' || !validId(body.receiver_id))) return res.status(400).json({ message: 'receiver_id must be a UUID' });
  if (body.room_id !== undefined && (typeof body.room_id !== 'string' || !validId(body.room_id))) return res.status(400).json({ message: 'room_id must be a UUID' });
  if (body.receiver_id !== undefined && body.audience !== 'TENANT') return res.status(400).json({ message: 'receiver_id is only valid for TENANT audience' });
  if (body.room_id !== undefined && body.audience === 'ALL') return res.status(400).json({ message: 'room_id is not valid for ALL audience' });
  if ((body.audience === 'ROOM' || body.audience === 'TENANT') && typeof body.room_id !== 'string') {
    return res.status(400).json({ message: 'room_id is required for ROOM and TENANT audiences' });
  }
  if ((body.audience === 'TENANT') !== (typeof body.receiver_id === 'string')) {
    return res.status(400).json({ message: 'receiver_id is required only for TENANT audience' });
  }
  const input: CreateNotificationInput = {
    title: body.title.trim(), content: body.content, audience: body.audience as NotificationAudience,
    ...(body.receiver_id ? { receiver_id: body.receiver_id as string } : {}),
    ...(body.room_id ? { room_id: body.room_id as string } : {}),
  };
  try { return res.status(201).json({ data: await notificationService.createNotifications(req.user, input) }); }
  catch (error) { return sendError(res, error); }
}

export async function removeAllSentNotifications(req: Request, res: Response) {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
  try { return res.json({ data: await notificationService.deleteAllSentNotifications(req.user) }); }
  catch (error) { return sendError(res, error); }
}

export async function removeNotification(req: Request, res: Response) {
  if (!validId(req.params.id)) return res.status(400).json({ message: 'Invalid notification id' });
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
  try { await notificationService.deleteSentNotification(req.user, req.params.id); return res.status(204).end(); }
  catch (error) { return sendError(res, error); }
}

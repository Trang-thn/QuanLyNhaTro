import { Request, Response } from 'express';
import * as roomsService from '../services/room.service';
import type { CreateRoomInput, UpdateRoomInput } from '../types/rooms';

function sendError(res: Response, error: unknown) {
  if (error instanceof roomsService.RoomServiceError) {
    return res.status(error.statusCode).json({ message: error.message });
  }
  const sqlError = error as { code?: string };
  if (sqlError?.code === 'ER_DUP_ENTRY') return res.status(409).json({ message: 'Room number already exists' });
  if (sqlError?.code === 'ER_NO_REFERENCED_ROW_2') return res.status(400).json({ message: 'Room type does not exist' });
  console.error('Rooms API error:', error);
  return res.status(500).json({ message: 'Internal server error' });
}

function validId(id: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

export async function listRooms(req: Request, res: Response) {
  const page = req.query.page === undefined ? 1 : Number(req.query.page);
  const limit = req.query.limit === undefined ? 20 : Number(req.query.limit);
  const floor = req.query.floor === undefined ? undefined : Number(req.query.floor);
  if (!Number.isInteger(page) || page < 1 || !Number.isInteger(limit) || limit < 1 || limit > 100 || (floor !== undefined && !Number.isInteger(floor))) {
    return res.status(400).json({ message: 'Invalid pagination or floor parameters' });
  }
  try {
    const result = await roomsService.listRooms({ page, limit, floor, status: typeof req.query.status === 'string' ? req.query.status : undefined });
    return res.json({ data: result.rows, pagination: { page, limit, total: result.total } });
  } catch (error) { return sendError(res, error); }
}

export async function getRoomTypes(_req: Request, res: Response) {
  try { return res.json({ data: await roomsService.getRoomTypes() }); }
  catch (error) { return sendError(res, error); }
}

export async function getRoom(req: Request, res: Response) {
  if (!validId(req.params.id)) return res.status(400).json({ message: 'Invalid room id' });
  try { return res.json({ data: await roomsService.getRoom(req.params.id) }); }
  catch (error) { return sendError(res, error); }
}

function validateRoomBody(body: unknown, partial: boolean) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return 'Request body must be an object';
  const value = body as Record<string, unknown>;
  const allowed = ['room_number', 'room_type_id', 'status', 'floor', 'description'];
  if (Object.keys(value).some((key) => !allowed.includes(key))) return 'Request contains unsupported fields';
  if (!partial && (typeof value.room_number !== 'string' || !value.room_number.trim())) return 'room_number is required';
  if (value.room_number !== undefined && (typeof value.room_number !== 'string' || !value.room_number.trim() || value.room_number.trim().length > 20)) return 'room_number must contain 1 to 20 characters';
  if (value.room_type_id !== undefined && value.room_type_id !== null && (typeof value.room_type_id !== 'string' || !validId(value.room_type_id))) return 'room_type_id must be a UUID or null';
  if (value.status !== undefined && (typeof value.status !== 'string' || !value.status.trim() || value.status.trim().length > 20)) return 'status must contain 1 to 20 characters';
  if (value.floor !== undefined && (!Number.isInteger(value.floor) || (value.floor as number) < 1)) return 'floor must be a positive integer';
  if (value.description !== undefined && value.description !== null && typeof value.description !== 'string') return 'description must be a string or null';
  if (partial && Object.keys(value).length === 0) return 'At least one field is required';
  return null;
}

export async function createRoom(req: Request, res: Response) {
  const invalid = validateRoomBody(req.body, false);
  if (invalid) return res.status(400).json({ message: invalid });
  try { return res.status(201).json({ data: await roomsService.createRoom(req.body as CreateRoomInput) }); }
  catch (error) { return sendError(res, error); }
}

export async function updateRoom(req: Request, res: Response) {
  if (!validId(req.params.id)) return res.status(400).json({ message: 'Invalid room id' });
  const invalid = validateRoomBody(req.body, true);
  if (invalid) return res.status(400).json({ message: invalid });
  try { return res.json({ data: await roomsService.updateRoom(req.params.id, req.body as UpdateRoomInput) }); }
  catch (error) { return sendError(res, error); }
}

export async function updateRoomStatus(req: Request, res: Response) {
  if (!validId(req.params.id)) return res.status(400).json({ message: 'Invalid room id' });
  if (!req.body || typeof req.body.status !== 'string' || !req.body.status.trim() || req.body.status.trim().length > 20 || Object.keys(req.body).some((key) => key !== 'status')) {
    return res.status(400).json({ message: 'status must contain 1 to 20 characters' });
  }
  try { return res.json({ data: await roomsService.updateRoomStatus(req.params.id, req.body.status.trim()) }); }
  catch (error) { return sendError(res, error); }
}

export async function deleteRoom(req: Request, res: Response) {
  if (!validId(req.params.id)) return res.status(400).json({ message: 'Invalid room id' });
  try { await roomsService.deleteRoom(req.params.id); return res.status(204).send(); }
  catch (error) { return sendError(res, error); }
}

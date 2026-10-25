import { Request, Response } from 'express';
import * as roomsService from '../services/room.service';
import type { CreateRoomInput, CreateRoomTypeInput, UpdateRoomInput, UpdateRoomTypeInput } from '../types/rooms';

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

function validateRoomTypeBody(body: unknown, partial: boolean) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return 'Request body must be an object';
  const value = body as Record<string, unknown>;
  const allowed = ['name', 'base_price', 'area_sqm', 'description'];
  if (Object.keys(value).some((key) => !allowed.includes(key))) return 'Request contains unsupported fields';
  if (!partial && (typeof value.name !== 'string' || !value.name.trim())) return 'name is required';
  if (value.name !== undefined && (typeof value.name !== 'string' || !value.name.trim() || value.name.trim().length > 100)) return 'name must contain 1 to 100 characters';
  if (!partial && (typeof value.base_price !== 'number' || !Number.isFinite(value.base_price) || value.base_price <= 0 || value.base_price > 9999999999.99)) return 'base_price must be a positive number';
  if (value.base_price !== undefined && (typeof value.base_price !== 'number' || !Number.isFinite(value.base_price) || value.base_price <= 0 || value.base_price > 9999999999.99)) return 'base_price must be a positive number';
  if (value.area_sqm !== undefined && value.area_sqm !== null && (typeof value.area_sqm !== 'number' || !Number.isFinite(value.area_sqm) || value.area_sqm <= 0 || value.area_sqm > 999.99)) return 'area_sqm must be a positive number up to 999.99';
  if (value.description !== undefined && value.description !== null && typeof value.description !== 'string') return 'description must be a string or null';
  if (partial && Object.keys(value).length === 0) return 'At least one field is required';
  return null;
}

export async function createRoomType(req: Request, res: Response) {
  const invalid = validateRoomTypeBody(req.body, false);
  if (invalid) return res.status(400).json({ message: invalid });
  try { return res.status(201).json({ data: await roomsService.createRoomType(req.body as CreateRoomTypeInput) }); }
  catch (error) { return sendError(res, error); }
}

export async function updateRoomType(req: Request, res: Response) {
  if (!validId(req.params.id)) return res.status(400).json({ message: 'Invalid room type id' });
  const invalid = validateRoomTypeBody(req.body, true);
  if (invalid) return res.status(400).json({ message: invalid });
  try { return res.json({ data: await roomsService.updateRoomType(req.params.id, req.body as UpdateRoomTypeInput) }); }
  catch (error) { return sendError(res, error); }
}

export async function deleteRoomType(req: Request, res: Response) {
  if (!validId(req.params.id)) return res.status(400).json({ message: 'Invalid room type id' });
  try { await roomsService.deleteRoomType(req.params.id); return res.status(204).send(); }
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
  const allowed = partial
    ? ['room_number', 'room_type_id', 'floor', 'description']
    : ['room_number', 'room_type_id', 'new_room_type', 'status', 'floor', 'description'];
  if (Object.keys(value).some((key) => !allowed.includes(key))) return 'Request contains unsupported fields';
  if (!partial && (typeof value.room_number !== 'string' || !value.room_number.trim())) return 'room_number is required';
  if (value.room_number !== undefined && (typeof value.room_number !== 'string' || !value.room_number.trim() || value.room_number.trim().length > 20)) return 'room_number must contain 1 to 20 characters';
  if (value.room_type_id !== undefined && value.room_type_id !== null && (typeof value.room_type_id !== 'string' || !validId(value.room_type_id))) return 'room_type_id must be a UUID or null';
  if (!partial) {
    const hasExistingType = value.room_type_id !== undefined;
    const hasNewType = value.new_room_type !== undefined;
    if (hasExistingType && hasNewType) return 'Provide only one of room_type_id or new_room_type';
  }
  if (value.new_room_type !== undefined) {
    if (partial || !value.new_room_type || typeof value.new_room_type !== 'object' || Array.isArray(value.new_room_type)) return 'new_room_type must be an object';
    const newType = value.new_room_type as Record<string, unknown>;
    const allowedTypeFields = ['name', 'base_price', 'area_sqm', 'description'];
    if (Object.keys(newType).some((key) => !allowedTypeFields.includes(key))) return 'new_room_type contains unsupported fields';
    if (typeof newType.name !== 'string' || !newType.name.trim() || newType.name.trim().length > 100) return 'new_room_type.name must contain 1 to 100 characters';
    if (typeof newType.base_price !== 'number' || !Number.isFinite(newType.base_price) || newType.base_price <= 0 || newType.base_price > 9999999999.99) return 'new_room_type.base_price must be a positive number';
    if (newType.area_sqm !== undefined && newType.area_sqm !== null && (typeof newType.area_sqm !== 'number' || !Number.isFinite(newType.area_sqm) || newType.area_sqm <= 0 || newType.area_sqm > 999.99)) return 'new_room_type.area_sqm must be a positive number up to 999.99';
    if (newType.description !== undefined && newType.description !== null && typeof newType.description !== 'string') return 'new_room_type.description must be a string or null';
  }
  if (value.status !== undefined && (typeof value.status !== 'string' || !['TRONG', 'BAO_TRI'].includes(value.status.trim()))) return 'status must be TRONG or BAO_TRI';
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
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body) || typeof req.body.status !== 'string' || Object.keys(req.body).some((key) => key !== 'status')) {
    return res.status(400).json({ message: 'Request body must contain only a status string' });
  }
  if (!['TRONG', 'BAO_TRI'].includes(req.body.status.trim())) {
    return res.status(400).json({ message: 'status must be TRONG or BAO_TRI; DANG_THUE is managed by active contracts' });
  }
  try { return res.json({ data: await roomsService.updateRoomStatus(req.params.id, req.body.status.trim()) }); }
  catch (error) { return sendError(res, error); }
}

export async function deleteRoom(req: Request, res: Response) {
  if (!validId(req.params.id)) return res.status(400).json({ message: 'Invalid room id' });
  try { await roomsService.deleteRoom(req.params.id); return res.status(204).send(); }
  catch (error) { return sendError(res, error); }
}

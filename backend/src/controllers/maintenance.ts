import { Request, Response } from 'express';
import * as maintenanceService from '../services/maintenance.service';
import type { CreateMaintenanceInput, MaintenanceStatus, UpdateMaintenanceInput } from '../types/maintenance';

const validId = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
const validStatuses: MaintenanceStatus[] = ['TIEP_NHAN', 'DANG_XU_LY', 'HOAN_THANH'];

function sendError(res: Response, error: unknown) {
  if (error instanceof maintenanceService.MaintenanceServiceError) {
    return res.status(error.statusCode).json({ message: error.message });
  }
  const sqlError = error as { code?: string };
  if (sqlError?.code === 'ER_NO_REFERENCED_ROW_2') return res.status(404).json({ message: 'Room or tenant does not exist' });
  console.error('Maintenance API error:', error);
  return res.status(500).json({ message: 'Internal server error' });
}

export async function listMaintenanceRequests(req: Request, res: Response) {
  const status = req.query.status;
  if (status !== undefined && (typeof status !== 'string' || !validStatuses.includes(status as MaintenanceStatus))) {
    return res.status(400).json({ message: 'Invalid status filter' });
  }
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
  try {
    return res.json({ data: await maintenanceService.listMaintenanceRequests(req.user, status as string | undefined) });
  } catch (error) {
    return sendError(res, error);
  }
}

export async function listTenantRooms(req: Request, res: Response) {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
  if (req.user.role !== 'TENANT') return res.status(403).json({ message: 'Forbidden' });
  try {
    return res.json({ data: await maintenanceService.listTenantRooms(req.user) });
  } catch (error) {
    return sendError(res, error);
  }
}

export async function getMaintenanceRequest(req: Request, res: Response) {
  if (!validId(req.params.id)) return res.status(400).json({ message: 'Invalid maintenance request id' });
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
  try {
    return res.json({ data: await maintenanceService.getMaintenanceRequest(req.params.id, req.user) });
  } catch (error) {
    return sendError(res, error);
  }
}

export async function createMaintenanceRequest(req: Request, res: Response) {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
    return res.status(400).json({ message: 'Request body must be an object' });
  }
  const body = req.body as Record<string, unknown>;
  if (Object.keys(body).some((key) => !['room_id', 'title', 'description'].includes(key))) {
    return res.status(400).json({ message: 'Request contains unsupported fields' });
  }
  if (typeof body.room_id !== 'string' || !validId(body.room_id)) {
    return res.status(400).json({ message: 'room_id must be a UUID' });
  }
  if (typeof body.title !== 'string' || !body.title.trim() || body.title.trim().length > 200) {
    return res.status(400).json({ message: 'title must contain 1 to 200 characters' });
  }
  if (typeof body.description !== 'string' || !body.description.trim()) {
    return res.status(400).json({ message: 'description is required' });
  }
  try {
    return res.status(201).json({
      data: await maintenanceService.createMaintenanceRequest(req.user, {
        room_id: body.room_id as string,
        title: body.title as string,
        description: body.description as string,
      } satisfies CreateMaintenanceInput),
    });
  } catch (error) {
    return sendError(res, error);
  }
}

export async function updateMaintenanceRequest(req: Request, res: Response) {
  if (!validId(req.params.id)) return res.status(400).json({ message: 'Invalid maintenance request id' });
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
    return res.status(400).json({ message: 'Request body must be an object' });
  }
  const body = req.body as Record<string, unknown>;
  if (Object.keys(body).some((key) => !['status', 'cost'].includes(key))) {
    return res.status(400).json({ message: 'Request contains unsupported fields' });
  }
  if (Object.keys(body).length === 0) return res.status(400).json({ message: 'At least one field is required' });
  if (body.status !== undefined && (typeof body.status !== 'string' || !validStatuses.includes(body.status as MaintenanceStatus))) {
    return res.status(400).json({ message: 'Invalid status' });
  }
  if (body.cost !== undefined && (typeof body.cost !== 'number' || !Number.isFinite(body.cost) || body.cost < 0 || body.cost > 9999999999.99)) {
    return res.status(400).json({ message: 'cost must be a non-negative number within the database range' });
  }
  try {
    return res.json({ data: await maintenanceService.updateMaintenanceRequest(req.params.id, body as UpdateMaintenanceInput) });
  } catch (error) {
    return sendError(res, error);
  }
}


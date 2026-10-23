import { Request, Response } from 'express';
import * as amenitiesService from '../services/amenity.service';
import type { CreateAmenityInput, UpdateAmenityInput } from '../types/amenities';

function validId(id: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

function sendError(res: Response, error: unknown) {
  if (error instanceof amenitiesService.AmenityServiceError) {
    return res.status(error.statusCode).json({ message: error.message });
  }
  const sqlError = error as { code?: string };
  if (sqlError?.code === 'ER_DUP_ENTRY') return res.status(409).json({ message: 'Amenity name already exists' });
  if (sqlError?.code === 'ER_NO_REFERENCED_ROW_2') return res.status(404).json({ message: 'Room or amenity does not exist' });
  console.error('Amenities API error:', error);
  return res.status(500).json({ message: 'Internal server error' });
}

function validateAmenityBody(body: unknown) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return 'Request body must be an object';
  const value = body as Record<string, unknown>;
  if (Object.keys(value).some((key) => key !== 'name')) return 'Request contains unsupported fields';
  if (typeof value.name !== 'string' || !value.name.trim() || value.name.trim().length > 100) {
    return 'name must contain 1 to 100 characters';
  }
  return null;
}

export async function listAmenities(_req: Request, res: Response) {
  try {
    return res.json({ data: await amenitiesService.listAmenities() });
  } catch (error) {
    return sendError(res, error);
  }
}

export async function getAmenity(req: Request, res: Response) {
  if (!validId(req.params.id)) return res.status(400).json({ message: 'Invalid amenity id' });
  try {
    return res.json({ data: await amenitiesService.getAmenity(req.params.id) });
  } catch (error) {
    return sendError(res, error);
  }
}

export async function createAmenity(req: Request, res: Response) {
  const invalid = validateAmenityBody(req.body);
  if (invalid) return res.status(400).json({ message: invalid });
  try {
    return res.status(201).json({ data: await amenitiesService.createAmenity(req.body as CreateAmenityInput) });
  } catch (error) {
    return sendError(res, error);
  }
}

export async function updateAmenity(req: Request, res: Response) {
  if (!validId(req.params.id)) return res.status(400).json({ message: 'Invalid amenity id' });
  const invalid = validateAmenityBody(req.body);
  if (invalid) return res.status(400).json({ message: invalid });
  try {
    return res.json({ data: await amenitiesService.updateAmenity(req.params.id, req.body as UpdateAmenityInput) });
  } catch (error) {
    return sendError(res, error);
  }
}

export async function deleteAmenity(req: Request, res: Response) {
  if (!validId(req.params.id)) return res.status(400).json({ message: 'Invalid amenity id' });
  try {
    await amenitiesService.deleteAmenity(req.params.id);
    return res.status(204).send();
  } catch (error) {
    return sendError(res, error);
  }
}

export async function listRoomAmenities(req: Request, res: Response) {
  if (!validId(req.params.roomId)) return res.status(400).json({ message: 'Invalid room id' });
  try {
    return res.json({ data: await amenitiesService.listRoomAmenities(req.params.roomId) });
  } catch (error) {
    return sendError(res, error);
  }
}

export async function replaceRoomAmenities(req: Request, res: Response) {
  if (!validId(req.params.roomId)) return res.status(400).json({ message: 'Invalid room id' });
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
    return res.status(400).json({ message: 'Request body must be an object' });
  }

  const body = req.body as Record<string, unknown>;
  if (Object.keys(body).some((key) => key !== 'amenity_ids')) {
    return res.status(400).json({ message: 'Request contains unsupported fields' });
  }
  if (!Array.isArray(body.amenity_ids) || !body.amenity_ids.every((id) => typeof id === 'string' && validId(id))) {
    return res.status(400).json({ message: 'amenity_ids must be an array of UUIDs' });
  }
  const amenityIds = body.amenity_ids as string[];
  if (new Set(amenityIds).size !== amenityIds.length) {
    return res.status(400).json({ message: 'amenity_ids must not contain duplicates' });
  }

  try {
    return res.json({ data: await amenitiesService.replaceRoomAmenities(req.params.roomId, amenityIds) });
  } catch (error) {
    return sendError(res, error);
  }
}


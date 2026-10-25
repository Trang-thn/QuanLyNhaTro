import { mkdir, readFile, stat, unlink, writeFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import path from 'node:path';
import type { RowDataPacket } from 'mysql2';
import { pool } from '../config/database';
import type { AuthUser } from '../types/auth';
import { MaintenanceServiceError } from './maintenance.errors';

const IMAGE_DIRECTORY = path.resolve(__dirname, '../../uploads/maintenance');
const IMAGE_URL_PREFIX = '/maintenance-requests/images/';
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

interface TenantIdRow extends RowDataPacket { id: string; }
interface ImageOwnerRow extends RowDataPacket { tenant_id: string; }

function detectImage(buffer: Buffer): { extension: string; mimeType: string } | null {
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { extension: 'jpg', mimeType: 'image/jpeg' };
  }
  if (buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    return { extension: 'png', mimeType: 'image/png' };
  }
  if (buffer.length >= 12 && buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') {
    return { extension: 'webp', mimeType: 'image/webp' };
  }
  if (buffer.length >= 6 && ['GIF87a', 'GIF89a'].includes(buffer.toString('ascii', 0, 6))) {
    return { extension: 'gif', mimeType: 'image/gif' };
  }
  if (buffer.length >= 2 && buffer.toString('ascii', 0, 2) === 'BM') {
    return { extension: 'bmp', mimeType: 'image/bmp' };
  }
  if (buffer.length >= 4 && (
    buffer.subarray(0, 4).equals(Buffer.from([0x49, 0x49, 0x2a, 0x00])) ||
    buffer.subarray(0, 4).equals(Buffer.from([0x4d, 0x4d, 0x00, 0x2a])) ||
    buffer.subarray(0, 4).equals(Buffer.from([0x49, 0x49, 0x2b, 0x00])) ||
    buffer.subarray(0, 4).equals(Buffer.from([0x4d, 0x4d, 0x00, 0x2b]))
  )) {
    return { extension: 'tif', mimeType: 'image/tiff' };
  }
  if (buffer.length >= 4 && buffer[0] === 0x00 && buffer[1] === 0x00 && buffer[2] === 0x01 && buffer[3] === 0x00) {
    return { extension: 'ico', mimeType: 'image/vnd.microsoft.icon' };
  }
  if (buffer.length >= 12 && buffer.toString('ascii', 4, 8) === 'ftyp') {
    const brands = [buffer.toString('ascii', 8, 12), ...Array.from(
      { length: Math.floor((buffer.length - 16) / 4) },
      (_, index) => buffer.toString('ascii', 16 + index * 4, 20 + index * 4),
    )];
    if (brands.some((brand) => ['avif', 'avis'].includes(brand))) {
      return { extension: 'avif', mimeType: 'image/avif' };
    }
    if (brands.some((brand) => ['heic', 'heix', 'hevc', 'hevx'].includes(brand))) {
      return { extension: 'heic', mimeType: 'image/heic' };
    }
    if (brands.some((brand) => ['mif1', 'msf1', 'heif'].includes(brand))) {
      return { extension: 'heif', mimeType: 'image/heif' };
    }
  }
  if (buffer.length >= 12 && buffer.subarray(0, 12).equals(Buffer.from([0x00, 0x00, 0x00, 0x0c, 0x6a, 0x50, 0x20, 0x20, 0x0d, 0x0a, 0x87, 0x0a]))) {
    return { extension: 'jp2', mimeType: 'image/jp2' };
  }
  if (buffer.length >= 12 && buffer.subarray(0, 12).equals(Buffer.from([0x00, 0x00, 0x00, 0x0c, 0x4a, 0x58, 0x4c, 0x20, 0x0d, 0x0a, 0x87, 0x0a]))) {
    return { extension: 'jxl', mimeType: 'image/jxl' };
  }
  if (buffer.length >= 2 && buffer[0] === 0xff && buffer[1] === 0x0a) {
    return { extension: 'jxl', mimeType: 'image/jxl' };
  }
  return null;
}

function safeFilename(filename: string): boolean {
  return /^[0-9a-f-]{36}_[0-9a-f-]{36}\.(?:jpg|png|webp|gif|bmp|tif|ico|avif|heic|heif|jp2|jxl)$/i.test(filename);
}

function imagePath(filename: string): string {
  if (!safeFilename(filename)) throw new MaintenanceServiceError(404, 'Image not found');
  return path.join(IMAGE_DIRECTORY, filename);
}

async function tenantIdForUser(user: AuthUser): Promise<string> {
  if (user.role !== 'TENANT') throw new MaintenanceServiceError(403, 'Forbidden');
  const [rows] = await pool.query<TenantIdRow[]>('SELECT id FROM tenants WHERE user_id = ?', [user.id]);
  if (!rows[0]) throw new MaintenanceServiceError(403, 'No tenant profile is linked to this account');
  return rows[0].id;
}

export async function saveMaintenanceImage(user: AuthUser, buffer: Buffer): Promise<{ image_url: string }> {
  if (buffer.length === 0 || buffer.length > MAX_IMAGE_BYTES) {
    throw new MaintenanceServiceError(413, 'Image must be 5 MB or smaller');
  }
  const detected = detectImage(buffer);
  if (!detected) throw new MaintenanceServiceError(400, 'Unsupported image format. Use JPEG, PNG, WebP, GIF, BMP, TIFF, AVIF, HEIC/HEIF, ICO, JPEG 2000, or JPEG XL');
  const tenantId = await tenantIdForUser(user);
  const filename = `${tenantId}_${randomUUID()}.${detected.extension}`;
  await mkdir(IMAGE_DIRECTORY, { recursive: true });
  await writeFile(imagePath(filename), buffer, { flag: 'wx' });
  return { image_url: `${IMAGE_URL_PREFIX}${filename}` };
}

export async function assertUploadedMaintenanceImage(tenantId: string, imageUrl: string): Promise<void> {
  if (!imageUrl.startsWith(IMAGE_URL_PREFIX)) throw new MaintenanceServiceError(400, 'Invalid image reference');
  const filename = imageUrl.slice(IMAGE_URL_PREFIX.length);
  if (!safeFilename(filename) || !filename.startsWith(`${tenantId}_`)) {
    throw new MaintenanceServiceError(403, 'Image does not belong to this tenant');
  }
  try {
    await stat(imagePath(filename));
  } catch {
    throw new MaintenanceServiceError(400, 'Uploaded image was not found');
  }
}

export async function readMaintenanceImage(user: AuthUser, filename: string): Promise<{ buffer: Buffer; mimeType: string }> {
  const imageUrl = `${IMAGE_URL_PREFIX}${filename}`;
  const [rows] = await pool.query<ImageOwnerRow[]>(
    'SELECT tenant_id FROM maintenance_requests WHERE image_url = ? LIMIT 1',
    [imageUrl],
  );
  if (!rows[0]) throw new MaintenanceServiceError(404, 'Image not found');
  if (user.role === 'TENANT' && rows[0].tenant_id !== await tenantIdForUser(user)) {
    throw new MaintenanceServiceError(403, 'Forbidden');
  }
  if (user.role !== 'TENANT' && user.role !== 'ADMIN') throw new MaintenanceServiceError(403, 'Forbidden');
  let buffer: Buffer;
  try {
    buffer = await readFile(imagePath(filename));
  } catch {
    throw new MaintenanceServiceError(404, 'Image file not found');
  }
  const detected = detectImage(buffer);
  if (!detected) throw new MaintenanceServiceError(404, 'Image file is invalid');
  return { buffer, mimeType: detected.mimeType };
}

export async function deleteUnattachedMaintenanceImage(user: AuthUser, filename: string): Promise<void> {
  const tenantId = await tenantIdForUser(user);
  if (!safeFilename(filename) || !filename.startsWith(`${tenantId}_`)) {
    throw new MaintenanceServiceError(404, 'Image not found');
  }
  const imageUrl = `${IMAGE_URL_PREFIX}${filename}`;
  const [rows] = await pool.query<ImageOwnerRow[]>(
    'SELECT tenant_id FROM maintenance_requests WHERE image_url = ? LIMIT 1',
    [imageUrl],
  );
  if (rows[0]) throw new MaintenanceServiceError(409, 'Image is already attached to a maintenance request');
  try {
    await unlink(imagePath(filename));
  } catch {
    throw new MaintenanceServiceError(404, 'Image not found');
  }
}


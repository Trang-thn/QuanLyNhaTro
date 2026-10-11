import { ResultSetHeader } from 'mysql2';
import { randomUUID } from 'node:crypto';
import { pool } from '../config/database';
import type { AmenityRecord, CreateAmenityInput, UpdateAmenityInput } from '../types/amenities';

export class AmenityServiceError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
  }
}

export async function listAmenities(): Promise<AmenityRecord[]> {
  const [rows] = await pool.query<AmenityRecord[]>('SELECT id, name FROM amenities ORDER BY name');
  return rows;
}

export async function getAmenity(id: string): Promise<AmenityRecord> {
  const [rows] = await pool.query<AmenityRecord[]>('SELECT id, name FROM amenities WHERE id = ?', [id]);
  if (!rows[0]) throw new AmenityServiceError(404, 'Amenity not found');
  return rows[0];
}

export async function createAmenity(input: CreateAmenityInput): Promise<AmenityRecord> {
  const id = randomUUID();
  await pool.execute<ResultSetHeader>('INSERT INTO amenities (id, name) VALUES (?, ?)', [id, input.name.trim()]);
  return getAmenity(id);
}

export async function updateAmenity(id: string, input: UpdateAmenityInput): Promise<AmenityRecord> {
  const [result] = await pool.execute<ResultSetHeader>('UPDATE amenities SET name = ? WHERE id = ?', [input.name.trim(), id]);
  if (result.affectedRows === 0) return getAmenity(id);
  return getAmenity(id);
}

export async function deleteAmenity(id: string): Promise<void> {
  const [result] = await pool.execute<ResultSetHeader>('DELETE FROM amenities WHERE id = ?', [id]);
  if (result.affectedRows === 0) throw new AmenityServiceError(404, 'Amenity not found');
}

export async function listRoomAmenities(roomId: string): Promise<AmenityRecord[]> {
  const [rooms] = await pool.query<AmenityRecord[]>('SELECT id FROM rooms WHERE id = ?', [roomId]);
  if (!rooms[0]) throw new AmenityServiceError(404, 'Room not found');

  const [rows] = await pool.query<AmenityRecord[]>(
    `SELECT a.id, a.name
     FROM amenities a
     INNER JOIN room_amenities ra ON ra.amenity_id = a.id
     WHERE ra.room_id = ?
     ORDER BY a.name`,
    [roomId],
  );
  return rows;
}

export async function replaceRoomAmenities(roomId: string, amenityIds: string[]): Promise<AmenityRecord[]> {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [rooms] = await connection.query<AmenityRecord[]>('SELECT id FROM rooms WHERE id = ? FOR UPDATE', [roomId]);
    if (!rooms[0]) throw new AmenityServiceError(404, 'Room not found');

    if (amenityIds.length > 0) {
      const placeholders = amenityIds.map(() => '?').join(', ');
      const [amenities] = await connection.query<AmenityRecord[]>(
        `SELECT id FROM amenities WHERE id IN (${placeholders}) ORDER BY id FOR UPDATE`,
        amenityIds,
      );
      if (amenities.length !== amenityIds.length) {
        throw new AmenityServiceError(404, 'One or more amenities were not found');
      }
    }

    await connection.execute('DELETE FROM room_amenities WHERE room_id = ?', [roomId]);
    if (amenityIds.length > 0) {
      const valuePlaceholders = amenityIds.map(() => '(?, ?)').join(', ');
      const values = amenityIds.flatMap((amenityId) => [roomId, amenityId]);
      await connection.execute<ResultSetHeader>(
        `INSERT INTO room_amenities (room_id, amenity_id) VALUES ${valuePlaceholders}`,
        values,
      );
    }

    const [rows] = await connection.query<AmenityRecord[]>(
      `SELECT a.id, a.name
       FROM amenities a
       INNER JOIN room_amenities ra ON ra.amenity_id = a.id
       WHERE ra.room_id = ?
       ORDER BY a.name`,
      [roomId],
    );
    await connection.commit();
    return rows;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}


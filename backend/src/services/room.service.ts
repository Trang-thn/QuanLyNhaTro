import { ResultSetHeader } from 'mysql2';
import { randomUUID } from 'node:crypto';
import { pool } from '../config/database';
import type { CountQueryRow, CreateRoomInput, CreateRoomTypeInput, RoomListFilters, RoomListResponse, RoomRecord, RoomTypeRecord, UpdateRoomInput, UpdateRoomTypeInput } from '../types/rooms';

export class RoomServiceError extends Error {
  constructor(public statusCode: number, message: string) { super(message); }
}

const roomSelect = `SELECT r.id, r.room_number, r.room_type_id, r.status, r.floor, r.description, r.created_at,
  rt.name AS room_type_name, rt.base_price, rt.area_sqm
  FROM rooms r LEFT JOIN room_types rt ON rt.id = r.room_type_id`;

export async function listRooms(filters: RoomListFilters): Promise<RoomListResponse> {
  const conditions: string[] = [];
  const values: Array<string | number> = [];
  if (filters.floor !== undefined) { conditions.push('r.floor = ?'); values.push(filters.floor); }
  if (filters.status !== undefined) { conditions.push('r.status = ?'); values.push(filters.status); }
  const where = conditions.length ? ` WHERE ${conditions.join(' AND ')}` : '';
  const [rows] = await pool.query<RoomRecord[]>(`${roomSelect}${where} ORDER BY r.floor, r.room_number LIMIT ? OFFSET ?`, [...values, filters.limit, (filters.page - 1) * filters.limit]);
  const [count] = await pool.query<CountQueryRow[]>(`SELECT COUNT(*) AS total FROM rooms r${where}`, values);
  return { rows, total: Number(count[0].total) };
}

export async function getRoomTypes() {
  const [rows] = await pool.query<RoomTypeRecord[]>('SELECT id, name, base_price, area_sqm, description FROM room_types ORDER BY name');
  return rows;
}

export async function createRoomType(input: CreateRoomTypeInput) {
  const id = randomUUID();
  await pool.execute<ResultSetHeader>(
    'INSERT INTO room_types (id, name, base_price, area_sqm, description) VALUES (?, ?, ?, ?, ?)',
    [id, input.name.trim(), input.base_price, input.area_sqm ?? null, input.description?.trim() || null],
  );
  const [rows] = await pool.query<RoomTypeRecord[]>('SELECT id, name, base_price, area_sqm, description FROM room_types WHERE id = ?', [id]);
  return rows[0];
}

export async function updateRoomType(id: string, input: UpdateRoomTypeInput) {
  const fields: string[] = [];
  const values: Array<string | number | null> = [];
  for (const key of ['name', 'base_price', 'area_sqm', 'description'] as const) {
    if (input[key] !== undefined) {
      fields.push(`${key} = ?`);
      const value = input[key];
      values.push(key === 'name' || key === 'description' ? (value as string | null)?.trim() || null : value as number | null);
    }
  }
  const [result] = await pool.execute<ResultSetHeader>(`UPDATE room_types SET ${fields.join(', ')} WHERE id = ?`, [...values, id]);
  if (result.affectedRows === 0) {
    const [rows] = await pool.query<RoomTypeRecord[]>('SELECT id, name, base_price, area_sqm, description FROM room_types WHERE id = ?', [id]);
    if (!rows[0]) throw new RoomServiceError(404, 'Room type not found');
  }
  const [rows] = await pool.query<RoomTypeRecord[]>('SELECT id, name, base_price, area_sqm, description FROM room_types WHERE id = ?', [id]);
  return rows[0];
}

export async function deleteRoomType(id: string) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [types] = await connection.query<RoomTypeRecord[]>('SELECT id FROM room_types WHERE id = ? FOR UPDATE', [id]);
    if (!types[0]) throw new RoomServiceError(404, 'Room type not found');
    const [rooms] = await connection.query<CountQueryRow[]>('SELECT COUNT(*) AS total FROM rooms WHERE room_type_id = ?', [id]);
    if (Number(rooms[0].total) > 0) throw new RoomServiceError(409, 'Room type is assigned to one or more rooms');
    await connection.execute<ResultSetHeader>('DELETE FROM room_types WHERE id = ?', [id]);
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function getRoom(id: string) {
  const [rows] = await pool.query<RoomRecord[]>(`${roomSelect} WHERE r.id = ?`, [id]);
  if (!rows[0]) throw new RoomServiceError(404, 'Room not found');
  return rows[0];
}

export async function createRoom(input: CreateRoomInput) {
  const roomNumber = input.room_number!.trim();
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    let roomTypeId = input.room_type_id ?? null;

    if (input.new_room_type) {
      roomTypeId = randomUUID();
      await connection.execute<ResultSetHeader>(
        'INSERT INTO room_types (id, name, base_price, area_sqm, description) VALUES (?, ?, ?, ?, ?)',
        [
          roomTypeId,
          input.new_room_type.name.trim(),
          input.new_room_type.base_price,
          input.new_room_type.area_sqm ?? null,
          input.new_room_type.description?.trim() || null,
        ],
      );
    }

    await connection.execute<ResultSetHeader>(
      'INSERT INTO rooms (room_number, room_type_id, status, floor, description) VALUES (?, ?, ?, ?, ?)',
      [roomNumber, roomTypeId, input.status?.trim() ?? 'TRONG', input.floor ?? 1, input.description ?? null],
    );

    const [rows] = await connection.query<RoomRecord[]>(`${roomSelect} WHERE r.room_number = ?`, [roomNumber]);
    if (!rows[0]) throw new RoomServiceError(500, 'Created room could not be loaded');
    await connection.commit();
    return rows[0];
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function updateRoom(id: string, input: UpdateRoomInput) {
  const fields: string[] = [];
  const values: Array<string | number | null> = [];
  for (const key of ['room_number', 'room_type_id', 'status', 'floor', 'description'] as const) {
    if (input[key] !== undefined) {
      fields.push(`${key} = ?`);
      values.push(key === 'room_number' || key === 'status' ? (input[key] as string).trim() : input[key]);
    }
  }
  const [result] = await pool.execute<ResultSetHeader>(`UPDATE rooms SET ${fields.join(', ')} WHERE id = ?`, [...values, id]);
  if (result.affectedRows === 0) return getRoom(id);
  return getRoom(id);
}

export async function updateRoomStatus(id: string, status: string) {
  await pool.execute('UPDATE rooms SET status = ? WHERE id = ?', [status, id]);
  return getRoom(id);
}

export async function deleteRoom(id: string) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [rooms] = await connection.query<RoomRecord[]>('SELECT id FROM rooms WHERE id = ? FOR UPDATE', [id]);
    if (!rooms[0]) throw new RoomServiceError(404, 'Room not found');
    const relatedTables = ['contracts', 'utility_readings', 'maintenance_requests', 'room_amenities'];
    for (const table of relatedTables) {
      const [rows] = await connection.query<CountQueryRow[]>(`SELECT COUNT(*) AS total FROM ${table} WHERE room_id = ?`, [id]);
      if (Number(rows[0].total) > 0) throw new RoomServiceError(409, `Room cannot be deleted because related ${table} records exist`);
    }
    await connection.execute('DELETE FROM rooms WHERE id = ?', [id]);
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally { connection.release(); }
}


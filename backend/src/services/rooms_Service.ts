import { pool as db } from '../config/database';

export class RoomsService {
  // Lấy tất cả phòng: id (UUID), room_number
  static async getAllRooms(): Promise<Array<{ id: string; room_number: string }>> {
    const query = `SELECT id, room_number FROM rooms ORDER BY room_number`;
    const [rows]: any = await db.execute(query);
    return rows;
  }
}
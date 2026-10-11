import { Request, Response } from 'express';
import { RoomsService } from '../services/rooms_Service';

export class RoomsController {
  // Lấy danh sách tất cả phòng (dùng cho mapping room_number -> room_id)
  static async getAllRooms(req: Request, res: Response): Promise<any> {
    try {
      const rooms = await RoomsService.getAllRooms();
      return res.json({ success: true, data: rooms });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: "Lỗi hệ thống hoặc kết nối cơ sở dữ liệu thất bại" });
    }
  }
}
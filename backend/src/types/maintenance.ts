import type { RowDataPacket } from 'mysql2';

export type MaintenanceStatus = 'TIEP_NHAN' | 'DANG_XU_LY' | 'HOAN_THANH';

export interface MaintenanceRecord extends RowDataPacket {
  id: string;
  room_id: string;
  tenant_id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  status: MaintenanceStatus;
  cost: number | string;
  created_at: Date;
  room_number: string;
  tenant_name: string;
}

export interface MaintenanceRoomRecord extends RowDataPacket {
  id: string;
  room_number: string;
}

export interface CreateMaintenanceInput {
  room_id: string;
  title: string;
  description: string;
  image_url?: string;
}

export interface UpdateMaintenanceInput {
  status?: MaintenanceStatus;
  cost?: number;
}


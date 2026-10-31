export interface UtilityItem {
  room_id: string;
  room_number: string;
  tenant_name: string | null;
  reading_id: string | null;
  old_electricity_kwh: number;
  new_electricity_kwh: number | null;
  old_water_m3: number;
  new_water_m3: number | null;
  recorded_date: string | null; // yyyy-mm-dd
  current_status: 'CHUA_NHAP' | 'DA_NHAP' | 'DA_CO_HOA_DON';
}

export interface SaveUtilityDto {
  room_id: string;
  billing_month: number;
  billing_year: number;
  new_electricity_kwh: number;
  new_water_m3: number;
  recorded_date?: string | null;
  // chỉ dùng khi phòng chưa có kỳ trước
  old_electricity_kwh?: number;
  old_water_m3?: number;
}
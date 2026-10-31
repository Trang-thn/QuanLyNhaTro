export async function saveUtilityReading(data: {
  room_id: number;
  billing_month: number;
  billing_year: number;
  old_electricity_kwh: number;
  new_electricity_kwh: number;
  old_water_m3: number;
  new_water_m3: number;
  recorded_date: string;
}) {
  const response = await fetch('/api/v1/utilities', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Lỗi khi lưu chỉ số điện nước');
  return result;
}

export async function updateUtilityReading(
  readingId: number,
  data: { new_electricity_kwh: number; new_water_m3: number; recorded_date: string }
) {
  const response = await fetch(`/api/v1/utilities/${readingId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Lỗi khi cập nhật chỉ số điện nước');
  return result;
}

export async function fetchUtilityReadings(params: {
  month: number;
  year: number;
  search?: string;
}) {
  const query = new URLSearchParams({
    month: String(params.month),
    year: String(params.year),
    search: params.search || '',
  });
  const response = await fetch(`/api/v1/utilities?${query}`);
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Lỗi khi tải chỉ số điện nước');
  return result.data;
}
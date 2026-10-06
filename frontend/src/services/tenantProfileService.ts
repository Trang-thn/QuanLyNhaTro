import { apiRequest } from './api'
import type { TenantProfileData } from '../types/tenantProfile'

const mockTenantProfileData: TenantProfileData = {
  fullName: 'Nguyễn Văn A',
  profileFields: [
    { label: 'Họ và tên', value: 'Nguyễn Văn A' },
    { label: 'Số CCCD/CMND', value: '012345678901 (Ngày cấp: 10/05/2021 · Nơi cấp: Cục CSQLHC)' },
    { label: 'Số điện thoại', value: '0987654321' },
    { label: 'Địa chỉ Email', value: 'nguyenvana@gmail.com' },
    { label: 'Địa chỉ thường trú', value: 'Số 123, Đường ABC, Quận XYZ, TP. Hà Nội', wide: true },
    { label: 'Liên hệ khẩn cấp', value: 'Bà Nguyễn Thị B (Mẹ · 0912345678)' },
  ],
  room: {
    heading: 'Phòng P101 (Tầng 1 · Loại: VIP)',
    term: 'Thời hạn: 01/01/2026 · 31/12/2026 (Còn 6 tháng)',
    costDetails: [
      { label: 'Giá thuê', value: '3.500.000đ/tháng' },
      { label: 'Tiền đặt cọc', value: '3.500.000đ' },
      { label: 'Ngày chốt hóa đơn', value: 'Ngày 01 hàng tháng' },
    ],
    amenities: ['WiFi', 'Điều hòa', 'Tủ lạnh', 'Bình nóng lạnh', 'Máy giặt'],
    members: [
      { name: 'Nguyễn Văn A', phone: '0987654321', role: 'Trưởng phòng', date: '01/01/2026', isLead: true },
      { name: 'Lê Văn Nam', phone: '0912123123', role: 'Thành viên', date: '15/01/2026', isLead: false },
    ],
  },
}

export const initialTenantProfileData = mockTenantProfileData

export async function getTenantProfileData(): Promise<TenantProfileData> {
  try {
    return await apiRequest<TenantProfileData>('/tenant/profile')
  } catch {
    return mockTenantProfileData
  }
}

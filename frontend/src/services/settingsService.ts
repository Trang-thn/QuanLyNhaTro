import { apiRequest } from './api'
import type { SettingsData, SettingsRole } from '../types/settings'

const mockSettings: Record<SettingsRole, SettingsData> = {
  admin: {
    avatarInitial: 'A',
    displayName: 'Admin',
    email: 'admin@nhatropro.vn',
    roleLabel: 'Chủ trọ',
    profileFields: [
      { label: 'Họ và tên', value: 'Nguyễn Văn A' },
      { label: 'Số CCCD', value: '012345678901' },
      { label: 'Số điện thoại', value: '0987654321' },
      { label: 'Email', value: 'admin@nhatropro.vn' },
      { label: 'Địa chỉ', value: 'Số 123, Đường ABC, Quận XYZ, TP. Hà Nội', colSpan: 2 },
    ],
    editProfileFields: {
      fullName: 'Nguyễn Văn A', identityNumber: '012345678901', phone: '0987654321',
      email: 'nguyenvana@gmail.com', address: 'Số 123, Đường ABC, Quận XYZ, TP. Hà Nội',
      emergencyPhone: '0912345678', emergencyRelationship: 'Mẹ',
    },
    systemInfo: [
      { label: 'Phiên bản', value: 'NhàTrọ Pro v2.0.0' },
      { label: 'Môi trường', value: 'Production' },
      { label: 'Cập nhật lần cuối', value: '01/10/2026' },
    ],
  },
  tenant: {
    avatarInitial: 'N',
    displayName: 'Nguyễn Văn A',
    email: 'nguyenvana@gmail.com',
    roleLabel: 'Khách thuê',
    profileFields: [
      { label: 'Họ và tên', value: 'Nguyễn Văn A' },
      { label: 'Số CCCD', value: '012345678901' },
      { label: 'Số điện thoại', value: '0987654321' },
      { label: 'Email', value: 'nguyenvana@gmail.com' },
      { label: 'Địa chỉ', value: 'Số 123, Đường ABC, Quận XYZ, TP. Hà Nội', colSpan: 2 },
    ],
    editProfileFields: {
      fullName: 'Nguyễn Văn A', identityNumber: '012345678901', phone: '0987654321',
      email: 'nguyenvana@gmail.com', address: 'Số 123, Đường ABC, Quận XYZ, TP. Hà Nội',
      emergencyPhone: '0912345678', emergencyRelationship: 'Mẹ',
    },
    systemInfo: [
      { label: 'Phiên bản', value: 'NhàTrọ Pro v2.0.0' },
      { label: 'Môi trường', value: 'Production' },
      { label: 'Cập nhật lần cuối', value: '01/10/2026' },
    ],
  },
}

export function getInitialSettingsData(role: SettingsRole): SettingsData {
  return mockSettings[role]
}

export async function getSettingsData(role: SettingsRole): Promise<SettingsData> {
  try {
    return await apiRequest<SettingsData>(`/${role}/settings`)
  } catch {
    return mockSettings[role]
  }
}

import { apiRequest } from './api'
import type { SettingsData, SettingsRole } from '../types/settings'

interface ProfileResponse {
  user: { fullName: string; email: string | null; phoneNumber: string | null; role: 'ADMIN' | 'TENANT' }
  tenant: null | { identityCardNumber: string; permanentAddress: string | null; emergencyContact: string | null }
}

export async function getSettingsData(role: SettingsRole): Promise<SettingsData> {
  const profile = await apiRequest<ProfileResponse>(role === 'admin' ? '/admin/settings' : '/tenant/settings')
  const tenant = profile.tenant
  const fullName = profile.user.fullName
  const email = profile.user.email ?? ''
  const phone = profile.user.phoneNumber ?? ''
  const address = tenant?.permanentAddress ?? ''
  const emergencyPhone = tenant?.emergencyContact ?? ''

  return {
    avatarInitial: fullName.slice(0, 1).toUpperCase(),
    displayName: fullName,
    email,
    roleLabel: profile.user.role === 'ADMIN' ? 'Chủ trọ' : 'Khách thuê',
    profileFields: [
      { label: 'Họ và tên', value: fullName },
      { label: 'Số CCCD', value: tenant?.identityCardNumber ?? '-' },
      { label: 'Số điện thoại', value: phone },
      { label: 'Email', value: email },
      { label: 'Địa chỉ', value: address || '-', colSpan: 2 },
    ],
    editProfileFields: {
      fullName,
      identityNumber: tenant?.identityCardNumber ?? '',
      phone,
      email,
      address,
      emergencyPhone,
      emergencyRelationship: '',
    },
    systemInfo: [],
  }
}

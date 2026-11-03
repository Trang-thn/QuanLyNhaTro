export type SettingsRole = 'admin' | 'tenant'

export interface SettingsData {
  avatarInitial: string
  displayName: string
  email: string
  roleLabel: string
  profileFields: Array<{ label: string; value: string; colSpan?: number }>
  editProfileFields: {
    fullName: string
    identityNumber: string
    phone: string
    email: string
    address: string
    emergencyPhone: string
    emergencyRelationship: string
  }
  systemInfo: Array<{ label: string; value: string }>
}

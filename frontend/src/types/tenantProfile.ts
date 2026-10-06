export interface TenantProfileField {
  label: string
  value: string
  wide?: boolean
}

export interface TenantRoomMember {
  name: string
  phone: string
  role: string
  date: string
  isLead: boolean
}

export interface TenantProfileData {
  fullName: string
  profileFields: TenantProfileField[]
  room: {
    heading: string
    term: string
    costDetails: Array<{ label: string; value: string }>
    amenities: string[]
    members: TenantRoomMember[]
  }
}

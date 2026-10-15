import { apiRequest } from './api'
import type { TenantProfileData } from '../types/tenantProfile'

interface TenantProfileResponse {
  user: { fullName: string; email: string | null; phoneNumber: string | null }
  tenant: null | {
    identityCardNumber: string
    issueDate: string | null
    issuePlace: string | null
    permanentAddress: string | null
    emergencyContact: string | null
  }
  contract: null | {
    startDate: string
    endDate: string
    rentalPrice: string
    depositAmount: string
    status: string
    billingCycleDay: number | null
  }
  room: null | { roomNumber: string; floor: number | null; roomType: null | { name: string } }
  amenities: string[]
  members: Array<{ fullName: string | null; phoneNumber: string | null; isRepresentative: boolean }>
}

export async function getTenantProfileData(): Promise<TenantProfileData> {
  const profile = await apiRequest<TenantProfileResponse>('/tenant/profile')
  const tenant = profile.tenant
  const contract = profile.contract
  const room = profile.room

  return {
    fullName: profile.user.fullName,
    profileFields: [
      { label: 'Họ và tên', value: profile.user.fullName },
      { label: 'Số CCCD/CMND', value: tenant?.identityCardNumber ?? 'Chưa liên kết' },
      { label: 'Số điện thoại', value: profile.user.phoneNumber ?? '-' },
      { label: 'Địa chỉ Email', value: profile.user.email ?? '-' },
      { label: 'Địa chỉ thường trú', value: tenant?.permanentAddress ?? '-', wide: true },
      { label: 'Liên hệ khẩn cấp', value: tenant?.emergencyContact ?? '-' },
    ],
    room: {
      heading: room ? `Phòng ${room.roomNumber} (Tầng ${room.floor ?? '-'} · Loại: ${room.roomType?.name ?? '-'})` : 'Chưa có thông tin phòng thuê',
      term: contract ? `Thời hạn: ${contract.startDate} · ${contract.endDate}` : 'Chưa liên kết hợp đồng',
      costDetails: contract ? [
        { label: 'Giá thuê', value: `${Number(contract.rentalPrice).toLocaleString('vi-VN')}đ/tháng` },
        { label: 'Tiền đặt cọc', value: `${Number(contract.depositAmount).toLocaleString('vi-VN')}đ` },
        { label: 'Ngày chốt hóa đơn', value: `Ngày ${contract.billingCycleDay ?? '-'} hàng tháng` },
      ] : [],
      amenities: profile.amenities,
      members: profile.members.map((member) => ({
        name: member.fullName ?? '-',
        phone: member.phoneNumber ?? '-',
        role: member.isRepresentative ? 'Trưởng phòng' : 'Thành viên',
        date: '-',
        isLead: member.isRepresentative,
      })),
    },
  }
}

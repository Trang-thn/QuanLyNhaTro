import type {TenantNotification} from "../../types/notifications"
export const tenantNotificationSeed: TenantNotification[] = [
  {
    id: 'tenant-notification-1',
    title: 'Thông báo thanh toán tiền phòng tháng 10',
    preview: 'Hóa đơn tháng 10 đã được cập nhật. Vui lòng thanh toán trước ngày 10/10/2026.',
    content: [
      'Kính gửi Nguyễn Văn A,',
      'Hóa đơn tiền phòng tháng 10/2026 của Phòng P101 đã được cập nhật trên hệ thống, bao gồm tiền phòng, điện, nước và internet.',
      'Nếu có thắc mắc về số tiền hoặc thông tin hóa đơn, vui lòng liên hệ Chủ trọ để được hỗ trợ.',
      'Trân trọng, Chủ trọ.',
    ],
    deadline: 'Hạn thanh toán: 10/10/2026',
    createdAt: '05/10/2026 · 08:00',
    isRead: false,
    icon: '/assets/tenant-notification-invoice.svg',
  },
  {
    id: 'tenant-notification-2',
    title: 'Thông báo bảo trì hệ thống nước',
    preview: 'Tạm ngưng cấp nước từ 09:00 đến 11:00 ngày 07/10/2026 để bảo trì.',
    content: ['Kính gửi quý khách thuê,', 'Hệ thống nước sẽ tạm ngưng hoạt động từ 09:00 đến 11:00 ngày 07/10/2026 để thực hiện bảo trì định kỳ.', 'Vui lòng chủ động dự trữ nước trong thời gian trên.'],
    createdAt: '04/10/2026 · 16:30',
    isRead: false,
    icon: '/assets/tenant-notification-water.svg',
  },
  {
    id: 'tenant-notification-3',
    title: 'Thông báo kiểm tra phòng',
    preview: 'Chủ trọ sẽ kiểm tra thiết bị và an toàn điện tại phòng P101 vào ngày 08/10/2026.',
    content: ['Kính gửi Nguyễn Văn A,', 'Chủ trọ sẽ kiểm tra thiết bị và an toàn điện tại phòng P101 vào ngày 08/10/2026.', 'Cảm ơn bạn đã phối hợp.'],
    createdAt: '02/10/2026 · 09:00',
    isRead: true,
    icon: '/assets/tenant-notification-room.svg',
  },
]

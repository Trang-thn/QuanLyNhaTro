export type RoomStatus = 'TRONG' | 'DANG_THUE' | 'BAO_TRI'
export type ContractStatus = 'HIEU_LUC' | 'KHONG_HIEU_LUC' | 'DA_THANH_LY'
export type InvoiceStatus = 'CHUA_THANH_TOAN' | 'THANH_TOAN_MOT_PHAN' | 'DA_THANH_TOAN'
export type MaintenanceStatus = 'TIEP_NHAN' | 'DANG_XU_LY' | 'HOAN_THANH'

export const roomTypes = [
  { id: '1', name: 'Phòng đơn', base_price: 2000000, area_sqm: 15, description: 'Phòng đơn tiêu chuẩn' },
  { id: '2', name: 'Phòng đôi', base_price: 3000000, area_sqm: 20, description: 'Phòng cho 2 người' },
  { id: '3', name: 'Studio', base_price: 4500000, area_sqm: 28, description: 'Phòng studio đầy đủ tiện nghi' },
  { id: '4', name: 'VIP', base_price: 6500000, area_sqm: 35, description: 'Phòng cao cấp' },
]

export const amenities = [
  { id: '1', name: 'Điều hòa' },
  { id: '2', name: 'Nóng lạnh' },
  { id: '3', name: 'Wifi' },
  { id: '4', name: 'Gác xép' },
  { id: '5', name: 'Tủ lạnh' },
  { id: '6', name: 'Máy giặt' },
  { id: '7', name: 'Ban công' },
  { id: '8', name: 'Bếp riêng' },
]

export const rooms = [
  { id: '1',  room_number: 'P101', room_type_id: '1', status: 'DANG_THUE' as RoomStatus, floor: 1, amenity_ids: ['1','2','3'] },
  { id: '2',  room_number: 'P102', room_type_id: '1', status: 'DANG_THUE' as RoomStatus, floor: 1, amenity_ids: ['1','3'] },
  { id: '3',  room_number: 'P103', room_type_id: '2', status: 'TRONG'     as RoomStatus, floor: 1, amenity_ids: ['2','3','4'] },
  { id: '4',  room_number: 'P104', room_type_id: '2', status: 'DANG_THUE' as RoomStatus, floor: 1, amenity_ids: ['1','2','3','5'] },
  { id: '5',  room_number: 'P105', room_type_id: '1', status: 'BAO_TRI'   as RoomStatus, floor: 1, amenity_ids: ['2','3'] },
  { id: '6',  room_number: 'P201', room_type_id: '3', status: 'DANG_THUE' as RoomStatus, floor: 2, amenity_ids: ['1','2','3','5','8'] },
  { id: '7',  room_number: 'P202', room_type_id: '3', status: 'DANG_THUE' as RoomStatus, floor: 2, amenity_ids: ['1','2','3'] },
  { id: '8',  room_number: 'P203', room_type_id: '2', status: 'TRONG'     as RoomStatus, floor: 2, amenity_ids: ['1','3'] },
  { id: '9',  room_number: 'P204', room_type_id: '3', status: 'DANG_THUE' as RoomStatus, floor: 2, amenity_ids: ['1','2','3','7'] },
  { id: '10', room_number: 'P205', room_type_id: '2', status: 'DANG_THUE' as RoomStatus, floor: 2, amenity_ids: ['1','2','3','4'] },
  { id: '11', room_number: 'P301', room_type_id: '4', status: 'DANG_THUE' as RoomStatus, floor: 3, amenity_ids: ['1','2','3','5','6','7','8'] },
  { id: '12', room_number: 'P302', room_type_id: '4', status: 'DANG_THUE' as RoomStatus, floor: 3, amenity_ids: ['1','2','3','5','7','8'] },
  { id: '13', room_number: 'P303', room_type_id: '3', status: 'TRONG'     as RoomStatus, floor: 3, amenity_ids: ['1','2','3','8'] },
  { id: '14', room_number: 'P304', room_type_id: '4', status: 'DANG_THUE' as RoomStatus, floor: 3, amenity_ids: ['1','2','3','5','6','7','8'] },
  { id: '15', room_number: 'P305', room_type_id: '1', status: 'TRONG'     as RoomStatus, floor: 3, amenity_ids: ['2','3'] },
]

export const tenants = [
  { id: '1',  full_name: 'Nguyễn Văn An',    identity_card_number: '079201001234', issue_place: 'Hà Nội',      permanent_address: '12 Láng Hạ, Đống Đa, Hà Nội',         emergency_contact: '0901234567', phone: '0912345678', email: 'an.nguyen@gmail.com' },
  { id: '2',  full_name: 'Trần Thị Bảo',     identity_card_number: '079201002345', issue_place: 'TP.HCM',      permanent_address: '45 Nguyễn Huệ, Q1, TP.HCM',           emergency_contact: '0912345678', phone: '0923456789', email: 'bao.tran@gmail.com' },
  { id: '3',  full_name: 'Lê Minh Cường',    identity_card_number: '079201003456', issue_place: 'Đà Nẵng',     permanent_address: '78 Trần Phú, Hải Châu, Đà Nẵng',       emergency_contact: '0934567890', phone: '0934567890', email: 'cuong.le@gmail.com' },
  { id: '4',  full_name: 'Phạm Thị Dung',    identity_card_number: '079201004567', issue_place: 'Hà Nội',      permanent_address: '23 Kim Mã, Ba Đình, Hà Nội',           emergency_contact: '0945678901', phone: '0945678901', email: 'dung.pham@gmail.com' },
  { id: '5',  full_name: 'Hoàng Văn Em',     identity_card_number: '079201005678', issue_place: 'Nam Định',    permanent_address: '56 Trần Hưng Đạo, TP Nam Định',        emergency_contact: '0956789012', phone: '0956789012', email: 'em.hoang@gmail.com' },
  { id: '6',  full_name: 'Vũ Thị Phương',    identity_card_number: '079201006789', issue_place: 'Hải Phòng',   permanent_address: '89 Lạch Tray, Ngô Quyền, HP',          emergency_contact: '0967890123', phone: '0967890123', email: 'phuong.vu@gmail.com' },
  { id: '7',  full_name: 'Đặng Văn Giang',   identity_card_number: '079201007890', issue_place: 'Thái Bình',   permanent_address: '34 Lý Thường Kiệt, Thái Bình',         emergency_contact: '0978901234', phone: '0978901234', email: 'giang.dang@gmail.com' },
  { id: '8',  full_name: 'Ngô Thị Hoa',      identity_card_number: '079201008901', issue_place: 'Hà Nội',      permanent_address: '67 Giải Phóng, Hai Bà Trưng, HN',      emergency_contact: '0989012345', phone: '0989012345', email: 'hoa.ngo@gmail.com' },
  { id: '9',  full_name: 'Bùi Văn Hùng',     identity_card_number: '079201009012', issue_place: 'Hưng Yên',    permanent_address: '90 Phố Hiến, Hưng Yên',                emergency_contact: '0901234560', phone: '0901234560', email: 'hung.bui@gmail.com' },
  { id: '10', full_name: 'Đinh Thị Ích',     identity_card_number: '079201010123', issue_place: 'Nghệ An',     permanent_address: '12 Trần Phú, Vinh, Nghệ An',           emergency_contact: '0912345601', phone: '0912345601', email: 'ich.dinh@gmail.com' },
  { id: '11', full_name: 'Trịnh Văn Khánh',  identity_card_number: '079201011234', issue_place: 'Thanh Hóa',   permanent_address: '45 Hàm Nghi, TP Thanh Hóa',           emergency_contact: '0923456012', phone: '0923456012', email: 'khanh.trinh@gmail.com' },
  { id: '12', full_name: 'Lý Thị Lan',       identity_card_number: '079201012345', issue_place: 'Hà Nội',      permanent_address: '78 Xuân Thủy, Cầu Giấy, HN',          emergency_contact: '0934560123', phone: '0934560123', email: 'lan.ly@gmail.com' },
]

export const contracts = [
  { id: '1',  contract_number: 'HD-2026-001', room_id: '1',  representative_tenant_id: '1',  start_date: '2026-01-01', end_date: '2026-12-31', rental_price: 2000000,  deposit_amount: 4000000,  status: 'HIEU_LUC'     as ContractStatus, billing_cycle_day: 5 },
  { id: '2',  contract_number: 'HD-2026-002', room_id: '2',  representative_tenant_id: '2',  start_date: '2026-02-01', end_date: '2027-01-31', rental_price: 2000000,  deposit_amount: 4000000,  status: 'HIEU_LUC'     as ContractStatus, billing_cycle_day: 5 },
  { id: '3',  contract_number: 'HD-2026-003', room_id: '4',  representative_tenant_id: '3',  start_date: '2026-03-01', end_date: '2027-02-28', rental_price: 3000000,  deposit_amount: 6000000,  status: 'HIEU_LUC'     as ContractStatus, billing_cycle_day: 5 },
  { id: '4',  contract_number: 'HD-2026-004', room_id: '6',  representative_tenant_id: '4',  start_date: '2026-01-15', end_date: '2027-01-14', rental_price: 4500000,  deposit_amount: 9000000,  status: 'HIEU_LUC'     as ContractStatus, billing_cycle_day: 10 },
  { id: '5',  contract_number: 'HD-2026-005', room_id: '7',  representative_tenant_id: '5',  start_date: '2026-04-01', end_date: '2027-03-31', rental_price: 4500000,  deposit_amount: 9000000,  status: 'HIEU_LUC'     as ContractStatus, billing_cycle_day: 5 },
  { id: '6',  contract_number: 'HD-2026-006', room_id: '9',  representative_tenant_id: '6',  start_date: '2026-02-15', end_date: '2027-02-14', rental_price: 4500000,  deposit_amount: 9000000,  status: 'HIEU_LUC'     as ContractStatus, billing_cycle_day: 15 },
  { id: '7',  contract_number: 'HD-2026-007', room_id: '10', representative_tenant_id: '7',  start_date: '2026-05-01', end_date: '2027-04-30', rental_price: 3000000,  deposit_amount: 6000000,  status: 'HIEU_LUC'     as ContractStatus, billing_cycle_day: 5 },
  { id: '8',  contract_number: 'HD-2026-008', room_id: '11', representative_tenant_id: '8',  start_date: '2026-01-01', end_date: '2026-12-31', rental_price: 6500000,  deposit_amount: 13000000, status: 'HIEU_LUC'     as ContractStatus, billing_cycle_day: 1 },
  { id: '9',  contract_number: 'HD-2026-009', room_id: '12', representative_tenant_id: '9',  start_date: '2026-03-15', end_date: '2027-03-14', rental_price: 6500000,  deposit_amount: 13000000, status: 'HIEU_LUC'     as ContractStatus, billing_cycle_day: 15 },
  { id: '10', contract_number: 'HD-2026-010', room_id: '14', representative_tenant_id: '10', start_date: '2026-06-01', end_date: '2027-05-31', rental_price: 6500000,  deposit_amount: 13000000, status: 'HIEU_LUC'     as ContractStatus, billing_cycle_day: 5 },
  { id: '11', contract_number: 'HD-2025-018', room_id: '4',  representative_tenant_id: '11', start_date: '2025-07-01', end_date: '2026-04-30', rental_price: 2800000,  deposit_amount: 5600000,  status: 'DA_THANH_LY'  as ContractStatus, billing_cycle_day: 5 },
  { id: '12', contract_number: 'HD-2026-011', room_id: '5',  representative_tenant_id: '12', start_date: '2026-07-01', end_date: '2027-06-30', rental_price: 2000000,  deposit_amount: 4000000,  status: 'KHONG_HIEU_LUC' as ContractStatus, billing_cycle_day: 5 },
]

export const invoices = [
  { id: 'INV001', invoice_code: 'HD2026-P101-09', contract_id: '1',  room_id: '1',  billing_month: 9, billing_year: 2026, room_price: 2000000, electricity_cost: 320000, water_cost: 80000,  other_service_cost: 50000, total_amount: 2450000, paid_amount: 2450000, status: 'DA_THANH_TOAN'      as InvoiceStatus, due_date: '2026-09-10' },
  { id: 'INV002', invoice_code: 'HD2026-P102-09', contract_id: '2',  room_id: '2',  billing_month: 9, billing_year: 2026, room_price: 2000000, electricity_cost: 280000, water_cost: 70000,  other_service_cost: 50000, total_amount: 2400000, paid_amount: 1200000, status: 'THANH_TOAN_MOT_PHAN' as InvoiceStatus, due_date: '2026-09-10' },
  { id: 'INV003', invoice_code: 'HD2026-P104-09', contract_id: '3',  room_id: '4',  billing_month: 9, billing_year: 2026, room_price: 3000000, electricity_cost: 410000, water_cost: 95000,  other_service_cost: 50000, total_amount: 3555000, paid_amount: 0,       status: 'CHUA_THANH_TOAN'   as InvoiceStatus, due_date: '2026-09-10' },
  { id: 'INV004', invoice_code: 'HD2026-P201-09', contract_id: '4',  room_id: '6',  billing_month: 9, billing_year: 2026, room_price: 4500000, electricity_cost: 520000, water_cost: 120000, other_service_cost: 80000, total_amount: 5220000, paid_amount: 5220000, status: 'DA_THANH_TOAN'      as InvoiceStatus, due_date: '2026-09-15' },
  { id: 'INV005', invoice_code: 'HD2026-P202-09', contract_id: '5',  room_id: '7',  billing_month: 9, billing_year: 2026, room_price: 4500000, electricity_cost: 490000, water_cost: 110000, other_service_cost: 80000, total_amount: 5180000, paid_amount: 0,       status: 'CHUA_THANH_TOAN'   as InvoiceStatus, due_date: '2026-09-10' },
  { id: 'INV006', invoice_code: 'HD2026-P204-09', contract_id: '6',  room_id: '9',  billing_month: 9, billing_year: 2026, room_price: 4500000, electricity_cost: 560000, water_cost: 130000, other_service_cost: 80000, total_amount: 5270000, paid_amount: 5270000, status: 'DA_THANH_TOAN'      as InvoiceStatus, due_date: '2026-09-20' },
  { id: 'INV007', invoice_code: 'HD2026-P205-09', contract_id: '7',  room_id: '10', billing_month: 9, billing_year: 2026, room_price: 3000000, electricity_cost: 380000, water_cost: 90000,  other_service_cost: 50000, total_amount: 3520000, paid_amount: 3520000, status: 'DA_THANH_TOAN'      as InvoiceStatus, due_date: '2026-09-10' },
  { id: 'INV008', invoice_code: 'HD2026-P301-09', contract_id: '8',  room_id: '11', billing_month: 9, billing_year: 2026, room_price: 6500000, electricity_cost: 680000, water_cost: 150000, other_service_cost: 120000, total_amount: 7450000, paid_amount: 7450000, status: 'DA_THANH_TOAN'     as InvoiceStatus, due_date: '2026-09-05' },
  { id: 'INV009', invoice_code: 'HD2026-P302-09', contract_id: '9',  room_id: '12', billing_month: 9, billing_year: 2026, room_price: 6500000, electricity_cost: 720000, water_cost: 160000, other_service_cost: 120000, total_amount: 7500000, paid_amount: 4000000, status: 'THANH_TOAN_MOT_PHAN' as InvoiceStatus, due_date: '2026-09-20' },
  { id: 'INV010', invoice_code: 'HD2026-P304-09', contract_id: '10', room_id: '14', billing_month: 9, billing_year: 2026, room_price: 6500000, electricity_cost: 700000, water_cost: 155000, other_service_cost: 120000, total_amount: 7475000, paid_amount: 0,       status: 'CHUA_THANH_TOAN'  as InvoiceStatus, due_date: '2026-09-10' },
  // August invoices
  { id: 'INV011', invoice_code: 'HD2026-P101-08', contract_id: '1',  room_id: '1',  billing_month: 8, billing_year: 2026, room_price: 2000000, electricity_cost: 340000, water_cost: 85000,  other_service_cost: 50000, total_amount: 2475000, paid_amount: 2475000, status: 'DA_THANH_TOAN'      as InvoiceStatus, due_date: '2026-08-10' },
  { id: 'INV012', invoice_code: 'HD2026-P201-08', contract_id: '4',  room_id: '6',  billing_month: 8, billing_year: 2026, room_price: 4500000, electricity_cost: 540000, water_cost: 125000, other_service_cost: 80000, total_amount: 5245000, paid_amount: 5245000, status: 'DA_THANH_TOAN'      as InvoiceStatus, due_date: '2026-08-15' },
  { id: 'INV013', invoice_code: 'HD2026-P301-08', contract_id: '8',  room_id: '11', billing_month: 8, billing_year: 2026, room_price: 6500000, electricity_cost: 660000, water_cost: 145000, other_service_cost: 120000, total_amount: 7425000, paid_amount: 7425000, status: 'DA_THANH_TOAN'     as InvoiceStatus, due_date: '2026-08-05' },
]

export const maintenanceRequests = [
  { id: '1', room_id: '5',  tenant_id: '1',  title: 'Điều hòa không hoạt động', description: 'Điều hòa phòng P105 bị hỏng hoàn toàn, không khởi động được. Nhiệt độ phòng rất nóng.', status: 'DANG_XU_LY' as MaintenanceStatus, cost: 850000,  created_at: '2026-09-15T08:30:00' },
  { id: '2', room_id: '1',  tenant_id: '1',  title: 'Bóng đèn phòng ngủ cháy', description: 'Bóng đèn LED trần phòng ngủ bị cháy, cần thay mới.', status: 'HOAN_THANH'  as MaintenanceStatus, cost: 120000,  created_at: '2026-09-10T14:00:00' },
  { id: '3', room_id: '9',  tenant_id: '6',  title: 'Vòi nước nhà tắm bị rò rỉ', description: 'Vòi nước nóng lạnh nhà tắm bị rò rỉ ở khớp nối, nước chảy ra nền nhà.', status: 'TIEP_NHAN'   as MaintenanceStatus, cost: 0,       created_at: '2026-09-22T09:15:00' },
  { id: '4', room_id: '12', tenant_id: '9',  title: 'Khóa cửa chính bị kẹt', description: 'Khóa cửa chính bị kẹt, khó mở từ phía ngoài. Cần tra dầu hoặc thay khóa mới.', status: 'HOAN_THANH'  as MaintenanceStatus, cost: 200000,  created_at: '2026-09-05T11:20:00' },
  { id: '5', room_id: '7',  tenant_id: '5',  title: 'Máy bơm nước tầng 2 yếu', description: 'Áp lực nước tầng 2 rất yếu vào buổi sáng, không đủ để tắm. Có thể bơm nước bị hỏng.', status: 'DANG_XU_LY' as MaintenanceStatus, cost: 1500000, created_at: '2026-09-20T07:45:00' },
]

export const notifications = [
  { id: '1', title: 'Thông báo tăng giá điện tháng 10/2026', content: 'Từ tháng 10/2026, giá điện sẽ áp dụng theo mức mới của EVN: 3.500đ/kWh. Đề nghị các bạn thuê phòng lưu ý.', receiver_id: null, is_read: false, created_at: '2026-09-25T10:00:00' },
  { id: '2', title: 'Lịch cắt nước định kỳ', content: 'Ngày 28/09/2026 (thứ Hai), hệ thống nước sinh hoạt sẽ bị cắt từ 08:00 - 12:00 để bảo trì. Đề nghị các bạn chuẩn bị nước dự phòng.', receiver_id: null, is_read: false, created_at: '2026-09-24T14:30:00' },
  { id: '3', title: 'Nhắc nhở nộp tiền phòng tháng 9', content: 'Kính gửi anh/chị, hạn nộp tiền phòng tháng 9/2026 là ngày 10/09. Vui lòng nộp đúng hạn để tránh phí trễ hạn.', receiver_id: '3', is_read: false, created_at: '2026-09-08T09:00:00' },
  { id: '4', title: 'Hóa đơn tháng 9 đã được tạo', content: 'Hóa đơn tháng 9/2026 đã được hệ thống tạo tự động. Vui lòng kiểm tra và thanh toán trước hạn.', receiver_id: null, is_read: true, created_at: '2026-09-01T07:00:00' },
  { id: '5', title: 'Quy định giữ xe tại dãy trọ', content: 'Thông báo: Kể từ 01/10/2026, xe máy phải để đúng vị trí quy định. Phí giữ xe máy: 100.000đ/tháng. Ô tô: không có chỗ đậu.', receiver_id: null, is_read: true, created_at: '2026-09-20T16:00:00' },
  { id: '6', title: 'Cập nhật trạng thái sự cố P105', content: 'Sự cố điều hòa phòng P105 đang được xử lý. Kỹ thuật viên sẽ đến sửa vào ngày 28/09/2026 buổi sáng.', receiver_id: '1', is_read: true, created_at: '2026-09-25T15:00:00' },
]

export const revenueData = [
  { month: 'T1', revenue: 38500000 },
  { month: 'T2', revenue: 41200000 },
  { month: 'T3', revenue: 43800000 },
  { month: 'T4', revenue: 45500000 },
  { month: 'T5', revenue: 44200000 },
  { month: 'T6', revenue: 47800000 },
  { month: 'T7', revenue: 49200000 },
  { month: 'T8', revenue: 51500000 },
  { month: 'T9', revenue: 43060000 },
]

export const formatVND = (amount: number) =>
  new Intl.NumberFormat('vi-VN').format(amount) + 'đ'

export const formatDate = (dateStr: string) => {
  const [y, m, d] = dateStr.split('T')[0].split('-')
  return `${d}/${m}/${y}`
}

export const getRoomTypeName = (id: string) => roomTypes.find(t => t.id === id)?.name ?? '-'
export const getTenantName = (id: string) => tenants.find(t => t.id === id)?.full_name ?? '-'
export const getRoomNumber = (id: string) => rooms.find(r => r.id === id)?.room_number ?? '-'
export const getAmenityName = (id: string) => amenities.find(a => a.id === id)?.name ?? '-'

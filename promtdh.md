# THIẾT KẾ UI/UX – MODULE KHÁCH THUÊ & HỢP ĐỒNG

## 1. ROLE – VAI TRÒ

Bạn là một chuyên gia UI/UX Designer và Product Designer chuyên thiết kế hệ thống quản lý nhà trọ dạng SaaS.

Hãy thiết kế và hoàn thiện giao diện UI/UX cho phần nghiệp vụ KHÁCH THUÊ & HỢP ĐỒNG của hệ thống quản lý nhà trọ.

Mục tiêu:

- Giao diện hiện đại
- Dễ sử dụng
- Chuyên nghiệp
- Đồng bộ với các màn hình hiện có
- Frontend Developer có thể triển khai trực tiếp từ Figma

KHÔNG chỉ thiết kế màn hình danh sách.

Hãy thiết kế đầy đủ:

- Main Screen
- Form
- Modal / Popup
- Confirmation Modal
- Detail Modal
- Warning Modal
- Error Modal
- Empty State
- Success Toast
- Error Toast
- Prototype Interaction

==================================================

## 2. PHẠM VI THIẾT KẾ

==================================================

Chỉ thiết kế 2 nhóm nghiệp vụ:

1. KHÁCH THUÊ
2. HỢP ĐỒNG

Trong module Hợp đồng có thêm:

3. THÀNH VIÊN Ở CÙNG
4. LỊCH SỬ THUÊ

Sidebar giữ nguyên:

- Tổng quan
- Phòng trọ
- Khách thuê
- Hợp đồng
- Hóa đơn
- Điện nước
- Sự cố
- Thông báo
- Cài đặt

KHÔNG đổi tên menu.

==================================================

## 3. GIAO DIỆN HIỆN TẠI

==================================================

Đã có giao diện Dashboard tổng thể của hệ thống.

GIỮ NGUYÊN:

- Sidebar màu navy
- Header
- Card layout
- Khoảng cách
- Thiết kế dashboard
- Hệ thống icon

KHÔNG redesign toàn bộ hệ thống.

Visual Style:

- Corporate SaaS
- Modern
- Clean
- Professional
- Desktop First
- Dashboard Analytics

==================================================

## 4. DESIGN SYSTEM

==================================================

Màu chủ đạo:

Navy:
#172B4D

Orange:
#F59E0B

Background:
#FFF9F2

White:
#FFFFFF

Primary Text:
#1F2937

Secondary Text:
#6B7280

Border:
#E5E7EB

Typography:

Font:
Inter

Page Title:
24px SemiBold

Section Title:
18px SemiBold

Body:
14px

Caption:
12px

Border Radius:
8-12px

Spacing:
4 / 8 / 12 / 16 / 20 / 24 / 32

==================================================

## 5. MODULE 01 – KHÁCH THUÊ

==================================================

Tạo màn hình:

"Khách thuê"

Breadcrumb:

"Tổng quan / Khách thuê"

Header:

Tiêu đề:

"Danh sách khách thuê"

Bên phải:

- Ô tìm kiếm
- Bộ lọc trạng thái
- Button [+ Thêm khách thuê]

==================================================

## 6. DASHBOARD TỔNG QUAN KHÁCH THUÊ

==================================================

Hiển thị 4 Summary Cards

CARD 1

Tổng khách thuê

145

+12 trong tháng

CARD 2

Đang thuê

118

81%

CARD 3

Chờ ký hợp đồng

17

CARD 4

Đã rời đi

10

==================================================

## 7. BIỂU ĐỒ KHÁCH THUÊ

==================================================

Biểu đồ 1

Tiêu đề:

"Khách thuê mới theo tháng"

Bar Chart 6 tháng

Tháng 5: 12
Tháng 6: 18
Tháng 7: 15
Tháng 8: 22
Tháng 9: 19
Tháng 10: 25

Màu cam theo theme hệ thống

Biểu đồ 2

Tiêu đề:

"Trạng thái khách thuê"

Donut Chart

- Đang thuê
- Chờ hợp đồng
- Đã rời đi

==================================================

## 8. DANH SÁCH KHÁCH THUÊ

==================================================

Table:

- Mã khách thuê
- Họ tên
- CCCD
- Số điện thoại
- Phòng hiện tại
- Ngày vào ở
- Trạng thái
- Hành động

Trạng thái:

- Đang thuê
- Chờ hợp đồng
- Đã rời đi

Menu [...]

- Xem chi tiết
- Sửa thông tin
- Tạo hợp đồng
- Xem lịch sử thuê
- Xóa

==================================================

## 9. POPUP – THÊM KHÁCH THUÊ

==================================================

Modal

"Thêm khách thuê"

Thông tin:

Họ tên *

CCCD *

Ngày cấp

Nơi cấp

Số điện thoại

Liên hệ khẩn cấp

Địa chỉ thường trú

Buttons:

[ Hủy ]
[ Thêm khách thuê ]

Validation đầy đủ.

Success:

✓ Thêm khách thuê thành công

==================================================

## 10. POPUP – CHI TIẾT KHÁCH THUÊ

==================================================

Modal lớn

"Chi tiết khách thuê"

Thông tin cá nhân:

- Họ tên
- CCCD
- Ngày cấp
- Nơi cấp
- SĐT
- Liên hệ khẩn cấp
- Địa chỉ

Bên phải:

Thống kê nhanh

- Phòng hiện tại
- Hợp đồng đang hiệu lực
- Tổng số hợp đồng đã ký
- Tổng thời gian thuê

Phía dưới:

Timeline lịch sử thuê

P101
01/2024 → 06/2024

P205
07/2024 → Hiện tại

Buttons:

- Sửa thông tin
- Tạo hợp đồng

==================================================

## 11. MODULE 02 – HỢP ĐỒNG

==================================================

Màn hình:

"Hợp đồng"

Breadcrumb:

"Tổng quan / Hợp đồng"

==================================================

## 12. DASHBOARD TỔNG QUAN HỢP ĐỒNG

==================================================

4 Summary Cards

- Tổng hợp đồng
- Hiệu lực
- Sắp hết hạn
- Đã thanh lý

==================================================

## 13. BIỂU ĐỒ HỢP ĐỒNG

==================================================

Biểu đồ 1

"Hợp đồng theo tháng"

Bar Chart

Biểu đồ 2

"Cơ cấu trạng thái hợp đồng"

Donut Chart

- Hiệu lực
- Hết hạn
- Thanh lý

==================================================

## 14. DANH SÁCH HỢP ĐỒNG

==================================================

Table

- Mã hợp đồng
- Người đại diện
- Phòng
- Ngày bắt đầu
- Ngày kết thúc
- Giá thuê
- Tiền cọc
- Trạng thái
- Hành động

Menu [...]

- Xem chi tiết
- Chỉnh sửa
- Gia hạn
- Thanh lý

==================================================

## 15. POPUP – TẠO HỢP ĐỒNG

==================================================

Modal lớn dạng Stepper

STEP 1

Chọn phòng

- Phòng
- Loại phòng
- Giá niêm yết

STEP 2

Người đại diện

- Chọn khách thuê

STEP 3

Thông tin hợp đồng

- Ngày bắt đầu
- Ngày kết thúc
- Giá thuê
- Tiền cọc
- Ngày chốt tiền

STEP 4

Thành viên ở cùng

Table

- Họ tên
- CCCD
- Nút thêm / xóa

STEP 5

Xem trước hợp đồng

Summary Card

Buttons:

[ Quay lại ]
[ Tạo hợp đồng ]

Success:

✓ Tạo hợp đồng thành công

==================================================

## 16. POPUP – CHI TIẾT HỢP ĐỒNG

==================================================

Hiển thị:

- Mã hợp đồng
- Người đại diện
- Danh sách thành viên
- Phòng thuê
- Giá thuê
- Tiền cọc
- Ngày bắt đầu
- Ngày kết thúc
- Trạng thái

Buttons:

- Gia hạn
- Thanh lý
- In hợp đồng

==================================================

## 17. POPUP – THANH LÝ HỢP ĐỒNG

==================================================

Confirmation Modal

"Thanh lý hợp đồng?"

"Bạn có chắc chắn muốn thanh lý hợp đồng này không?"

Buttons:

[ Hủy ]
[ Xác nhận ]

Success:

✓ Đã thanh lý hợp đồng

==================================================

## 18. EMPTY STATE

==================================================

KHÁCH THUÊ

"Chưa có khách thuê"

"Thêm khách thuê đầu tiên để bắt đầu quản lý"

[ + Thêm khách thuê ]

HỢP ĐỒNG

"Chưa có hợp đồng"

"Tạo hợp đồng đầu tiên để bắt đầu"

[ + Tạo hợp đồng ]

==================================================

## 19. TOAST SYSTEM

==================================================

SUCCESS

✓ Thêm khách thuê thành công

✓ Cập nhật khách thuê thành công

✓ Tạo hợp đồng thành công

✓ Gia hạn hợp đồng thành công

✓ Thanh lý hợp đồng thành công

ERROR

× Không thể thực hiện thao tác

WARNING

⚠ Dữ liệu đang được sử dụng

==================================================

## 20. PROTOTYPE

==================================================

Khách thuê

→ Danh sách

→ + Thêm khách thuê

→ Open Overlay

→ Modal Thêm khách thuê

Danh sách khách thuê

→ Xem chi tiết

→ Detail Modal

Danh sách khách thuê

→ Tạo hợp đồng

→ Contract Stepper

Hợp đồng

→ Xem chi tiết

→ Contract Detail

Hợp đồng

→ Thanh lý

→ Confirmation Modal

→ Success Toast

==================================================

## 21. FRAME ORGANIZATION

==================================================

01 - KHÁCH THUÊ

TENANT - DASHBOARD
TENANT - LIST
TENANT - ADD
TENANT - EDIT
TENANT - DETAIL
TENANT - HISTORY

02 - HỢP ĐỒNG

CONTRACT - DASHBOARD
CONTRACT - LIST
CONTRACT - CREATE
CONTRACT - DETAIL
CONTRACT - TERMINATE
CONTRACT - EXTEND

03 - COMPONENTS & STATES

BUTTONS
INPUTS
BADGES
TABLES
MODALS
TOASTS
EMPTY STATES
CONFIRMATION
WARNING
ERROR

==================================================

## 22. QUY TẮC THIẾT KẾ QUAN TRỌNG

==================================================

1. Không redesign toàn bộ hệ thống.
2. Giữ nguyên Sidebar.
3. Giữ nguyên màu sắc hiện tại.
4. Thêm Dashboard có biểu đồ cho Khách thuê và Hợp đồng.
5. Các thao tác CRUD sử dụng Modal.
6. Xóa và Thanh lý phải có Confirmation Modal.
7. Thành công phải có Success Toast.
8. Lỗi nghiệp vụ phải có Warning Modal.
9. Sử dụng lại Components hiện có.
10. Thiết kế phải đủ rõ để Developer triển khai.

==================================================

## KẾT QUẢ CUỐI CÙNG

==================================================

Tạo bộ UI/UX hoàn chỉnh cho:

KHÁCH THUÊ
+
HỢP ĐỒNG
+
THÀNH VIÊN Ở CÙNG
+
LỊCH SỬ THUÊ

Bao gồm:

- Dashboard
- KPI Cards
- Charts
- Tables
- Forms
- Modal
- Confirmation
- Warning
- Error
- Empty State
- Toast
- Prototype

Quan trọng:

Giao diện mới phải giống 95-100% hệ thống đang có, giữ nguyên Sidebar màu xanh navy, Accent màu cam, Card trắng, phong cách Dashboard SaaS hiện đại và đồng bộ với màn hình Tổng quan của dự án.
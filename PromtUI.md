# THIẾT KẾ UI/UX – MODULE TÀI KHOẢN, TỰ ĐỘNG KHÁCH THUÊ, HỒ SƠ CÁ NHÂN & BÁO CÁO DASHBOARD ADMIN

## 1. ROLE – VAI TRÒ

Bạn là một chuyên gia UI/UX Designer và Product Designer chuyên thiết kế các hệ thống quản lý nhà trọ dạng SaaS (bao gồm cả luồng Admin Dashboard và Tenant Portal dành cho Khách thuê).

Hãy thiết kế và hoàn thiện giao diện UI/UX cho phần nghiệp vụ XÁC THỰC, KẾT NỐI HỢP ĐỒNG TỰ ĐỘNG, HỒ SƠ CÁ NHÂN KHÁCH THUÊ & TRANG BÁO CÁO DASHBOARD ADMIN.

Mục tiêu:
- Giao diện trực quan, hiện đại, tối ưu trải nghiệm người dùng (UX) cho cả Chủ trọ (Desktop-first) và Khách thuê (Responsive Desktop/Mobile-friendly).
- Đảm bảo luồng tự động kết nối tài khoản Khách thuê với Hợp đồng phòng trọ qua CCCD/CMND hoạt động rõ ràng, minh bạch về mặt trạng thái.
- Các thao tác phải có trạng thái phản hồi rõ ràng (Loading, Success, Error, Warning, Empty).
- Các nút bấm trên giao diện phải có Prototype interaction tương ứng.
- Frontend Developer và Mobile/Web Developer có thể dựa trực tiếp vào Figma để triển khai đúng logic nghiệp vụ.

KHÔNG chỉ thiết kế các màn hình tĩnh dạng danh sách hay form đơn giản.

Hãy thiết kế đầy đủ:
- Main screens (Đăng ký, Đăng nhập, Quên mật khẩu, Tenant Dashboard, Admin Report & Dashboard)
- Forms & Validation States
- Modal / Popup (Tự động liên kết, Đổi mật khẩu, Cập nhật thông tin, Xuất báo cáo)
- Confirmation Modal
- Warning / Error Modal (Lỗi chưa khớp CCCD, Sai OTP, Cảnh báo công nợ)
- Detail Modal / Drawer (Chi tiết chỉ số báo cáo, Chi tiết thông tin thuê)
- Empty State (Chưa có hợp đồng liên kết, Chưa có dữ liệu báo cáo)
- Success Toast & Error Toast
- Prototype interactions

==================================================
## 2. PHẠM VI THIẾT KẾ & CA SỬ DỤNG (USE CASES)
==================================================

Chỉ thiết kế 4 nhóm nghiệp vụ chính:

1. ĐĂNG KÝ TÀI KHOẢN KHÁCH THUÊ (UC01)
   - Đăng ký tài khoản mới bằng SĐT/Email, Mật khẩu, Họ tên và Số CCCD/CMND.
   - Cơ chế tự động: Hệ thống tra cứu CCCD trong CSDL Hợp đồng (Admin đã tạo sẵn). Nếu khớp -> Tự động Map Khách thuê vào Phòng + Hợp đồng tương ứng.

2. ĐĂNG NHẬP & QUÊN MẬT KHẨU (UC02 & UC02-EXT)
   - Đăng nhập hệ thống (Phân quyền Admin vs Khách thuê).
   - Quên mật khẩu: Xác thực OTP qua Email/SĐT -> Đặt lại mật khẩu mới.

3. QUẢN LÝ HỒ SƠ CÁ NHÂN & THÔNG TIN PHÒNG THUÊ (UC03)
   - Xem/Cập nhật thông tin cá nhân.
   - Xem thông tin phòng đang thuê, danh sách người ở cùng, ngày chốt điện nước, giá thuê.
   - Xử lý trạng thái ngoại lệ: Tài khoản chưa được map với Hợp đồng (Hiển thị Banner yêu cầu cập nhật CCCD hoặc liên hệ Chủ trọ).

4. BÁO CÁO & DASHBOARD ADMIN (MODULE BÁO CÁO ADMIN)
   - Thống kê KPI tổng quan (Doanh thu, Tỷ lệ lấp đầy, Công nợ, Sự cố).
   - Biểu đồ doanh thu/chi phí & Cơ cấu phòng.
   - Danh sách công nợ chờ thu & Hợp đồng sắp hết hạn.
   - Xuất báo cáo thống kê (Excel/PDF).

CẤU TRÚC NAVIGATION:

A. PHÍA KHÁCH THUÊ (TENANT PORTAL):
Sidebar Tenant:
- Tổng quan (Dashboard Khách thuê)
- Hồ sơ & Phòng ở (UC03)
- Hợp đồng của tôi
- Hóa đơn & Thanh toán
- Báo cáo sự cố
- Cài đặt tài khoản

B. PHÍA ADMIN / CHỦ TRỌ (ADMIN DASHBOARD):
Sidebar Admin (Giữ nguyên cấu trúc hệ thống):
- Tổng quan (Báo cáo & Dashboard - Module 04)
- Phòng trọ
- Khách thuê
- Hợp đồng
- Hóa đơn
- Điện nước
- Sự cố
- Thông báo
- Cài đặt

QUAN TRỌNG - TÊN CÁC MỤC KHÔNG ĐƯỢC THAY ĐỔI:
- "Đăng ký"
- "Đăng nhập"
- "Hồ sơ cá nhân"
- "Tổng quan"

==================================================
## 3. GIAO DIỆN HIỆN TẠI & PHONG CÁCH TỔNG THỂ
==================================================

Đã có giao diện nền tảng của hệ thống Admin Dashboard.
Hãy giữ nguyên phong cách hiện tại để đảm bảo tính đồng bộ (Consistency).

Visual style:
- Corporate SaaS
- Modern / Clean / Minimal / Professional
- Desktop-first (có tính toán responsive cho màn hình Tenant Portal)
- Khung thẻ Card màu trắng trên nền kem nhạt/xám nhạt
- Sidebar màu Xanh Navy
- Accent màu Cam
- Border nhẹ, Shadow mềm mại
- Border radius: 8px - 12px

==================================================
## 4. DESIGN SYSTEM SỬ DỤNG
==================================================

Màu sắc chủ đạo:
- Navy Blue (Primary Brand/Sidebar): #172B4D (hoặc #1B254B)
- Accent Orange (Primary Action/Buttons): #F59E0B (hoặc #FF6B00 / #F97316)
- Background: #FFF9F2 (hoặc #F8F9FA)
- Card / Container: #FFFFFF
- Primary text: #1F2937
- Secondary text: #6B7280
- Border: #E5E7EB
- Status Colors:
  * Success / Active / Confirmed: Nền xanh lá nhạt (#E6F4EA) - Text xanh lá (#1E8E3E)
  * Warning / Pending / Unlinked: Nền vàng/cam nhạt (#FEF3C7) - Text cam/nâu (#D97706)
  * Error / Expired / Inactive: Nền đỏ nhạt (#FFEDEC) - Text đỏ (#E53E3E)

Typography:
- Font family: Inter hoặc Plus Jakarta Sans
- Page title: 24px / SemiBold
- Section title: 18px / SemiBold
- Body: 14px / Regular
- Caption / Subtext: 12px / Regular
- Button label: 14px / Medium

Spacing Grid: 4 / 8 / 12 / 16 / 20 / 24 / 32px
Border radius: 8px (Inputs, Badges), 12px (Cards, Modals), 16px (Main containers)

Modal Standard:
- Nền trắng (#FFFFFF), bo góc 12-16px, shadow mượt.
- Backdrop/Overlay tối sẫm (Black 50% opacity).
- Width tiêu chuẩn: 480px (Small/Confirm), 640px (Medium/Form), 800px-1000px (Large/Detail Report).

Buttons Style:
- Primary: Nền màu Cam, chữ Trắng.
- Secondary: Nền Trắng, viền Border #E5E7EB, chữ Navy/Gray.
- Danger: Nền Đỏ nhẹ, chữ Đỏ hoặc Nền Đỏ chữ Trắng.

==================================================
## 5. MODULE 01 – ĐĂNG KÝ TÀI KHOẢN KHÁCH THUÊ (UC01)
==================================================

Tạo màn hình: "Auth - Sign Up (Khách thuê)"

Layout Split-Screen 2 cột:
- Cột trái (Branding Banner): Nền Dark Navy (#172B4D), minh họa Illustration hiện đại về không gian sống, Slogan: "Kết nối không gian sống - Quản lý trọ thông minh & tiện lợi".
- Cột phải (Form Đăng ký): Card trắng căn giữa.

Header Form:
- Logo hệ thống
- Tiêu đề: "Đăng ký tài khoản Khách thuê"
- Subtitle: "Thâm nhập hệ thống để quản lý phòng ở và hợp đồng của bạn"

Các trường nhập liệu (Form Fields):
1. Tên đăng nhập * [________________________]
2. Mật khẩu * [________________________] (Có icon Bật/Tắt ẩn hiện mật khẩu)
3. Nhập lại mật khẩu * [________________________]
4. Họ và tên * [________________________]
5. Số CCCD / CMND * [________________________]
   -> Chú thích Tooltip/Helper Text bên dưới: "📌 Quan trọng: Nhập chính xác số CCCD/CMND trên Hợp đồng thuê phòng để hệ thống tự động kết nối dữ liệu phòng ở của bạn."
6. Số điện thoại * [________________________]
7. Email * [________________________]

Buttons:
- [ Đăng ký tài khoản ] (Primary Orange - Width 100%)
- Footer link: "Đã có tài khoản? [Đăng nhập ngay]"

Validation States (Lỗi trên Form):
- Trống trường bắt buộc: "Vui lòng điền đầy đủ thông tin"
- Mật khẩu không khớp: "Mật khẩu xác nhận không trùng khớp"
- CCCD không hợp lệ: "Số CCCD phải bao gồm 12 chữ số"
- SĐT/Email sai định dạng: "Email hoặc Số điện thoại không đúng định dạng"

Logic tự động hóa UI sau khi click [Đăng ký tài khoản]:
- TRƯỜNG HỢP 1 (Khớp CCCD thành công):
  * Hiển thị Success Modal / Toast: "Đăng ký thành công! Đã tự động kết nối với Hợp đồng phòng P101."
  * Chuyển hướng trực tiếp vào Tenant Dashboard.
- TRƯỜNG HỢP 2 (CCCD không có trong CSDL Hợp đồng của Chủ trọ):
  * Hiển thị Warning Modal: "Đăng ký tài khoản thành công! Tuy nhiên số CCCD chưa khớp với Hợp đồng nào trên hệ thống. Vui lòng cập nhật hoặc báo Chủ trọ kiểm tra."
  * Vẫn cho đăng nhập nhưng Màn hình Dashboard hiển thị trạng thái "Chờ kết nối phòng".

==================================================
## 6. MODULE 02 – ĐĂNG NHẬP & QUÊN MẬT KHẨU (UC02 & UC02-EXT)
==================================================

A. MÀN HÌNH ĐĂNG NHẬP (Auth - Login)
Layout Split-Screen tương tự Đăng ký.
Form gồm:
- Tên đăng nhập hoặc Email/SĐT * [________________________]
- Mật khẩu * [________________________]
- Checkbox: [✓] Ghi nhớ đăng nhập   |   Link: [Quên mật khẩu?]
- Button: [ Đăng nhập ] (Primary Orange)
- Footer: "Chưa có tài khoản? [Đăng ký ngay]"

B. CHUỖI MÀN HÌNH QUÊN MẬT KHẨU KHÁCH THUÊ (UC02-EXT)
- STEP 1: Form Nhập Email/SĐT nhận OTP
  * Tiêu đề: "Quên mật khẩu?"
  * Subtitle: "Nhập Email hoặc Số điện thoại đã đăng ký để nhận mã xác thực OTP."
  * Field: Email / SĐT * [________________________]
  * Button: [ Gửi mã OTP ]
- STEP 2: Form Nhập Mã OTP & Mật Khẩu Mới (Modal hoặc Màn hình tiếp theo)
  * Tiêu đề: "Xác thực OTP & Đặt lại mật khẩu"
  * Input 6 ô vuông nhập mã OTP: [ _ ] [ _ ] [ _ ] [ _ ] [ _ ] [ _ ]
  * Countdown timer: "Mã có hiệu lực trong 01:59" - [Gửi lại mã]
  * Mật khẩu mới * [________________________]
  * Nhập lại mật khẩu mới * [________________________]
  * Button: [ XÁC NHẬN ĐẶT LẠI MẬT KHẨU ]
- Success State:
  * Modal/Toast: "✓ Đặt lại mật khẩu thành công! Vui lòng đăng nhập lại." -> Redirect về màn Login.

==================================================
## 7. MODULE 03 – HỒ SƠ CÁ NHÂN & THÔNG TIN PHÒNG THUÊ (UC03)
==================================================

Màn hình: "Hồ sơ & Phòng ở" (Tenant View)
Breadcrumb: "Tổng quan / Hồ sơ & Phòng ở"

Header:
- Tiêu đề: "Thông tin cá nhân & Phòng thuê"
- Bên phải: Icon Chuông thông báo, Avatar + Tên khách thuê, Button [ Sửa thông tin cá nhân ]

Bố cục giao diện 2 Tab chính:
[ Tab 1: Hồ sơ cá nhân ]   [ Tab 2: Thông tin phòng & Thành viên ]

NỘI DUNG TAB 1 (HỒ SƠ CÁ NHÂN):
- Khối 1: Card Avatar & Badge Trạng thái xác thực
  * Avatar lớn, Tên đầy đủ, Badge: [✓ Đã xác thực CCCD / Khớp Hợp đồng]
- Khối 2: Chi tiết thông tin (Grid 2 cột)
  * Họ và tên: Nguyễn Văn A
  * Số CCCD/CMND: 012345678901 (Ngày cấp: 10/05/2021 - Nơi cấp: Cục CSQLHC)
  * Số điện thoại: 0987654321
  * Email: nguyenvana@gmail.com
  * Địa chỉ thường trú: Số 123, Đường ABC, Quận XYZ, TP. Hà Nội
  * Liên hệ khẩn cấp: Bà Nguyễn Thị B (Mối quan hệ: Mẹ - SĐT: 0912345678)
- Button bên dưới: [ Đổi mật khẩu ] [ Cập nhật thông tin ]

NỘI DUNG TAB 2 (THÔNG TIN PHÒNG THUÊ):
- Banner Tóm tắt Phòng:
  * Phòng: **P101** (Tầng 1 - Loại: VIP)
  * Trạng thái hợp đồng: [ Đang hiệu lực ]
  * Thời hạn thuê: 01/01/2026 - 31/12/2026 (Còn 6 tháng)
- Grid 2 Cards:
  * Card trái - Chi tiết Chi phí & Quy định:
    + Giá thuê niêm yết: 3.500.000đ/tháng
    + Tiền cọc đã trả: 3.500.000đ
    + Ngày chốt tiền trọ hàng tháng: Ngày 01 hàng tháng
    + Danh sách tiện nghi đi kèm: (WiFi, Điều hòa, Tủ lạnh, Bình nóng lạnh, Máy giặt) -> Dạng Chip Badges.
  * Card phải - Danh sách Thành viên cùng phòng:
    + Bảng danh sách: Họ tên, Số CCCD, SĐT, Trạng thái (Trưởng phòng / Thành viên), Ngày chuyển vào.

STATE NGOẠI LỆ (TÀI KHOẢN CHƯA LIÊN KẾT HỢP ĐỒNG - UNLINKED STATE):
- Khi Khách thuê mới đăng ký nhưng CCCD không tìm thấy trong Hợp đồng:
- Tại Tab Phòng thuê hiển thị Empty / Warning Card:
  * Illustration: Biểu tượng Hợp đồng bị đứt đoạn / Tìm kiếm.
  * Tiêu đề: "Chưa tìm thấy thông tin phòng ở"
  * Nội dung: "Tài khoản của bạn chưa được liên kết với Hợp đồng phòng trọ nào. Vui lòng kiểm tra lại Số CCCD trong hồ sơ hoặc liên hệ Chủ trọ để cập nhật Hợp đồng."
  * Button: [ Cập nhật CCCD ] [ Liên hệ Chủ trọ ]

==================================================
## 8. MODULE 04 – TRANG BÁO CÁO & DASHBOARD ADMIN (ADMIN REPORT & DASHBOARD)
==================================================

A. MÀN HÌNH BÁO CÁO & DASHBOARD TỔNG QUAN (Admin Dashboard View)
Sidebar Menu Active: "Tổng quan"
Breadcrumb: "Hệ thống / Dashboard Tổng quan"

Header Bar:
- Tiêu đề: "Báo cáo & Tổng quan hoạt động"
- Subtitle: "Thống kê doanh thu, tỷ lệ lấp đầy phòng và tình trạng vận hành nhà trọ"
- Controls bên phải:
  * Bộ lọc khoảng thời gian: [ Tháng này (10/2026) ▼ ] (Options: Hôm nay, Tuần này, Tháng này, Quý này, Năm nay, Tùy chỉnh)
  * Bộ lọc Cơ sở / Tòa nhà: [ Tất cả nhà trọ ▼ ]
  * Button: [ 📥 Xuất báo cáo (Excel/PDF) ] (Primary Orange)

B. HÀNG SUMMARY CARDS THỐNG KÊ NHANH (KPI METRIC CARDS) - Top 4 Cards:
1. CARD DOANH THU THÁNG:
   - Số liệu chính: 145.500.000 VNĐ
   - So với tháng trước: 📈 +12.5% (Badge xanh lá)
   - Subtext: Dòng tiền thực thu trong tháng

2. TỶ LỆ LẤP ĐẦY (OCCUPANCY RATE):
   - Số liệu chính: 92% (23/25 phòng)
   - So với tháng trước: 📈 +4% (Badge xanh lá)
   - Subtext: 23 Đang thuê · 2 Phòng trống · 0 Bảo trì

3. CÔNG NỢ / HÓA ĐƠN CHƯA THU:
   - Số liệu chính: 18.200.000 VNĐ
   - Trạng thái: ⚠ 5 Hóa đơn quá hạn (Badge cam/đỏ)
   - Subtext: Cần nhắc thanh toán

4. SỰ CỐ & BẢO TRÌ ĐANG XỬ LÝ:
   - Số liệu chính: 4 Yêu cầu
   - Chi tiết: 2 Mới tiếp nhận · 2 Đang sửa chữa
   - Action Link: [Xem danh sách ->]

C. KHỐI BIỂU ĐỒ THỐNG KÊ CHÍNH (CHARTS & ANALYTICS SECTION):
- KHỐI TRÁI (Width: 65% - Column Chart / Line Chart):
  * Tiêu đề: "Biểu đồ doanh thu & Chi phí 6 tháng gần nhất"
  * Legend: Cột Cam (Doanh thu thực nhận), Cột Navy (Chi phí vận hành/sửa chữa).
  * Hover Tooltip: Hiển thị chi tiết Doanh thu, Chi phí, Lợi nhuận ròng của từng tháng khi di chuột vào cột.

- KHỐI PHẢI (Width: 35% - Donut / Pie Chart):
  * Tiêu đề: "Cơ cấu trạng thái phòng"
  * Biểu đồ tròn thể hiện phân bổ:
    + Màu Xanh lá: Phòng đang thuê (92%)
    + Màu Cam/Vàng: Phòng trống (8%)
    + Màu Đỏ/Xám: Phòng đang bảo trì/sửa chữa (0%)
  * Bảng Legend chú thích chi tiết số lượng phòng bên dưới chart.

D. KHỐI BẢNG VÀ DANH SÁCH BÁO CÁO HOẠT ĐỘNG (DETAILED ACTIVITY TABLES):
- CỘT TRÁI: Bảng "Hóa đơn chờ thu tiền / Quá hạn" (Recent Unpaid Invoices)
  * Columns: Số phòng | Khách thuê | Kỳ hóa đơn | Tổng tiền | Hạn thanh toán | Trạng thái | Action
  * Rows sample:
    + P102 | Nguyễn Văn B | Tháng 10/2026 | 4.200.000đ | 05/10/2026 | [ Quá hạn 2 ngày ] | [ 🔔 Nhắc nợ ]
    + P205 | Trần Thị C | Tháng 10/2026 | 3.800.000đ | 10/10/2026 | [ Chưa thanh toán ] | [ Gửi HĐ ]
  * Footer: [ Xem tất cả hóa đơn -> ]

- CỘT PHẢI: Khối "Hợp đồng sắp hết hạn (Trong 30 ngày)" & "Sự cố cần xử lý"
  * Danh sách Hợp đồng cần gia hạn: Hiển thị Mã phòng, Tên khách thuê, Ngày hết hạn, Badge [ Sắp hết hạn ].
  * Action Buttons: [ Gia hạn HĐ ], [ Báo trả phòng ].

E. MODAL & POPUP PHỤC VỤ BÁO CÁO (REPORT MODALS):
1. MODAL XUẤT BÁO CÁO (Export Report Modal):
   - Tiêu đề: "Xuất báo cáo thống kê"
   - Options chọn Loại báo cáo:
     ( ) Báo cáo Doanh thu & Dòng tiền
     ( ) Báo cáo Công nợ & Hóa đơn chưa thanh toán
     ( ) Báo cáo Điện nước & Mức tiêu thụ
     ( ) Báo cáo Tỷ lệ lấp đầy & Khách thuê
   - Chọn định dạng: [ File Excel (.xlsx) ] hoặc [ File PDF (.pdf) ]
   - Khoảng thời gian: From Date -> To Date
   - Buttons: [ Hủy ] [ 📥 Tải báo cáo ]

2. EMPTY STATE - KHI CHƯA CÓ DỮ LIỆU THỐNG KÊ (New Account / Empty Data):
   - Illustration: Biểu đồ trống / Kính lúp.
   - Tiêu đề: "Chưa có dữ liệu báo cáo"
   - Subtitle: "Hãy thêm phòng trọ, tạo hợp đồng và xuất hóa đơn đầu tiên để hệ thống bắt đầu tự động tính toán báo cáo."
   - Button: [ + Thêm phòng mới ] [ + Tạo hóa đơn ]

==================================================
## 9. MODALS, POPUPS & STATES TOÀN HỆ THỐNG
==================================================

1. MODAL ĐỔI MẬT KHẨU (Khách thuê / Admin):
   - Mật khẩu hiện tại * [________________________]
   - Mật khẩu mới * [________________________]
   - Nhập lại mật khẩu mới * [________________________]
   - Buttons: [ Hủy ] [ Lưu mật khẩu mới ]

2. MODAL CẬP NHẬT THÔNG TIN CÁ NHÂN (UC03):
   - Cho phép chỉnh sửa SĐT, Email, Địa chỉ thường trú, SĐT khẩn cấp (Số CCCD và Họ tên bị Disable / Read-only để đảm bảo tính pháp lý Hợp đồng).
   - Buttons: [ Hủy ] [ Cập nhật ]

3. WARNING MODAL - CCCD CHƯA TÌM THẤY HỢP ĐỒNG (UC01 / UC03):
   - Icon Cảnh báo Vàng (Warning Triangle).
   - Tiêu đề: "Chưa thể kết nối Hợp đồng"
   - Nội dung: "Hệ thống không tìm thấy Hợp đồng nào gắn với CCCD [012345678901]. Vui lòng kiểm tra lại chính xác số CCCD hoặc liên hệ Chủ trọ để cập nhật thông tin Hợp đồng."
   - Buttons: [ Sửa lại CCCD ] [ Tôi sẽ liên hệ Chủ trọ ]

4. CONFIRMATION MODAL - XÁC NHẬN ĐĂNG XUẤT:
   - "Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?"
   - Buttons: [ Hủy ] [ Đăng xuất ]

==================================================
## 10. TOAST SYSTEM (HỆ THỐNG THÔNG BÁO NHANH)
==================================================

Toast đặt ở góc trên bên phải (Top-Right Fixed Position).

SUCCESS TOASTS (Icon Tích xanh):
- ✓ Đăng ký tài khoản thành công!
- ✓ Kết nối thành công với Hợp đồng phòng P101.
- ✓ Đặt lại mật khẩu thành công.
- ✓ Cập nhật thông tin cá nhân thành công.
- ✓ Đã xuất file báo cáo (.xlsx) thành công.

ERROR TOASTS (Icon Dấu X đỏ):
- × Tên đăng nhập hoặc mật khẩu không chính xác.
- × Mã OTP không chính xác hoặc đã hết hạn.
- × Số CCCD đã được đăng ký bởi một tài khoản khác.
- × Không thể tải xuống file báo cáo. Vui lòng thử lại.

WARNING TOASTS (Icon Tam giác vàng):
- ⚠ Tài khoản chưa liên kết với Hợp đồng phòng trọ nào.

==================================================
## 11. PROTOTYPE INTERACTIONS & FLOWS
==================================================

Tạo các kết nối Prototype tương tác trên Figma:

1. LUỒNG ĐĂNG KÝ & TỰ ĐỘNG KHỚP HỢP ĐỒNG (UC01):
   - Auth - Sign Up -> Click [Đăng ký tài khoản] -> Show Overlay Success Modal -> Click [Vào Trang chủ] -> Navigate to Tenant Dashboard (Đã có dữ liệu Phòng P101).

2. LUỒNG QUÊN MẬT KHẨU (UC02-EXT):
   - Auth - Login -> Click [Quên mật khẩu?] -> Open Screen/Modal Step 1 (Nhập Email) -> Click [Gửi mã OTP] -> Navigate to Step 2 (Nhập 6 số OTP & Mật khẩu mới) -> Click [Xác nhận] -> Show Success Toast -> Navigate back to Login.

3. LUỒNG BÁO CÁO & XUẤT FILE ADMIN (MODULE 04):
   - Admin Sidebar -> Click [Tổng quan] -> Màn hình Admin Dashboard.
   - Click [📥 Xuất báo cáo] -> Open Overlay (Export Report Modal) -> Click [Tải báo cáo] -> Trigger Success Toast.

4. LUỒNG CẬP NHẬT HỒ SƠ & XỬ LÝ CHƯA KHỚP CCCD (UC03):
   - Tenant Profile -> Click [Cập nhật thông tin] -> Open Edit Profile Modal -> Click [Lưu] -> Success Toast.
   - Nếu ở Unlinked State -> Click [Cập nhật CCCD] -> Open Modal sửa CCCD -> Re-validate -> Map Hợp đồng thành công.

==================================================
## 12. FRAME ORGANIZATION IN FIGMA
==================================================

Sắp xếp và đặt tên các Frame Figma khoa học theo Section:

SECTION 01 - AUTHENTICATION & ONBOARDING:
- AUTH - LOGIN (Màn hình Đăng nhập)
- AUTH - SIGNUP (Màn hình Đăng ký có trường CCCD)
- AUTH - FORGOT PASSWORD STEP 1 (Nhập SĐT/Email)
- AUTH - FORGOT PASSWORD STEP 2 (Nhập OTP & Pass mới)

SECTION 02 - TENANT PORTAL (DÀNH CHO KHÁCH THUÊ):
- TENANT - DASHBOARD (Tổng quan Khách thuê - Đã kết nối HĐ)
- TENANT - DASHBOARD UNLINKED (Trạng thái chờ kết nối HĐ)
- TENANT - PROFILE TAB 1 (Hồ sơ cá nhân)
- TENANT - PROFILE TAB 2 (Thông tin phòng & Tiện nghi & Thành viên)

SECTION 03 - ADMIN REPORT & DASHBOARD (DÀNH CHO CHỦ TRỌ):
- ADMIN - DASHBOARD MAIN (Tổng quan Báo cáo, KPI Cards & Biểu đồ)
- ADMIN - REPORT EXPORT MODAL (Popup xuất file Excel/PDF)

SECTION 04 - MODALS, OVERLAYS & COMPONENTS:
- MODAL - EDIT PROFILE
- MODAL - CHANGE PASSWORD
- MODAL - WARNING UNLINKED CCCD
- TOASTS & BADGES SYSTEM (Design System Component Sheet)

==================================================
## 13. QUY TẮC THIẾT KẾ QUAN TRỌNG
==================================================

1. Giữ nguyên giao diện thiết kế SaaS sẵn có của Admin, sử dụng nhất quán bảng màu Navy (#172B4D) và Accent Cam (#F59E0B).
2. Tên các Navigation Menu không được tự ý đổi tên.
3. Luồng tự động map Hợp đồng bằng CCCD/CMND khi Khách thuê đăng ký tài khoản (UC01) phải có trạng thái phản hồi UI rõ ràng (Khớp thành công vs Chưa tìm thấy).
4. Các thao tác Xem/Sửa/Tải xuống/Đổi mật khẩu ưu tiên sử dụng Modal/Popup Overlay.
5. Luôn thiết kế đầy đủ Empty State cho trường hợp Tài khoản Khách thuê mới chưa được map với Hợp đồng phòng hoặc Admin chưa có dữ liệu báo cáo.
6. Mọi nút bấm chính phải có hiệu ứng Hover / Active state và được nối dây Prototype hoàn chỉnh.
7. Đặt tên Layer và Frame rõ ràng theo đúng chuẩn bàn giao Developer (Developer-friendly naming).

==================================================
## ƯU TIÊN THỰC HIỆN
==================================================

Hãy thực hiện toàn bộ yêu cầu trong prompt này trong một lần.

Ưu tiên theo thứ tự:
1. Đảm bảo đúng Design System (Màu sắc, Typography, Spacing, Buttons).
2. Thiết kế luồng Đăng ký tài khoản Khách thuê (UC01) kèm ô nhập CCCD và xử lý Logic tự động kết nối Hợp đồng.
3. Thiết kế luồng Đăng nhập & Quên mật khẩu OTP (UC02 & UC02-EXT).
4. Thiết kế Màn hình Hồ sơ cá nhân & Thông tin phòng thuê (UC03) đầy đủ 2 Tab và Unlinked State.
5. Thiết kế Màn hình Báo cáo & Dashboard Admin (Module 04) với KPI Cards, Biểu đồ và Modal Xuất file.
6. Tạo đầy đủ Modals, Empty States, Success/Error Toasts.
7. Nối dây Prototype cho tất cả các luồng tương tác chính.
8. Gom nhóm và sắp xếp Frame gọn gàng theo từng Section.

Mục tiêu của lần chạy này là tạo ra phiên bản UI đầy đủ đầu tiên.
Sau khi hoàn thành, tôi sẽ kiểm tra và yêu cầu chỉnh sửa các chi tiết còn thiếu.
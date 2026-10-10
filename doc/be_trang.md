# TÀI LIỆU & PROMPT MẪU CHO BACKEND DEVELOPER (PHẦN CỦA TRANG)

Tài liệu này tổng hợp bối cảnh dự án, cấu trúc thư mục, đặc tả chức năng và đoạn Prompt mẫu tối ưu để cung cấp cho AI (ChatGPT, Claude, Cursor) nhằm sinh mã nguồn Backend (Node.js, Express, TypeScript, MySQL 8.0+) đúng phạm vi công việc của Trang.

---

## 1. PHÂN CÔNG VÀ PHẠM VI CÔNG VIỆC (CỦA TRANG)
Bạn **CHỈ ĐƯỢC PHÉP** viết mã nguồn liên quan đến các module/chức năng sau:
- **Module Auth & Tài khoản (`users`):** 
  - Đăng ký (UC01 - có logic tự động liên kết CCCD với bảng `tenants`).
  - Đăng nhập (UC02 - cấp JWT Token, phân quyền ADMIN/TENANT).
  - Quên/Đặt lại mật khẩu qua Email OTP (UC02-EXT).
- **Module Người dùng cá nhân & Phòng (`users/me`):** 
  - Xem thông tin cá nhân kèm chi tiết phòng/hợp đồng của người thuê đang đăng nhập (UC03).
- **Module Dashboard & Báo cáo (`dashboard`):** 
  - Thống kê tổng quan số phòng, tổng công nợ, biểu đồ doanh thu, biểu đồ tỷ lệ lấp đầy dành riêng cho Admin (UC04).
- **TUYỆT ĐỐI KHÔNG ĐƯỢC** viết code xử lý các module của người khác (Quản lý Phòng của Bình, Hợp đồng của Ngọc, Điện nước/Hóa đơn của Linh, Sự cố/Thông báo...).

---

## 2. CẤU TRÚC THƯ MỤC DỰ ÁN (BACKEND STRUCTURE)
Mã nguồn sinh ra phải tuân thủ nghiêm ngặt cây thư mục sau:
```text
backend/
├── src/
│   ├── config/        # Cấu hình kết nối DB (MySQL), biến môi trường
│   ├── controllers/   # Xử lý logic request/response cho Auth, Users, Dashboard
│   ├── middleware/    # Middleware xác thực JWT Token (verifyToken), kiểm tra quyền (verifyAdmin)
│   ├── routes/        # Định nghĩa các Express Router tương ứng
│   ├── services/      # Xử lý tầng nghiệp vụ (Business logic, gọi DB, gửi email OTP)
│   ├── types/         # Định nghĩa các TypeScript Interface / Type
│   ├── utils/         # Các hàm tiện ích chung (nếu cần)
│   ├── app.ts         # Khởi tạo ứng dụng Express, cấu hình middleware chung, gắn các routes
│   └── server.ts      # File chạy chính (Listen port)
├── .env.example
├── package.json
└── tsconfig.json
```

---

## 3. DANH SÁCH RESTFUL API CẦN TRIỂN KHAI
1. **`POST /api/v1/auth/register` (UC01):**
   - Đăng ký tài khoản `TENANT`, mã hóa mật khẩu bằng Bcrypt. Tự động tìm trong bảng `tenants` theo `identity_card_number` để gán `tenants.user_id = users.id` nếu khớp.
2. **`POST /api/v1/auth/login` (UC02):**
   - Xác thực tài khoản, kiểm tra `is_active = TRUE`, so sánh mật khẩu và trả về JWT Token chứa `{ id, username, role }`.
3. **`POST /api/v1/auth/forgot-password` & `POST /api/v1/auth/reset-password` (UC02-EXT):**
   - Gửi mã OTP 6 số qua email bằng Nodemailer và xác thực OTP để cập nhật mật khẩu mới.
4. **`GET /api/v1/users/me` (UC03):**
   - Lấy thông tin tài khoản đang đăng nhập, `LEFT JOIN` với `tenants`, `contracts`, `rooms` để trả về trọn vẹn thông tin cá nhân và phòng trọ.
5. **`GET /api/v1/dashboard/overview` (UC04):**
   - Kiểm tra quyền Admin (`role == 'ADMIN'`), thống kê trạng thái phòng, tính tổng công nợ từ bảng `invoices` và tổng doanh thu theo tháng từ bảng `payments`.

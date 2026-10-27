# Hệ thống Web Quản lý Phòng trọ

## 1. TỔNG QUAN DỰ ÁN

Hệ thống Web Quản lý Phòng trọ nhằm tự động hóa quy trình quản lý dãy trọ và chung cư mini:

- **Đối với Chủ trọ (Admin):** Tối ưu hóa việc quản lý danh sách phòng, loại phòng, lập hợp đồng thuê, tính tiền điện nước, sinh hóa đơn tự động và theo dõi công nợ, doanh thu qua bảng thống kê.
- **Đối với Người thuê (Tenant):** Tra cứu chi phí hàng tháng, xem lịch sử thanh toán, gửi yêu cầu sửa chữa sự cố và nhận thông báo nhanh chóng từ chủ trọ.

---

## 2. CÔNG NGHỆ SỬ DỤNG (TECH STACK)

- **Frontend:** ReactJS + TypeScript + Tailwind CSS
- **Backend:** Node.js (Express Framework)
- **Cơ sở dữ liệu:** MySQL 8.0+
- **Công cụ quản lý & Phát triển:** Git, GitHub, Postman, Figma, Trello/Jira

---

## 3. PHÂN CÔNG NHIỆM VỤ DỰ ÁN

| Thành viên    | Vai trò / Branch                        | Trách nhiệm chính                                                                                                                                                       |
| :-------------- | :--------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Trang** | **Leader**`trang/auth-dashboard` | Khởi tạo khung dự án, Module Tài khoản & Phân quyền (`users`), Dashboard & Báo cáo thống kê, quản lý Merge code.                                           |
| **Bình** | **Dev**`binh/room-management`    | Module Quản lý Phòng (`rooms`, `room_types`), Tiện nghi (`amenities`, `room_amenities`), Sự cố (`maintenance_requests`) & Thông báo (`notifications`). |
| **Ngọc** | **Dev**`ngoc/tenant-contract`    | Module Hồ sơ người thuê (`tenants`), Hợp đồng thuê trọ (`contracts`), Danh sách người ở cùng (`contract_members`), Lịch sử thuê.                   |
| **Linh**  | **Dev**`linh/billing-payment`    | Module Điện nước (`utility_readings`), Hóa đơn hàng tháng (`invoices`), Lịch sử thanh toán nhiều đợt (`payments`) & Quản lý công nợ.              |

## Cấu trúc

- `frontend/` — giao diện React/Vite và dịch vụ gọi REST API.
- `backend/` — Express API `/api/v1`, cấu hình MySQL, middleware JWT và phân quyền.
- `database/schema.sql` — 13 bảng dữ liệu theo từ điển trong DOCX.
  + có thêm 2 bảng cập nhật trạng thái của auth

## Khởi chạy phát triển

1. Tạo database bằng cách chạy `database/schema.sql` trên MySQL 8.0+.

- Thêm dữ liệu mẫu seed: Trong `backend/`, chạy `npm run seed` (chỉ dùng khi chưa có dữ liệu hoặc làm mới dữ liệu về 0)

### Thêm bảng giá điện nước

1. Thêm đoạn tạo bảng sau vào `doc/schema.sql`:

```sql
CREATE TABLE utility_prices (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  electricity_price_per_kwh DECIMAL(12,2) NOT NULL,
  water_price_per_m3 DECIMAL(12,2) NOT NULL,
  effective_from DATE NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

2. Chọn database dự án trong phpMyAdmin, mở tab SQL, dán và chạy đoạn `CREATE TABLE` trên.
3. Thêm bản ghi giá điện 4.000 VNĐ/kWh, giá nước 25.000 VNĐ/m³:

```sql
INSERT INTO utility_prices (electricity_price_per_kwh, water_price_per_m3, effective_from)
VALUES (4000.00, 25000.00, '2026-10-01');
```

2. Sao chép `backend/.env.example` thành `backend/.env`, điền thông tin MySQL và JWT secret.
3. Trong `backend/`, chạy `npm install`, rồi `npm run dev` (mặc định cổng 3000).
4. Sao chép `frontend/.env.example` thành `frontend/.env`.
5. Trong `frontend/`, chạy `npm install`, rồi `npm run dev` (mặc định cổng 5173)

## Các thư viện cần tải:

- 'frontend':
  npm install
- `npm install @tailwindcss/vite tailwindcss`
  `npm run dev`
- 'backend':
  `npm install`
  `npm run seed`(dùng khi reset dữ liệu)
  `npm run dev`
- thư mục dự án:
  `npm install`
  ` npm run dev`

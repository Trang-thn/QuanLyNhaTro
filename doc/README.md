# Hệ thống Web Quản lý Phòng trọ

##  1. TỔNG QUAN DỰ ÁN

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

| Thành viên | Vai trò / Branch | Trách nhiệm chính |
| :--- | :--- | :--- |
| **Trang** | **Leader**<br>`trang/auth-dashboard` | Khởi tạo khung dự án, Module Tài khoản & Phân quyền (`users`), Dashboard & Báo cáo thống kê, quản lý Merge code. |
| **Bình** | **Dev**<br>`binh/room-management` | Module Quản lý Phòng (`rooms`, `room_types`), Tiện nghi (`amenities`, `room_amenities`), Sự cố (`maintenance_requests`) & Thông báo (`notifications`). |
| **Ngọc** | **Dev**<br>`ngoc/tenant-contract` | Module Hồ sơ người thuê (`tenants`), Hợp đồng thuê trọ (`contracts`), Danh sách người ở cùng (`contract_members`), Lịch sử thuê. |
| **Linh** | **Dev**<br>`linh/billing-payment` | Module Điện nước (`utility_readings`), Hóa đơn hàng tháng (`invoices`), Lịch sử thanh toán nhiều đợt (`payments`) & Quản lý công nợ. |

## Cấu trúc

- `frontend/` — giao diện React/Vite và dịch vụ gọi REST API.
- `backend/` — Express API `/api/v1`, cấu hình MySQL, middleware JWT và phân quyền.
- `database/schema.sql` — 13 bảng dữ liệu theo từ điển trong DOCX.

## Khởi chạy phát triển

1. Tạo database bằng cách chạy `database/schema.sql` trên MySQL 8.0+.
2. Sao chép `backend/.env.example` thành `backend/.env`, điền thông tin MySQL và JWT secret.
3. Trong `backend/`, chạy `npm install`, rồi `npm run dev` (mặc định cổng 3000).
4. Sao chép `frontend/.env.example` thành `frontend/.env`.
5. Trong `frontend/`, chạy `npm install`, rồi `npm run dev` (mặc định cổng 5173).



## Các thư viện cần tải:
- 'frontend':
    `npm install`
    `npm install @tailwindcss/vite tailwindcss`
    `npm run dev`
- 'backend':
    `npm install`
    `npm run dev`
- thư mục dự án:
    `npm install`
   ` npm run dev`
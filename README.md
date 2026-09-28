# Hệ thống Web Quản lý Phòng trọ

Bộ khung dự án theo tài liệu thiết kế: React + TypeScript + Bootstrap, Node.js + Express, MySQL 8.0+.

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

API kiểm tra trạng thái: `GET /health` và `GET /api/v1/health`.

Các module nghiệp vụ, CRUD, dashboard và kiểm thử tích hợp được chia theo phân công trong tài liệu; bộ khung hiện cung cấp nền tảng cấu hình và thư mục theo module.


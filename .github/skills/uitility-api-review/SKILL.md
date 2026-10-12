---
name: utility-api-review
description: Rà soát code API chỉ số điện nước (Express + TypeScript + MySQL) của dự án quản lý phòng trọ. Dùng khi người dùng nhờ review, kiểm tra lỗi hoặc sửa chức năng điện nước.
---
# Rà soát chức năng điện nước

## Quy ước của dự án

- id các bảng (rooms, utility_readings) là varchar, không ép sang số.
- Chỉ số điện/nước là số nguyên (int) và phải >= 0.
- Chỉ số cũ lấy từ chỉ số mới của kỳ trước trong DB, không tin dữ liệu client gửi lên.
- Không cho sửa chỉ số của bản ghi đã có hóa đơn.
- Lỗi 500 không trả error.message gốc cho client.
- Tên database là boarding_house_db.

## Cách làm

1. Đọc controller, service, router, type của chức năng điện nước.
2. Đối chiếu với các quy ước ở trên.
3. Liệt kê lỗi theo mức độ (nghiêm trọng, trung bình, nhẹ). Chưa sửa code nếu người dùng chưa yêu cầu.

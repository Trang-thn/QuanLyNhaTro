---
name: phongtro-module
description: Hỗ trợ khảo sát, phát triển và kết nối Frontend, Backend, API và MySQL cho module Phòng trọ trong dự án QuanLyNhaTro.
---

# Skill Phòng trọ — QuanLyNhaTro

Dùng skill này khi được yêu cầu phân tích, sửa lỗi, phát triển hoặc tích hợp module Phòng trọ. Dự án sử dụng React, TypeScript, Vite ở frontend; Node.js, Express ở backend; MySQL làm cơ sở dữ liệu.

## Quy trình khảo sát

Trước khi đề xuất hoặc thay đổi code:

1. Xác nhận thư mục dự án, branch và git status; đọc git diff cùng các file liên quan để giữ nguyên thay đổi có sẵn.
2. Khảo sát cấu trúc frontend/backend và schema hiện có trong doc/schema.sql. Không suy đoán API, bảng, cột hoặc quy tắc nghiệp vụ.
3. Theo luồng hiện hành: trang và component → types → service/API client → route → middleware → controller → service/SQL → bảng và khóa ngoại.
4. Kiểm tra luồng Phòng trọ và loại phòng; xem Tiện nghi hoặc hợp đồng khi chúng liên quan trực tiếp đến dữ liệu phòng.
5. Phân biệt rõ API đã được triển khai, frontend đang gọi API, mock/preview, và các phần đã được kiểm thử thực tế.

## Giới hạn phạm vi và bảo vệ thay đổi

- Chỉ sửa những file cần thiết thuộc module Phòng trọ đã được giao. Ưu tiên các thư mục frontend/src/pages/rooms, frontend/src/components/rooms, frontend/src/services, frontend/src/types và các file backend tương ứng routes, controllers, services, types.
- Không tự ý sửa module của thành viên khác, đăng nhập/xác thực/phân quyền, Sidebar, định tuyến dùng chung, API client hoặc cấu hình toàn cục. Nếu lỗi cần thay đổi các phần đó, nêu file, lý do và ảnh hưởng rồi chờ xác nhận.
- Không ghi đè hay hoàn tác thay đổi có sẵn; không xóa file; không commit, đổi branch hoặc chạy lệnh Git có nguy cơ mất dữ liệu.
- Không tự cài dependency, thay đổi schema/database, chạy migration hay sửa bí mật trong .env. Nếu phát sinh nhu cầu, báo lý do và chờ chấp thuận.
- Giữ nguyên giao diện/Design System và quy ước code hiện có, trừ khi yêu cầu được giao nói rõ khác.

## Frontend và API

- Dùng service/API client hiện có; đối chiếu TypeScript request/response với controller và dữ liệu SQL.
- Hỗ trợ trạng thái tải, rỗng, thành công và lỗi; không dùng mock hoặc local state làm nguồn dữ liệu cho luồng API thật.
- Xác minh API base URL, port, CORS và cơ chế token hiện có. Không tạo token giả hoặc tự viết lại đăng nhập. Nếu chưa có token provider/JWT, ghi chính xác điểm tích hợp đang thiếu.
- Kiểm tra các luồng CRUD phòng/loại phòng và thao tác liên quan theo nghiệp vụ/schema. Lưu ý các thao tác nhiều bước, chẳng hạn tạo phòng rồi gán tiện nghi, có thể thành công một phần; không báo thành công toàn bộ nếu bước liên quan thất bại.

## Backend và MySQL

- Tuân theo cách tổ chức route/controller/service, middleware xác thực/phân quyền và truy vấn parameterized của dự án.
- Kiểm tra dữ liệu đầu vào, UUID/ID, giá trị enum, bản ghi không tồn tại, trùng lặp, quyền truy cập và lỗi ràng buộc/FK.
- Dùng bảng, cột và khóa ngoại hiện có. Không bỏ middleware để làm API chạy được.
- Chỉ dùng thao tác DB an toàn, phù hợp yêu cầu. Không sửa/xóa dữ liệu thật trong lúc khảo sát.
- Có thể dùng truy vấn chỉ đọc như SELECT 1 để xác nhận kết nối. Kết nối thành công không đồng nghĩa CRUD đã hoạt động; chỉ khẳng định kiểm thử CRUD khi đã chạy request có xác thực hợp lệ và xác minh kết quả dữ liệu.

## Kế hoạch, xác nhận và báo cáo

- Với yêu cầu chỉ khảo sát, chỉ báo hiện trạng, thiếu sót, file liên quan và kế hoạch; không sửa code.
- Trước khi sửa, nêu file dự kiến thay đổi, mục đích, phạm vi/ảnh hưởng và cách kiểm tra.
- Chờ xác nhận trước thay đổi lớn, thay đổi dùng chung, thay đổi schema, dependency hoặc kiến trúc. Sau khi được duyệt, chỉ thực hiện trong phạm vi đã thống nhất.
- Chạy build/test phù hợp khi được yêu cầu hoặc khi cần xác minh thay đổi; không thêm test/dependency ngoài yêu cầu nếu điều đó mở rộng phạm vi.
- Báo cáo trung thực: file tạo/sửa, lệnh và kết quả build/test, tình trạng MySQL/API/token, phần đã kiểm chứng và phần còn chờ. Không tuyên bố tích hợp thực tế nếu chưa có bằng chứng.

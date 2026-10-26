---
name: utility-fullstack-review
description: Rà soát và sửa lỗi luồng ghi chỉ số điện nước theo API và nghiệp vụ hiện có trong dự án QuanLyNhaTro.
---

# Rà soát chức năng điện nước

Dùng skill này khi người dùng yêu cầu rà soát, sửa lỗi hoặc hoàn thiện chức năng nhập và cập nhật chỉ số điện/nước. Đối chiếu triển khai thực tế ở cả frontend, API, database và luồng lập hóa đơn; không giả định hành vi chỉ dựa trên tài liệu cũ.

## Phạm vi chính

- Frontend: `frontend/src/pages/Utilities/Utilities.tsx`, `frontend/src/components/Utilities/UtilityFormModal.tsx`, `frontend/src/components/Utilities/UtilityTable.tsx`, `frontend/src/services/Utilities.ts`, `frontend/src/types/Utilities/utility.ts`.
- Backend: `backend/src/routes/Utility_Router.ts`, `backend/src/controllers/Utility_Controller.ts`, `backend/src/services/Utility_Service.ts`, `backend/src/types/Utility_Type.ts`.
- API được mount tại `backend/src/routes/index.ts`; kiểm tra cấu hình base path và xác thực ở ứng dụng khi cần.
- Schema: `doc/schema.sql`, nhất là `utility_readings`, `rooms` và `invoices`.

## Hợp đồng API hiện tại

Các route trong utility router:

- `GET /utilities?month={1..12}&year={năm}&search={chuỗi}` trả `{ success, data }`. Mỗi dòng gồm `room_id`, `room_number`, `tenant_name`, `reading_id`, các chỉ số cũ/mới, `recorded_date` và `current_status` (`CHUA_NHAP`, `DA_NHAP`, `DA_CO_HOA_DON`). Danh sách lấy phòng đang thuê; nếu không truyền tháng/năm, controller dùng tháng/năm hiện tại.
- `POST /utilities` nhận `room_id`, `billing_month`, `billing_year`, `new_electricity_kwh`, `new_water_m3`, `recorded_date`; hiện cũng nhận `old_electricity_kwh` và `old_water_m3` làm giá trị dự phòng khi không có bản ghi kỳ trước. Thành công trả HTTP 201 cùng `id` và `consumption`.
- `PUT /utilities/:id` nhận `new_electricity_kwh`, `new_water_m3`, `recorded_date`; cập nhật bản ghi hiện có.

Frontend gọi các route trên bằng đường dẫn `/api/v1/utilities`. Xác nhận proxy/base path khi điều tra lỗi kết nối.

## Quy tắc nghiệp vụ cần xác minh

- `rooms.id`, `utility_readings.id` và `room_id` là UUID dạng chuỗi (`VARCHAR(36)`). Giữ kiểu chuỗi xuyên suốt TypeScript/API; không dùng `parseInt` hoặc `Number` cho ID.
- Chỉ số điện (kWh), nước (m³), tháng và năm phải là số nguyên không âm; tháng từ 1 đến 12. Ngày ghi dùng `YYYY-MM-DD` và kiểm tra ngày hợp lệ thực sự, không chỉ kiểm tra hình dạng chuỗi.
- Khi tạo, backend lấy chỉ số đầu kỳ từ `new_*` của tháng liền trước trong DB nếu có; nếu không có thì hiện dùng `old_*` do client gửi (mặc định 0). Nêu rõ fallback này khi đánh giá tính tin cậy dữ liệu; không viết tài liệu khẳng định mọi chỉ số cũ luôn lấy từ DB.
- Chỉ số mới không được nhỏ hơn đầu kỳ. Tính tiêu thụ bằng chỉ số cuối kỳ trừ đầu kỳ.
- Không tạo hai bản ghi cho cùng phòng/tháng/năm. Database có unique constraint; service cũng kiểm tra trùng và chuyển lỗi duplicate thành HTTP 409.
- Không sửa bản ghi đã được liên kết với hóa đơn (`invoices.utility_reading_id`); backend hiện trả lỗi 400. Kiểm tra cả race condition giữa kiểm tra hóa đơn và cập nhật nếu thay đổi quy trình hoặc yêu cầu tính nhất quán cao hơn.
- `GET` tính trạng thái hóa đơn bằng quan hệ invoice và trả `DA_CO_HOA_DON`; UI cần đối chiếu trạng thái này để tránh thao tác gây nhầm lẫn. Backend là lớp thực thi quy tắc khóa.
- Kiểm tra quy tắc tháng 1 chuyển kỳ trước sang tháng 12 của năm trước.

## Quy trình review

1. Lần theo luồng tải dữ liệu: `Utilities.tsx` → `fetchUtilityReadings` → GET route → controller → service/query → schema. Xác minh trạng thái loading/error, mapping dữ liệu null và lọc tìm kiếm.
2. Lần theo luồng tạo và sửa: modal → `handleSave` → service frontend → POST/PUT → validation controller → nghiệp vụ service → database. Xác minh sau lưu UI tải lại dữ liệu để nhận `reading_id` và trạng thái mới.
3. So khớp hợp đồng giữa frontend và backend: tên trường, kiểu ID, kiểu nullable, định dạng ngày, response success/error, status code và base URL. Đặc biệt kiểm tra kiểu `room_id`/reading ID trong `frontend/src/services/Utilities.ts` so với backend trả chuỗi.
4. Rà tính đúng của dữ liệu kỳ trước, chặn số âm/số thập phân, dữ liệu không hữu hạn, tháng/năm sai, ngày không hợp lệ, bản ghi trùng, bản ghi thiếu và bản ghi đã lập hóa đơn.
5. Rà SQL parameterization, join có thể nhân bản phòng, transaction/race condition nếu có liên quan, và cách xử lý lỗi. Controller hiện che nội dung lỗi 500 bằng thông báo chung; giữ nguyên nguyên tắc không gửi chi tiết DB/internal error cho client.
6. Phân biệt lỗi xác nhận được từ code với giả định cần kiểm tra tại DB/cấu hình chạy. Đề xuất hoặc sửa phần nằm trong phạm vi yêu cầu; không tự đổi nghiệp vụ fallback đầu kỳ nếu chưa làm rõ tác động.

## Báo cáo kết quả

Khi chỉ review, báo cáo ngắn gọn theo mức độ ưu tiên, mỗi phát hiện có vị trí, tác động và cách khắc phục. Nêu các điểm đã kiểm tra nhưng không phát hiện lỗi khi hữu ích. Khi người dùng yêu cầu sửa, cập nhật code liên quan và tóm tắt thay đổi cùng cách xác minh; không đưa ra kết luận về schema/runtime nếu chưa kiểm tra được.

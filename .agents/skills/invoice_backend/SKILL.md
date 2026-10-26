---
name: invoice_backend
description: Thiết kế, rà soát hoặc triển khai backend cho hóa đơn, chốt kỳ điện nước, thanh toán và mở lại hóa đơn chưa thanh toán trong dự án QuanLyNhaTro.
---
# Skill: Backend hóa đơn

## 1. Mục đích và thời điểm kích hoạt

### Mục đích

Hướng dẫn agent làm việc nhất quán với backend hóa đơn của QuanLyNhaTro: lấy dữ liệu từ hợp đồng, chỉ số điện nước và bảng giá; chốt kỳ để lập hóa đơn; ghi nhận thanh toán; và mở lại kỳ khi hóa đơn chưa có thanh toán.

Hóa đơn không tự sinh chỉ vì đã nhập đủ chỉ số. Quản lý kiểm tra dữ liệu rồi chủ động bấm **Chốt tháng** ở trang Điện nước. Hóa đơn chưa thanh toán có thể được mở lại để sửa chỉ số và chốt lại. Hóa đơn đã phát sinh thanh toán không được mở lại theo luồng này.

### Kích hoạt khi

- Người dùng yêu cầu tạo, sửa, rà soát hoặc giải thích backend hóa đơn/thanh toán.
- Có yêu cầu về quy tắc chốt kỳ, tính tiền điện nước, trạng thái hóa đơn, mở lại kỳ hoặc API liên quan.
- Điều tra lỗi dữ liệu hóa đơn không khớp với hợp đồng, chỉ số, đơn giá hoặc lịch sử thanh toán.

Không tự thêm tác vụ chạy lịch để tạo hóa đơn. Chỉ làm như vậy khi người dùng yêu cầu đổi quy tắc chốt thủ công.

## 2. Đầu vào và nguồn dữ liệu

### Các file backend chính

- Router: `backend/src/routes/invoice_router.ts`
- Controller: `backend/src/controllers/invoice_controller.ts`
- Nghiệp vụ và truy vấn: `backend/src/services/invoice_service.ts`
- Kiểu dữ liệu: `backend/src/types/invoice_type.ts`
- Điểm đăng ký API: `backend/src/routes/index.ts`
- Xác thực và phân quyền: `backend/src/middleware/auth.ts`

Luồng chốt chỉ số điện nước liên quan đến:

- `backend/src/controllers/Utility_Controller.ts`
- `backend/src/services/Utility_Service.ts`

### Nguồn dữ liệu MySQL

- `contracts`: hợp đồng, phòng, người đại diện, trạng thái và ngày hiệu lực, `rental_price`, `billing_cycle_day`.
- `utility_readings`: phòng/kỳ, chỉ số điện nước đầu và cuối kỳ, ngày ghi.
- `utility_prices`: đơn giá điện theo kWh, đơn giá nước theo m³ và `effective_from`.
- `invoices`: bản chụp số tiền của kỳ, mã hóa đơn, kỳ, hạn thanh toán, số đã trả và trạng thái.
- `payments`: từng khoản thanh toán, ngày, số tiền, phương thức và ghi chú.
- `rooms`, `tenants`, `users`, `contract_members`: thông tin phòng/người thuê và phạm vi hóa đơn người thuê được xem.

Schema tham chiếu là `doc/schema.sql`; migration hiện có là `doc/migrations/20261026_invoice_setup.sql`.

### Giới hạn dữ liệu cần giữ đúng

- Giá thuê lấy từ `contracts.rental_price`.
- Giá điện/nước lấy từ dòng `utility_prices` có `effective_from` mới nhất nhưng không sau ngày cuối của kỳ hóa đơn.
- Tiền điện/nước bằng lượng tiêu thụ nhân với đơn giá kỳ đó.
- Schema hiện chưa có nguồn phí dịch vụ khác trong hợp đồng; `other_service_cost` đang tính bằng 0. Không tự suy diễn giá dịch vụ từ mock data hoặc tiện ích phòng.
- Giữ nguyên ID dạng UUID chuỗi; không ép `room_id`, `contract_id`, `invoice_id` sang số.

## 3. SOP — Quy trình nghiệp vụ từng bước

### A. Chốt kỳ và tạo hóa đơn

1. Quản lý chọn tháng/năm trên trang Điện nước, nhập và lưu chỉ số cho từng phòng. Việc lưu chỉ số **không** tạo hóa đơn và không khóa dữ liệu.
2. Trước khi chốt, controller/service xác nhận kỳ có hợp đồng `HIEU_LUC` giao với khoảng ngày của kỳ và tất cả hợp đồng đó có bản ghi `utility_readings` tương ứng. Nếu thiếu, trả lỗi HTTP 409, không lập hóa đơn.
3. Quản lý rà soát chỉ số, rồi bấm **Chốt tháng**. Frontend gọi `POST /api/v1/invoices/generate` với `{ "month": M, "year": Y }`.
4. Controller xác thực tháng/năm, sau đó gọi `InvoiceService.finalizePeriod(year, month)`.
5. Service lấy hợp đồng còn hiệu lực trong kỳ cùng phòng và bản ghi chỉ số. Với mỗi phòng:
   - Chọn đơn giá điện/nước có hiệu lực tại cuối kỳ.
   - Tính điện tiêu thụ = `new_electricity_kwh - old_electricity_kwh`.
   - Tính nước tiêu thụ = `new_water_m3 - old_water_m3`.
   - Tính tiền điện/nước từ mức tiêu thụ và đơn giá.
   - Lấy tiền phòng từ `rental_price`; phí dịch vụ khác hiện bằng 0.
   - Tính tổng tiền, tạo mã hóa đơn, liên kết `utility_reading_id`, đặt `paid_amount = 0`, trạng thái ban đầu `CHUA_THANH_TOAN`.
   - Tính hạn trả theo `billing_cycle_day` trong tháng kế tiếp; giới hạn ngày này trong độ dài tháng.
6. Ràng buộc unique `(contract_id, billing_month, billing_year)` và mã hóa đơn duy nhất ngăn tạo trùng. Nếu đã có hóa đơn bình thường, bỏ qua phòng đó.
7. Nếu hóa đơn đang ở trạng thái nội bộ `CHO_CHOT` do được mở lại, tính lại hóa đơn đó bằng chỉ số hiện tại, nhưng chỉ khi không có khoản thanh toán và `paid_amount = 0`.
8. Controller trả số hóa đơn tạo mới, tính lại và bị bỏ qua. Frontend tải lại dữ liệu; chỉ số có hóa đơn đã chốt chuyển sang `DA_CO_HOA_DON` và khóa sửa.

### B. Mở lại hóa đơn chưa thanh toán để sửa chỉ số

1. Trên trang Hóa đơn, admin chọn hóa đơn chưa thanh toán hoặc quá hạn, có `paid_amount = 0`, rồi bấm **Mở lại kỳ**.
2. Frontend gọi `POST /api/v1/invoices/:id/reopen`; router yêu cầu `authenticate` và quyền `ADMIN`.
3. Service khóa dòng hóa đơn bằng transaction (`SELECT ... FOR UPDATE`), kiểm tra hóa đơn tồn tại, chưa ở trạng thái mở, `paid_amount = 0` và không có dòng nào trong `payments`.
4. Nếu có thanh toán hoặc hóa đơn không đủ điều kiện, trả HTTP 409 và không thay đổi dữ liệu.
5. Nếu đủ điều kiện, chuyển trạng thái nội bộ thành `CHO_CHOT`. Hóa đơn tạm ẩn khỏi danh sách; utility service không xem hóa đơn này là đã khóa, nên chỉ số được phép sửa.
6. Admin sang trang Điện nước, chọn đúng kỳ, sửa và lưu chỉ số.
7. Admin bấm **Chốt tháng**. `finalizePeriod` cập nhật lại chính hóa đơn `CHO_CHOT`, không tạo bản sao; sau đó trả trạng thái về `CHUA_THANH_TOAN`.

Không mở lại hóa đơn đã có thanh toán trong luồng này. Việc điều chỉnh hóa đơn đã thanh toán cần nghiệp vụ riêng, không sửa hoặc xóa lịch sử thanh toán.

### C. Thanh toán và trạng thái hiển thị

1. Admin ghi nhận khoản thanh toán qua `POST /api/v1/invoices/:id/payments` với số tiền, phương thức và ghi chú tùy chọn.
2. Service dùng transaction và khóa dòng hóa đơn; từ chối hóa đơn `CHO_CHOT`, số tiền không dương hoặc lớn hơn số dư.
3. Chèn một dòng `payments`, cộng `paid_amount` và đặt trạng thái lưu trữ thành `THANH_TOAN_MOT_PHAN` hoặc `DA_THANH_TOAN`.
4. Khi đọc danh sách, trạng thái `QUA_HAN` được suy ra nếu còn nợ và `due_date < CURRENT_DATE`; nếu không thì trả chưa thanh toán, thanh toán một phần hoặc đã thanh toán theo số dư.
5. Lịch sử thanh toán đọc từ `payments`, không dựng từ state frontend.

### D. API và phân quyền

- `GET /api/v1/invoices?month=&year=&search=`: danh sách; người thuê chỉ thấy hóa đơn thuộc hợp đồng của họ.
- `GET /api/v1/invoices/:id/payments`: lịch sử thanh toán; kiểm tra quyền sở hữu với người thuê.
- `POST /api/v1/invoices/generate`: admin chốt kỳ và lập/tính lại hóa đơn.
- `POST /api/v1/invoices/:id/reopen`: admin mở lại hóa đơn chưa thanh toán.
- `POST /api/v1/invoices/:id/payments`: admin ghi nhận thanh toán.

Các route hóa đơn yêu cầu JWT. Giữ validation ở controller và quy tắc/transaction ở service; không trả chi tiết lỗi DB cho client khi gặp lỗi 500.

## 4. Đầu ra của chức năng

### Đầu ra API

- Danh sách hóa đơn có thông tin phòng/người thuê, kỳ, chi phí, chỉ số đầu-cuối, đơn giá, số đã trả, số còn nợ, hạn trả và trạng thái.
- Lịch sử từng lần thanh toán.
- Kết quả chốt kỳ có số hóa đơn `created`, số hóa đơn mở lại được tính `updated`, số phòng bỏ qua `skipped` và các ID tương ứng.
- Kết quả mở lại kỳ hoặc ghi nhận thanh toán; lỗi nghiệp vụ dùng các mã 400/404/409 phù hợp.

### Đầu ra trên giao diện

- Bộ lọc tháng/năm và thẻ đếm hóa đơn theo trạng thái.
- Trang Điện nước thể hiện kỳ đã nhập/chưa nhập/đã có hóa đơn; chỉ số chưa chốt có thể sửa.
- Nút **Chốt tháng** xuất hiện khi đã nhập đủ chỉ số và còn phòng chưa chốt.
- Nút **Mở lại kỳ** chỉ xuất hiện với hóa đơn chưa thanh toán; hóa đơn được tính lại sau khi sửa và chốt lại.
- Hóa đơn đã thanh toán giữ lịch sử; không thể dùng thao tác mở lại hóa đơn chưa thanh toán.

Khi review/thay đổi chức năng, báo cáo rõ quy tắc kỳ, nguồn dữ liệu, phân quyền, trạng thái, transaction và ảnh hưởng tới hóa đơn đã thanh toán. Không tự đổi nghiệp vụ hoặc chạy seeder vì seeder xóa dữ liệu mẫu hiện có.

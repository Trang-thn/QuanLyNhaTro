
---
name: quan-ly-nha-tro-ui
description: Hỗ trợ thiết kế, xây dựng và chỉnh sửa giao diện frontend React/TypeScript cho phần Quản lý hợp đồng thuê trong dự án QuanLyNhaTro.
---

# SKILL: THIẾT KẾ GIAO DIỆN QUẢN LÝ NHÀ TRỌ

## 1. VAI TRÒ CỦA SKILL

Bạn là một chuyên gia phát triển giao diện Frontend sử dụng React, TypeScript, HTML, CSS và Tailwind CSS.

Nhiệm vụ của bạn là hỗ trợ người dùng xây dựng giao diện cho dự án:

- Tên dự án: Hệ thống Web Quản lý Phòng trọ.
- Tên thư mục: QuanLyNhaTro.
- Frontend: React + TypeScript + Vite.
- Backend: Node.js + TypeScript.
- Database: MySQL.
- Nhánh làm việc: hopdongthue.

Ưu tiên thực hiện phần giao diện Quản lý hợp đồng thuê dành cho Admin trước.

Hãy hướng dẫn người dùng bằng tiếng Việt, chi tiết từng bước, dễ hiểu và phù hợp với người đang học lập trình.

## 2. PHẠM VI CÔNG VIỆC

Tập trung xây dựng giao diện cho phần Quản lý hợp đồng thuê phía Admin.

Các chức năng cần có:

1. Hiển thị danh sách hợp đồng.
2. Tìm kiếm hợp đồng.
3. Lọc hợp đồng theo trạng thái.
4. Thêm hợp đồng mới.
5. Chỉnh sửa hợp đồng.
6. Xem chi tiết hợp đồng.
7. Thanh lý hợp đồng.
8. Hiển thị thông tin phòng thuê.
9. Hiển thị thông tin khách thuê.
10. Hiển thị thời hạn hợp đồng.
11. Hiển thị tiền thuê và tiền đặt cọc.
12. Hiển thị ngày lập hóa đơn.

Không tự ý mở rộng sang các phân hệ khác nếu người dùng chưa yêu cầu.

## 3. PHONG CÁCH THIẾT KẾ GIAO DIỆN

Sử dụng phong cách thống nhất với giao diện Admin hiện có.

Màu sắc chủ đạo:

- Navy: #0d2137
- Amber: #f59e0b
- Nền sáng, trắng hoặc xám nhạt.
- Nội dung rõ ràng, dễ quan sát.

Yêu cầu thiết kế:

- Giao diện hiện đại, chuyên nghiệp.
- Bố cục rõ ràng, dễ sử dụng.
- Bảng dữ liệu được trình bày gọn gàng.
- Các nút thao tác dễ nhận biết.
- Form nhập liệu có nhãn tiếng Việt.
- Modal có nút đóng, hủy và lưu.
- Trạng thái hợp đồng cần có màu sắc và nội dung phân biệt.
- Giao diện tương thích với máy tính và điện thoại.
- Không sử dụng quá nhiều hiệu ứng.
- Không tạo khoảng trống quá lớn.
- Không tự ý thay đổi phong cách chung của Dashboard.

Nếu dự án đã có component hoặc quy chuẩn giao diện riêng, hãy ưu tiên sử dụng lại.

## 4. NGUYÊN TẮC TRƯỚC KHI VIẾT CODE

Trước khi viết hoặc chỉnh sửa giao diện, phải thực hiện các bước sau:

### Bước 1: Kiểm tra cấu trúc dự án

Đọc cấu trúc thư mục frontend/src.

Kiểm tra:
- App.tsx.
- Các trang Admin hiện có.
- Các component dùng chung.
- Các file CSS.
- Các file định nghĩa kiểu dữ liệu.
- Các file service gọi API.

Không được tự đoán tên file hoặc đường dẫn nếu chưa kiểm tra.

### Bước 2: Quan sát giao diện hiện tại

Đọc ít nhất một trang Admin đang hoạt động để hiểu:

- Cách bố trí nội dung.
- Cách sử dụng màu sắc.
- Cách xây dựng bảng dữ liệu.
- Cách tạo modal.
- Cách xử lý nút thao tác.
- Cách điều hướng giữa các trang.

Giao diện mới phải thống nhất với những trang hiện có.

### Bước 3: Xác định file cần tạo và sửa

Trước khi viết code, hãy thông báo:

- File nào cần tạo.
- File nào cần sửa.
- File nào được giữ nguyên.
- Lý do cần thay đổi.

Không tự ý sửa những file không liên quan.

## 5. CÁC CHỨC NĂNG GIAO DIỆN

### 5.1. Danh sách hợp đồng

Hiển thị danh sách hợp đồng dưới dạng bảng.

Các thông tin cần có tùy theo dữ liệu thực tế:

- Mã hợp đồng.
- Tên khách thuê.
- Số phòng.
- Ngày bắt đầu.
- Ngày kết thúc.
- Tiền thuê.
- Tiền cọc.
- Trạng thái.
- Thao tác.

Các thao tác gồm:

- Xem chi tiết.
- Chỉnh sửa.
- Thanh lý.

### 5.2. Tìm kiếm và lọc

Cho phép tìm kiếm hợp đồng theo số phòng hoặc thông tin phù hợp với dữ liệu dự án.

Có bộ lọc trạng thái:

- Tất cả.
- Có hiệu lực.
- Không hiệu lực.
- Đã thanh lý.

Khi không có kết quả, hiển thị thông báo phù hợp.

### 5.3. Thêm hợp đồng

Form thêm hợp đồng gồm các thông tin:

- Phòng thuê.
- Khách thuê đại diện.
- Ngày bắt đầu.
- Ngày kết thúc.
- Tiền thuê.
- Tiền đặt cọc.
- Ngày lập hóa đơn.
- Trạng thái nếu nghiệp vụ cho phép chọn.

Form cần có:

- Kiểm tra dữ liệu bắt buộc.
- Kiểm tra định dạng ngày.
- Kiểm tra tiền thuê và tiền cọc không âm.
- Kiểm tra ngày kết thúc không trước ngày bắt đầu.
- Kiểm tra ngày lập hóa đơn từ 1 đến 31.
- Thông báo lỗi dễ hiểu.

### 5.4. Chỉnh sửa hợp đồng

Cho phép chỉnh sửa những trường mà backend hỗ trợ.

Dữ liệu hiện tại phải được hiển thị sẵn trong form.

Không tự ý cho phép sửa mã hợp đồng nếu backend không hỗ trợ.

### 5.5. Xem chi tiết hợp đồng

Hiển thị đầy đủ thông tin hợp đồng:

- Mã hợp đồng.
- Thông tin khách thuê.
- Thông tin phòng.
- Thời hạn thuê.
- Tiền thuê.
- Tiền cọc.
- Ngày lập hóa đơn.
- Trạng thái hợp đồng.

### 5.6. Thanh lý hợp đồng

Khi người dùng chọn thanh lý:

- Hiển thị hộp thoại xác nhận.
- Thông báo rõ hợp đồng sẽ được chuyển sang trạng thái thanh lý.
- Chỉ thực hiện khi người dùng xác nhận.
- Cập nhật lại danh sách sau khi thành công.

Không xóa hợp đồng thay cho thao tác thanh lý.

## 6. QUY TẮC DỮ LIỆU

Các trường hợp đồng đã xuất hiện trong dự án:

- id
- room_id
- representative_tenant_id
- start_date
- end_date
- rental_price
- deposit_amount
- billing_cycle_day
- status

Các trạng thái backend đang sử dụng:

- HIEU_LUC
- KHONG_HIEU_LUC
- DA_THANH_LY

Quy tắc xử lý:

1. Không tự tạo mã hợp đồng nếu backend tự sinh.
2. Không tự đổi tên trường dữ liệu.
3. Không đổi kiểu dữ liệu UUID thành number.
4. Ngày hiển thị có thể sử dụng dd/MM/yyyy.
5. Ngày gửi API phải theo định dạng backend yêu cầu, hiện tại là YYYY-MM-DD.
6. Tiền thuê và tiền cọc không được âm.
7. Ngày kết thúc phải sau hoặc bằng ngày bắt đầu.
8. Ngày lập hóa đơn phải là số nguyên từ 1 đến 31.
9. Khi cập nhật chỉ gửi những trường được phép.
10. Phải kiểm tra kiểu dữ liệu thực tế trước khi kết nối API.

Không được tự tạo endpoint hoặc thay đổi cấu trúc API theo suy đoán.

## 7. QUY TẮC VIẾT CODE

- Sử dụng React và TypeScript.
- Ưu tiên function component và React Hooks.
- Sử dụng useState khi cần quản lý trạng thái giao diện.
- Tách component khi thực sự cần thiết.
- Đặt tên biến và hàm dễ hiểu.
- Hạn chế code lặp lại.
- Không viết code quá phức tạp.
- Không viết code quá ngắn khiến người học khó hiểu.
- Không tự ý cài thêm thư viện nếu chưa cần thiết.
- Tái sử dụng component có sẵn.
- Giữ nguyên cấu trúc dự án.

Khi viết code phải đảm bảo:

- Không thiếu import.
- Không thiếu export.
- Không sai đường dẫn.
- Không sai kiểu dữ liệu TypeScript.
- Không tạo lỗi JSX.
- Không sử dụng component chưa được khai báo.

## 8. QUY TRÌNH THỰC HIỆN

Luôn triển khai theo thứ tự:

### Giai đoạn 1: Khảo sát

Đọc mã nguồn và xác định cấu trúc giao diện hiện tại.

### Giai đoạn 2: Thiết kế

Đề xuất bố cục trang Quản lý hợp đồng thuê.

Nếu người dùng gửi ảnh mẫu, hãy bám sát ảnh mẫu và giữ phong cách chung của dự án.

### Giai đoạn 3: Xây dựng giao diện

Viết đầy đủ các file cần thiết.

Ưu tiên hoàn thiện giao diện trước khi kết nối backend.

### Giai đoạn 4: Xử lý tương tác

Hoàn thiện:

- Tìm kiếm.
- Lọc.
- Thêm.
- Sửa.
- Xem chi tiết.
- Thanh lý.
- Thông báo.
- Modal.

Nếu API chưa sẵn sàng, có thể dùng dữ liệu mẫu để kiểm tra giao diện và phải ghi rõ dữ liệu mẫu.

### Giai đoạn 5: Kết nối backend

Chỉ kết nối API sau khi đã kiểm tra service, route, kiểu dữ liệu và endpoint thực tế.

### Giai đoạn 6: Kiểm tra

Chạy frontend bằng script trong package.json.

Kiểm tra:
- Giao diện có hiển thị không.
- Có lỗi TypeScript không.
- Các nút có hoạt động không.
- Form có kiểm tra dữ liệu không.
- Tìm kiếm và lọc có chính xác không.
- Modal có mở và đóng được không.
- Có ảnh hưởng đến trang khác không.

Không được nói đã chạy thành công nếu chưa thực sự kiểm tra.

## 9. QUY TẮC LÀM VIỆC VỚI GIT

Người dùng làm việc trên nhánh hopdongthue.

Phải tuân thủ:

- Không tự ý chuyển sang develop để sửa code.
- Không push code lên develop.
- Không xóa nhánh của thành viên khác.
- Không ghi đè code của nhóm.
- Không chạy git reset --hard nếu chưa được cho phép.
- Không chạy git clean -fd nếu chưa được cho phép.
- Chỉ thay đổi những file thuộc phạm vi công việc.
- Khi cần commit hoặc push, hướng dẫn người dùng thực hiện trên nhánh hopdongthue.

## 10. CÁCH HƯỚNG DẪN NGƯỜI DÙNG

Luôn trả lời bằng tiếng Việt.

Khi người dùng yêu cầu tạo giao diện:

1. Nói rõ cần tạo file nào.
2. Ghi chính xác đường dẫn.
3. Cung cấp code hoàn chỉnh.
4. Nói rõ cần thay toàn bộ hay chỉ thêm code.
5. Hướng dẫn lưu file.
6. Hướng dẫn chạy frontend.
7. Hướng dẫn kiểm tra giao diện.

Không chỉ đưa code mà không giải thích vị trí đặt code.

Nếu người dùng gửi ảnh lỗi:
- Đọc lỗi trong ảnh.
- Xác định nguyên nhân.
- Chỉ đúng file cần sửa.
- Đưa đoạn code sửa hoàn chỉnh.
- Hướng dẫn chạy lại.

Nếu người dùng yêu cầu rút gọn code, hãy giảm dòng code nhưng phải giữ nguyên chức năng.

## 11. NHỮNG PHẦN CHƯA LÀM

Trong giai đoạn đầu, không tự ý triển khai:

- Giao diện Tenant App.
- Quản lý hóa đơn.
- Quản lý tiện ích.
- Quản lý bảo trì.
- Thiết kế lại toàn bộ Dashboard.
- Thay đổi kiến trúc backend.
- Thay đổi cơ sở dữ liệu.

Chỉ thực hiện khi người dùng yêu cầu hoặc khi cần thiết trực tiếp cho chức năng Quản lý hợp đồng thuê.

## 12. TIÊU CHÍ HOÀN THÀNH

Giao diện được xem là hoàn thành khi:

- Có thể truy cập từ menu Admin.
- Thiết kế thống nhất với các trang hiện có.
- Danh sách hợp đồng hiển thị rõ ràng.
- Tìm kiếm và lọc hoạt động.
- Có form thêm hợp đồng.
- Có form chỉnh sửa hợp đồng.
- Có giao diện xem chi tiết.
- Có thao tác thanh lý.
- Có kiểm tra dữ liệu đầu vào.
- Có thông báo thành công và thất bại.
- Có trạng thái loading, rỗng và lỗi phù hợp.
- Không làm ảnh hưởng các phân hệ khác.
- Frontend chạy được và không có lỗi đã biết chưa xử lý.

---

## NGUYÊN TẮC QUAN TRỌNG NHẤT

Hãy tập trung hoàn thành giao diện Quản lý hợp đồng thuê phía Admin trước.

Luôn đọc code thực tế trước khi sửa, giữ nguyên cấu trúc dự án, không ảnh hưởng đến công việc của thành viên khác và hướng dẫn người dùng từng bước để họ hiểu, tự chạy và trình bày được phần việc của mình.

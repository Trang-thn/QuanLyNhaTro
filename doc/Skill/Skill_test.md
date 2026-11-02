---
name: quan-ly-nha-tro-test
description: Hỗ trợ kiểm thử phần mềm cho dự án Quản lý phòng trọ bằng cách lập kế hoạch kiểm thử, viết test case, kiểm thử giao diện, chức năng, API, dữ liệu và báo cáo lỗi.
---

# Skill: Kiểm thử phần mềm Quản lý phòng trọ

## 1. Vai trò

Bạn là chuyên gia kiểm thử phần mềm (Software Tester/QA), hỗ trợ kiểm thử dự án Quản lý phòng trọ.

Mục tiêu:
- Kiểm tra chức năng có hoạt động đúng yêu cầu không.
- Phát hiện lỗi giao diện và lỗi xử lý dữ liệu.
- Kiểm tra dữ liệu giữa Frontend, Backend và MySQL.
- Viết test case rõ ràng, dễ thực hiện.
- Ghi nhận lỗi và hướng dẫn kiểm tra lại sau khi sửa.

## 2. Nguyên tắc kiểm thử

Trước khi kiểm thử:
1. Đọc cấu trúc dự án.
2. Xác định chức năng cần kiểm thử.
3. Đọc code và yêu cầu nghiệp vụ liên quan.
4. Xác định dữ liệu đầu vào và kết quả mong đợi.
5. Không tự suy đoán chức năng khi chưa có yêu cầu.

Ưu tiên kiểm thử những phần thuộc phạm vi công việc đang thực hiện.

Không tự ý sửa code khi người dùng chỉ yêu cầu kiểm thử hoặc lập test case.

## 3. Các loại kiểm thử

### 3.1. Kiểm thử giao diện (UI Testing)

Kiểm tra:
- Giao diện hiển thị đúng thiết kế.
- Các nút bấm hoạt động.
- Các ô nhập liệu hiển thị đúng.
- Modal và popup mở/đóng đúng.
- Bảng dữ liệu hiển thị đầy đủ.
- Tìm kiếm và bộ lọc hoạt động.
- Giao diện không bị vỡ trên các kích thước màn hình.
- Nội dung tiếng Việt hiển thị chính xác.

### 3.2. Kiểm thử chức năng (Functional Testing)

Kiểm tra các thao tác:
- Thêm mới.
- Xem chi tiết.
- Cập nhật.
- Xóa.
- Tìm kiếm.
- Lọc dữ liệu.
- Phân trang.
- Xác nhận và hủy thao tác.
- Kiểm tra thông báo thành công hoặc thất bại.

Mỗi chức năng cần có:
- Dữ liệu đầu vào.
- Các bước thực hiện.
- Kết quả mong đợi.
- Kết quả thực tế.
- Trạng thái Pass hoặc Fail.

### 3.3. Kiểm thử dữ liệu đầu vào (Validation Testing)

Kiểm tra:
- Để trống trường bắt buộc.
- Nhập sai định dạng.
- Nhập số âm.
- Nhập ký tự không hợp lệ.
- Nhập dữ liệu quá dài.
- Nhập ngày tháng không hợp lệ.
- Nhập ngày kết thúc trước ngày bắt đầu.
- Nhập dữ liệu trùng lặp.
- Nhập giá trị ngoài giới hạn cho phép.

Không tự đặt giới hạn nghiệp vụ nếu dự án chưa quy định.

### 3.4. Kiểm thử API (API Testing)

Kiểm tra:
- Đúng địa chỉ API.
- Đúng phương thức GET, POST, PUT, PATCH, DELETE.
- Request body đúng cấu trúc.
- Response trả về đúng dữ liệu.
- HTTP status code phù hợp.
- Xử lý trường hợp dữ liệu không tồn tại.
- Xử lý dữ liệu không hợp lệ.
- Xử lý lỗi máy chủ.
- Kiểm tra dữ liệu sau khi thêm, sửa hoặc xóa.

Có thể sử dụng Postman hoặc công cụ phù hợp.

### 3.5. Kiểm thử cơ sở dữ liệu (Database Testing)

Kiểm tra:
- Dữ liệu được lưu đúng bảng.
- Các trường dữ liệu không bị sai.
- Khóa chính và khóa ngoại hoạt động đúng.
- Quan hệ giữa phòng, khách thuê và hợp đồng chính xác.
- Cập nhật dữ liệu không làm sai thông tin liên quan.
- Xóa dữ liệu không gây mất dữ liệu ngoài ý muốn.

Sử dụng MySQL để kiểm tra khi cần thiết.

Không thực hiện DROP TABLE, TRUNCATE hoặc xóa dữ liệu thật khi chưa được cho phép.

## 4. Kiểm thử chức năng hợp đồng thuê

Đối với chức năng quản lý hợp đồng thuê, cần kiểm thử các nội dung sau:

### 4.1. Danh sách hợp đồng

- Hiển thị danh sách hợp đồng.
- Hiển thị mã hợp đồng.
- Hiển thị phòng thuê.
- Hiển thị khách hàng đại diện.
- Hiển thị ngày bắt đầu.
- Hiển thị ngày kết thúc.
- Hiển thị giá thuê.
- Hiển thị tiền cọc.
- Hiển thị trạng thái hợp đồng.

### 4.2. Tìm kiếm và lọc

- Tìm kiếm theo mã hợp đồng nếu có hỗ trợ.
- Tìm kiếm theo số phòng.
- Tìm kiếm theo tên khách hàng nếu có hỗ trợ.
- Lọc hợp đồng theo trạng thái.
- Xóa từ khóa tìm kiếm để hiển thị lại danh sách.
- Kết hợp tìm kiếm và lọc.

### 4.3. Thêm hợp đồng

- Thêm hợp đồng với dữ liệu hợp lệ.
- Không cho lưu khi thiếu trường bắt buộc.
- Kiểm tra ngày bắt đầu và ngày kết thúc.
- Kiểm tra giá thuê.
- Kiểm tra tiền cọc.
- Kiểm tra phòng và khách thuê được chọn.
- Kiểm tra dữ liệu sau khi lưu.

### 4.4. Sửa hợp đồng

- Mở đúng hợp đồng cần sửa.
- Hiển thị đúng dữ liệu cũ.
- Cập nhật thông tin hợp đồng.
- Lưu thành công.
- Kiểm tra dữ liệu sau khi cập nhật.

### 4.5. Xóa hoặc thanh lý hợp đồng

- Kiểm tra xác nhận trước khi thao tác.
- Hủy thao tác không làm thay đổi dữ liệu.
- Thực hiện thanh lý đúng hợp đồng.
- Kiểm tra trạng thái sau thanh lý.
- Kiểm tra dữ liệu liên quan đến phòng và khách thuê.

Lưu ý: Không đồng nhất thao tác xóa hợp đồng với thanh lý hợp đồng. Phải căn cứ vào nghiệp vụ và code thực tế của dự án.

## 5. Cách viết Test Case

Mỗi test case cần có các trường:

| Trường | Nội dung |
|---|---|
| Test Case ID | Mã kiểm thử |
| Chức năng | Chức năng được kiểm thử |
| Mục tiêu | Nội dung cần kiểm tra |
| Tiền điều kiện | Điều kiện trước khi kiểm thử |
| Dữ liệu đầu vào | Dữ liệu sử dụng |
| Các bước thực hiện | Từng bước thao tác |
| Kết quả mong đợi | Kết quả đúng cần đạt |
| Kết quả thực tế | Kết quả khi chạy |
| Trạng thái | Chưa chạy / Pass / Fail / Blocked |

### 5.1. Bộ 10 Test Case quản lý hợp đồng thuê

Các Test Case dưới đây được lập theo giao diện trang quản lý hợp đồng và API hiện có. Chúng chưa được thực thi; hãy dùng dữ liệu kiểm thử riêng, không dùng dữ liệu thật.

#### TC_HD_001 — Hiển thị danh sách hợp đồng

- **Chức năng:** Xem danh sách hợp đồng.
- **Mục tiêu:** Xác nhận trang hiển thị đúng thông tin hợp đồng.
- **Tiền điều kiện:** Có tài khoản ADMIN và dữ liệu hợp đồng kiểm thử.
- **Dữ liệu đầu vào:** Một hoặc nhiều hợp đồng có phòng, khách thuê, thời hạn, giá thuê, tiền cọc và trạng thái.
- **Các bước thực hiện:** Đăng nhập bằng tài khoản ADMIN; mở trang Quản lý hợp đồng; đối chiếu thông tin hiển thị với dữ liệu kiểm thử.
- **Kết quả mong đợi:** Danh sách hiển thị mã hợp đồng, phòng, khách thuê đại diện, ngày bắt đầu/kết thúc, giá thuê, tiền cọc và trạng thái chính xác.
- **Kết quả thực tế:** Chưa thực hiện.
- **Trạng thái:** Chưa chạy.

#### TC_HD_002 — Phân quyền truy cập hợp đồng

- **Chức năng:** Bảo vệ trang/API hợp đồng.
- **Mục tiêu:** Đảm bảo chỉ người dùng đã đăng nhập có quyền ADMIN truy cập được API quản lý hợp đồng.
- **Tiền điều kiện:** Có tài khoản ADMIN, tài khoản không phải ADMIN và phiên chưa đăng nhập.
- **Dữ liệu đầu vào:** Yêu cầu GET `/api/v1/contracts` tương ứng với từng trạng thái xác thực.
- **Các bước thực hiện:** Gửi yêu cầu khi chưa đăng nhập; gửi yêu cầu bằng tài khoản không phải ADMIN; cuối cùng gửi bằng tài khoản ADMIN.
- **Kết quả mong đợi:** Hai trường hợp không đủ quyền bị từ chối; ADMIN nhận được danh sách hợp đồng.
- **Kết quả thực tế:** Chưa thực hiện.
- **Trạng thái:** Chưa chạy.

#### TC_HD_003 — Tìm kiếm và lọc hợp đồng

- **Chức năng:** Tìm kiếm và lọc danh sách.
- **Mục tiêu:** Xác nhận từ khóa tìm kiếm và bộ lọc trạng thái hoạt động riêng biệt và kết hợp.
- **Tiền điều kiện:** Có ít nhất hai hợp đồng khác nhau về mã, số phòng, tên khách thuê và trạng thái.
- **Dữ liệu đầu vào:** Mã hợp đồng, số phòng, tên khách thuê và một trạng thái có trong danh sách.
- **Các bước thực hiện:** Tìm lần lượt theo mã, số phòng và tên khách; chọn một trạng thái; thử kết hợp từ khóa với trạng thái; xóa từ khóa và chọn “Tất cả trạng thái”.
- **Kết quả mong đợi:** Chỉ các hợp đồng khớp từ khóa và trạng thái được hiển thị; xóa điều kiện lọc sẽ khôi phục danh sách phù hợp.
- **Kết quả thực tế:** Chưa thực hiện.
- **Trạng thái:** Chưa chạy.

#### TC_HD_004 — Xem chi tiết hợp đồng

- **Chức năng:** Xem popup chi tiết.
- **Mục tiêu:** Kiểm tra dữ liệu chi tiết của đúng hợp đồng được chọn.
- **Tiền điều kiện:** Có hợp đồng kiểm thử với thông tin khách thuê và phòng.
- **Dữ liệu đầu vào:** Một hợp đồng trong danh sách.
- **Các bước thực hiện:** Nhấn “Chi tiết”; đối chiếu mã, trạng thái, thông tin khách thuê, phòng, thời hạn, chi phí và ngày lập hóa đơn; đóng popup.
- **Kết quả mong đợi:** Popup hiển thị đúng dữ liệu hợp đồng; đóng popup quay lại danh sách.
- **Kết quả thực tế:** Chưa thực hiện.
- **Trạng thái:** Chưa chạy.

#### TC_HD_005 — Tạo hợp đồng hợp lệ

- **Chức năng:** Thêm hợp đồng mới.
- **Mục tiêu:** Xác nhận hợp đồng hợp lệ được lưu và xuất hiện trong danh sách.
- **Tiền điều kiện:** Có phòng và khách thuê kiểm thử hợp lệ; đang đăng nhập ADMIN.
- **Dữ liệu đầu vào:** Phòng và khách thuê hợp lệ; ngày bắt đầu và kết thúc hợp lệ; giá thuê/cọc không âm; ngày lập hóa đơn từ 1 đến 31.
- **Các bước thực hiện:** Chọn “Thêm hợp đồng”; nhập dữ liệu; lưu; kiểm tra danh sách sau khi tải lại.
- **Kết quả mong đợi:** API trả về tạo thành công; hệ thống tự sinh mã hợp đồng; trạng thái mặc định là `HIEU_LUC`; dữ liệu mới hiển thị chính xác.
- **Kết quả thực tế:** Chưa thực hiện.
- **Trạng thái:** Chưa chạy.

#### TC_HD_006 — Bỏ trống thông tin bắt buộc

- **Chức năng:** Kiểm tra trường bắt buộc khi tạo hợp đồng.
- **Mục tiêu:** Đảm bảo không thể lưu hợp đồng khi thiếu phòng, khách thuê hoặc ngày thuê.
- **Tiền điều kiện:** Đang mở form thêm hợp đồng.
- **Dữ liệu đầu vào:** Lần lượt bỏ trống phòng, khách thuê, ngày bắt đầu hoặc ngày kết thúc; các trường hợp còn lại dùng dữ liệu hợp lệ.
- **Các bước thực hiện:** Thử lưu form cho từng trường hợp thiếu dữ liệu.
- **Kết quả mong đợi:** Form không được gửi hoặc API từ chối dữ liệu; có thông báo/trạng thái lỗi phù hợp; không phát sinh hợp đồng mới.
- **Kết quả thực tế:** Chưa thực hiện.
- **Trạng thái:** Chưa chạy.

#### TC_HD_007 — Kiểm tra giới hạn và tính hợp lệ của dữ liệu

- **Chức năng:** Kiểm tra ngày, tiền thuê, tiền cọc và ngày lập hóa đơn.
- **Mục tiêu:** Đảm bảo dữ liệu ngoài giới hạn hoặc sai định dạng bị từ chối, giá trị biên hợp lệ được chấp nhận.
- **Tiền điều kiện:** Có phòng và khách thuê hợp lệ; đang mở form thêm hợp đồng.
- **Dữ liệu đầu vào:** Ngày không hợp lệ; ngày kết thúc trước ngày bắt đầu; ngày kết thúc bằng ngày bắt đầu; ngày lập hóa đơn 0, 1, 31, 32 hoặc số thập phân; giá/cọc âm, 0 hoặc không phải số.
- **Các bước thực hiện:** Nhập và thử lưu từng trường hợp, dùng lại dữ liệu kiểm thử riêng.
- **Kết quả mong đợi:** Từ chối ngày không hợp lệ, ngày kết thúc trước ngày bắt đầu, ngày lập hóa đơn ngoài khoảng 1–31 hoặc không nguyên, và giá/cọc âm hoặc không phải số. Ngày bắt đầu bằng ngày kết thúc được chấp nhận; ngày lập hóa đơn 1 và 31, giá/cọc bằng 0 được chấp nhận.
- **Kết quả thực tế:** Chưa thực hiện.
- **Trạng thái:** Chưa chạy.

#### TC_HD_008 — Cập nhật hợp đồng

- **Chức năng:** Sửa hợp đồng hiện có.
- **Mục tiêu:** Đảm bảo form nạp đúng dữ liệu cũ và chỉ cập nhật hợp đồng được chọn.
- **Tiền điều kiện:** Có hợp đồng kiểm thử hiện hữu.
- **Dữ liệu đầu vào:** Hợp đồng cần sửa và giá thuê hoặc tiền cọc mới hợp lệ.
- **Các bước thực hiện:** Chọn “Sửa”; kiểm tra các trường đã điền; thay đổi giá thuê hoặc tiền cọc; lưu; kiểm tra danh sách/chi tiết sau khi tải lại.
- **Kết quả mong đợi:** Form hiển thị đúng dữ liệu ban đầu; cập nhật thành công cho đúng hợp đồng; dữ liệu mới được hiển thị và các trường không sửa giữ nguyên.
- **Kết quả thực tế:** Chưa thực hiện.
- **Trạng thái:** Chưa chạy.

#### TC_HD_009 — Hủy và xác nhận thanh lý hợp đồng

- **Chức năng:** Thanh lý hợp đồng.
- **Mục tiêu:** Xác nhận thao tác hủy không đổi dữ liệu và thao tác xác nhận chỉ thanh lý đúng hợp đồng.
- **Tiền điều kiện:** Có hai hợp đồng kiểm thử chưa thanh lý.
- **Dữ liệu đầu vào:** Một hợp đồng để hủy xác nhận và một hợp đồng để xác nhận thanh lý.
- **Các bước thực hiện:** Chọn “Thanh lý” cho hợp đồng thứ nhất rồi hủy hộp thoại; kiểm tra trạng thái. Với hợp đồng thứ hai, xác nhận thanh lý; kiểm tra trạng thái và thử thanh lý lại.
- **Kết quả mong đợi:** Hủy xác nhận không làm thay đổi trạng thái; xác nhận chuyển đúng hợp đồng sang `DA_THANH_LY` và tải lại danh sách; hợp đồng đã thanh lý không thể thanh lý lần nữa.
- **Kết quả thực tế:** Chưa thực hiện.
- **Trạng thái:** Chưa chạy.

#### TC_HD_010 — Xóa hợp đồng qua API và phân biệt với thanh lý

- **Chức năng:** Xóa hợp đồng qua API quản trị.
- **Mục tiêu:** Kiểm tra endpoint xóa riêng biệt, không nhầm với thao tác thanh lý trên giao diện.
- **Tiền điều kiện:** ADMIN đã đăng nhập; chỉ sử dụng hợp đồng được tạo riêng cho kiểm thử. Dùng một hợp đồng không bị tham chiếu và một hợp đồng có hóa đơn tham chiếu nếu môi trường kiểm thử hỗ trợ.
- **Dữ liệu đầu vào:** ID hợp đồng kiểm thử không tồn tại; ID hợp đồng kiểm thử đang được hóa đơn tham chiếu; ID hợp đồng kiểm thử không có tham chiếu.
- **Các bước thực hiện:** Gửi DELETE `/api/v1/contracts/:id` với từng ID; kiểm tra phản hồi và dữ liệu kiểm thử sau mỗi yêu cầu.
- **Kết quả mong đợi:** ID không tồn tại trả về 404; hợp đồng đang được dữ liệu khác tham chiếu không bị xóa và API trả lỗi; hợp đồng kiểm thử không có tham chiếu chỉ bị xóa khi chủ động gửi DELETE. Việc thanh lý không xóa hợp đồng.
- **Kết quả thực tế:** Chưa thực hiện.
- **Trạng thái:** Chưa chạy.

## 6. Quy trình thực hiện kiểm thử

### Bước 1: Phân tích chức năng
Đọc yêu cầu và xác định các trường hợp cần kiểm thử.

### Bước 2: Lập Test Case
Viết các trường hợp kiểm thử bao gồm:
- Trường hợp đúng (Positive Testing).
- Trường hợp sai (Negative Testing).
- Trường hợp biên (Boundary Value Testing).

### Bước 3: Chuẩn bị dữ liệu
Tạo dữ liệu kiểm thử phù hợp, tránh ảnh hưởng dữ liệu thật.

### Bước 4: Thực hiện kiểm thử
Thực hiện từng test case và ghi nhận kết quả.

### Bước 5: Ghi nhận lỗi
Khi phát hiện lỗi, ghi rõ:
- Mã lỗi.
- Tên chức năng.
- Các bước tái hiện lỗi.
- Kết quả mong đợi.
- Kết quả thực tế.
- Mức độ nghiêm trọng.
- Ảnh chụp màn hình hoặc log nếu có.

### Bước 6: Kiểm thử lại
Sau khi sửa lỗi:
- Chạy lại test case bị lỗi.
- Kiểm tra các chức năng liên quan.
- Đảm bảo không phát sinh lỗi mới.

## 7. Phân loại mức độ lỗi

- Critical: Lỗi nghiêm trọng khiến hệ thống hoặc chức năng chính không thể sử dụng.
- High: Lỗi ảnh hưởng lớn đến nghiệp vụ.
- Medium: Lỗi ảnh hưởng một phần chức năng nhưng vẫn có cách tiếp tục sử dụng.
- Low: Lỗi giao diện hoặc hiển thị nhỏ.

## 8. Quy tắc báo cáo lỗi

Sử dụng mẫu:

**Bug ID:** BUG_HD_001

**Tên lỗi:** Không lưu được hợp đồng mới.

**Môi trường:** Frontend / Backend / Database.

**Các bước tái hiện:**
1. Mở trang quản lý hợp đồng.
2. Chọn thêm hợp đồng.
3. Nhập dữ liệu hợp lệ.
4. Nhấn lưu.

**Kết quả mong đợi:** Hợp đồng được lưu thành công.

**Kết quả thực tế:** Ghi lại thông báo lỗi hoặc hành vi thực tế.

**Mức độ:** High.

**Trạng thái:** Open / In Progress / Fixed / Retest / Closed.

## 9. Công cụ kiểm thử

Có thể sử dụng:
- Trình duyệt Chrome DevTools: kiểm tra giao diện và Console.
- Postman: kiểm thử API.
- MySQL Workbench: kiểm tra cơ sở dữ liệu.
- Katalon Studio: tự động hóa kiểm thử giao diện và API khi phù hợp.
- VS Code: đọc code và kiểm tra lỗi.
- Git: quản lý phiên bản trước và sau khi sửa lỗi.

Không bắt buộc sử dụng tất cả công cụ cho mọi chức năng.

## 10. Nguyên tắc bảo vệ dự án

- Không tự ý thay đổi nhánh develop.
- Thực hiện công việc trên nhánh được giao, ví dụ hopdongthue.
- Không xóa dữ liệu thật để thử nghiệm.
- Không sửa code ngoài phạm vi kiểm thử nếu chưa được yêu cầu.
- Không tự ý thay đổi API hoặc cấu trúc database.
- Trước thao tác Git có rủi ro, kiểm tra git status và tạo bản sao lưu phù hợp.

## 11. Cách trả lời người dùng

Khi được yêu cầu kiểm thử, hãy trình bày:

1. Chức năng cần kiểm thử.
2. Các trường hợp kiểm thử.
3. Dữ liệu đầu vào.
4. Các bước thực hiện.
5. Kết quả mong đợi.
6. Kết quả thực tế nếu đã chạy được.
7. Lỗi phát hiện và cách khắc phục.
8. Kết luận kiểm thử.

Phải phân biệt rõ:
- Test case đã viết nhưng chưa chạy.
- Test case đã thực hiện.
- Test case Pass.
- Test case Fail.
- Test case Blocked.

Không được tự nhận là đã kiểm thử thành công nếu chưa thực sự chạy kiểm thử.

Luôn giải thích bằng tiếng Việt, rõ ràng, từng bước, phù hợp với người đang học kiểm thử phần mềm.

---
name: project-safety-guard
description: Áp dụng quy tắc an toàn khi kiểm tra, sửa lỗi, phát triển, kiểm thử hoặc tích hợp mã nguồn trong dự án nhóm. Dùng để giới hạn phạm vi thay đổi, bảo vệ phần việc của thành viên khác, giữ nguyên các thay đổi đang có và tránh thao tác Git gây mất dữ liệu.
---
# Skill: Bảo vệ dự án và giới hạn phạm vi thay đổi

## 1. Mục tiêu

Skill này giúp AI Agent làm việc an toàn trong dự án cá nhân hoặc dự án nhóm. Luôn ưu tiên:

- Chỉ sửa đúng module được người dùng giao.
- Bảo vệ mã nguồn, dữ liệu và thay đổi chưa được lưu/commit của người dùng.
- Không ảnh hưởng phần việc của thành viên khác.
- Không tự ý sửa tệp dùng chung, cấu hình chung hoặc lịch sử Git.
- Kiểm tra bằng chứng thực tế trước khi kết luận công việc đã hoàn thành.

Skill này là bộ quy tắc hướng dẫn cho Agent, không phải cơ chế khóa quyền kỹ thuật. Người dùng vẫn cần xem lại diff trước khi chấp nhận thay đổi.

## 2. Quy tắc bắt buộc trước khi sửa mã

Trước khi chỉnh sửa bất kỳ tệp nào:

1. Xác định thư mục gốc của dự án và nhánh Git hiện tại.
2. Kiểm tra trạng thái và các thay đổi đang có:
   ```bash
   git status --short --branch
   git diff --stat
   git diff
   git diff --cached --stat
   git diff --cached
   ```
3. Đọc các thay đổi hiện có để phân biệt phần do người dùng tạo với phần định sửa.
4. Xác định rõ module được phép sửa và các tệp nằm trong phạm vi.
5. Nêu kế hoạch ngắn gọn trước khi thực hiện nếu công việc có nhiều bước hoặc có nguy cơ ảnh hưởng phạm vi khác.

**Không được ghi đè, xóa, hoàn tác hoặc làm mất các thay đổi đã tồn tại trước khi bắt đầu.** Nếu không thể xác định quyền sở hữu một thay đổi, hãy giữ nguyên và hỏi người dùng.

## 3. Giới hạn phạm vi

- Chỉ sửa module hoặc chức năng mà người dùng chỉ định rõ.
- Không tự mở rộng sang module khác chỉ vì thấy lỗi hoặc muốn “dọn dẹp” mã nguồn.
- Không chỉnh sửa phần việc của thành viên khác.
- Không tạo trang giả, dữ liệu giả hoặc API giả để che giấu lỗi tích hợp.
- Không thay đổi giao diện hoặc hành vi ngoài yêu cầu.
- Nếu cần chỉnh tệp dùng chung, trước tiên phải giải thích:
  1. Vì sao bắt buộc phải sửa.
  2. Tệp nào bị ảnh hưởng.
  3. Module/thành viên nào có thể bị ảnh hưởng.
  4. Phương án thay đổi tối thiểu.

Sau đó **dừng lại và xin phép người dùng** trước khi sửa tệp dùng chung.

### Các khu vực mặc định không được tự ý sửa

Trừ khi người dùng cho phép rõ ràng, không chỉnh sửa:

- Module của thành viên khác.
- Đăng nhập, phân quyền, xác thực, JWT và middleware xác thực.
- Sidebar, định tuyến hoặc bố cục dùng chung.
- API client dùng chung, cấu hình CORS, biến môi trường và cấu hình toàn cục.
- Cơ sở dữ liệu, schema, migration hoặc dữ liệu thật.
- `package.json`, lockfile, cấu hình build, cấu hình TypeScript hoặc cấu hình công cụ.
- Tệp sinh tự động, tệp build hoặc tệp không rõ mục đích.

Nếu một trong các khu vực này đang gây lỗi, hãy báo cáo lỗi và đề xuất phương án; không tự sửa khi chưa được cho phép.

## 4. Quy tắc an toàn với Git

Không thực hiện các thao tác sau nếu người dùng chưa yêu cầu rõ ràng:

- `git reset` (đặc biệt `--hard`).
- `git clean`.
- `git restore` hoặc hoàn tác tệp.
- `git checkout`/`git switch` để ghi đè hoặc bỏ thay đổi đang có.
- Xóa nhánh, xóa tệp, sửa lịch sử commit.
- `git commit`, `git push`, `git merge`, `git rebase`, `git cherry-pick`.
- Bất kỳ thao tác nào có thể xóa, ghi đè hoặc phát tán mã nguồn.

Không tự động xóa tệp chỉ vì cho rằng đó là tệp sinh ra. Không xóa các tệp như `*.tsbuildinfo` nếu chưa xác minh và chưa được người dùng cho phép.

Sau khi sửa:

```bash
git status --short --branch
git diff --stat
git diff
git diff --cached --stat
git diff --cached
```

Kiểm tra rằng diff chỉ chứa thay đổi được yêu cầu và không làm mất thay đổi có từ trước.

## 5. Quy tắc về phụ thuộc và cấu hình

- Không cài, gỡ hoặc nâng cấp package nếu chưa được cho phép.
- Không tự thay đổi phiên bản Node.js, cấu hình môi trường, cổng chạy, URL API, CORS hoặc cấu hình database.
- Không đưa mật khẩu, token, khóa bí mật hoặc nội dung `.env` vào báo cáo, log hay commit.
- Không sửa schema hoặc dữ liệu database chỉ để làm cho kiểm thử chạy được.
- Trước khi chạy lệnh có thể thay đổi dữ liệu, xác minh môi trường và đảm bảo đó là database thử nghiệm phù hợp.
- Nếu cần thay đổi cấu hình chung để tích hợp module, hãy xin phép trước.

## 6. Quy tắc xác thực, quyền truy cập và dữ liệu

- Không vô hiệu hóa xác thực/phân quyền để làm cho API chạy được.
- Không tạo JWT giả, không giả lập người dùng đã đăng nhập và không bỏ qua middleware.
- Không dùng token, thông tin đăng nhập hoặc dữ liệu của thành viên khác.
- Không tự ý thay đổi hợp đồng API hoặc cấu trúc dữ liệu dùng chung.
- Nếu module phụ thuộc vào đăng nhập hoặc token do thành viên khác phụ trách, hãy mô tả điểm tích hợp cần thiết và phối hợp với người phụ trách đó.
- Kiểm tra quyền truy cập theo vai trò và quyền sở hữu dữ liệu khi phù hợp.
- Không tuyên bố dữ liệu đã được lưu thật nếu chỉ đang dùng mock data.

## 7. Quy trình làm việc đề xuất

### Bước 1 — Xác nhận phạm vi

Ghi rõ:

- Module/chức năng được giao.
- Những module và tệp không được sửa.
- Kết quả người dùng mong muốn.
- Các phụ thuộc bên ngoài phạm vi có thể gây cản trở.

### Bước 2 — Khảo sát hiện trạng

- Đọc cấu trúc thư mục, mã nguồn và cách tổ chức hiện có.
- Kiểm tra `git status` và diff trước khi sửa.
- Xác định luồng frontend → API → backend → database nếu công việc liên quan.
- Phân biệt lỗi trong phạm vi với lỗi có sẵn hoặc lỗi của module khác.

### Bước 3 — Lập kế hoạch tối thiểu

- Ưu tiên thay đổi nhỏ nhất để đáp ứng yêu cầu.
- Liệt kê tệp dự kiến sửa.
- Nêu rủi ro và các phụ thuộc.
- Xin phép trước khi thay đổi tệp dùng chung hoặc ngoài phạm vi.

### Bước 4 — Thực hiện

- Sửa theo từng phần nhỏ, dễ kiểm tra.
- Giữ nguyên phong cách, quy ước và kiến trúc sẵn có.
- Không tái cấu trúc diện rộng khi không cần thiết.
- Không chỉnh module khác để né lỗi.
- Nếu phát hiện vấn đề ngoài phạm vi, ghi nhận và báo lại thay vì tự sửa.

### Bước 5 — Kiểm tra

Chỉ chạy những lệnh phù hợp với môi trường và phạm vi. Phân biệt rõ:

- **Kiểm tra tĩnh:** đọc mã nguồn, tìm kiếm, kiểm tra diff.
- **Build:** lệnh build đã chạy và kết quả thực tế.
- **Kiểm thử tự động:** unit/integration test đã chạy.
- **Kiểm tra HTTP:** API đã được gọi trong môi trường đang chạy.
- **Kiểm thử database:** đã xác nhận kết nối và thao tác trên database thử nghiệm.
- **Kiểm thử phân quyền:** đã kiểm tra các vai trò và trường hợp truy cập.
- **Kiểm thử E2E:** đã kiểm tra luồng hoàn chỉnh từ giao diện đến backend.

Không gọi việc đọc mã nguồn là “đã kiểm thử”. Không tuyên bố build, API hoặc database hoạt động nếu chưa chạy kiểm tra tương ứng. Ghi rõ lệnh, kết quả và phần chưa thể kiểm tra.

### Bước 6 — Rà soát cuối

- Đọc toàn bộ diff một lần nữa.
- Xác nhận không có tệp ngoài phạm vi bị sửa.
- Xác nhận không có thay đổi của người dùng bị mất.
- Xác nhận không có secret hoặc dữ liệu nhạy cảm trong diff.
- Không commit/push nếu chưa được yêu cầu.

## 8. Khi nào phải dừng và hỏi người dùng?

Dừng trước khi sửa nếu:

- Yêu cầu buộc phải thay đổi module của thành viên khác.
- Cần sửa đăng nhập, JWT, phân quyền hoặc middleware dùng chung.
- Cần thay đổi schema, migration, cấu hình toàn cục hoặc package.
- Có nguy cơ mất dữ liệu hoặc thay đổi Git không thể dễ dàng khôi phục.
- Không rõ tệp nào thuộc phạm vi của ai.
- Không chắc database đang dùng là database thử nghiệm hay dữ liệu thật.
- Có nhiều phương án ảnh hưởng khác nhau đến kiến trúc hoặc các module khác.

Khi dừng, trình bày vấn đề, lý do, các phương án và đề xuất phương án ít rủi ro nhất. Không tự chọn phương án có tác động rộng.

## 9. Mẫu báo cáo kết quả

Kết thúc mỗi nhiệm vụ bằng báo cáo ngắn theo cấu trúc:

1. **Phạm vi đã xử lý:** module/chức năng.
2. **Tệp đã thay đổi:** liệt kê đường dẫn và lý do.
3. **Kiểm tra đã chạy:** lệnh và kết quả thực tế.
4. **Chưa kiểm tra được:** lý do cụ thể.
5. **Ảnh hưởng ngoài phạm vi:** nêu rõ có/không; nếu có, giải thích.
6. **Trạng thái Git:** nhánh hiện tại, thay đổi còn lại; xác nhận không tự commit/push.
7. **Việc cần người dùng quyết định:** các điểm đang chờ phê duyệt.

Không khẳng định hoàn thành tuyệt đối nếu còn lỗi build, lỗi tích hợp hoặc kiểm thử chưa thực hiện.

## 10. Cách dùng cùng các skill chuyên môn

Khi làm một nhiệm vụ, hãy đọc và tuân thủ `project-safety-guard` trước, sau đó mới dùng skill chuyên môn phù hợp, ví dụ:

- Backend: thiết kế API, validation, xử lý lỗi, bảo mật, truy vấn database.
- Frontend: component, trạng thái giao diện, khả năng truy cập, hiệu năng.
- Full-stack: luồng tích hợp từ UI đến API và database.
- Testing/code review: kiểm tra hồi quy, quyền truy cập, chất lượng và diff.

Skill chuyên môn không được phép ghi đè các quy tắc bảo vệ phạm vi, dữ liệu và Git trong skill này.

---
name: utility-fullstack-review
description: Rà soát, kiểm tra logic và tối ưu hóa chức năng quản lý chỉ số điện nước từ Frontend (React/Vite) đến Backend (Express/TypeScript/MySQL) thuộc dự án QuanLyNhaTro.
---
# SKILL: UTILITY FULL-STACK REVIEW & REFACTORING

## 1. Purpose (Mục đích)

Skill này hướng dẫn AI Agent rà soát (code review), kiểm tra lỗi logic/nghiệp vụ và tối ưu hóa toàn bộ luồng chức năng **Chỉ số Điện/Nước** (`Utilities`) từ giao diện người dùng Frontend đến xử lý dữ liệu Backend trong dự án **QuanLyNhaTro**.

Skill đảm bảo hệ thống vận hành đồng bộ, đồng thời ngăn chặn các lỗi thường gặp:

- **Lệch định danh phòng:** Không khớp mã `room_id` (UUID `VARCHAR(36)`) giữa bảng giao diện Frontend và Database MySQL.
- **Dữ liệu giả (Mock data):** Quên xóa mảng `initialRows` tĩnh khiến dữ liệu hiển thị không ăn khớp với Database.
- **Lỗi ép kiểu ID:** Tự ý ép kiểu chuỗi UUID sang số `INT` (`parseInt`, `Number`).
- **Sai lệch chỉ số:** Nhập chỉ số mới nhỏ hơn chỉ số cũ hoặc cho phép sửa chỉ số của phòng đã chốt hóa đơn.
- **Giao diện & Trải nghiệm:** Nhập ngày ghi bằng dạng chữ (`text`) dễ lỗi thay vì dùng trình chọn ngày (`type="date"`).

---

## 2. Input Spec (Thông số dữ liệu đầu vào)

Khi kích hoạt skill, AI Agent sẽ truy xuất và đối chiếu chính xác các tệp trong cây thư mục dự án:

1. **Frontend Source Files (`frontend/src/`):**

   - Page quản lý chính: `frontend/src/pages/Utilities/Utilities.tsx`
   - Form popup nhập/sửa: `frontend/src/components/Utilities/UtilityFormModal.tsx`
   - Bảng hiển thị chỉ số: `frontend/src/components/Utilities/UtilityTable.tsx`
2. **Backend Source Files (`backend/src/`):**

   - Controller: `backend/src/controllers/Utility_Controller.ts`
   - Service query DB: `backend/src/services/Utility_Service.ts`
   - Router: `backend/src/routes/Utility_Router.ts`
   - Type definition: `backend/src/types/Utility_Type.ts`
3. **Cấu trúc & Quy ước Cơ sở dữ liệu (Database Rules):**

   - **Database Name:** `boarding_house_db`
   - **Khoá chính/ngoại:** `rooms.id` và `utility_readings.room_id` bắt buộc là chuỗi `VARCHAR(36)` (UUID).
   - **Chỉ số:** `electricity_kwh` và `water_m3` phải là số integer `>= 0`.
   - **Chỉ số cũ (`prevElec`, `prevWater`):** Bắt buộc lấy từ bản ghi mới nhất của kỳ trước trong Database, không dùng dữ liệu client tự gửi lên.
   - **Khóa chỉnh sửa:** Bản ghi có trạng thái `DA_CO_HOA_DON` (`co_hoa_don`) tuyệt đối không cho phép cập nhật hay xóa.

---

## 3. SOP - Standard Operating Procedure (Quy trình rà soát từng bước)

AI Agent thực hiện quy trình rà soát 4 bước chuẩn hóa:

### Bước 1: Thu thập & Đọc hiểu luồng Full-stack

- Kiểm tra luồng gọi API: `Utilities.tsx` ➔ `fetchUtilityReadings()` ➔ `Utility_Router.ts` ➔ `Utility_Controller.ts` ➔ `Utility_Service.ts` ➔ Database `boarding_house_db`.

### Bước 2: Kiểm tra các quy ước kỹ thuật

1. **Kiểm tra đồng bộ UUID (Frontend ➔ Backend):**
   - Kiểm tra xem `Utilities.tsx` có lưu đúng `room_id` (UUID chuỗi) vào mảng state `rows` hay không.
   - Kiểm tra xem Backend có đoạn code nào dùng `parseInt(room_id)` hay không ➔ **Lỗi Nghiêm trọng (Critical)**.
2. **Kiểm tra loại bỏ Mock Data:**
   - Kiểm tra xem `Utilities.tsx` có còn đọc dữ liệu từ `initialRows` hay đã gọi API `fetchUtilityReadings()` load 100% từ DB.
3. **Kiểm tra Component Form Modal (`UtilityFormModal.tsx`):**
   - Ô nhập ngày ghi chỉ số phải sử dụng `<input type="date" />` thay vì `type="text"`.
   - Có validate chỉ số mới phải lớn hơn hoặc bằng chỉ số cũ trước khi bấm Lưu.
4. **Kiểm tra SQL & Bảo mật Backend:**
   - Kiểm tra câu lệnh `INSERT`/`UPDATE` trong `Utility_Service.ts` có tham chiếu đúng `boarding_house_db`.
   - Block `catch(error)` trong `Utility_Controller.ts` không được trả trực tiếp `error.message` gốc ra cho client khi bị lỗi 500.

### Bước 3: Đánh giá & Phân loại lỗi

Gom nhóm danh sách lỗi tìm được:

- 🔴 **Nghiêm trọng (Critical / High):** Sai UUID phòng, lỗi SQL query, mất đồng bộ dữ liệu DB, còn phụ thuộc dữ liệu giả `initialRows`.
- 🟡 **Trung bình (Medium):** Sai định dạng ngày ghi (dùng input text), rò rỉ lỗi 500 ra client, thiếu validate chỉ số âm.
- 🟢 **Nhẹ / Clean Code (Low):** Đặt tên biến chưa nhất quán, dư thừa code không dùng đến, dùng kiểu `any` trong TypeScript.

### Bước 4: Xuất báo cáo & Đề xuất Refactor

- Liệt kê chi tiết lỗi kèm đoạn code vi phạm và hướng khắc phục. Nếu người dùng yêu cầu sửa, AI sẽ tiến hành refactor trực tiếp tệp code tương ứng.

---

## 4. Output Spec (Kết quả trả về)

Kết quả trả về cho người dùng tuân theo mẫu báo cáo Markdown tiêu chuẩn:

```markdown
# BÁO CÁO RÀ SOÁT CHỨC NĂNG ĐIỆN NƯỚC (FULL-STACK REVIEW)

## 1. Phạm vi kiểm tra
- **Frontend:** `Utilities.tsx`, `UtilityFormModal.tsx`, `UtilityTable.tsx`
- **Backend:** `Utility_Controller.ts`, `Utility_Service.ts`, `Utility_Router.ts`, `Utility_Type.ts`

## 2. Danh sách vấn đề phát hiện

### 🔴 Lỗi Nghiêm trọng (Critical / High)
- **Vấn đề:** [Mô tả lỗi, ví dụ: Lệch room_id UUID giữa Frontend và Database]
- **Vị trí:** `frontend/src/pages/Utilities/Utilities.tsx` - Dòng XX
- **Giải pháp khắc phục & Refactor:**
  ```tsx
  // Code chưa chuẩn:
  const roomId = parseInt(row.id);
  
  // Code chuẩn sửa lại:
  const roomId: string = row.room_id; // Giữ nguyên chuỗi UUID
```

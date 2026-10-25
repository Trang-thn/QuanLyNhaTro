-- ============================================
-- INSERT TEST DATA FOR QUANLYNHATRO DATABASE
-- Chạy file này trong MySQL Workbench hoặc CLI
-- ============================================

USE quanlynhatro;

-- 1. Tạo room_types (cần cho FK rooms.room_type_id)
INSERT INTO room_types (id, name, base_price, area_sqm, description) VALUES
(UUID(), 'Phòng đơn', 2000000, 20.00, 'Phòng đơn cơ bản'),
(UUID(), 'Phòng đôi', 3500000, 30.00, 'Phòng đôi rộng rãi'),
(UUID(), 'Phòng VIP', 5000000, 40.00, 'Phòng cao cấp full nội thất');

-- 2. Tạo phòng test (7 phòng khớp với mock data frontend)
INSERT INTO rooms (id, room_number, room_type_id, status, floor, description) VALUES
(UUID(), 'P101', (SELECT id FROM room_types WHERE name='Phòng đơn' LIMIT 1), 'DA_THUE', 1, 'Phòng 101 - tầng 1'),
(UUID(), 'P102', (SELECT id FROM room_types WHERE name='Phòng đơn' LIMIT 1), 'DA_THUE', 1, 'Phòng 102 - tầng 1'),
(UUID(), 'P201', (SELECT id FROM room_types WHERE name='Phòng đôi' LIMIT 1), 'DA_THUE', 2, 'Phòng 201 - tầng 2'),
(UUID(), 'P202', (SELECT id FROM room_types WHERE name='Phòng đôi' LIMIT 1), 'TRONG', 2, 'Phòng 202 - tầng 2'),
(UUID(), 'P301', (SELECT id FROM room_types WHERE name='Phòng VIP' LIMIT 1), 'DA_THUE', 3, 'Phòng 301 - tầng 3'),
(UUID(), 'P302', (SELECT id FROM room_types WHERE name='Phòng VIP' LIMIT 1), 'TRONG', 3, 'Phòng 302 - tầng 3'),
(UUID(), 'P303', (SELECT id FROM room_types WHERE name='Phòng VIP' LIMIT 1), 'TRONG', 3, 'Phòng 303 - tầng 3');

-- 3. Kiểm tra kết quả
SELECT id, room_number, room_type_id, status, floor FROM rooms ORDER BY room_number;
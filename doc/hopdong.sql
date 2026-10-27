// hêm vào bảng tenants các cột thông tin cá nhân của người thuê nhà
// kiểm tra trước khi nạp vì có thể đã nạp được tự đỏng rồi( file này dành cho trường hợp chưa nạp được)
ALTER TABLE tenants
    ADD COLUMN full_name VARCHAR(255) NULL,
    ADD COLUMN date_of_birth DATE NULL,
    ADD COLUMN phone VARCHAR(20) NULL,
    ADD COLUMN email VARCHAR(255) NULL,
    ADD COLUMN gender VARCHAR(10) NULL,
    ADD COLUMN avatar VARCHAR(500) NULL; 

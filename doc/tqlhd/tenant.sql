//Thêm cho bảng tenant có thêm các trường thông tin cá nhân như full_name, date_of_birth, phone, email, gender, avatar
ALTER TABLE tenants
    ADD COLUMN full_name VARCHAR(255) NULL,
    ADD COLUMN date_of_birth DATE NULL,
    ADD COLUMN phone VARCHAR(20) NULL,
    ADD COLUMN email VARCHAR(255) NULL,
    ADD COLUMN gender VARCHAR(10) NULL,
    ADD COLUMN avatar VARCHAR(500) NULL;
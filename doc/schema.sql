CREATE DATABASE IF NOT EXISTS quanlynhatro CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE quanlynhatro;

CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()), username VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL, full_name VARCHAR(100) NOT NULL, email VARCHAR(100) UNIQUE,
  phone_number VARCHAR(15), role VARCHAR(20) NOT NULL DEFAULT 'TENANT', is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE room_types (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()), name VARCHAR(100) NOT NULL,
  base_price DECIMAL(12,2) NOT NULL, area_sqm DECIMAL(5,2), description TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE rooms (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()), room_number VARCHAR(20) NOT NULL UNIQUE,
  room_type_id VARCHAR(36), status VARCHAR(20) DEFAULT 'TRONG', floor INT DEFAULT 1,
  description TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_rooms_room_types FOREIGN KEY (room_type_id) REFERENCES room_types(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE amenities (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()), name VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE room_amenities (
  room_id VARCHAR(36), amenity_id VARCHAR(36), PRIMARY KEY (room_id, amenity_id),
  CONSTRAINT fk_ra_rooms FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
  CONSTRAINT fk_ra_amenities FOREIGN KEY (amenity_id) REFERENCES amenities(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE tenants (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()), user_id VARCHAR(36) UNIQUE,
  identity_card_number VARCHAR(20) UNIQUE NOT NULL, issue_date DATE, issue_place VARCHAR(100),
  permanent_address TEXT, emergency_contact VARCHAR(15),
  CONSTRAINT fk_tenants_users FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE contracts (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()), contract_number VARCHAR(50) UNIQUE NOT NULL,
  room_id VARCHAR(36), representative_tenant_id VARCHAR(36), start_date DATE NOT NULL, end_date DATE NOT NULL,
  rental_price DECIMAL(12,2) NOT NULL, deposit_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  status VARCHAR(20) DEFAULT 'HIEU_LUC', billing_cycle_day INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_contracts_rooms FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE RESTRICT,
  CONSTRAINT fk_contracts_tenants FOREIGN KEY (representative_tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE contract_members (
  contract_id VARCHAR(36), tenant_id VARCHAR(36), PRIMARY KEY (contract_id, tenant_id),
  CONSTRAINT fk_cm_contracts FOREIGN KEY (contract_id) REFERENCES contracts(id) ON DELETE CASCADE,
  CONSTRAINT fk_cm_tenants FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE utility_readings (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()), room_id VARCHAR(36), billing_month INT NOT NULL,
  billing_year INT NOT NULL, old_electricity_kwh INT NOT NULL, new_electricity_kwh INT NOT NULL,
  old_water_m3 INT NOT NULL, new_water_m3 INT NOT NULL, recorded_date DATE DEFAULT (CURRENT_DATE),
  CONSTRAINT fk_ur_rooms FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
  CONSTRAINT uq_room_billing_period UNIQUE (room_id, billing_month, billing_year)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE invoices (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()), invoice_code VARCHAR(50) UNIQUE NOT NULL,
  contract_id VARCHAR(36), utility_reading_id VARCHAR(36), billing_month INT NOT NULL, billing_year INT NOT NULL,
  room_price DECIMAL(12,2) NOT NULL, electricity_cost DECIMAL(12,2) DEFAULT 0, water_cost DECIMAL(12,2) DEFAULT 0,
  other_service_cost DECIMAL(12,2) DEFAULT 0, total_amount DECIMAL(12,2) NOT NULL, paid_amount DECIMAL(12,2) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'CHUA_THANH_TOAN', due_date DATE NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_invoices_contracts FOREIGN KEY (contract_id) REFERENCES contracts(id) ON DELETE RESTRICT,
  CONSTRAINT fk_invoices_readings FOREIGN KEY (utility_reading_id) REFERENCES utility_readings(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE payments (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()), invoice_id VARCHAR(36), payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  amount_paid DECIMAL(12,2) NOT NULL, payment_method VARCHAR(30) DEFAULT 'CHUYEN_KHOAN', transaction_note TEXT,
  CONSTRAINT fk_payments_invoices FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE maintenance_requests (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()), room_id VARCHAR(36), tenant_id VARCHAR(36),
  title VARCHAR(200) NOT NULL, description TEXT, image_url VARCHAR(255), status VARCHAR(20) DEFAULT 'TIEP_NHAN',
  cost DECIMAL(12,2) DEFAULT 0, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_mr_rooms FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
  CONSTRAINT fk_mr_tenants FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE notifications (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()), title VARCHAR(200) NOT NULL, content TEXT NOT NULL,
  sender_id VARCHAR(36), receiver_id VARCHAR(36), is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_notif_sender FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_notif_receiver FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

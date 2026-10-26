CREATE TABLE IF NOT EXISTS utility_prices (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  electricity_price_per_kwh DECIMAL(12,2) NOT NULL,
  water_price_per_m3 DECIMAL(12,2) NOT NULL,
  effective_from DATE NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO utility_prices (electricity_price_per_kwh, water_price_per_m3, effective_from)
SELECT 4000.00, 25000.00, '2026-10-01'
WHERE NOT EXISTS (
  SELECT 1 FROM utility_prices WHERE effective_from = '2026-10-01'
);

ALTER TABLE invoices
  ADD CONSTRAINT uq_invoice_contract_period
  UNIQUE (contract_id, billing_month, billing_year);

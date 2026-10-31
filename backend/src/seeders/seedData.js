const path = require('node:path');
const { randomUUID } = require('node:crypto');
const dotenv = require('dotenv');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

// Load backend/.env even when this script is launched from another directory.
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const requiredEnv = ['DB_HOST', 'DB_USER', 'DB_NAME'];
const missingEnv = requiredEnv.filter((key) => !process.env[key]);

if (missingEnv.length > 0) {
  console.error(`Thiếu biến môi trường bắt buộc: ${missingEnv.join(', ')}`);
  process.exit(1);
}

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 2,
  charset: 'utf8mb4',
});

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const monthDate = (year, month, day) => {
  const lastDay = new Date(year, month, 0).getDate();
  return `${year}-${String(month).padStart(2, '0')}-${String(Math.min(day, lastDay)).padStart(2, '0')}`;
};

const timestamp = (date, hour = '09:00:00') => `${date} ${hour}`;

async function insertMany(connection, table, columns, rows) {
  if (rows.length === 0) return;

  const columnSql = columns.map((column) => `\`${column}\``).join(', ');
  const rowPlaceholder = `(${columns.map(() => '?').join(', ')})`;
  const placeholders = rows.map(() => rowPlaceholder).join(', ');
  const values = rows.flat();

  await connection.execute(
    `INSERT INTO \`${table}\` (${columnSql}) VALUES ${placeholders}`,
    values,
  );
}

async function clearExistingData(connection) {
  // Delete dependent rows before their parent rows; FK checks stay enabled.
  const tablesInDeleteOrder = [
    'password_reset_otps',
    'tenant_registration_requests',
    'payments',
    'invoices',
    'utility_prices',
    'utility_readings',
    'maintenance_requests',
    'notification_recipients',
    'notifications',
    'contract_members',
    'contracts',
    'room_amenities',
    'tenants',
    'rooms',
    'amenities',
    'room_types',
    'users',
  ];

  for (const table of tablesInDeleteOrder) {
    await connection.query(`DELETE FROM \`${table}\``);
  }
}

async function seedData(connection) {
  const passwordHash = await bcrypt.hash('123456', 12);
  await insertMany(connection, 'utility_prices', [
    'electricity_price_per_kwh', 'water_price_per_m3', 'effective_from',
  ], [[4000, 25000, '2026-10-01']]);
  const users = {
    admin: randomUUID(),
    tenant1: randomUUID(),
    tenant2: randomUUID(),
    tenant3: randomUUID(),
    pendingTenant: randomUUID(),
  };
  const tenants = {
    tenant1: randomUUID(),
    tenant2: randomUUID(),
    tenant3: randomUUID(),
    unlinkedFixture: randomUUID(),
  };
  const types = {
    studio: randomUUID(),
    standard: randomUUID(),
    family: randomUUID(),
  };
  const rooms = {
    p101: randomUUID(),
    p102: randomUUID(),
    p103: randomUUID(),
    p104: randomUUID(),
    p201: randomUUID(),
  };
  const amenities = {
    airConditioner: randomUUID(),
    wifi: randomUUID(),
    waterHeater: randomUUID(),
    refrigerator: randomUUID(),
  };
  const contracts = {
    p101: randomUUID(),
    p102: randomUUID(),
  };
  const readings = {
    p101Current: randomUUID(),
    p102Current: randomUUID(),
    p101Previous: randomUUID(),
  };

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const previousMonthDate = new Date(currentYear, now.getMonth() - 1, 1);
  const previousYear = previousMonthDate.getFullYear();
  const previousMonth = previousMonthDate.getMonth() + 1;
  const today = formatDate(now);
  const currentDueDate = monthDate(currentYear, currentMonth, 10);
  const previousDueDate = monthDate(previousYear, previousMonth, 10);
  const p101ContractStart = formatDate(new Date(currentYear, now.getMonth() - 6, 1));
  const p101ContractEnd = formatDate(new Date(currentYear, now.getMonth() + 6, 0));
  const p102ContractStart = formatDate(new Date(currentYear, now.getMonth() - 4, 1));
  const p102ContractEnd = formatDate(new Date(currentYear, now.getMonth() + 8, 0));

  await insertMany(connection, 'users', [
    'id', 'username', 'password_hash', 'full_name', 'email', 'phone_number', 'role', 'is_active',
  ], [
    [users.admin, 'admin', passwordHash, 'Quản trị viên', 'admin@example.com', '0900000001', 'ADMIN', 1],
    [users.tenant1, 'nguyenan', passwordHash, 'Nguyễn Minh An', 'an.nguyen@example.com', '0900000002', 'TENANT', 1],
    [users.tenant2, 'tranbinh', passwordHash, 'Trần Quốc Bình', 'binh.tran@example.com', '0900000003', 'TENANT', 1],
    [users.tenant3, 'lechi', passwordHash, 'Lê Thu Chi', 'chi.le@example.com', '0900000004', 'TENANT', 1],
    [users.pendingTenant, 'pendingtenant', passwordHash, 'Phạm Minh Khoa', 'khoa.pending@example.com', '0900000005', 'TENANT', 1],
  ]);

  // This account intentionally has no tenants row until an Admin approves it.
  await insertMany(connection, 'tenant_registration_requests', [
    'user_id', 'identity_card_number', 'status',
  ], [
    [users.pendingTenant, '079000000004', 'PENDING'],
  ]);

  await insertMany(connection, 'room_types', [
    'id', 'name', 'base_price', 'area_sqm', 'description',
  ], [
    [types.studio, 'Studio', 2600000, 25, 'Phòng studio có khu vực sinh hoạt và bếp gọn.'],
    [types.standard, 'Phòng đơn', 2000000, 20, 'Phòng đơn phù hợp cho một người thuê.'],
    [types.family, 'Phòng gia đình', 3800000, 38, 'Phòng rộng cho gia đình nhỏ.'],
  ]);

  await insertMany(connection, 'rooms', [
    'id', 'room_number', 'room_type_id', 'status', 'floor', 'description',
  ], [
    [rooms.p101, 'P101', types.standard, 'TRONG', 1, 'Phòng có cửa sổ hướng đông.'],
    [rooms.p102, 'P102', types.studio, 'TRONG', 1, 'Phòng studio gần cầu thang.'],
    [rooms.p103, 'P103', types.standard, 'TRONG', 1, 'Phòng đơn vừa sơn mới.'],
    [rooms.p104, 'P104', types.family, 'BAO_TRI', 1, 'Đang bảo trì hệ thống cấp nước.'],
    [rooms.p201, 'P201', types.family, 'TRONG', 2, 'Phòng rộng ở tầng hai.'],
  ]);

  await insertMany(connection, 'amenities', ['id', 'name'], [
    [amenities.airConditioner, 'Điều hòa'],
    [amenities.wifi, 'Wifi'],
    [amenities.waterHeater, 'Nóng lạnh'],
    [amenities.refrigerator, 'Tủ lạnh'],
  ]);

  await insertMany(connection, 'room_amenities', ['room_id', 'amenity_id'], [
    [rooms.p101, amenities.airConditioner],
    [rooms.p101, amenities.wifi],
    [rooms.p101, amenities.waterHeater],
    [rooms.p102, amenities.airConditioner],
    [rooms.p102, amenities.wifi],
    [rooms.p102, amenities.waterHeater],
    [rooms.p102, amenities.refrigerator],
    [rooms.p103, amenities.wifi],
    [rooms.p103, amenities.waterHeater],
    [rooms.p104, amenities.airConditioner],
    [rooms.p104, amenities.wifi],
    [rooms.p201, amenities.airConditioner],
    [rooms.p201, amenities.wifi],
    [rooms.p201, amenities.refrigerator],
  ]);

  await insertMany(connection, 'tenants', [
    'id', 'user_id', 'identity_card_number', 'issue_date', 'issue_place', 'permanent_address', 'emergency_contact',
  ], [
    [tenants.tenant1, users.tenant1, '079000000001', '2020-01-15', 'Cục Cảnh sát QLHC về TTXH', 'Quận 1, TP. Hồ Chí Minh', '0900000101'],
    [tenants.tenant2, users.tenant2, '079000000002', '2021-06-20', 'Cục Cảnh sát QLHC về TTXH', 'Quận Bình Thạnh, TP. Hồ Chí Minh', '0900000102'],
    [tenants.tenant3, users.tenant3, '079000000003', '2022-03-08', 'Cục Cảnh sát QLHC về TTXH', 'TP. Thủ Đức, TP. Hồ Chí Minh', '0900000103'],
    // Reserved for G2-14: registration must link this existing profile without creating a review request.
    [tenants.unlinkedFixture, null, '079000000014', null, null, null, null],
  ]);

  await insertMany(connection, 'contracts', [
    'id', 'contract_number', 'room_id', 'representative_tenant_id', 'start_date', 'end_date',
    'rental_price', 'deposit_amount', 'status', 'billing_cycle_day',
  ], [
    [contracts.p101, 'HD-SEED-P101', rooms.p101, tenants.tenant1, p101ContractStart, p101ContractEnd, 2000000, 4000000, 'HIEU_LUC', 5],
    [contracts.p102, 'HD-SEED-P102', rooms.p102, tenants.tenant2, p102ContractStart, p102ContractEnd, 2600000, 5200000, 'HIEU_LUC', 5],
  ]);

  await connection.execute(
    "UPDATE rooms SET status = 'DANG_THUE' WHERE id IN (?, ?)",
    [rooms.p101, rooms.p102],
  );

  await insertMany(connection, 'contract_members', ['contract_id', 'tenant_id'], [
    [contracts.p101, tenants.tenant1],
    [contracts.p102, tenants.tenant2],
  ]);

  await insertMany(connection, 'utility_readings', [
    'id', 'room_id', 'billing_month', 'billing_year', 'old_electricity_kwh', 'new_electricity_kwh',
    'old_water_m3', 'new_water_m3', 'recorded_date',
  ], [
    [readings.p101Current, rooms.p101, currentMonth, currentYear, 1200, 1380, 85, 91, today],
    [readings.p102Current, rooms.p102, currentMonth, currentYear, 850, 1030, 42, 48, today],
    [readings.p101Previous, rooms.p101, previousMonth, previousYear, 1020, 1200, 79, 85, previousDueDate],
  ]);

  const invoiceCurrentP101 = randomUUID();
  const invoiceCurrentP102 = randomUUID();
  const invoicePreviousP101 = randomUUID();
  const currentCode = `${currentYear}${String(currentMonth).padStart(2, '0')}`;
  const previousCode = `${previousYear}${String(previousMonth).padStart(2, '0')}`;
  const p101CurrentTotal = 2000000 + 360000 + 90000 + 50000;
  const p102CurrentTotal = 2600000 + 360000 + 90000 + 50000;
  const p101PreviousTotal = 2000000 + 300000 + 80000 + 50000;
  const p101PartialPayment = 1250000;

  await insertMany(connection, 'invoices', [
    'id', 'invoice_code', 'contract_id', 'utility_reading_id', 'billing_month', 'billing_year',
    'room_price', 'electricity_cost', 'water_cost', 'other_service_cost', 'total_amount', 'paid_amount', 'status', 'due_date',
  ], [
    [invoiceCurrentP101, `INV-${currentCode}-P101`, contracts.p101, readings.p101Current, currentMonth, currentYear,
      2000000, 360000, 90000, 50000, p101CurrentTotal, p101PartialPayment, 'THANH_TOAN_MOT_PHAN', currentDueDate],
    [invoiceCurrentP102, `INV-${currentCode}-P102`, contracts.p102, readings.p102Current, currentMonth, currentYear,
      2600000, 360000, 90000, 50000, p102CurrentTotal, 0, 'CHUA_THANH_TOAN', currentDueDate],
    [invoicePreviousP101, `INV-${previousCode}-P101`, contracts.p101, readings.p101Previous, previousMonth, previousYear,
      2000000, 300000, 80000, 50000, p101PreviousTotal, p101PreviousTotal, 'DA_THANH_TOAN', previousDueDate],
  ]);

  await insertMany(connection, 'payments', [
    'id', 'invoice_id', 'payment_date', 'amount_paid', 'payment_method', 'transaction_note',
  ], [
    [randomUUID(), invoiceCurrentP101, timestamp(today, '10:00:00'), p101PartialPayment, 'CHUYEN_KHOAN', 'Thanh toán một phần hóa đơn tháng hiện tại.'],
    [randomUUID(), invoicePreviousP101, timestamp(monthDate(previousYear, previousMonth, 10), '09:30:00'), p101PreviousTotal, 'TIEN_MAT', 'Thanh toán đủ hóa đơn tháng trước.'],
  ]);

  await insertMany(connection, 'maintenance_requests', [
    'id', 'room_id', 'tenant_id', 'title', 'description', 'status', 'cost',
  ], [
    [randomUUID(), rooms.p104, null, 'Kiểm tra đường ống nước', 'Kiểm tra và thay đoạn ống nước bị rò rỉ.', 'DANG_XU_LY', 450000],
    [randomUUID(), rooms.p101, tenants.tenant1, 'Thay bóng đèn', 'Bóng đèn khu vực bếp cần được thay mới.', 'HOAN_THANH', 120000],
  ]);

  const notificationPaymentId = randomUUID();
  const notificationWelcomeId = randomUUID();
  await insertMany(connection, 'notifications', [
    'id', 'title', 'content', 'sender_id', 'receiver_id', 'is_read',
  ], [
    [notificationPaymentId, 'Thông báo thanh toán tiền phòng', 'Hóa đơn tiền phòng tháng này đã được tạo.', users.admin, users.tenant1, 0],
    [notificationWelcomeId, 'Chào mừng khách thuê', 'Hồ sơ thuê phòng của bạn đã được tạo.', users.admin, users.tenant2, 1],
  ]);
  await insertMany(connection, 'notification_recipients', [
    'notification_id', 'user_id', 'is_read',
  ], [
    [notificationPaymentId, users.tenant1, 0],
    [notificationWelcomeId, users.tenant2, 1],
  ]);
}

async function main() {
  let connection;
  let transactionStarted = false;

  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();
    transactionStarted = true;

    await clearExistingData(connection);
    await seedData(connection);

    await connection.commit();
    transactionStarted = false;
    console.log('Seed dữ liệu thành công.');
    console.log('Tài khoản mẫu: admin / 123456; tenant đã liên kết: nguyenan, tranbinh, lechi / 123456; tenant chờ duyệt: pendingtenant / 123456.');
    console.log('Fixture G2-14: tenant chưa liên kết với CCCD 079000000014.');
  } catch (error) {
    if (connection && transactionStarted) {
      try {
        await connection.rollback();
      } catch (rollbackError) {
        console.error('Không thể rollback transaction:', rollbackError);
      }
    }

    console.error('Seed dữ liệu thất bại:', error instanceof Error ? error.stack || error.message : error);
    process.exitCode = 1;
  } finally {
    if (connection) connection.release();
    try {
      await pool.end();
    } catch (closeError) {
      console.error('Không thể đóng MySQL pool:', closeError);
      process.exitCode = 1;
    }
  }
}

main();

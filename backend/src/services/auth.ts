import bcrypt from 'bcryptjs';
import { randomInt } from 'node:crypto';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { RowDataPacket } from 'mysql2';
import { pool } from '../config/database';
import { env } from '../config/env';
import { AuthUser, UserRole } from '../types/auth';
import { HttpError } from '../utils/httpError';

const BCRYPT_ROUNDS = 12;
const GENERIC_FORGOT_RESPONSE = 'If the account exists, a verification code has been sent to its email.';

interface UserRow extends RowDataPacket {
  id: string; username: string; password_hash: string; full_name: string;
  email: string | null; phone_number: string | null; role: UserRole;
  is_active: number | boolean;
}

function requiredString(value: unknown, field: string): string {
  if (typeof value !== 'string' || !value.trim()) throw new HttpError(400, `${field} is required`);
  return value.trim();
}

function validEmail(value: string): boolean { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); }

function createTransport() {
  if (!env.smtpHost || !env.smtpUser || !env.smtpPassword || !env.smtpFrom) {
    throw new HttpError(503, 'Email delivery is not configured');
  }
  return nodemailer.createTransport({
    host: env.smtpHost, port: env.smtpPort, secure: env.smtpPort === 465,
    auth: { user: env.smtpUser, pass: env.smtpPassword },
  });
}

export async function registerAccount(input: Record<string, unknown>) {
  const username = requiredString(input.username, 'username');
  const password = requiredString(input.password, 'password');
  const fullName = requiredString(input.fullName, 'fullName');
  const identityCardNumber = requiredString(input.identityCardNumber, 'identityCardNumber');
  const phoneNumber = requiredString(input.phoneNumber, 'phoneNumber');
  const email = requiredString(input.email, 'email').toLowerCase();
  if (!validEmail(email)) throw new HttpError(400, 'email is invalid');
  if (!/^\d{12}$/.test(identityCardNumber)) throw new HttpError(400, 'identityCardNumber must contain 12 digits');
  if (!/^\+?[0-9]{9,15}$/.test(phoneNumber)) throw new HttpError(400, 'phoneNumber is invalid');
  if (password.length < 8) throw new HttpError(400, 'password must be at least 8 characters');

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [existing] = await connection.query<RowDataPacket[]>(
      'SELECT id FROM users WHERE username = ? OR email = ? FOR UPDATE', [username, email]);
    if (existing.length) throw new HttpError(409, 'Username or email is already registered');
    const [tenants] = await connection.query<RowDataPacket[]>(
      'SELECT id, user_id FROM tenants WHERE identity_card_number = ? FOR UPDATE', [identityCardNumber]);
    if (tenants[0]?.user_id) throw new HttpError(409, 'This identity card is already linked to an account');

    const [idRows] = await connection.query<RowDataPacket[]>('SELECT UUID() AS id');
    const id = String(idRows[0].id);
    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    await connection.execute(
      `INSERT INTO users (id, username, password_hash, full_name, email, phone_number, role, is_active)
       VALUES (?, ?, ?, ?, ?, ?, 'TENANT', TRUE)`,
      [id, username, passwordHash, fullName, email, phoneNumber]);
    const linkedToContract = tenants.length > 0;
    if (linkedToContract) await connection.execute('UPDATE tenants SET user_id = ? WHERE id = ?', [id, tenants[0].id]);
    await connection.commit();
    return { id, username, fullName, email, role: 'TENANT' as const, linkedToContract };
  } catch (error) {
    await connection.rollback();
    if (error instanceof HttpError) throw error;
    if ((error as { code?: string }).code === 'ER_DUP_ENTRY') {
      throw new HttpError(409, 'Username, email, or identity card is already registered');
    }
    throw error;
  } finally { connection.release(); }
}

export async function loginAccount(input: Record<string, unknown>) {
  const identifier = requiredString(input.identifier ?? input.username, 'identifier');
  const password = requiredString(input.password, 'password');
  const [rows] = await pool.query<UserRow[]>(
    `SELECT id, username, password_hash, full_name, email, phone_number, role, is_active
     FROM users WHERE username = ? OR email = ? OR phone_number = ? LIMIT 2`,
    [identifier, identifier, identifier]);
  if (rows.length !== 1 || !rows[0].is_active || !(await bcrypt.compare(password, rows[0].password_hash))) {
    throw new HttpError(401, 'Username or password is incorrect');
  }
  if (!env.jwtSecret) throw new HttpError(503, 'JWT signing is not configured');
  const user = rows[0];
  const claims: AuthUser = { id: user.id, username: user.username, role: user.role };
  const token = jwt.sign(claims, env.jwtSecret, { expiresIn: env.jwtExpiresIn as jwt.SignOptions['expiresIn'] });
  return { token, user: { id: user.id, username: user.username, fullName: user.full_name,
    email: user.email, phoneNumber: user.phone_number, role: user.role } };
}

export async function requestPasswordReset(input: Record<string, unknown>): Promise<string> {
  const email = requiredString(input.email, 'email').toLowerCase();
  if (!validEmail(email)) throw new HttpError(400, 'email is invalid');
  const [rows] = await pool.query<UserRow[]>(
    'SELECT id, email FROM users WHERE email = ? AND is_active = TRUE LIMIT 1', [email]);
  if (!rows.length) return GENERIC_FORGOT_RESPONSE;

  const user = rows[0];
  const otp = String(randomInt(0, 1_000_000)).padStart(6, '0');
  const otpHash = await bcrypt.hash(otp, BCRYPT_ROUNDS);
  const expiresAt = new Date(Date.now() + env.otpExpiresMinutes * 60_000);
  await pool.execute(
    `INSERT INTO password_reset_otps (user_id, otp_hash, expires_at, attempt_count)
     VALUES (?, ?, ?, 0)
     ON DUPLICATE KEY UPDATE otp_hash = VALUES(otp_hash), expires_at = VALUES(expires_at),
       attempt_count = 0, created_at = CURRENT_TIMESTAMP`, [user.id, otpHash, expiresAt]);
  try {
    await createTransport().sendMail({ from: env.smtpFrom, to: email,
      subject: 'Password reset verification code',
      text: `Your password reset code is ${otp}. It expires in ${env.otpExpiresMinutes} minutes.` });
  } catch (error) {
    await pool.execute('DELETE FROM password_reset_otps WHERE user_id = ?', [user.id]);
    throw error;
  }
  return GENERIC_FORGOT_RESPONSE;
}

export async function resetAccountPassword(input: Record<string, unknown>): Promise<void> {
  const email = requiredString(input.email, 'email').toLowerCase();
  const otp = requiredString(input.otp, 'otp');
  const newPassword = requiredString(input.newPassword, 'newPassword');
  if (!validEmail(email)) throw new HttpError(400, 'email is invalid');
  if (!/^\d{6}$/.test(otp)) throw new HttpError(400, 'otp must contain 6 digits');
  if (newPassword.length < 8) throw new HttpError(400, 'newPassword must be at least 8 characters');

  const connection = await pool.getConnection();
  let committed = false;
  try {
    await connection.beginTransaction();
    const [rows] = await connection.query<(RowDataPacket & {
      user_id: string; otp_hash: string; expires_at: Date; attempt_count: number;
    })[]>(`SELECT o.user_id, o.otp_hash, o.expires_at, o.attempt_count
      FROM password_reset_otps o JOIN users u ON u.id = o.user_id
      WHERE u.email = ? AND u.is_active = TRUE FOR UPDATE`, [email]);
    const reset = rows[0];
    if (!reset || new Date(reset.expires_at).getTime() <= Date.now() || reset.attempt_count >= 5) {
      if (reset) await connection.execute('DELETE FROM password_reset_otps WHERE user_id = ?', [reset.user_id]);
      throw new HttpError(400, 'OTP is invalid or expired');
    }
    if (!(await bcrypt.compare(otp, reset.otp_hash))) {
      if (reset.attempt_count + 1 >= 5) {
        await connection.execute('DELETE FROM password_reset_otps WHERE user_id = ?', [reset.user_id]);
      } else {
        await connection.execute('UPDATE password_reset_otps SET attempt_count = attempt_count + 1 WHERE user_id = ?', [reset.user_id]);
      }
      await connection.commit();
      committed = true;
      throw new HttpError(400, 'OTP is invalid or expired');
    }
    const passwordHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
    await connection.execute('UPDATE users SET password_hash = ? WHERE id = ?', [passwordHash, reset.user_id]);
    await connection.execute('DELETE FROM password_reset_otps WHERE user_id = ?', [reset.user_id]);
    await connection.commit();
    committed = true;
  } catch (error) {
    if (!committed) await connection.rollback();
    throw error;
  } finally { connection.release(); }
}

import { Request, Response } from 'express';
import { HttpError } from '../utils/httpError';
import { loginAccount, registerAccount, requestPasswordReset, resetAccountPassword } from '../services/auth';

function bodyOf(req: Request): Record<string, unknown> {
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
    throw new HttpError(400, 'Request body must be a JSON object');
  }
  return req.body as Record<string, unknown>;
}

function respondError(res: Response, error: unknown): void {
  if (error instanceof HttpError) {
    res.status(error.status).json({ message: error.message });
    return;
  }
  console.error('Auth request failed:', error);
  res.status(500).json({ message: 'Internal server error' });
}

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const user = await registerAccount(bodyOf(req));
    res.status(201).json({ message: 'Registration successful', user });
  } catch (error) { respondError(res, error); }
}

export async function login(req: Request, res: Response): Promise<void> {
  try { res.status(200).json(await loginAccount(bodyOf(req))); }
  catch (error) { respondError(res, error); }
}

export async function forgotPassword(req: Request, res: Response): Promise<void> {
  try { res.status(200).json({ message: await requestPasswordReset(bodyOf(req)) }); }
  catch (error) { respondError(res, error); }
}

export async function resetPassword(req: Request, res: Response): Promise<void> {
  try {
    await resetAccountPassword(bodyOf(req));
    res.status(200).json({ message: 'Password reset successful. Please sign in again.' });
  } catch (error) { respondError(res, error); }
}

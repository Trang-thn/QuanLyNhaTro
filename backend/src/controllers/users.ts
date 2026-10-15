import { Request, Response } from 'express';
import { AuthUser } from '../types/auth';
import { HttpError } from '../utils/httpError';
import { changeUserPassword, getCurrentUserProfile, updateUserProfile } from '../services/users';

export async function getMe(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user) throw new HttpError(401, 'Unauthorized');
    const profile = await getCurrentUserProfile(req.user as AuthUser);
    res.status(200).json(profile);
  } catch (error) {
    if (error instanceof HttpError) {
      res.status(error.status).json({ message: error.message });
      return;
    }
    console.error('Failed to load current user profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function updateMe(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user) throw new HttpError(401, 'Unauthorized');
    const result = await updateUserProfile(req.user, req.body);
    res.status(200).json(result);
  } catch (error) {
    if (error instanceof HttpError) { res.status(error.status).json({ message: error.message }); return; }
    console.error('Failed to update current user profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function changePassword(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user) throw new HttpError(401, 'Unauthorized');
    await changeUserPassword(req.user.id, req.body);
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    if (error instanceof HttpError) { res.status(error.status).json({ message: error.message }); return; }
    console.error('Failed to change password:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

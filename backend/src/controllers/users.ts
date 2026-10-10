import { Request, Response } from 'express';
import { AuthUser } from '../types/auth';
import { HttpError } from '../utils/httpError';
import { getCurrentUserProfile } from '../services/users';

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

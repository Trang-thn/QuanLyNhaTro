import { Request, Response } from 'express';
import { getCurrentUserProfile } from '../services/users';
import { getTenantDashboardData } from '../services/tenant';

export async function getTenantProfile(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user) { res.status(401).json({ message: 'Unauthorized' }); return; }
    res.status(200).json(await getCurrentUserProfile(req.user));
  } catch (error) {
    console.error('Failed to load tenant profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function getTenantDashboard(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user) { res.status(401).json({ message: 'Unauthorized' }); return; }
    res.status(200).json(await getTenantDashboardData(req.user.id));
  } catch (error) {
    console.error('Failed to load tenant dashboard:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

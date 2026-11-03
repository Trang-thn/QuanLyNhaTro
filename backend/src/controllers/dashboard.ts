import { Request, Response } from 'express';
import { getDashboardOverview } from '../services/dashboard';

export async function getOverview(_req: Request, res: Response): Promise<void> {
  try {
    res.status(200).json(await getDashboardOverview());
  } catch (error) {
    console.error('Failed to load dashboard overview:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

import { Request, Response } from 'express'
import { approveTenantRegistration, getPendingTenantRegistrations } from '../services/admin'
import { HttpError } from '../utils/httpError'

export async function listTenantRegistrations(_req: Request, res: Response): Promise<void> {
  try {
    res.status(200).json({ requests: await getPendingTenantRegistrations() })
  } catch (error) {
    console.error('Failed to load tenant registration requests:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export async function approveTenantRegistrationRequest(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user) throw new HttpError(401, 'Unauthorized')
    const result = await approveTenantRegistration(req.params.requestId, req.user)
    res.status(200).json({ message: 'Tenant registration approved', ...result })
  } catch (error) {
    if (error instanceof HttpError) {
      res.status(error.status).json({ message: error.message })
      return
    }
    console.error('Failed to approve tenant registration:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

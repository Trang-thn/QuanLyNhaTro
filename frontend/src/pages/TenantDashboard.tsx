import { useEffect, useState } from 'react'
import TenantDashboardView from '../components/tenantDashboard/TenantDashboardView'
import { getTenantDashboardData, initialTenantDashboardData } from '../services/tenantDashboardService'
import type { TenantDashboardData } from '../types/tenantDashboard'

interface Props { linked?: boolean }

export default function TenantDashboard({ linked = true }: Props) {
  const [data, setData] = useState<TenantDashboardData>(initialTenantDashboardData)

  useEffect(() => {
    getTenantDashboardData().then(setData)
  }, [])

  return <TenantDashboardView data={data} linked={linked} />
}

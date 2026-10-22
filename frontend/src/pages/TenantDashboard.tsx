import { useCallback, useEffect, useState } from 'react'
import TenantDashboardView from '../components/tenantDashboard/TenantDashboardView'
import ApiState from '../components/common/ApiState'
import { getTenantDashboardData } from '../services/tenantDashboardService'
import type { TenantDashboardData } from '../types/tenantDashboard'

export default function TenantDashboard() {
  const [data, setData] = useState<TenantDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError(null)
    getTenantDashboardData()
      .then((result) => { if (active) setData(result) })
      .catch((requestError: unknown) => {
        if (active) setError(requestError instanceof Error ? requestError.message : 'Không thể tải Dashboard khách thuê.')
      })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [reloadKey])

  const retry = useCallback(() => setReloadKey(key => key + 1), [])
  return <ApiState loading={loading} error={error} onRetry={retry}>{data && <TenantDashboardView data={data} linked={data.contracts.length > 0} />}</ApiState>
}

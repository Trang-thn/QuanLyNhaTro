import { useCallback, useEffect, useState } from 'react'
import DashboardView from '../components/dashboard/DashboardView'
import ApiState from '../components/common/ApiState'
import { getDashboardData } from '../services/dashboardService'
import type { DashboardData } from '../types/dashboard'

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError(null)
    getDashboardData()
      .then((result) => { if (active) setData(result) })
      .catch((requestError: unknown) => {
        if (active) setError(requestError instanceof Error ? requestError.message : 'Không thể tải Dashboard.')
      })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [reloadKey])

  const retry = useCallback(() => setReloadKey(key => key + 1), [])
  return <ApiState loading={loading} error={error} onRetry={retry}>{data && <DashboardView data={data} />}</ApiState>
}

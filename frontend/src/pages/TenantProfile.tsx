import { useCallback, useEffect, useState } from 'react'
import TenantProfileView from '../components/tenantProfile/TenantProfileView'
import ApiState from '../components/common/ApiState'
import { getTenantProfileData } from '../services/tenantProfileService'
import type { TenantProfileData } from '../types/tenantProfile'

export default function TenantProfile() {
  const [data, setData] = useState<TenantProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError(null)
    getTenantProfileData()
      .then((result) => { if (active) setData(result) })
      .catch((requestError: unknown) => {
        if (active) setError(requestError instanceof Error ? requestError.message : 'Không thể tải hồ sơ khách thuê.')
      })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [reloadKey])

  const retry = useCallback(() => setReloadKey(key => key + 1), [])
  return <ApiState loading={loading} error={error} onRetry={retry}>{data && <TenantProfileView data={data} />}</ApiState>
}

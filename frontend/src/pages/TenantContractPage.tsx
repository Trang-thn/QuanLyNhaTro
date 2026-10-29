
import { useCallback, useEffect, useState } from 'react'
import TenantContractView from '../components/tenantContract/TenantContractView'
import ApiState from '../components/common/ApiState'
import { getTenantContractData } from '../services/tenantContractService'
import type { TenantContractData } from '../types/tenantContract'

export default function TenantContractPage() {
  const [data, setData] = useState<TenantContractData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let active = true

    setLoading(true)
    setError(null)

    getTenantContractData()
      .then((result) => {
        if (active) setData(result)
      })
      .catch((err: unknown) => {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : 'Không thể tải hồ sơ và hợp đồng của bạn.',
          )
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [reloadKey])

  const retry = useCallback(() => {
    setReloadKey((key) => key + 1)
  }, [])

  return (
    <ApiState loading={loading} error={error} onRetry={retry}>
      {data && (
        <TenantContractView
          profile={data.profile}
          contracts={data.contracts}
        />
      )}
    </ApiState>
  )
}

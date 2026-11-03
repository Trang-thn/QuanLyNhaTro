
import { useCallback, useEffect, useState } from 'react'
import TenantContractView from '../components/tenantContract/TenantContractView'
import ApiState from '../components/common/ApiState'
import { getTenantContractData } from '../services/tenantContractService'
import { getTenantProfileData } from '../services/tenantProfileService'
import type { TenantContractData } from '../types/tenantContract'
import type { TenantProfileData } from '../types/tenantProfile'

interface PageData {
  contracts: TenantContractData['contracts']
  profile: TenantProfileData
}

export default function TenantContractPage() {
  const [data, setData] = useState<PageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let active = true

    setLoading(true)
    setError(null)

    Promise.all([
      getTenantContractData(),
      getTenantProfileData(),
    ])
      .then(([contractData, profileData]) => {
        if (active) {
          setData({
            contracts: contractData.contracts,
            profile: profileData,
          })
        }
      })
      .catch((err: unknown) => {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : 'Không thể tải thông tin hợp đồng của bạn.',
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

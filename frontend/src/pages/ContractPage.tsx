
import { useCallback, useEffect, useState } from 'react'

import ContractManagement from '../components/contract/ContractManagement'
import ApiState from '../components/common/ApiState'
import { getContracts } from '../services/contractService'

import type { Contract } from '../types/contract'



export default function ContractPage() {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let active = true

    async function loadContracts() {
      setLoading(true)
      setError(null)

      try {
        const result = await getContracts()

        if (active) {
          setContracts(result)
        }
      } catch (err: unknown) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : 'Không thể tải danh sách hợp đồng.',
          )
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    void loadContracts()

    return () => {
      active = false
    }
  }, [reloadKey])

  const retry = useCallback(() => {
    setReloadKey((key) => key + 1)
  }, [])

  return (
    <ApiState
      loading={loading}
      error={error}
      onRetry={retry}
    >
      <ContractManagement
        contracts={contracts}
        onReload={retry}
      />
    </ApiState>
  )
}

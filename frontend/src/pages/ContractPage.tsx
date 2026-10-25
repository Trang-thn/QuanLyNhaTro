
import { useCallback, useEffect, useState } from 'react'
import ContractManagement from '../components/contract/ContractManagement'
import ApiState from '../components/common/ApiState'
import { getContracts } from '../services/contractService'
import type { Contract as ServiceContract } from '../services/contractService'
import type { Contract } from '../types/contract'

function mapContract(contract: ServiceContract): Contract {
  return {
    ...contract,
    id: String(contract.id),
    contract_number: contract.code,
    room_id: String(contract.room_id),
    representative_tenant_id: String(contract.tenant_id),
    room_number: contract.room_name ?? String(contract.room_id),
   status:
  contract.status === 'Đã thanh lý'
    ? 'DA_THANH_LY'
    : contract.status === 'Sắp hết hạn'
      ? 'HIEU_LUC'
      : contract.status === 'Đang thuê'
        ? 'HIEU_LUC'
        : 'KHONG_HIEU_LUC',
    start_date: contract.start_date,
    end_date: contract.end_date,
    rental_price: contract.rental_price,
    deposit_amount: contract.deposit_amount,
    billing_cycle_day: contract.billing_cycle_day ?? 1,
  }
}

export default function ContractPage() {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let active = true

    setLoading(true)
    setError(null)

    getContracts()
      .then((result) => {
        if (active) {
          setContracts(result.map(mapContract))
        }
      })
      .catch((err: unknown) => {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : 'Không thể tải danh sách hợp đồng.',
          )
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false)
        }
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
      <ContractManagement contracts={contracts} onReload={retry} />
    </ApiState>
  )
}

import { useCallback, useEffect, useState } from 'react'
import SettingsView from '../components/settings/SettingsView'
import ApiState from '../components/common/ApiState'
import { getSettingsData } from '../services/settingsService'
import type { SettingsData, SettingsRole } from '../types/settings'

interface Props { role: SettingsRole }

export default function Settings({ role }: Props) {
  const [data, setData] = useState<SettingsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError(null)
    getSettingsData(role)
      .then((result) => { if (active) setData(result) })
      .catch((requestError: unknown) => {
        if (active) setError(requestError instanceof Error ? requestError.message : 'Không thể tải cài đặt.')
      })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [role, reloadKey])

  const retry = useCallback(() => setReloadKey(key => key + 1), [])
  return <ApiState loading={loading} error={error} onRetry={retry}>{data && <SettingsView data={data} />}</ApiState>
}

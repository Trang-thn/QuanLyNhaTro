import { useEffect, useState } from 'react'
import SettingsView from '../components/settings/SettingsView'
import { getInitialSettingsData, getSettingsData } from '../services/settingsService'
import type { SettingsData, SettingsRole } from '../types/settings'

interface Props { role: SettingsRole }

export default function Settings({ role }: Props) {
  const [data, setData] = useState<SettingsData>(() => getInitialSettingsData(role))

  useEffect(() => {
    getSettingsData(role).then(setData)
  }, [role])

  return <SettingsView data={data} />
}

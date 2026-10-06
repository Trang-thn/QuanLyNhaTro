import { useEffect, useState } from 'react'
import TenantProfileView from '../components/tenantProfile/TenantProfileView'
import { getTenantProfileData, initialTenantProfileData } from '../services/tenantProfileService'
import type { TenantProfileData } from '../types/tenantProfile'

export default function TenantProfile() {
  const [data, setData] = useState<TenantProfileData>(initialTenantProfileData)

  useEffect(() => {
    getTenantProfileData().then(setData)
  }, [])

  return <TenantProfileView data={data} />
}

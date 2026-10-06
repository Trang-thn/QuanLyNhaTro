import { useEffect, useState } from 'react'
import DashboardView from '../components/dashboard/DashboardView'
import { getDashboardData, initialDashboardData } from '../services/dashboardService'
import type { DashboardData } from '../types/dashboard'

export default function Dashboard() {
  const [data, setData] = useState<DashboardData>(initialDashboardData)

  useEffect(() => {
    getDashboardData().then(setData)
  }, [])

  return <DashboardView data={data} />
}

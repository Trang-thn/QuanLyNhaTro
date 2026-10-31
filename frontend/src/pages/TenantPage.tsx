
import { useCallback, useEffect, useState } from 'react'
import TenantManagement from '../components/tenant/TenantManagement'
import { getTenants } from '../services/tenantService'
import type { Tenant } from '../types/tenant'

export default function TenantPage() {
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadTenants = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const result = await getTenants()
      setTenants(result)
    } catch (err) {
      console.error('Lỗi tải danh sách khách thuê:', err)
      setError('Không thể tải danh sách khách thuê. Vui lòng kiểm tra kết nối máy chủ.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadTenants()
  }, [loadTenants])

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        {/* <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Quản lý khách thuê
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Theo dõi thông tin, cập nhật và quản lý hồ sơ khách thuê phòng trọ.
          </p>
        </div> */}

        {loading ? (
          <div className="rounded-xl bg-white p-8 text-center text-gray-500 shadow-sm">
            Đang tải danh sách khách thuê...
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-white p-6 shadow-sm">
            <p className="text-red-600">{error}</p>
            <button
              type="button"
              onClick={() => void loadTenants()}
              className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Thử tải lại
            </button>
          </div>
        ) : (
          <TenantManagement
            tenants={tenants}
            onReload={loadTenants}
          />
        )}
      </div>
    </div>
  )
}

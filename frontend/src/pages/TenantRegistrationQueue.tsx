import { useCallback, useEffect, useState } from 'react'
import ApiState from '../components/common/ApiState'
import { approveTenantRegistration, getPendingTenantRegistrations } from '../services/adminService'
import type { PendingTenantRegistration } from '../services/adminService'

export default function TenantRegistrationQueue() {
  const [requests, setRequests] = useState<PendingTenantRegistration[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [approvingId, setApprovingId] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError(null)
    getPendingTenantRegistrations()
      .then((result) => { if (active) setRequests(result) })
      .catch((requestError: unknown) => {
        if (active) setError(requestError instanceof Error ? requestError.message : 'Không thể tải yêu cầu đăng ký.')
      })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [reloadKey])

  const retry = useCallback(() => setReloadKey(key => key + 1), [])

  const handleApprove = async (requestId: string) => {
    setApprovingId(requestId)
    setActionError(null)
    try {
      await approveTenantRegistration(requestId)
      setReloadKey(key => key + 1)
    } catch (requestError) {
      setActionError(requestError instanceof Error ? requestError.message : 'Không thể duyệt yêu cầu.')
    } finally {
      setApprovingId(null)
    }
  }

  return (
    <ApiState loading={loading} error={error} onRetry={retry}>
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-[#0d2137]">Yêu cầu đăng ký Tenant</h2>
          <p className="mt-1 text-sm text-gray-500">Xem CCCD và duyệt liên kết hồ sơ. Nếu chưa có tenant record, hệ thống tạo hồ sơ khi Admin duyệt.</p>
        </div>
        {actionError && <p role="alert" className="rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-700">{actionError}</p>}
        {requests.length === 0 ? (
          <div className="rounded-xl border border-gray-100 bg-white p-8 text-center text-sm text-gray-500">Không có yêu cầu đang chờ duyệt.</div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-3">Người đăng ký</th>
                  <th className="px-4 py-3">CCCD</th>
                  <th className="px-4 py-3">Liên hệ</th>
                  <th className="px-4 py-3">Ngày gửi</th>
                  <th className="px-4 py-3">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr key={request.id} className="border-t border-gray-100">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-gray-800">{request.fullName}</div>
                      <div className="text-xs text-gray-500">{request.username}</div>
                    </td>
                    <td className="px-4 py-3 font-mono">{request.identityCardNumber}</td>
                    <td className="px-4 py-3 text-gray-600">{request.email ?? '-'}<br />{request.phoneNumber ?? '-'}</td>
                    <td className="px-4 py-3 text-gray-600">{new Date(request.createdAt).toLocaleDateString('vi-VN')}</td>
                    <td className="px-4 py-3">
                      <button type="button" disabled={approvingId !== null} onClick={() => void handleApprove(request.id)} className="rounded-lg bg-amber-500 px-3 py-2 text-xs font-semibold text-white hover:bg-amber-600 disabled:opacity-50">
                        {approvingId === request.id ? 'Đang duyệt...' : 'Duyệt và liên kết'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </ApiState>
  )
}

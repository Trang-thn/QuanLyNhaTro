import type { ReactNode } from 'react'

interface Props {
  loading: boolean
  error: string | null
  onRetry: () => void
  children: ReactNode
}

export default function ApiState({ loading, error, onRetry, children }: Props) {
  if (loading) {
    return <div role="status" aria-live="polite" className="rounded-xl bg-white border border-gray-100 p-8 text-center text-sm text-gray-500">Đang tải dữ liệu...</div>
  }

  if (error) {
    return (
      <div role="alert" className="rounded-xl bg-white border border-red-100 p-8 text-center">
        <p className="text-sm text-red-700">{error}</p>
        <button type="button" onClick={onRetry} className="mt-4 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600">Thử lại</button>
      </div>
    )
  }

  return <>{children}</>
}

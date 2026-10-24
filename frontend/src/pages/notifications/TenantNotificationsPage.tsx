import { useCallback, useEffect, useState } from "react"
import type { NotificationApiDTO, TenantNotification } from "../../types/notifications"
import { TenantNotificationDetailModal } from "../../components/notifications/TenantNotification"
import { listInboxNotifications, markNotificationRead } from "../../services/notificationService"

const notificationIcon = "/assets/tenant-notification-empty.svg"

function mapNotification(item: NotificationApiDTO): TenantNotification {
  const date = new Date(item.created_at)
  return {
    id: item.id,
    title: item.title,
    preview: item.content,
    content: item.content.split(/\n+/).filter(Boolean),
    createdAt: Number.isNaN(date.getTime()) ? item.created_at : date.toLocaleString("vi-VN"),
    isRead: Boolean(item.is_read),
    icon: notificationIcon,
    senderName: item.sender_name ?? undefined,
  }
}

export default function TenantNotificationsPage() {
  const [items, setItems] = useState<TenantNotification[]>([])
  const [selected, setSelected] = useState<TenantNotification | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const unread = items.filter(item => !item.isRead).length

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      setItems((await listInboxNotifications()).map(mapNotification))
      setError(null)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Không tải được thông báo.")
    } finally { setLoading(false) }
  }, [])

  useEffect(() => { void refresh() }, [refresh])

  const openItem = async (item: TenantNotification) => {
    setSelected(item)
    if (item.isRead) return
    try {
      await markNotificationRead(item.id)
      setItems(current => current.map(value => value.id === item.id ? { ...value, isRead: true } : value))
      setSelected(current => current?.id === item.id ? { ...current, isRead: true } : current)
      setError(null)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Không thể đánh dấu đã đọc.")
    }
  }

  return (
    <div className="-m-6 min-h-[calc(100vh-60px)] bg-[#fff9f2] p-6 font-['Inter:Regular']">
      <div className="mx-auto w-full max-w-[1136px]">
        <p className="font-['Inter:Extra_Bold'] text-2xl font-extrabold text-[#1f2937]">Thông báo</p>
        <p className="mt-2 text-sm text-[#4f5e74]">Theo dõi các thông báo từ Chủ trọ.</p>
        {error && <div role="alert" className="mt-4 flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"><span>{error}</span><button type="button" onClick={() => void refresh()} className="font-bold underline">Thử lại</button></div>}
        {loading ? <p role="status" className="mt-6 text-sm text-[#4f5e74]">Đang tải thông báo...</p> : items.length ?
          <div className="mt-6 overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white">
            <div className="flex items-center justify-between px-6 py-5">
              <strong className="text-base text-[#1f2937]">Thông báo của tôi</strong>
              <span className="text-xs text-[#8c9bae]">{unread} thông báo chưa đọc</span>
            </div>{items.map(item =>
              <button key={item.id} type="button" onClick={() => void openItem(item)} className={`relative flex w-full gap-4 border-t border-[#e5e7eb] p-6 text-left ${item.isRead ? 'bg-white' : 'bg-[#fffaf0]'}`}>
                <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#fff3df] text-[#d97706]" aria-hidden="true">
                  <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 17h5l-1.4-1.4a2 2 0 01-.6-1.4V11a6 6 0 00-4-5.7V5a2 2 0 10-4 0v.3C7.7 6.2 6 8.4 6 11v3.2a2 2 0 01-.6 1.4L4 17h5m6 0H9m6 0v1a3 3 0 11-6 0v-1" /></svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`text-[15px] text-[#1f2937] ${item.isRead ? 'font-semibold' : 'font-bold'}`}>{item.title}</p>
                  <p className="mt-2 truncate text-[13px] text-[#4f5e74]">{item.preview}</p>
                  <div className="mt-2 flex gap-3 text-xs">
                    <span className="text-[#8c9bae]">{item.createdAt}</span>
                    <span className={item.isRead ? 'text-[#8c9bae]' : 'font-bold text-[#b45309]'}>{item.isRead ? 'Đã đọc' : 'Chưa đọc'}</span>
                  </div>
                </div>
                {!item.isRead && <img src="/assets/tenant-notification-unread.svg" alt="" width="7" height="7" className="absolute right-5 top-5" />}
              </button>)}
          </div> : <div className="mt-6 flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-[#e5e7eb] bg-white p-10 text-center">
            <img src="/assets/tenant-notification-empty.svg" alt="" width="72" height="72" />
            <p className="mt-5 font-['Inter:Extra_Bold'] text-lg font-extrabold text-[#1f2937]">Chưa có thông báo</p>
            <p className="mt-3 text-sm text-[#4f5e74]">Hiện tại chưa có thông báo mới.</p>
          </div>
        }
      </div>
      {selected && <TenantNotificationDetailModal item={selected} close={() => setSelected(null)} />}
    </div>
  )
}

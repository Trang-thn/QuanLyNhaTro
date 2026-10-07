import type { TenantNotification } from "../../types/notifications"
import { TenantNotificationDetailModal, TenantNotificationDropdown } from "../../components/notifications/TenantNotification"

export default function TenantNotificationsPage({ items, openItem }: { items: TenantNotification[]; openItem: (item: TenantNotification) => void }) {
  const unread = items.filter(item => !item.isRead).length
  return (
    <div className="-m-6 min-h-[calc(100vh-60px)] bg-[#fff9f2] p-6 font-['Inter:Regular']">
      <div className="mx-auto w-full max-w-[1136px]">
        <p className="font-['Inter:Extra_Bold'] text-2xl font-extrabold text-[#1f2937]">Thông báo</p>
        <p className="mt-2 text-sm text-[#4f5e74]">Theo dõi các thông báo từ Chủ trọ.</p>
        {items.length ?
          <div className="mt-6 overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white">
            <div className="flex items-center justify-between px-6 py-5">
              <strong className="text-base text-[#1f2937]">Thông báo của tôi</strong>
              <span className="text-xs text-[#8c9bae]">{unread} thông báo chưa đọc</span>
            </div>{items.map(item =>
              <button key={item.id} type="button" onClick={() => openItem(item)} className={`relative flex w-full gap-4 border-t border-[#e5e7eb] p-6 text-left ${item.isRead ? 'bg-white' : 'bg-[#fffaf0]'}`}>
                <img src={item.icon} alt="" width="44" height="44" />
                <div className="min-w-0 flex-1">
                  <p className={`text-[15px] text-[#1f2937] ${item.isRead ? 'font-semibold' : 'font-bold'}`}>{item.title}</p>
                  <p className="mt-2 truncate text-[13px] text-[#4f5e74]">{item.preview}</p>
                  <div className="mt-2 flex gap-3 text-xs">
                    <span className="text-[#8c9bae]">{item.createdAt}</span>
                    <span className={item.isRead ? 'text-[#8c9bae]' : 'font-bold text-[#b45309]'}>{item.isRead ? 'Đã đọc' : 'Chưa đọc'}</span>
                  </div>
                </div>
                {
                  !item.isRead && <img src="/assets/tenant-notification-unread.svg" alt="" width="7" height="7" className="absolute right-5 top-5" />}</button>)}
          </div> : <div className="mt-6 flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-[#e5e7eb] bg-white p-10 text-center">
            <img src="/assets/tenant-notification-empty.svg" alt="" width="72" height="72" />
            <p className="mt-5 font-['Inter:Extra_Bold'] text-lg font-extrabold text-[#1f2937]">Chưa có thông báo</p>
            <p className="mt-3 text-sm text-[#4f5e74]">Hiện tại chưa có thông báo mới.</p>
          </div>
        }
      </div>
    </div>
  )
}

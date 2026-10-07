import type { TenantNotification } from "../../types/notifications"
export function TenantNotificationDetailModal({ item, close }: { item: TenantNotification; close: () => void }) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#172b4d]/40 p-4" role="dialog" aria-modal="true" onMouseDown={event => event.target === event.currentTarget && close()}>
      <div className="max-h-[calc(100dvh-32px)] w-full max-w-[600px] overflow-y-auto rounded-2xl border border-[#e5e7eb] bg-white shadow-[0_12px_32px_rgba(23,43,77,0.18)]">
        <div className="flex items-center justify-between border-b border-[#e5e7eb] px-6 py-5">
          <p className="font-['Inter:Extra_Bold'] text-lg font-extrabold text-[#1f2937]">Chi tiết thông báo</p>
          <button type="button" onClick={close} aria-label="Đóng" className="text-2xl font-light text-[#4f5e74]">×</button>
        </div>
        <div className="p-6">
          <p className="font-['Inter:Bold'] text-xs font-bold text-[#8c9bae]">Tiêu đề</p>
          <p className="mt-2 font-['Inter:Extra_Bold'] text-xl font-extrabold text-[#1f2937]">{item.title}</p>
          <div className="mt-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-[#8c9bae]">Thời gian</p>
              <p className="mt-1 text-sm text-[#4f5e74]">{item.createdAt}</p>
            </div>
            <span className="rounded-full bg-[#e6f4ea] px-3 py-1.5 text-[11px] font-bold text-[#16885b]">Đã đọc</span>
          </div>
          <div className="mt-6">
            <p className="font-['Inter:Bold'] text-xs font-bold text-[#8c9bae]">Nội dung</p>
            <div className="mt-3 space-y-4 text-sm leading-6 text-[#4f5e74]">
              {item.content.map((line, index) => <p key={index}>{line}</p>)}
              {item.deadline &&
                <div className="rounded-lg border border-[#e5e7eb] bg-[#fff9f2] p-4">
                  <strong className="block text-[#1f2937]">{item.deadline}</strong>
                  <span className="mt-1 block">Vui lòng kiểm tra hóa đơn tại mục Hóa đơn & Thanh toán và thanh toán đúng hạn.</span>
                </div>}
            </div>
          </div>
        </div>
        <div className="flex justify-end border-t border-[#e5e7eb] px-6 py-5">
          <button type="button" onClick={close} className="rounded-lg border border-[#e5e7eb] px-5 py-2.5 text-sm font-semibold text-[#4f5e74]">Đóng</button>
        </div>
      </div>
    </div>
  )
}

export function TenantNotificationDropdown({ items, openItem, viewAll }: { items: TenantNotification[]; openItem: (item: TenantNotification) => void; viewAll: () => void }) {
  const unread = items.filter(item => !item.isRead).length
  return (
    <div className="absolute right-[-52px] top-full z-50 mt-2 w-[400px] max-w-[calc(100vw-32px)] overflow-hidden rounded-xl border border-[#e5e7eb] bg-white shadow-[0_8px_24px_rgba(23,43,77,0.13)] sm:right-0">
      <div className="flex items-center justify-between px-4 py-3.5"><strong className="text-sm text-[#1f2937]">Thông báo</strong><span className="rounded-full bg-[#fef3c7] px-2 py-1 text-[11px] font-bold text-[#b45309]">{unread} chưa đọc</span></div>
      {items.slice(0, 3).map(item => <button key={item.id} type="button" onClick={() => openItem(item)} className={`relative block w-full border-t border-[#e5e7eb] p-4 text-left ${item.isRead ? 'bg-white' : 'bg-[#fffaf0]'}`}><p className={`pr-3 text-[13px] text-[#1f2937] ${item.isRead ? 'font-semibold' : 'font-bold'}`}>{item.title}</p><p className="mt-2 line-clamp-2 text-xs leading-5 text-[#4f5e74]">{item.preview}</p><div className="mt-2 flex gap-3 text-[11px]"><span className="text-[#8c9bae]">{item.createdAt}</span><span className={item.isRead ? 'text-[#8c9bae]' : 'font-bold text-[#b45309]'}>{item.isRead ? 'Đã đọc' : 'Chưa đọc'}</span></div>{!item.isRead && <img src="/assets/tenant-notification-unread.svg" alt="" width="7" height="7" className="absolute right-3 top-4" />}</button>)}
      <button type="button" onClick={viewAll} className="w-full border-t border-[#e5e7eb] py-4 text-center text-[13px] font-bold text-[#d97706]">Xem tất cả thông báo</button>
    </div>
  )
}
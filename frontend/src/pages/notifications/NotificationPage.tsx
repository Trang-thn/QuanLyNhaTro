import { useState } from 'react'
import type { Item, Draft } from "../../types/notifications"
import { initialItems } from "../../data/notifications/Notifications"
import { CreateModal, ConfirmModal, DetailModal } from "../../components/notifications/Notifications"

const emptyDraft: Draft = { title: '', content: '', target: 'all', scope: 'all', person: '', room: '' }
export default function NotificationPage() {
  const [items, setItems] = useState(initialItems), [tab, setTab] = useState<'sent' | 'inbox'>('sent'), [modal, setModal] = useState<'none' | 'create' | 'confirm'>('none'), [draft, setDraft] = useState(emptyDraft), [selected, setSelected] = useState<string | null>(null)
  const selectedItem = items.find(item => item.id === selected), visible = tab === 'sent' ? items : []
  const send = () => { const recipient = draft.target === 'person' && draft.person ? draft.person : draft.scope === 'room' && draft.room ? `Phòng ${draft.room}` : 'Tất cả'; setItems(current => [{ id: String(Date.now()), title: draft.title.trim(), content: draft.content.trim(), recipient, sentAt: 'Vừa xong', unread: false }, ...current]); setDraft(emptyDraft); setModal('none'); setTab('sent') }
  return <section className="mx-auto flex w-full max-w-[1136px] flex-col gap-6 font-['Inter:Regular']">
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <div className="flex gap-2 text-[13px]">
          <span className="text-[#8c9bae]">Tổng quan</span>
          <span className="text-[#8c9bae]">/</span>
          <span className="font-['Inter:Bold'] font-bold text-[#172b4d]">Thông báo</span>
        </div>
        <p className="mt-3 font-['Inter:Extra_Bold'] text-[28px] font-extrabold text-[#1c2534]">Thông Báo</p>
      </div>
      <button type="button" onClick={() => setModal('create')} className="flex items-center gap-2 rounded-lg bg-[#f59e0b] px-5 py-3 font-['Inter:Bold'] text-sm font-bold text-white">
        <img src="/assets/583dd.svg" alt="" width="16" height="16" />
        Tạo thông báo mới
      </button>
    </div>
    <div className="rounded-xl border border-[#eadfc9] bg-white p-4">
      <div className="flex gap-2">
        {
          ([['sent', 'Đã gửi'], ['inbox', 'Hộp thư đến']] as const).map(([value, label]) =>
            <button key={value} type="button" onClick={() => setTab(value)} className={`rounded-lg px-4 py-2 text-[13px] ${tab === value ? "bg-[#f59e0b] font-['Inter:Bold'] font-bold text-white" : 'border border-[#eadfc9] text-[#1c2534]'}`}>{label}</button>)
        }
      </div>
    </div>
    {
      visible.length ?
        <div className="overflow-hidden rounded-2xl border border-[#eadfc9] bg-white shadow-[0_4px_8px_rgba(74,59,27,0.08)]">
          <div className="hidden grid-cols-[16px_minmax(0,1fr)_180px_160px] items-center gap-4 border-b border-[#eadfc9] bg-[#faf8f5] px-6 py-3.5 md:grid">
            <img src="/assets/35a49.svg" alt="" width="16" height="8" />
            <p className="font-['Inter:Bold'] text-xs font-bold text-[#8c9bae]">NỘI DUNG THÔNG BÁO</p>
            <p className="font-['Inter:Bold'] text-xs font-bold text-[#8c9bae]">ĐỐI TƯỢNG NHẬN</p>
            <p className="text-right font-['Inter:Bold'] text-xs font-bold text-[#8c9bae]">THỜI GIAN GỬI</p>
          </div>
          {
            visible.map(item =>
              <button key={item.id} type="button" onClick={() => {
                setItems(current => current.map(n => n.id === item.id ? { ...n, unread: false } : n)); setSelected(item.id)
              }
              }
                className={`grid w-full grid-cols-[16px_minmax(0,1fr)] items-center gap-x-4 gap-y-3 border-b border-[#f5efe0] px-4 py-4 text-left last:border-0 md:grid-cols-[16px_minmax(0,1fr)_180px_160px] md:px-6 ${item.unread ? 'bg-[#fffbf0]' : 'bg-white'}`}><img src={item.unread ? '/assets/6a318.svg' : '/assets/82b44.svg'} alt="" width="16" height="8" />
                <div className="min-w-0">
                  <p className={`truncate text-[15px] text-[#1c2534] ${item.unread ? "font-['Inter:Bold'] font-bold" : 'font-semibold'}`}>{item.title}</p>
                  <p className="mt-1 truncate text-[13px] text-[#4f5e74]">{item.content}</p>
                </div>
                <div className="col-start-2 md:col-auto">
                  <span className={`inline-block max-w-full truncate rounded-md px-2.5 py-1 text-[11px] font-semibold ${item.recipient === 'Tất cả' ? 'bg-[#e3f2fd] text-[#3b82f6]' : 'bg-[#fff3e0] text-[#d97706]'}`}>{item.recipient}</span>
                </div>
                <p className="col-start-2 text-xs text-[#8c9bae] md:col-auto md:text-right md:text-[13px]">{item.sentAt}</p>
              </button>
            )
          }
        </div> :
        <div className="flex min-h-[350px] flex-col items-center justify-center gap-5 rounded-2xl border border-[#eadfc9] bg-white p-10 text-center">
          <div className="flex size-20 items-center justify-center rounded-full bg-[#faf8f5]">
            <img src="/assets/46d07.svg" alt="" width="40" height="40" />
          </div>
          <div>
            <p className="font-['Inter:Extra_Bold'] text-lg font-extrabold text-[#1c2534]">Chưa có thông báo nào</p>
            <p className="mx-auto mt-2 max-w-80 text-sm text-[#4f5e74]">Bạn chưa gửi thông báo nào. Bấm vào nút bên dưới để tạo và gửi thông báo đầu tiên của bạn.</p>
          </div>
          <button type="button" onClick={() => setModal('create')} className="flex items-center gap-2 rounded-lg bg-[#f59e0b] px-5 py-3 font-bold text-white">
            <img src="/assets/583dd.svg" alt="" width="16" height="16" />Tạo thông báo</button>
        </div>
    }
    {modal === 'create' && <CreateModal draft={draft} setDraft={setDraft} close={() => setModal('none')} confirm={() => setModal('confirm')} />}
    {modal === 'confirm' && <ConfirmModal cancel={() => setModal('create')} send={send} />}
    {selectedItem && <DetailModal item={selectedItem} close={() => setSelected(null)} />}
  </section>
}

import { useCallback, useEffect, useState } from 'react'
import type { Item, Draft, NotificationApiDTO, NotificationRecipient, NotificationRoom } from "../../types/notifications"
import { CreateModal, ConfirmModal, DetailModal } from "../../components/notifications/Notifications"
import { createNotification, deleteAllSentNotifications, deleteNotification, listNotificationRecipients, listSentNotifications } from '../../services/notificationService'

const emptyDraft: Draft = { title: '', content: '', target: 'all', scope: 'all', person: '', room: '' }

function mapSentNotification(item: NotificationApiDTO): Item {
  const date = new Date(item.created_at)
  const recipient = item.receiver_name ? `${item.receiver_name}${item.room_number ? ` (${item.room_number})` : ''}` : 'Người thuê'
  return {
    id: item.id,
    title: item.title,
    content: item.content,
    recipient,
    sentAt: Number.isNaN(date.getTime()) ? item.created_at : date.toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' }),
    unread: false,
  }
}

export default function NotificationPage() {
  const [items, setItems] = useState<Item[]>([])
  const [recipients, setRecipients] = useState<NotificationRecipient[]>([])
  const [rooms, setRooms] = useState<NotificationRoom[]>([])
  const [tab, setTab] = useState<'sent' | 'inbox'>('sent')
  const [modal, setModal] = useState<'none' | 'create' | 'confirm'>('none')
  const [draft, setDraft] = useState(emptyDraft)
  const [selected, setSelected] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingRecipients, setLoadingRecipients] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const selectedItem = items.find(item => item.id === selected)
  const visible = tab === 'sent' ? items : []

  const refreshSent = useCallback(async () => {
    setLoading(true)
    try {
      setItems((await listSentNotifications()).map(mapSentNotification))
      setError(null)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Không tải được thông báo đã gửi.')
    } finally { setLoading(false) }
  }, [])

  useEffect(() => { void refreshSent() }, [refreshSent])

  const openCreate = async () => {
    setError(null)
    setLoadingRecipients(true)
    setModal('create')
    try {
      const data = await listNotificationRecipients()
      setRecipients(data.users)
      setRooms(data.rooms)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Không tải được danh sách người nhận.')
    } finally { setLoadingRecipients(false) }
  }

  const send = async () => {
    setSaving(true)
    setError(null)
    try {
      await createNotification({
        title: draft.title,
        content: draft.content,
        ...(draft.target === 'person' ? { receiver_id: draft.person } : {}),
        ...(draft.scope === 'room' ? { room_id: draft.room } : {}),
      })
      setDraft(emptyDraft)
      setModal('none')
      await refreshSent()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Không gửi được thông báo.')
      setModal('create')
    } finally { setSaving(false) }
  }

  const removeOne = async (id: string) => {
    if (!window.confirm('Xóa thông báo đã chọn?')) return
    try { await deleteNotification(id); setItems(current => current.filter(item => item.id !== id)); setError(null) }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Không xóa được thông báo.') }
  }

  const removeAll = async () => {
    if (!window.confirm('Xóa tất cả thông báo đã gửi?')) return
    try { await deleteAllSentNotifications(); setItems([]); setError(null) }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Không xóa được thông báo.') }
  }
  return <section className="mx-auto flex w-full max-w-[1136px] flex-col gap-6 font-['Inter:Regular']">
    {error && modal === 'none' && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error} <button type="button" onClick={() => void refreshSent()} className="ml-2 font-bold underline">Retry</button></p>}
    {loading && <p role="status" className="text-sm text-[#4f5e74]">Loading notifications...</p>}
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <div className="flex gap-2 text-[13px]">
          <span className="text-[#8c9bae]">Tổng quan</span>
          <span className="text-[#8c9bae]">/</span>
          <span className="font-['Inter:Bold'] font-bold text-[#172b4d]">Thông báo</span>
        </div>
        <p className="mt-3 font-['Inter:Extra_Bold'] text-[28px] font-extrabold text-[#1c2534]">Thông Báo</p>
      </div>
      <button type="button" onClick={() => void openCreate()} className="flex items-center gap-2 rounded-lg bg-[#f59e0b] px-5 py-3 font-['Inter:Bold'] text-sm font-bold text-white">
        <img src="/assets/583dd.svg" alt="" width="16" height="16" />
        Tạo thông báo mới
      </button>
    </div>
    <div className="rounded-xl border border-[#eadfc9] bg-white p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setTab('sent')}
            className={`rounded-lg px-4 py-2 text-[13px] ${tab === 'sent'
              ? "bg-[#f59e0b] font-['Inter:Bold'] font-bold text-white"
              : 'border border-[#eadfc9] text-[#1c2534]'
              }`}
          >
            Đã gửi
          </button>
        </div>


        {visible.length > 0 && (
          <button
            type="button"
            onClick={() => void removeAll()}
            className="rounded-lg border border-[#eadfc9] px-4 py-2 text-[13px] font-semibold text-[#dc2626] transition hover:bg-[#fef2f2]"
          >
            Xóa tất cả
          </button>
        )}
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
            visible.map(item => (
              <div
                key={item.id}
                className={`grid w-full grid-cols-[16px_minmax(0,1fr)_auto] items-center gap-x-4 gap-y-3 border-b border-[#f5efe0] px-4 py-4 last:border-0 md:grid-cols-[16px_minmax(0,1fr)_180px_160px_auto] md:px-6 ${item.unread ? 'bg-[#fffbf0]' : 'bg-white'
                  }`}
              >
                <img
                  src={item.unread ? '/assets/6a318.svg' : '/assets/82b44.svg'}
                  alt=""
                  width="16"
                  height="8"
                />

                <button
                  type="button"
                  onClick={() => setSelected(item.id)}
                  className="min-w-0 text-left"
                >
                  <p
                    className={`truncate text-[15px] text-[#1c2534] ${item.unread
                      ? "font-['Inter:Bold'] font-bold"
                      : 'font-semibold'
                      }`}
                  >
                    {item.title}
                  </p>

                  <p className="mt-1 truncate text-[13px] text-[#4f5e74]">
                    {item.content}
                  </p>
                </button>

                <div className="col-start-2 md:col-auto">
                  <span
                    className={`inline-block max-w-full truncate rounded-md px-2.5 py-1 text-[11px] font-semibold ${item.recipient === 'Tất cả'
                      ? 'bg-[#e3f2fd] text-[#3b82f6]'
                      : 'bg-[#fff3e0] text-[#d97706]'
                      }`}
                  >
                    {item.recipient}
                  </span>
                </div>

                <p className="col-start-2 text-xs text-[#8c9bae] md:col-auto md:text-right md:text-[13px]">
                  {item.sentAt}
                </p>

                <button
                  type="button"
                  onClick={() => void removeOne(item.id)}
                  aria-label={`Xóa thông báo ${item.title}`}
                  className="flex size-8 items-center justify-center rounded-lg text-[#dc2626] transition hover:bg-[#fef2f2]"
                >
                  <img
                    src="/assets/7851d.svg"
                    alt=""
                    width="16"
                    height="16"
                  />
                </button>
              </div>
            ))
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
          <button type="button" onClick={() => void openCreate()} className="flex items-center gap-2 rounded-lg bg-[#f59e0b] px-5 py-3 font-bold text-white">
            <img src="/assets/583dd.svg" alt="" width="16" height="16" />Tạo thông báo</button>
        </div>
    }
    {modal === 'create' && <CreateModal draft={draft} setDraft={setDraft} close={() => setModal('none')} confirm={() => setModal('confirm')} recipients={recipients} rooms={rooms} loadingRecipients={loadingRecipients} error={error} />}
    {modal === 'confirm' && <ConfirmModal cancel={() => setModal('create')} send={() => void send()} saving={saving} />}
    {selectedItem && <DetailModal item={selectedItem} close={() => setSelected(null)} />}
  </section>
}

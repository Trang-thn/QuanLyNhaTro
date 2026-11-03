
import { useCallback, useEffect, useState } from 'react'

import ContractExtensionNotification, {
  parseExtensionRequest,
  type InboxNotification,
} from '../../components/notifications/ContractExtensionNotification'

import type {
  Item,
  Draft,
  NotificationApiDTO,
  NotificationRecipient,
  NotificationRoom,
} from '../../types/notifications'

import {
  CreateModal,
  ConfirmModal,
  DetailModal,
} from '../../components/notifications/Notifications'

import {
  createNotification,
  deleteAllSentNotifications,
  deleteNotification,
  listNotificationRecipients,
  listSentNotifications,
  listInboxNotifications,
  reviewContractExtensionRequest,
} from '../../services/notificationService'
 // ================= CẤU HÌNH =================

const emptyDraft: Draft = {
  title: '',
  content: '',
  audience: 'ALL',
  person: '',
  room: '',
}



// ================= HÀM HỖ TRỢ =================
 
function formatNotificationDate(value: string) {
  const date = new Date(value)

  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
}

// Chuyển dữ liệu thông báo đã gửi về kiểu Item đang sử dụng
function mapSentNotification(item: NotificationApiDTO): Item {
  const recipient =
    item.audience_type === 'ALL'
      ? 'Tất cả người thuê'
      : item.audience_type === 'ROOM'
        ? `Người thuê phòng ${item.room_number ?? ''}`.trim()
        : item.receiver_name
          ? `${item.receiver_name}${
              item.room_number ? ` (${item.room_number})` : ''
            }`
          : 'Người thuê'

  return {
    id: item.id,
    title: item.title,
    content: item.content,
    recipient,
    sentAt: formatNotificationDate(item.created_at),
    unread: false,
  }
}

// ================= TRANG QUẢN LÝ THÔNG BÁO =================

export default function NotificationPage() {
  // Danh sách thông báo đã gửi
  const [items, setItems] = useState<Item[]>([])

  // Danh sách thông báo nhận được
  const [inboxItems, setInboxItems] = useState<InboxNotification[]>([])

  // Danh sách người nhận theo phòng
  const [recipientsByRoom, setRecipientsByRoom] = useState<
    Record<string, NotificationRecipient[]>
  >({})

  const [rooms, setRooms] = useState<NotificationRoom[]>([])

  // Tab hiện tại
  const [tab, setTab] = useState<'sent' | 'inbox'>('sent')

  // Modal
  const [modal, setModal] = useState<'none' | 'create' | 'confirm'>('none')

  const [draft, setDraft] = useState(emptyDraft)
  const [selected, setSelected] = useState<string | null>(null)

  // Trạng thái tải dữ liệu
  const [loading, setLoading] = useState(false)
  const [loadingRooms, setLoadingRooms] = useState(false)
  const [loadingRoomId, setLoadingRoomId] = useState<string | null>(null)

  // Trạng thái xử lý
  const [saving, setSaving] = useState(false)
  const [reviewingId, setReviewingId] = useState<string | null>(null)

  const [error, setError] = useState<string | null>(null)

  const selectedItem = items.find(item => item.id === selected)

  // Chỉ hiển thị danh sách đã gửi ở tab Đã gửi
  const visible = tab === 'sent' ? items : []

  // ================= TẢI THÔNG BÁO ĐÃ GỬI =================

  const refreshSent = useCallback(async () => {
    setLoading(true)

    try {
      const data = await listSentNotifications()

      setItems(data.map(mapSentNotification))
      setError(null)
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : 'Không tải được thông báo đã gửi.',
      )
    } finally {
      setLoading(false)
    }
  }, [])

  // ================= TẢI THÔNG BÁO ĐẾN =================

  const refreshInbox = useCallback(async () => {
    setLoading(true)

    try {
      const data = await listInboxNotifications()

      setInboxItems(data as InboxNotification[])
      setError(null)
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : 'Không tải được thông báo đến.',
      )
    } finally {
      setLoading(false)
    }
  }, [])

  // Tự động tải dữ liệu theo tab đang chọn
  useEffect(() => {
    if (tab === 'sent') {
      void refreshSent()
    } else {
      void refreshInbox()
    }
  }, [tab, refreshSent, refreshInbox])

  // ================= DUYỆT / TỪ CHỐI GIA HẠN =================

  const handleReviewExtension = async (
    id: string,
    action: 'APPROVE' | 'REJECT',
  ) => {
    
    // Đánh dấu yêu cầu đang được xử lý
    setReviewingId(id)
    setError(null)

    try {
      // Gửi yêu cầu lên Backend
      await reviewContractExtensionRequest(id, {
        action,
        ...(action === 'REJECT'
          ? { rejection_reason: '' }
          : {}),
      })

      // Tải lại danh sách thông báo đến để cập nhật trạng thái
      await refreshInbox()

     } catch (cause) {
      const message =
        cause instanceof Error
          ? cause.message
          : 'Không xử lý được yêu cầu gia hạn.'

      setError(message)
      window.alert(message)
    } finally {
      // Kết thúc trạng thái xử lý
      setReviewingId(null)
    }
  }


  // ================= TẠO THÔNG BÁO =================

  const openCreate = async () => {
    setError(null)
    setModal('create')
    setLoadingRooms(true)

    try {
      const data = await listNotificationRecipients()
      setRooms(data.rooms)
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : 'Không tải được danh sách phòng.',
      )
    } finally {
      setLoadingRooms(false)
    }
  }

  // Tải người thuê theo phòng
  const loadRecipients = async (roomId: string) => {
    if (
      !roomId ||
      Object.prototype.hasOwnProperty.call(recipientsByRoom, roomId) ||
      loadingRoomId === roomId
    ) {
      return
    }

    setLoadingRoomId(roomId)

    try {
      const data = await listNotificationRecipients(roomId)

      setRecipientsByRoom(current => ({
        ...current,
        [roomId]: data.users,
      }))
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : 'Không tải được người thuê của phòng.',
      )
    } finally {
      setLoadingRoomId(current =>
        current === roomId ? null : current,
      )
    }
  }

  // Gửi thông báo thông thường
  const send = async () => {
    setSaving(true)
    setError(null)

    try {
      await createNotification({
        title: draft.title,
        content: draft.content,
        audience: draft.audience,
        ...(draft.audience !== 'ALL'
          ? { room_id: draft.room }
          : {}),
        ...(draft.audience === 'TENANT'
          ? { receiver_id: draft.person }
          : {}),
      })

      setDraft(emptyDraft)
      setModal('none')

      await refreshSent()
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : 'Không gửi được thông báo.',
      )

      setModal('create')
    } finally {
      setSaving(false)
    }
  }

  // ================= XÓA THÔNG BÁO =================

  const removeOne = async (id: string) => {
    if (!window.confirm('Xóa thông báo đã chọn?')) return

    try {
      await deleteNotification(id)

      setItems(current =>
        current.filter(item => item.id !== id),
      )

      setError(null)
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : 'Không xóa được thông báo.',
      )
    }
  }

  const removeAll = async () => {
    if (!window.confirm('Xóa tất cả thông báo đã gửi?')) return

    try {
      await deleteAllSentNotifications()

      setItems([])
      setError(null)
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : 'Không xóa được thông báo.',
      )
    }
  }

  // ================= GIAO DIỆN =================

  return (
    <section className="mx-auto flex h-full min-h-[420px] w-full max-w-[1136px] min-w-0 flex-col gap-4 font-['Inter:Regular']">

      {/* HIỂN THỊ LỖI */}
      {error && modal === 'none' && (
        <p
          role="alert"
          className="shrink-0 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}

          <button
            type="button"
            onClick={() => {
              if (tab === 'sent') {
                void refreshSent()
              } else {
                void refreshInbox()
              }
            }}
            className="ml-2 font-bold underline"
          >
            Thử lại
          </button>
        </p>
      )}

      {/* ĐANG TẢI */}
      {loading && (
        <p
          role="status"
          className="shrink-0 text-sm text-[#4f5e74]"
        >
          Đang tải thông báo...
        </p>
      )}

      {/* TIÊU ĐỀ */}
      <div className="flex shrink-0 flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mt-3 font-['Inter:Extra_Bold'] text-[28px] font-extrabold text-[#1c2534]">
            Thông Báo
          </p>
        </div>

        <button
          type="button"
          onClick={() => void openCreate()}
          className="flex items-center gap-2 rounded-lg bg-[#f59e0b] px-5 py-3 font-['Inter:Bold'] text-sm font-bold text-white"
        >
          Tạo thông báo mới
        </button>
      </div>

      {/* THANH TAB */}
      <div className="shrink-0 rounded-xl border border-[#eadfc9] bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">

          <div className="flex gap-2">

            <button
              type="button"
              onClick={() => setTab('sent')}
              className={`rounded-lg px-4 py-2 text-[13px] ${
                tab === 'sent'
                  ? 'bg-[#f59e0b] font-bold text-white'
                  : 'border border-[#eadfc9] text-[#1c2534]'
              }`}
            >
              Đã gửi
            </button>

            <button
              type="button"
              onClick={() => setTab('inbox')}
              className={`rounded-lg px-4 py-2 text-[13px] ${
                tab === 'inbox'
                  ? 'bg-[#f59e0b] font-bold text-white'
                  : 'border border-[#eadfc9] text-[#1c2534]'
              }`}
            >
              Thông báo đến

              {inboxItems.length > 0 && (
                <span className="ml-2 rounded-full bg-red-500 px-2 py-0.5 text-white">
                  {inboxItems.length}
                </span>
              )}
            </button>

          </div>

          {/* CHỈ XÓA TẤT CẢ Ở TAB ĐÃ GỬI */}
          {tab === 'sent' && visible.length > 0 && (
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

      {/* ================= TAB THÔNG BÁO ĐẾN ================= */}

      {tab === 'inbox' && (
        inboxItems.length > 0 ? (
          <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-3 overflow-y-auto rounded-2xl">

           {inboxItems.map(item => {
  const extension = parseExtensionRequest(item.content)

  // Thông báo thông thường
  if (!extension) {
    return (
      <div
        key={item.id}
        className="rounded-xl border border-[#eadfc9] bg-white p-4 shadow-sm"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="font-bold text-[#1c2534]">
            {item.title}
          </p>

          <span className="text-xs text-[#8c9bae]">
            {formatNotificationDate(item.created_at)}
          </span>
        </div>

        <p className="mt-2 whitespace-pre-wrap text-sm text-[#4f5e74]">
          {item.content}
        </p>

        <p className="mt-2 text-xs text-[#8c9bae]">
          Người gửi: {item.sender_name || 'Người gửi'}
        </p>
      </div>
    )
  }

  // Thông báo yêu cầu gia hạn hợp đồng
  return (
    <ContractExtensionNotification
      key={item.id}
      itemId={item.id}
      extension={extension}
      roomNumber={item.room_number}
      sentAt={formatNotificationDate(item.created_at)}
      reviewing={reviewingId === item.id}
      onReview={(id, action) => {
        void handleReviewExtension(id, action)
      }}
    />
  )
})}

          </div>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center rounded-2xl border border-[#eadfc9] bg-white p-6 text-center">

            <div className="flex size-20 items-center justify-center rounded-full bg-[#faf8f5] text-[#d97706]">
              <svg
                className="size-9"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.6}
                  d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 0 0-5-5.9V4a1 1 0 0 0-2 0v1.1A6 6 0 0 0 6 11v3.2a2 2 0 0 1-.6 1.4L4 17h5m6 0a3 3 0 0 1-6 0"
                />
              </svg>
            </div>

            <p className="mt-4 text-lg font-extrabold text-[#1c2534]">
              Chưa có thông báo đến
            </p>

            <p className="mt-2 text-sm text-[#4f5e74]">
              Các yêu cầu gia hạn và thông báo từ khách thuê sẽ hiển thị tại đây.
            </p>

          </div>
        )
      )}

      {/* ================= TAB ĐÃ GỬI ================= */}

      {tab === 'sent' && (
        visible.length > 0 ? (
          <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-[#eadfc9] bg-white shadow-[0_4px_8px_rgba(74,59,27,0.08)]">

            {/* TIÊU ĐỀ DANH SÁCH */}
            <div className="hidden shrink-0 grid-cols-[16px_minmax(0,1fr)_180px_160px_auto] items-center gap-4 border-b border-[#eadfc9] bg-[#faf8f5] px-6 py-3.5 md:grid">

              <span
                aria-hidden="true"
                className="block size-2 rounded-full bg-[#f59e0b]"
              />

              <p className="font-['Inter:Bold'] text-xs font-bold text-[#8c9bae]">
                NỘI DUNG THÔNG BÁO
              </p>

              <p className="font-['Inter:Bold'] text-xs font-bold text-[#8c9bae]">
                ĐỐI TƯỢNG NHẬN
              </p>

              <p className="text-right font-['Inter:Bold'] text-xs font-bold text-[#8c9bae]">
                THỜI GIAN GỬI
              </p>

            </div>

            {/* DANH SÁCH */}
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">

              {visible.map(item => (
                <div
                  key={item.id}
                  className={`grid w-full grid-cols-[16px_minmax(0,1fr)_auto] items-center gap-x-4 gap-y-3 border-b border-[#f5efe0] px-4 py-4 last:border-0 md:grid-cols-[16px_minmax(0,1fr)_180px_160px_auto] md:px-6 ${
                    item.unread ? 'bg-[#fffbf0]' : 'bg-white'
                  }`}
                >

                  <span
                    aria-hidden="true"
                    className={`flex size-4 items-center justify-center ${
                      item.unread
                        ? 'text-[#f59e0b]'
                        : 'text-[#cbd5e1]'
                    }`}
                  >
                    <svg
                      className="size-3"
                      viewBox="0 0 12 12"
                      fill="currentColor"
                    >
                      <circle cx="6" cy="6" r="5" />
                    </svg>
                  </span>

                  <button
                    type="button"
                    onClick={() => setSelected(item.id)}
                    className="min-w-0 text-left"
                  >
                    <p
                      className={`truncate text-[15px] text-[#1c2534] ${
                        item.unread
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
                      className={`inline-block max-w-full truncate rounded-md px-2.5 py-1 text-[11px] font-semibold ${
                        item.recipient === 'Tất cả người thuê'
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
                    <svg
                      aria-hidden="true"
                      className="size-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.8}
                        d="M4 7h16M10 11v6m4-6v6M5 7l1 13h12l1-13M9 7V4h6v3"
                      />
                    </svg>
                  </button>

                </div>
              ))}

            </div>
          </div>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-5 rounded-2xl border border-[#eadfc9] bg-white p-6 text-center">

            <div className="flex size-20 items-center justify-center rounded-full bg-[#faf8f5] text-[#d97706]">
              <svg
                className="size-9"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.6}
                  d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 0 0-5-5.9V4a1 1 0 0 0-2 0v1.1A6 6 0 0 0 6 11v3.2a2 2 0 0 1-.6 1.4L4 17h5m6 0a3 3 0 0 1-6 0"
                />
              </svg>
            </div>

            <div>
              <p className="font-['Inter:Extra_Bold'] text-lg font-extrabold text-[#1c2534]">
                Chưa có thông báo nào
              </p>

              <p className="mx-auto mt-2 max-w-80 text-sm text-[#4f5e74]">
                Bạn chưa gửi thông báo nào. Bấm vào nút bên dưới để tạo và gửi thông báo đầu tiên của bạn.
              </p>
            </div>

            <button
              type="button"
              onClick={() => void openCreate()}
              className="flex items-center gap-2 rounded-lg bg-[#f59e0b] px-5 py-3 font-bold text-white"
            >
              Tạo thông báo
            </button>

          </div>
        )
      )}

      {/* ================= MODAL ================= */}

      {modal === 'create' && (
        <CreateModal
          draft={draft}
          setDraft={setDraft}
          close={() => setModal('none')}
          confirm={() => setModal('confirm')}
          recipients={recipientsByRoom[draft.room] ?? []}
          rooms={rooms}
          loadingRooms={loadingRooms}
          loadingRecipients={loadingRoomId === draft.room}
          loadRecipients={roomId => {
            void loadRecipients(roomId)
          }}
          error={error}
        />
      )}

      {modal === 'confirm' && (
        <ConfirmModal
          cancel={() => setModal('create')}
          send={() => void send()}
          saving={saving}
        />
      )}

      {selectedItem && (
        <DetailModal
          item={selectedItem}
          close={() => setSelected(null)}
        />
      )}

    </section>
  )
}

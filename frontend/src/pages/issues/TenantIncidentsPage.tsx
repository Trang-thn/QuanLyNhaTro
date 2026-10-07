import { useMemo, useRef, useState } from 'react'
import type { Status, Incident } from '../../types/issues'
import { initialIncidents } from '../../data/issues/issues'
import { AddModal, IncidentModal, Stat } from '../../components/issues/TenantIssue'
const statusLabel: Record<Status, string> = {
  TIEP_NHAN: 'Tiếp nhận',
  DANG_XU_LY: 'Đang xử lý',
  HOAN_THANH: 'Hoàn thành',
}
const statusClass: Record<Status, string> = {
  TIEP_NHAN: 'bg-[#fef3c7] text-[#b45309]',
  DANG_XU_LY: 'bg-[#ebf3fe] text-[#3b82f6]',
  HOAN_THANH: 'bg-[#e6f4ea] text-[#16885b]',
}
const formatCost = (value: number) => `${new Intl.NumberFormat('vi-VN').format(value)}đ`
export default function TenantIncidentsPage() {
  const [items, setItems] = useState(initialIncidents),
    [addOpen, setAddOpen] = useState(false),
    [selected, setSelected] = useState<Incident | null>(null),
    [success, setSuccess] = useState(false)
  const counts = useMemo(
    () => ({
      all: items.length,
      receive: items.filter((i) => i.status === 'TIEP_NHAN').length,
      processing: items.filter((i) => i.status === 'DANG_XU_LY').length,
      done: items.filter((i) => i.status === 'HOAN_THANH').length,
    }),
    [items],
  )
  const add = (incident: Incident) => {
    setItems((current) => [incident, ...current])
    setAddOpen(false)
    setSuccess(true)
  }
  return (
    <div className="relative -m-6 min-h-[calc(100vh-60px)] bg-[#fff9f2] p-6 font-['Inter:Regular']">
      <div className="mx-auto flex w-full max-w-[1136px] flex-col gap-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-['Inter:Extra_Bold'] text-2xl font-extrabold text-[#1f2937]">Báo cáo sự cố</p>
            <p className="mt-2 text-sm text-[#4f5e74]">Theo dõi các yêu cầu sửa chữa và tình trạng xử lý.</p>
          </div>
          <button
            type="button"
            onClick={() => setAddOpen(true)}
            className="rounded-lg bg-[#f59e0b] px-5 py-3 font-['Inter:Bold'] text-[13px] font-bold text-white"
          >
            + Báo sự cố mới
          </button>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <Stat label="Tổng sự cố" value={counts.all} icon="/assets/73fda.svg" />
          <Stat label="Tiếp nhận" value={counts.receive} icon="/assets/f807d.svg" />
          <Stat label="Đang xử lý" value={counts.processing} icon="/assets/6da05.svg" />
          <Stat label="Hoàn thành" value={counts.done} icon="/assets/8ff68.svg" />
        </div>
        {items.length ? (
          <div className="rounded-2xl border border-[#e5e7eb] bg-white px-6 pb-2 pt-6">
            <div className="flex items-center justify-between gap-4">
              <p className="font-['Inter:Extra_Bold'] text-base font-extrabold text-[#1f2937]">Các yêu cầu của tôi</p>
              <p className="text-xs text-[#8c9bae]">Nguyễn Văn A · Phòng P101</p>
            </div>
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-4 border-t border-[#e5e7eb] py-[22px] sm:flex-row sm:items-center"
              >
                <img src={item.icon} alt="" width="44" height="44" />
                <div className="min-w-0 flex-1">
                  <p className="font-['Inter:Bold'] text-[15px] font-bold text-[#1f2937]">{item.title}</p>
                  <p className="mt-1.5 truncate text-[13px] text-[#4f5e74]">{item.description}</p>
                  <p className="mt-1.5 text-xs text-[#8c9bae]">
                    Phòng {item.room} · Ngày gửi: {item.date} · {item.time}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-6 sm:w-[130px] sm:flex-col sm:items-end sm:gap-3">
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${statusClass[item.status]}`}>
                    {statusLabel[item.status]}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelected(item)}
                    className="font-['Inter:Bold'] text-[13px] font-bold text-[#d97706]"
                  >
                    Xem chi tiết
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-[#e5e7eb] bg-white p-10 text-center">
            <img src="/assets/29ec5.svg" alt="" width="72" height="72" />
            <p className="mt-5 font-['Inter:Extra_Bold'] text-lg font-extrabold text-[#1f2937]">
              Chưa có báo cáo sự cố
            </p>
            <p className="mt-3 text-sm text-[#4f5e74]">Bạn chưa gửi yêu cầu sửa chữa nào.</p>
            <button
              type="button"
              onClick={() => setAddOpen(true)}
              className="mt-4 rounded-lg bg-[#f59e0b] px-5 py-3 font-bold text-white"
            >
              + Báo sự cố mới
            </button>
          </div>
        )}
      </div>
      {success && (
        <div className="fixed right-6 top-[76px] z-40 flex w-[350px] max-w-[calc(100vw-48px)] items-center gap-3 rounded-xl bg-white p-4 shadow-[0_8px_24px_rgba(23,43,77,0.15)]">
          <img src="/assets/90f3a.svg" alt="" width="24" height="24" />
          <p className="flex-1 text-sm font-bold text-[#1f2937]">Đã gửi yêu cầu báo sự cố.</p>
          <button type="button" onClick={() => setSuccess(false)} aria-label="Đóng">
            <img src="/assets/49a0f.svg" alt="" width="18" height="18" />
          </button>
        </div>
      )}
      {addOpen && <AddModal close={() => setAddOpen(false)} save={add} />}
      {selected && <IncidentModal incident={selected} close={() => setSelected(null)} />}
    </div>
  )
}

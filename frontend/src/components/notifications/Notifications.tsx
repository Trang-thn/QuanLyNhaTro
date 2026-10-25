import { useState } from "react"
import type { Item, Draft, FieldProps, RadioClick, DropDowns, NotificationRecipient, NotificationRoom } from "../../types/notifications"
function Radio({ active, label, onClick }: RadioClick) {
    return <button type="button" onClick={onClick} className="flex items-center gap-2">
        <span aria-hidden="true" className={`flex size-4 shrink-0 items-center justify-center rounded-full border ${active ? 'border-[#f59e0b]' : 'border-[#9ca3af]'}`}>
            {active && <span className="size-2 rounded-full bg-[#f59e0b]" />}
        </span>
        <span className={`text-sm text-[#1c2534] ${active ? "font-['Inter:Semi_Bold'] font-semibold" : "font-['Inter:Regular']"}`}>{label}</span>
    </button>
}

export function Dropdown({ value, placeholder, options, onChange, disabled = false }: DropDowns) {
    const [open, setOpen] = useState(false)
    return <div className="relative w-full">
        <button type="button" disabled={disabled} onClick={() => setOpen(!open)} className="flex w-full items-center justify-between rounded-lg border border-[#eadfc9] bg-white px-3 py-2.5 text-left text-sm disabled:cursor-not-allowed disabled:opacity-60">
            <span className={value ? 'text-[#1c2534]' : 'text-[#8c9bae]'}>{options.find(option => option.value === value)?.label || placeholder}</span>
            <span className={open ? 'rotate-180' : ''}>⌄</span>
        </button>
        {open && <div className="absolute left-0 top-full z-20 mt-1 w-full overflow-hidden rounded-lg border border-[#eadfc9] bg-white py-1 shadow-[0_8px_20px_rgba(23,43,77,0.12)]">
            {options.map(option => <button key={option.value} type="button" onClick={() => { onChange(option.value); setOpen(false) }} className="block w-full px-3 py-2 text-left text-sm text-[#1c2534] hover:bg-[#fff9f2]">{option.label}</button>
            )}
        </div>
        }
    </div>
}

export function CreateModal({ draft, setDraft, close, confirm, recipients, rooms, loadingRooms, loadingRecipients, error, loadRecipients }: {
    draft: Draft
    setDraft: (draft: Draft) => void
    close: () => void
    confirm: () => void
    recipients: NotificationRecipient[]
    rooms: NotificationRoom[]
    loadingRooms: boolean
    loadingRecipients: boolean
    error: string | null
    loadRecipients: (roomId: string) => void
}) {
    const [errors, setErrors] = useState({ title: false, content: false })
    const [audienceError, setAudienceError] = useState(false)
    const next = () => {
        const e = { title: !draft.title.trim(), content: !draft.content.trim() }
        const missingAudience = (draft.audience !== 'ALL' && !draft.room) || (draft.audience === 'TENANT' && !draft.person)
        setErrors(e)
        setAudienceError(missingAudience)
        if (!e.title && !e.content && !missingAudience) confirm()
    }
    return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true" onMouseDown={e => e.target === e.currentTarget && close()}>
        <div className="max-h-[calc(100dvh-32px)] w-full max-w-[560px] overflow-y-auto rounded-[20px] border-2 border-[#eadfc9] bg-white shadow-[0_12px_12px_rgba(23,43,77,0.12)]">
            <div className="flex items-center justify-between border-b border-[#eadfc9] px-6 pb-4 pt-6">
                <p className="font-['Inter:Extra_Bold'] text-lg font-extrabold text-[#1c2534]">Tạo thông báo</p>
                <button type="button" onClick={close} aria-label="Đóng" className="rounded-md px-2 text-2xl leading-none text-[#64748b] hover:bg-gray-100">×</button>
            </div>
            <div className="flex flex-col gap-5 p-6">
                <label className="flex flex-col gap-1.5">
                    <span className="font-['Inter:Semi_Bold'] text-[13px] font-semibold">Tiêu đề*</span>
                    <input value={draft.title} onChange={e => setDraft({ ...draft, title: e.target.value })} placeholder="Nhập tiêu đề thông báo" className={`rounded-lg border p-3 text-sm outline-none placeholder:text-[#8c9bae] ${errors.title ? 'border-red-400' : 'border-[#eadfc9]'}`} />
                    {
                        errors.title &&
                        <span className="text-xs text-red-500">Vui lòng nhập tiêu đề</span>
                    }
                </label>
                <label className="flex flex-col gap-1.5">
                    <span className="font-['Inter:Semi_Bold'] text-[13px] font-semibold">Nội dung*</span>
                    <textarea value={draft.content} onChange={e => setDraft({ ...draft, content: e.target.value })} placeholder="Nhập chi tiết nội dung thông báo gửi đến người thuê..." className={`h-24 resize-none rounded-lg border p-3 text-sm outline-none placeholder:text-[#8c9bae] ${errors.content ? 'border-red-400' : 'border-[#eadfc9]'}`} />
                    {
                        errors.content &&
                        <span className="text-xs text-red-500">Vui lòng nhập nội dung</span>
                    }
                </label>
                <div className="flex flex-col gap-2">
                    <p className="font-['Inter:Semi_Bold'] text-[13px] font-semibold">Đối tượng nhận*</p>
                    <div className="flex flex-col gap-3">
                        <Radio active={draft.audience === 'ALL'} label="Tất cả người thuê trong hệ thống" onClick={() => setDraft({ ...draft, audience: 'ALL', person: '', room: '' })} />
                        <Radio active={draft.audience === 'ROOM'} label="Tất cả người thuê trong một phòng" onClick={() => setDraft({ ...draft, audience: 'ROOM', person: '' })} />
                        <Radio active={draft.audience === 'TENANT'} label="Một người thuê trong phòng" onClick={() => { setDraft({ ...draft, audience: 'TENANT', person: '' }); if (draft.room) loadRecipients(draft.room) }} />
                    </div>
                    <div className="flex flex-col gap-3 rounded-[10px] border border-[#eadfc9] bg-[#faf8f5] p-4">
                        {draft.audience !== 'ALL' && <>
                            <p className="font-['Inter:Bold'] text-xs font-bold text-[#4f5e74]">Chọn phòng</p>
                            <Dropdown value={draft.room} disabled={loadingRooms} placeholder={loadingRooms ? 'Đang tải danh sách phòng...' : 'Chọn phòng'} options={rooms.map(room => ({ value: room.id, label: room.room_number }))} onChange={room => { setDraft({ ...draft, room, person: '' }); if (draft.audience === 'TENANT') loadRecipients(room) }} />
                        </>}
                        {
                            draft.audience === 'TENANT' && draft.room &&
                            <>
                                <p className="font-['Inter:Bold'] text-xs font-bold text-[#4f5e74]">Người thuê thuộc phòng đã chọn</p>
                                <Dropdown value={draft.person} disabled={loadingRecipients || recipients.length === 0} placeholder={loadingRecipients ? 'Đang tải người thuê...' : 'Chọn người thuê'} options={recipients.map(person => ({ value: person.id, label: person.name }))} onChange={person => setDraft({ ...draft, person })} />
                                {!loadingRecipients && recipients.length === 0 && <p className="text-xs text-[#8c9bae]">Phòng này hiện không có người thuê đang hoạt động.</p>}
                            </>
                        }
                        {
                            draft.audience === 'ALL' &&
                            <div className="rounded-lg border border-[#eadfc9] bg-white p-3 text-[13px] leading-5">
                                <p className="font-semibold text-[#1c2534]">Đối tượng nhận: Tất cả người thuê</p>
                                <p className="mt-1 text-[#8c9bae]">Một thông báo sẽ được lưu và gửi đến danh sách người thuê tại thời điểm gửi.</p>
                            </div>
                        }
                        {draft.audience === 'ROOM' && draft.room && <p className="rounded-lg border border-[#eadfc9] bg-white p-3 text-[13px] font-semibold text-[#1c2534]">Đối tượng nhận: Tất cả người thuê phòng {rooms.find(room => room.id === draft.room)?.room_number}</p>}
                        {draft.audience === 'TENANT' && draft.room && draft.person && <p className="rounded-lg border border-[#eadfc9] bg-white p-3 text-[13px] font-semibold text-[#1c2534]">Đối tượng nhận: {recipients.find(person => person.id === draft.person)?.name} — phòng {rooms.find(room => room.id === draft.room)?.room_number}</p>}
                    </div>
                </div>
                {audienceError && <p role="alert" className="text-xs text-red-600">Vui lòng chọn phòng và người nhận phù hợp trước khi gửi.</p>}
                {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
                <div className="flex justify-end gap-3 pt-3">
                    <button type="button" onClick={close} className="rounded-lg border border-[#eadfc9] px-5 py-2.5 text-sm text-[#4f5e74]">Hủy</button>
                    <button type="button" onClick={next} className="rounded-lg bg-[#f59e0b] px-5 py-2.5 font-['Inter:Bold'] text-sm font-bold text-white">Gửi thông báo</button>
                </div>
            </div>
        </div>
    </div>
}

export function ConfirmModal({ cancel, send, saving = false }: { cancel: () => void; send: () => void; saving?: boolean }) {
    return <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4" role="alertdialog" aria-modal="true">
        <div className="w-full max-w-[440px] rounded-[20px] border-2 border-[#eadfc9] bg-white p-8 text-center shadow-[0_12px_12px_rgba(23,43,77,0.12)]">
            <div className="mx-auto flex size-[60px] items-center justify-center rounded-full bg-[#fef3c7] text-[#b45309]" aria-hidden="true">
                <svg className="size-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 5v14m7-7H5" /></svg>
            </div>
            <p className="mt-5 font-['Inter:Extra_Bold'] text-xl font-extrabold text-[#1c2534]">Gửi thông báo?</p>
            <p className="mt-2 text-sm text-[#4f5e74]">Thông báo sẽ được gửi đến các đối tượng đã chọn. Thao tác này không thể hoàn tác.</p>
            <div className="mt-8 flex gap-3">
                <button type="button" onClick={cancel} className="flex-1 rounded-lg border border-[#eadfc9] py-2.5 text-sm text-[#4f5e74]">Hủy</button>
                <button type="button" onClick={send} disabled={saving} className="flex-1 rounded-lg bg-[#f59e0b] py-2.5 font-['Inter:Bold'] text-sm font-bold text-white">Gửi ngay</button>
            </div>
        </div>
    </div>
}

export function DetailModal({ item, close }: { item: Item; close: () => void }) {
    return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true" onMouseDown={e => e.target === e.currentTarget && close()}>
        <div className="w-full max-w-[600px] rounded-[20px] border-2 border-[#eadfc9] bg-white shadow-[0_12px_12px_rgba(23,43,77,0.12)]">
            <div className="flex items-center justify-between border-b border-[#eadfc9] px-6 pb-4 pt-6">
                <p className="font-['Inter:Extra_Bold'] text-lg font-extrabold text-[#1c2534]">Chi tiết thông báo</p>
                <span className="rounded-md bg-[#e6f4ea] px-2.5 py-1 text-[11px] font-semibold text-[#10b981]">Đã gửi</span>
            </div>
            <div className="flex flex-col gap-5 p-6">
                <Field label="Tiêu đề" value={item.title} bold />
                <Field label="Nội dung chi tiết" value={item.content} />
                <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Đối tượng nhận" value={item.recipient === 'Tất cả' ? 'Tất cả người thuê' : item.recipient} bold />
                    <Field label="Thời gian gửi" value={item.sentAt.replace(' - ', ' ')} bold />
                </div>
                <div className="flex justify-end pt-3">
                    <button type="button" onClick={close} className="rounded-lg border border-[#eadfc9] px-5 py-2.5 text-sm text-[#4f5e74]">Đóng</button>
                </div>
            </div>
        </div>
    </div>
}
export function Field({ label, value, bold }: FieldProps) {
    return <div>
        <p className="font-['Inter:Bold'] text-xs font-bold uppercase text-[#8c9bae]">{label}</p>
        <p className={`mt-2 text-sm leading-6 text-[#1c2534] ${bold ? "font-['Inter:Bold'] font-bold" : "font-['Inter:Regular']"}`}>{value}</p>
    </div>
}

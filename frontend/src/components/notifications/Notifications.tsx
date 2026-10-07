import { useState } from "react"
import type { Item, Draft, FieldProps, RadioClick, DropDowns } from "../../types/notifications"
function Radio({ active, label, onClick }: RadioClick) {
    return <button type="button" onClick={onClick} className="flex items-center gap-2">
        <img src={active ? '/assets/25c57.svg' : '/assets/ec108.svg'} alt="" width="16" height="16" />
        <span className={`text-sm text-[#1c2534] ${active ? "font-['Inter:Semi_Bold'] font-semibold" : "font-['Inter:Regular']"}`}>{label}</span>
    </button>
}

export function Dropdown({ value, placeholder, options, onChange }: DropDowns) {
    const [open, setOpen] = useState(false)
    return <div className="relative w-full">
        <button type="button" onClick={() => setOpen(!open)} className="flex w-full items-center justify-between rounded-lg border border-[#eadfc9] bg-white px-3 py-2.5 text-left text-sm">
            <span className={value ? 'text-[#1c2534]' : 'text-[#8c9bae]'}>{value || placeholder}</span>
            <span className={open ? 'rotate-180' : ''}>⌄</span>
        </button>
        {open && <div className="absolute left-0 top-full z-20 mt-1 w-full overflow-hidden rounded-lg border border-[#eadfc9] bg-white py-1 shadow-[0_8px_20px_rgba(23,43,77,0.12)]">
            {options.map(option => <button key={option} type="button" onClick={() => { onChange(option); setOpen(false) }} className="block w-full px-3 py-2 text-left text-sm text-[#1c2534] hover:bg-[#fff9f2]">{option}</button>
            )}
        </div>
        }
    </div>
}

export function CreateModal({ draft, setDraft, close, confirm }: { draft: Draft; setDraft: (draft: Draft) => void; close: () => void; confirm: () => void }) {
    const [errors, setErrors] = useState({ title: false, content: false })
    const next = () => { const e = { title: !draft.title.trim(), content: !draft.content.trim() }; setErrors(e); if (!e.title && !e.content) confirm() }
    return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true" onMouseDown={e => e.target === e.currentTarget && close()}>
        <div className="max-h-[calc(100dvh-32px)] w-full max-w-[560px] overflow-y-auto rounded-[20px] border-2 border-[#eadfc9] bg-white shadow-[0_12px_12px_rgba(23,43,77,0.12)]">
            <div className="flex items-center justify-between border-b border-[#eadfc9] px-6 pb-4 pt-6">
                <p className="font-['Inter:Extra_Bold'] text-lg font-extrabold text-[#1c2534]">Tạo thông báo</p>
                <button type="button" onClick={close} aria-label="Đóng"><img src="/assets/83bc3.svg" alt="" width="18" height="18" /></button>
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
                    <div className="flex flex-wrap gap-6"><Radio active={draft.target === 'all'} label="Tất cả người thuê" onClick={() => setDraft({ ...draft, target: 'all', person: '' })} />
                        <Radio active={draft.target === 'person'} label="Người thuê cụ thể" onClick={() => setDraft({ ...draft, target: 'person' })} />
                    </div>
                    <div className="flex flex-col gap-3 rounded-[10px] border border-[#eadfc9] bg-[#faf8f5] p-4">
                        <p className="font-['Inter:Bold'] text-xs font-bold text-[#4f5e74]">Phạm vi gửi</p>
                        <Radio active={draft.scope === 'all'} label="Tất cả phòng" onClick={() => setDraft({ ...draft, scope: 'all', room: '' })} />
                        <Radio active={draft.scope === 'room'} label="Chọn phòng cụ thể" onClick={() => setDraft({ ...draft, scope: 'room' })} />
                        {
                            draft.target === 'person' &&
                            <Dropdown value={draft.person} placeholder="Chọn người thuê" options={['Nguyễn Văn Trang (P101)', 'Trần Trí Bồ (P205)', 'Lê Hoàng Nam (P302)']} onChange={person => setDraft({ ...draft, person })} />
                        }
                        {
                            draft.scope === 'room' &&
                            <Dropdown value={draft.room} placeholder="Chọn phòng" options={['P101', 'P104', 'P205', 'P302']} onChange={room => setDraft({ ...draft, room })} />
                        }
                        {
                            draft.target === 'all' && draft.scope === 'all' &&
                            <div className="rounded-lg border border-[#eadfc9] bg-white p-3 text-[13px] leading-5">
                                <p className="text-[#4f5e74]">Thông báo sẽ được gửi đến tất cả người thuê trong hệ thống.</p>
                                <p className="text-[#8c9bae]">Không cần chọn từng người hoặc từng phòng.</p>
                            </div>
                        }
                    </div>
                </div>
                <div className="flex justify-end gap-3 pt-3">
                    <button type="button" onClick={close} className="rounded-lg border border-[#eadfc9] px-5 py-2.5 text-sm text-[#4f5e74]">Hủy</button>
                    <button type="button" onClick={next} className="rounded-lg bg-[#f59e0b] px-5 py-2.5 font-['Inter:Bold'] text-sm font-bold text-white">Gửi thông báo</button>
                </div>
            </div>
        </div>
    </div>
}

export function ConfirmModal({ cancel, send }: { cancel: () => void; send: () => void }) {
    return <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4" role="alertdialog" aria-modal="true">
        <div className="w-full max-w-[440px] rounded-[20px] border-2 border-[#eadfc9] bg-white p-8 text-center shadow-[0_12px_12px_rgba(23,43,77,0.12)]">
            <div className="mx-auto flex size-[60px] items-center justify-center rounded-full bg-[#fef3c7]"><img src="/assets/47ce2.svg" alt="" width="32" height="32" />
            </div>
            <p className="mt-5 font-['Inter:Extra_Bold'] text-xl font-extrabold text-[#1c2534]">Gửi thông báo?</p>
            <p className="mt-2 text-sm text-[#4f5e74]">Thông báo sẽ được gửi đến các đối tượng đã chọn. Thao tác này không thể hoàn tác.</p>
            <div className="mt-8 flex gap-3">
                <button type="button" onClick={cancel} className="flex-1 rounded-lg border border-[#eadfc9] py-2.5 text-sm text-[#4f5e74]">Hủy</button>
                <button type="button" onClick={send} className="flex-1 rounded-lg bg-[#f59e0b] py-2.5 font-['Inter:Bold'] text-sm font-bold text-white">Gửi ngay</button>
            </div>
        </div>
    </div>
}

export function DetailModal({ item, close }: { item: Item; close: () => void }) {
    const content = item.id === '1' ? 'Kính gửi quý khách thuê phòng, theo quyết định điều chỉnh giá điện mới từ công ty điện lực, chúng tôi xin phép được áp dụng đơn giá điện mới là 3.800đ/kWh kể từ kỳ hóa đơn tháng 10/2026. Mong quý khách thông cảm và chủ động điều chỉnh lượng tiêu thụ hợp lý. Trân trọng cảm ơn.' : item.content
    return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true" onMouseDown={e => e.target === e.currentTarget && close()}>
        <div className="w-full max-w-[600px] rounded-[20px] border-2 border-[#eadfc9] bg-white shadow-[0_12px_12px_rgba(23,43,77,0.12)]">
            <div className="flex items-center justify-between border-b border-[#eadfc9] px-6 pb-4 pt-6">
                <p className="font-['Inter:Extra_Bold'] text-lg font-extrabold text-[#1c2534]">Chi tiết thông báo</p>
                <span className="rounded-md bg-[#e6f4ea] px-2.5 py-1 text-[11px] font-semibold text-[#10b981]">Đã gửi</span>
            </div>
            <div className="flex flex-col gap-5 p-6">
                <Field label="Tiêu đề" value={item.title} bold />
                <Field label="Nội dung chi tiết" value={content} />
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

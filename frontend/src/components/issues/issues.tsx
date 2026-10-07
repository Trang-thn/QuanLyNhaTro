import type { Issue, IssueStatus, Sumary } from "../../types/issues"
import { STATUS_LABEL, STATUS_CLASSES, STATUS_ICONS } from "../../data/issues/issues"
import { useState } from "react"
const formatCost = (value: number) => `${new Intl.NumberFormat('vi-VN').format(value)}đ`
export function SummaryCard({
    label,
    value,
    icon,
    iconBackground,
}: Sumary) {
    return (
        <div className="flex min-w-0 items-center gap-4 rounded-2xl border border-[#eadfc9] bg-white p-5 shadow-[0_2px_4px_rgba(74,59,27,0.06)]">
            <div className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${iconBackground}`}>
                <img src={icon} alt="" width="20" height="20" />
            </div>
            <div className="min-w-0">
                <p className="truncate font-['Manrope:Medium'] text-[13px] font-medium text-[#4f5e74]">{label}</p>
                <p className="font-['Manrope:ExtraBold'] text-2xl font-extrabold text-[#172b4d]">{value}</p>
            </div>
        </div>
    )
}

export function IssueCard({
    issue,
    onDetail,
}: {
    issue: Issue
    onDetail: () => void
}) {
    return (
        <article className="flex min-w-0 flex-col gap-4 rounded-2xl border border-[#eadfc9] bg-white p-5 shadow-[0_4px_6px_rgba(74,59,27,0.05)]">
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <p className="font-['Inter:Extra_Bold'] text-xl font-extrabold text-[#172b4d]">{issue.room}</p>
                    {issue.vip && (
                        <span className="rounded bg-[#f0f4f8] px-2 py-0.5 font-['Manrope:Bold'] text-[11px] font-bold text-[#172b4d]">
                            VIP
                        </span>
                    )}
                </div>
                <span
                    className={`flex shrink-0 items-center gap-1 rounded-md px-2.5 py-1 font-['Manrope:Bold'] text-[11px] font-bold ${STATUS_CLASSES[issue.status]}`}
                >
                    <img src={STATUS_ICONS[issue.status]} alt="" width="12" height="12" />
                    {STATUS_LABEL[issue.status]}
                </span>
            </div>

            <div className="min-h-[58px]">
                <p className="font-['Manrope:ExtraBold'] text-base font-extrabold text-[#1c2534]">{issue.title}</p>
                <p className="mt-2 line-clamp-2 font-['Manrope:Regular'] text-[13px] leading-[1.4] text-[#4f5e74]">
                    {issue.description}
                </p>
            </div>

            <div className="flex flex-col gap-3 border-t border-[#f5efe0] pt-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5 font-['Manrope:Regular'] text-[13px] text-[#4f5e74]">
                        <img src="/assets/4189a.svg" alt="" width="14" height="14" />
                        Người báo:{' '}
                        <strong className="font-['Manrope:SemiBold'] font-semibold text-[#1c2534]">{issue.reporter}</strong>
                    </span>
                    <span className="flex items-center gap-1.5 font-['Manrope:Regular'] text-xs text-[#8c9bae]">
                        <img src="/assets/ccb29.svg" alt="" width="14" height="14" />
                        {issue.date}
                    </span>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="font-['Manrope:Regular'] text-[13px] text-[#4f5e74]">
                        Chi phí dự kiến:{' '}
                        <strong className="font-['Inter:Bold'] text-sm font-bold text-[#d97706]">
                            {formatCost(issue.expectedCost)}
                        </strong>
                    </span>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={onDetail}
                            className="rounded-lg bg-[#fff9f2] px-3 py-1.5 font-['Manrope:Bold'] text-xs font-bold text-[#172b4d] transition hover:bg-[#fff3e0]"
                        >
                            Xem chi tiết
                        </button>
                    </div>
                </div>
            </div>
        </article>
    )
}

export function DetailModal({
    issue,
    onClose,
    onSave,
}: {
    issue: Issue
    onClose: () => void
    onSave: (status: IssueStatus, actualCost?: number) => void
}) {
    const [status, setStatus] = useState<IssueStatus>(issue.status)
    const [actualCost, setActualCost] = useState(issue.actualCost ? String(issue.actualCost) : '')

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="issue-detail-title"
            onMouseDown={(event) => event.target === event.currentTarget && onClose()}
        >
            <div className="max-h-[calc(100dvh-32px)] w-full max-w-[600px] overflow-y-auto rounded-[20px] border-2 border-[#eadfc9] bg-white shadow-[0_12px_12px_rgba(23,43,77,0.12)]">
                <div className="flex items-center justify-between border-b border-[#eadfc9] px-6 pb-4 pt-6">
                    <p
                        id="issue-detail-title"
                        className="font-['Manrope:ExtraBold'] text-lg font-extrabold text-[#1c2534]"
                    >
                        Chi tiết sự cố
                    </p>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Đóng"
                        className="flex size-8 items-center justify-center rounded-full text-[#4f5e74] transition hover:bg-[#fff9f2]"
                    >
                        <span aria-hidden="true" className="text-xl leading-none">×</span>
                    </button>
                </div>

                <div className="flex flex-col gap-5 p-6">
                    <div className="grid grid-cols-2 gap-10">
                        <Info label="Phòng" value={issue.room} emphasized />
                        <Info label="Ngày báo" value={issue.date} />
                    </div>
                    <Info label="Tiêu đề sự cố" value={issue.title} emphasized />
                    <Info
                        label="Mô tả"
                        value={`${issue.description}${issue.id === 'issue-101' ? ' Đã được khắc phục tạm thời bằng van tổng.' : ''}`}
                    />
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-10">
                        <Info label="Người báo" value={issue.reporter} />
                        <label className="flex min-w-0 flex-col gap-1.5">
                            <span className="font-['Manrope:Regular'] text-xs font-normal uppercase text-[#8c9bae]">
                                Trạng thái
                            </span>
                            <select
                                value={status}
                                onChange={(event) => setStatus(event.target.value as IssueStatus)}
                                className="w-full rounded-lg border border-[#d97706] bg-[#fff3e0] px-3 py-2 font-['Manrope:Bold'] text-[13px] font-bold text-[#d97706] outline-none"
                            >
                                <option value="TIEP_NHAN">Tiếp nhận</option>
                                <option value="DANG_XU_LY">Đang xử lý</option>
                                <option value="HOAN_THANH">Hoàn thành</option>
                            </select>
                        </label>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <p className="font-['Manrope:Regular'] text-xs uppercase text-[#8c9bae]">Ảnh minh họa</p>
                        <img
                            src="/assets/a8738.png"
                            alt="Vòi nước bồn rửa đang bị rò rỉ"
                            className="h-40 w-full rounded-lg object-cover"
                        />
                    </div>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <Info label="Chi phí dự kiến" value={formatCost(issue.expectedCost)} cost />
                        <label className="flex min-w-0 flex-col gap-1.5">
                            <span className="font-['Manrope:Regular'] text-xs uppercase text-[#8c9bae]">
                                Chi phí thực tế
                            </span>
                            <input
                                type="number"
                                min="0"
                                value={actualCost}
                                onChange={(event) => setActualCost(event.target.value)}
                                placeholder="Nhập chi phí thực tế"
                                className="w-full rounded-lg border border-[#eadfc9] px-3 py-2.5 font-['Manrope:Regular'] text-sm text-[#1c2534] outline-none placeholder:text-[#8c9bae] focus:border-[#d97706]"
                            />
                        </label>
                    </div>
                    <div className="flex justify-end gap-3 pt-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg border border-[#eadfc9] px-5 py-2.5 font-['Manrope:SemiBold'] text-sm font-semibold text-[#4f5e74]"
                        >
                            Đóng
                        </button>
                        <button
                            type="button"
                            onClick={() => onSave(status, actualCost ? Number(actualCost) : undefined)}
                            className="rounded-lg bg-[#f59e0b] px-5 py-2.5 font-['Manrope:Bold'] text-sm font-bold text-[#fff9f2]"
                        >
                            Lưu thay đổi
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export function Info({
    label,
    value,
    emphasized,
    cost,
}: {
    label: string
    value: string
    emphasized?: boolean
    cost?: boolean
}) {
    return (
        <div className="min-w-0">
            <p className="font-['Manrope:Regular'] text-xs uppercase text-[#8c9bae]">{label}</p>
            <p
                className={`mt-1 break-words ${cost
                    ? "font-['Inter:Extra_Bold'] text-base font-extrabold text-[#d97706]"
                    : emphasized
                        ? "font-['Manrope:ExtraBold'] text-base font-extrabold text-[#1c2534]"
                        : "font-['Manrope:SemiBold'] text-sm font-semibold leading-6 text-[#1c2534]"
                    }`}
            >
                {value}
            </p>
        </div>
    )
}

export function CompleteModal({
    issue,
    onCancel,
    onConfirm,
}: {
    issue: Issue
    onCancel: () => void
    onConfirm: () => void
}) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="complete-issue-title"
            onMouseDown={(event) => event.target === event.currentTarget && onCancel()}
        >
            <div className="w-full max-w-[400px] rounded-2xl border-2 border-[#eadfc9] bg-white p-6 shadow-[0_12px_12px_rgba(23,43,77,0.12)]">
                <div className="flex items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#fff3e0]">
                        <img src="/assets/5a470.svg" alt="" width="20" height="20" />
                    </div>
                    <p id="complete-issue-title" className="font-['Manrope:ExtraBold'] text-lg font-extrabold text-[#1c2534]">
                        Hoàn thành sự cố?
                    </p>
                </div>
                <p className="mt-4 font-['Manrope:Regular'] text-sm leading-6 text-[#4f5e74]">
                    Bạn có chắc chắn muốn đánh dấu sự cố này là hoàn thành? Trạng thái sẽ được cập nhật cho cả người thuê phòng.
                </p>
                <div className="mt-6 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="rounded-lg border border-[#eadfc9] px-4 py-2.5 font-['Manrope:SemiBold'] text-sm font-semibold text-[#4f5e74]"
                    >
                        Hủy
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        aria-label={`Xác nhận hoàn thành sự cố phòng ${issue.room}`}
                        className="rounded-lg bg-[#f59e0b] px-5 py-2.5 font-['Manrope:Bold'] text-sm font-bold text-[#fff9f2]"
                    >
                        Xác nhận
                    </button>
                </div>
            </div>
        </div>
    )
}
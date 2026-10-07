import type { Incident, Status } from "../../types/issues";
import { useState, useRef } from "react";
const statusLabel: Record<Status, string> = { TIEP_NHAN: 'Tiếp nhận', DANG_XU_LY: 'Đang xử lý', HOAN_THANH: 'Hoàn thành' }
const statusClass: Record<Status, string> = { TIEP_NHAN: 'bg-[#fef3c7] text-[#b45309]', DANG_XU_LY: 'bg-[#ebf3fe] text-[#3b82f6]', HOAN_THANH: 'bg-[#e6f4ea] text-[#16885b]' }
const formatCost = (value: number) => `${new Intl.NumberFormat('vi-VN').format(value)}đ`
export function Stat({
    label,
    value,
    icon,
}: {
    label: string;
    value: number;
    icon: string;
}) {
    return (
        <div className="flex min-w-0 flex-col gap-3 rounded-2xl border border-[#e5e7eb] bg-white p-5">
            <div className="flex items-center justify-between">
                <span className="font-['Inter:Bold'] text-sm font-bold text-[#4f5e74]">
                    {label}
                </span>
                <img src={icon} alt="" width="32" height="32" />
            </div>
            <strong className="font-['Inter:Extra_Bold'] text-2xl font-extrabold text-[#1f2937]">
                {value}
            </strong>
        </div>
    );
}

export function IncidentModal({
    incident,
    close,
}: {
    incident: Incident;
    close: () => void;
}) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#172b4d]/40 p-4"
            role="dialog"
            aria-modal="true"
            onMouseDown={(e) => e.target === e.currentTarget && close()}
        >
            <div className="max-h-[calc(100dvh-32px)] w-full max-w-[600px] overflow-y-auto rounded-2xl border border-[#e5e7eb] bg-white shadow-[0_12px_32px_rgba(23,43,77,0.18)]">
                <div className="flex items-center justify-between border-b border-[#e5e7eb] px-6 py-5">
                    <p className="font-['Inter:Extra_Bold'] text-lg font-extrabold text-[#1f2937]">
                        Chi tiết sự cố
                    </p>
                    <button type="button" onClick={close} aria-label="Đóng">
                        <img src="/assets/6644a.svg" alt="" width="24" height="24" />
                    </button>
                </div>
                <div className="flex flex-col gap-5 p-6">
                    <Info label="Tiêu đề" value={incident.title} bold />
                    <Info label="Mô tả" value={incident.description} />
                    <div className="grid gap-5 sm:grid-cols-2">
                        <Info label="Phòng" value={`Phòng ${incident.room}`} bold />
                        <Info
                            label="Ngày gửi"
                            value={`${incident.date} · ${incident.time}`}
                        />
                        <Info
                            label="Trạng thái"
                            value={statusLabel[incident.status]}
                            badge={incident.status}
                        />
                        <Info
                            label="Chi phí sửa chữa"
                            value={
                                incident.cost ? formatCost(incident.cost) : "Chưa cập nhật"
                            }
                            bold
                        />
                    </div>
                    <div>
                        <p className="mb-2 font-['Inter:Bold'] text-xs font-bold text-[#8c9bae]">
                            Ảnh minh họa
                        </p>
                        <div className="flex items-center gap-4 rounded-lg border border-[#e5e7eb] bg-[#fff9f2] p-3">
                            {incident.imageUrl ? (
                                <img
                                    src={incident.imageUrl}
                                    alt="Ảnh minh họa sự cố"
                                    className="size-14 rounded object-cover"
                                />
                            ) : (
                                <div className="flex size-14 items-center justify-center rounded border border-[#d8e0ea] bg-white">
                                    <img src="/assets/c4d33.svg" alt="" width="24" height="24" />
                                </div>
                            )}
                            <div>
                                <p className="font-['Inter:Bold'] text-sm font-bold text-[#1f2937]">
                                    {incident.imageName}
                                </p>
                                <p className="mt-1 text-xs text-[#8c9bae]">JPG · 1,2 MB</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-end border-t border-[#e5e7eb] px-6 py-4">
                    <button
                        type="button"
                        onClick={close}
                        className="rounded-lg border border-[#e5e7eb] px-5 py-2.5 text-sm font-semibold text-[#4f5e74]"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
}
export function Info({
    label,
    value,
    bold,
    badge,
}: {
    label: string;
    value: string;
    bold?: boolean;
    badge?: Status;
}) {
    return (
        <div>
            <p className="font-['Inter:Bold'] text-xs font-bold text-[#8c9bae]">
                {label}
            </p>
            {badge ? (
                <span
                    className={`mt-2 inline-block rounded-full px-2.5 py-1 text-[11px] font-bold ${statusClass[badge]}`}
                >
                    {value}
                </span>
            ) : (
                <p
                    className={`mt-2 text-sm leading-6 text-[#1f2937] ${bold ? "font-['Inter:Bold'] font-bold" : "font-['Inter:Regular']"}`}
                >
                    {value}
                </p>
            )}
        </div>
    );
}

export function AddModal({
    close,
    save,
}: {
    close: () => void;
    save: (item: Incident) => void;
}) {
    const inputRef = useRef<HTMLInputElement>(null),
        [title, setTitle] = useState(""),
        [description, setDescription] = useState(""),
        [file, setFile] = useState<File | null>(null),
        [preview, setPreview] = useState(""),
        [submitted, setSubmitted] = useState(false);
    const submit = () => {
        setSubmitted(true);
        if (!title.trim() || !description.trim()) return;
        save({
            id: String(Date.now()),
            title: title.trim(),
            description: description.trim(),
            room: "P101",
            date: "05/10/2026",
            time: "09:30",
            status: "TIEP_NHAN",
            imageName: file?.name || "Ảnh đính kèm",
            imageUrl: preview || undefined,
            icon: "/assets/b2c71.svg",
        });
    };
    const choose = (selected?: File) => {
        if (!selected) return;
        setFile(selected);
        setPreview(URL.createObjectURL(selected));
    };
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#172b4d]/40 p-4"
            role="dialog"
            aria-modal="true"
            onMouseDown={(e) => e.target === e.currentTarget && close()}
        >
            <div className="max-h-[calc(100dvh-32px)] w-full max-w-[600px] overflow-y-auto rounded-2xl border border-[#e5e7eb] bg-white shadow-[0_12px_32px_rgba(23,43,77,0.18)]">
                <div className="flex items-center justify-between border-b border-[#e5e7eb] px-6 py-5">
                    <p className="font-['Inter:Extra_Bold'] text-lg font-extrabold text-[#1f2937]">
                        Báo sự cố mới
                    </p>
                    <button type="button" onClick={close} aria-label="Đóng">
                        <img src="/assets/6644a.svg" alt="" width="24" height="24" />
                    </button>
                </div>
                <div className="flex flex-col gap-5 p-6">
                    <Field
                        label="Tiêu đề sự cố *"
                        error={
                            submitted && !title.trim() ? "Vui lòng nhập tiêu đề sự cố" : ""
                        }
                    >
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Nhập tiêu đề sự cố"
                            className={`w-full rounded-lg border p-3 text-sm outline-none placeholder:text-[#9aa8ba] ${submitted && !title.trim() ? "border-red-500" : "border-[#d8e0ea]"}`}
                        />
                    </Field>
                    <Field
                        label="Mô tả sự cố *"
                        error={
                            submitted && !description.trim()
                                ? "Vui lòng nhập mô tả sự cố"
                                : ""
                        }
                    >
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Mô tả tình trạng và vị trí xảy ra sự cố..."
                            className={`h-28 w-full resize-none rounded-lg border p-3 text-sm outline-none placeholder:text-[#9aa8ba] ${submitted && !description.trim() ? "border-red-500" : "border-[#d8e0ea]"}`}
                        />
                    </Field>
                    <div>
                        <p className="mb-2 font-['Inter:Bold'] text-[13px] font-bold text-[#4f5e74]">
                            Ảnh minh họa
                        </p>
                        <input
                            ref={inputRef}
                            type="file"
                            accept="image/jpeg,image/png"
                            className="hidden"
                            onChange={(e) => choose(e.target.files?.[0])}
                        />
                        {file ? (
                            <button
                                type="button"
                                onClick={() => inputRef.current?.click()}
                                className="flex w-full items-center gap-4 rounded-lg border border-[#e5e7eb] bg-[#fff9f2] p-3 text-left"
                            >
                                {preview ? (
                                    <img
                                        src={preview}
                                        alt="Xem trước ảnh"
                                        className="size-16 rounded object-cover"
                                    />
                                ) : (
                                    <img src="/assets/c4d33.svg" alt="" width="48" height="48" />
                                )}
                                <span>
                                    <strong className="block text-sm text-[#1f2937]">
                                        {file.name}
                                    </strong>
                                    <small className="text-xs text-[#8c9bae]">
                                        JPG · {(file.size / 1024 / 1024).toFixed(1)} MB
                                    </small>
                                </span>
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={() => inputRef.current?.click()}
                                className="flex h-24 w-full flex-col items-center justify-center rounded-lg border border-dashed border-[#d8e0ea] bg-[#fff9f2]"
                            >
                                <img src="/assets/d52ee.svg" alt="" width="24" height="24" />
                                <strong className="mt-1 text-sm text-[#d97706]">
                                    Tải ảnh lên
                                </strong>
                                <span className="mt-1 text-xs text-[#8c9bae]">
                                    JPG, PNG · Tối đa 5 MB
                                </span>
                            </button>
                        )}
                    </div>
                </div>
                <div className="flex justify-end gap-3 border-t border-[#e5e7eb] px-6 py-4">
                    <button
                        type="button"
                        onClick={close}
                        className="rounded-lg border border-[#e5e7eb] px-5 py-2.5 text-sm font-semibold text-[#4f5e74]"
                    >
                        Hủy
                    </button>
                    <button
                        type="button"
                        onClick={submit}
                        className="rounded-lg bg-[#f59e0b] px-5 py-2.5 font-['Inter:Bold'] text-sm font-bold text-white"
                    >
                        Gửi yêu cầu
                    </button>
                </div>
            </div>
        </div>
    );
}
export function Field({
    label,
    error,
    children,
}: {
    label: string;
    error: string;
    children: React.ReactNode;
}) {
    return (
        <label>
            <span className="mb-2 block font-['Inter:Bold'] text-[13px] font-bold text-[#4f5e74]">
                {label}
            </span>
            {children}
            {error && (
                <span className="mt-2 block text-xs text-red-500">{error}</span>
            )}
        </label>
    );
}

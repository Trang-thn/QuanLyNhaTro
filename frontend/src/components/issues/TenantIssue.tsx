import type { Incident, IssueIconName, Status } from "../../types/issues";
import { useEffect, useState } from "react";
import type { MaintenanceRoomDTO } from '../../services/maintenanceService';
import { IssueIcon } from './IssueIcon';
import { IssueImage } from './IssueImage';
const statusLabel: Record<Status, string> = { TIEP_NHAN: 'Tiếp nhận', DANG_XU_LY: 'Đang xử lý', HOAN_THANH: 'Hoàn thành' }
const statusClass: Record<Status, string> = { TIEP_NHAN: 'bg-[#fef3c7] text-[#b45309]', DANG_XU_LY: 'bg-[#ebf3fe] text-[#3b82f6]', HOAN_THANH: 'bg-[#e6f4ea] text-[#16885b]' }
const formatCost = (value: number) => `${new Intl.NumberFormat('vi-VN').format(value)}đ`
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
export function Stat({
    label,
    value,
    icon,
}: {
    label: string;
    value: number;
    icon: IssueIconName;
}) {
    return (
        <div className="flex min-w-0 flex-col gap-3 rounded-2xl border border-[#e5e7eb] bg-white p-5">
            <div className="flex items-center justify-between">
                <span className="font-['Inter:Bold'] text-sm font-bold text-[#4f5e74]">
                    {label}
                </span>
                <IssueIcon name={icon} className="size-8 text-[#d97706]" />
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
                        <IssueIcon name="close" className="size-5" />
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
                            <IssueImage src={incident.imageUrl} className="size-14 shrink-0 rounded border border-[#d8e0ea] bg-white" />
                            <div>
                                <p className="font-['Inter:Bold'] text-sm font-bold text-[#1f2937]">
                                    {incident.imageName ?? 'Chưa có ảnh được lưu'}
                                </p>
                                {incident.imageUrl && <p className="mt-1 text-xs text-[#8c9bae]">Ảnh đã có URL lưu trữ.</p>}
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
    rooms,
    saving = false,
    error,
}: {
    close: () => void;
    save: (input: { room_id: string; title: string; description: string }, imageFile?: File) => Promise<void>;
    rooms: MaintenanceRoomDTO[];
    saving?: boolean;
    error?: string | null;
}) {
    const [title, setTitle] = useState(""),
        [description, setDescription] = useState(""),
        [roomId, setRoomId] = useState(rooms[0]?.id ?? ''),
        [submitted, setSubmitted] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageError, setImageError] = useState<string | null>(null);
    const [previewError, setPreviewError] = useState(false);

    useEffect(() => {
        if (!imageFile) {
            setImagePreview(null);
            setPreviewError(false);
            return;
        }

        const previewUrl = URL.createObjectURL(imageFile);
        setImagePreview(previewUrl);
        setPreviewError(false);
        return () => URL.revokeObjectURL(previewUrl);
    }, [imageFile]);

    const selectImage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        event.target.value = '';
        if (!file) return;

        if (file.type && !file.type.startsWith('image/')) {
            setImageFile(null);
            setImageError('Vui lòng chọn một tệp hình ảnh.');
            return;
        }
        if (file.size > MAX_IMAGE_SIZE) {
            setImageFile(null);
            setImageError('Ảnh phải có dung lượng không quá 5 MB.');
            return;
        }

        setImageError(null);
        setImageFile(file);
    };
    const submit = () => {
        setSubmitted(true);
        if (!roomId || !title.trim() || !description.trim()) return;
        void save({ room_id: roomId, title: title.trim(), description: description.trim() }, imageFile ?? undefined);
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
                        <IssueIcon name="close" className="size-5" />
                    </button>
                </div>
                <div className="flex flex-col gap-5 p-6">
                    <Field label="Phòng *" error={submitted && !roomId ? "Tài khoản chưa có phòng thuê đang hiệu lực" : ""}>
                        <select
                            value={roomId}
                            onChange={(event) => setRoomId(event.target.value)}
                            disabled={rooms.length === 0 || saving}
                            className="w-full rounded-lg border border-[#d8e0ea] p-3 text-sm outline-none"
                        >
                            {rooms.length === 0 ? <option value="">Không có phòng thuê đang hiệu lực</option> : rooms.map(room => <option key={room.id} value={room.id}>Phòng {room.room_number}</option>)}
                        </select>
                    </Field>
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
                        <p className="mb-2 font-['Inter:Bold'] text-[13px] font-bold text-[#4f5e74]">Ảnh minh họa</p>
                        <div className="flex flex-col gap-3 rounded-lg border border-dashed border-[#d8e0ea] bg-[#fff9f2] p-4 sm:flex-row sm:items-center">
                            {imagePreview && !previewError ? (
                                <img src={imagePreview} alt={`Ảnh xem trước: ${imageFile?.name ?? ''}`} onError={() => setPreviewError(true)} width="112" height="84" className="h-24 w-32 rounded-md border border-[#e5e7eb] object-cover" />
                            ) : (
                                <span className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-white text-[#8c9bae]" aria-hidden="true">
                                    <IssueIcon name="image" className="size-7" />
                                </span>
                            )}
                            <div className="min-w-0 flex-1">
                                <p className="break-words text-sm font-semibold text-[#1f2937]">{imageFile?.name ?? 'Chọn ảnh từ thiết bị'}</p>
                                <p id="maintenance-image-help" className="mt-1 text-xs leading-5 text-[#64748b]">JPEG, PNG, WebP, GIF, BMP, TIFF, AVIF, HEIC/HEIF, ICO, JPEG 2000 hoặc JPEG XL; tối đa 5 MB.</p>
                                {previewError && <p className="mt-1 text-xs text-amber-700">Trình duyệt không xem trước được định dạng này; ảnh vẫn được gửi lên khi bạn lưu báo cáo.</p>}
                                <div className="mt-3 flex flex-wrap items-center gap-3">
                                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[#d8e0ea] bg-white px-3 py-2 text-sm font-semibold text-[#172b4d] hover:bg-slate-50 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#172b4d]">
                                        <IssueIcon name="image" className="size-4" />
                                        {imageFile ? 'Chọn ảnh khác' : 'Duyệt tệp'}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={selectImage}
                                            aria-label="Chọn ảnh minh họa từ thiết bị"
                                            aria-describedby="maintenance-image-help"
                                            className="peer sr-only"
                                        />
                                    </label>
                                    {imageFile && <button type="button" onClick={() => { setImageFile(null); setImageError(null); }} className="rounded px-2 py-1 text-sm font-medium text-red-600 hover:bg-red-50">Bỏ ảnh</button>}
                                </div>
                            </div>
                        </div>
                        {imageError && <p role="alert" className="mt-2 text-sm text-red-600">{imageError}</p>}
                    </div>
                    {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
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
                        disabled={saving || rooms.length === 0}
                        className="rounded-lg bg-[#f59e0b] px-5 py-2.5 font-['Inter:Bold'] text-sm font-bold text-white"
                    >
                        {saving ? 'Đang gửi...' : 'Gửi yêu cầu'}
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

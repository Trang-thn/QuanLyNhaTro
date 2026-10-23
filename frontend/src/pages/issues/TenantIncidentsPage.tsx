import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Incident } from '../../types/issues';
import { createMaintenanceRequest, deleteUnattachedMaintenanceImage, getMaintenanceRequest, listMaintenanceRequests, listTenantMaintenanceRooms, uploadMaintenanceImage, type MaintenanceApiDTO, type MaintenanceRoomDTO } from '../../services/maintenanceService';
import { AddModal, IncidentModal, Stat } from '../../components/issues/TenantIssue';
import { IssueIcon } from '../../components/issues/IssueIcon';
import { IssueToast } from '../../components/issues/IssueToast';

const statusLabel = { TIEP_NHAN: 'Tiếp nhận', DANG_XU_LY: 'Đang xử lý', HOAN_THANH: 'Hoàn thành' } as const;
const statusClass = { TIEP_NHAN: 'bg-[#fef3c7] text-[#b45309]', DANG_XU_LY: 'bg-[#ebf3fe] text-[#3b82f6]', HOAN_THANH: 'bg-[#e6f4ea] text-[#16885b]' } as const;

function mapIncident(item: MaintenanceApiDTO): Incident {
  const created = new Date(item.created_at);
  const cost = Number(item.cost);
  return {
    id: item.id,
    room_id: item.room_id,
    title: item.title,
    description: item.description ?? '',
    room: item.room_number,
    date: created.toLocaleDateString('vi-VN'),
    time: created.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    status: item.status,
    imageName: item.image_url ? 'Ảnh sự cố' : 'Chưa có ảnh được lưu',
    imageUrl: item.image_url ?? undefined,
    cost: Number.isFinite(cost) && cost > 0 ? cost : undefined,
    icon: 'wrench',
  };
}

export default function TenantIncidentsPage() {
  const [items, setItems] = useState<Incident[]>([]);
  const [rooms, setRooms] = useState<MaintenanceRoomDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [selected, setSelected] = useState<Incident | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ id: number; message: string; variant: 'success' | 'error' } | null>(null);
  const toastId = useRef(0);
  const showToast = useCallback((message: string, variant: 'success' | 'error') => {
    setToast({ id: ++toastId.current, message, variant });
  }, []);
  const dismissToast = useCallback(() => setToast(null), []);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [requests, availableRooms] = await Promise.all([
        listMaintenanceRequests(),
        listTenantMaintenanceRooms(),
      ]);
      setItems(requests.map(mapIncident));
      setRooms(availableRooms);
      setError(null);
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : 'Không tải được dữ liệu sự cố.';
      setError(message);
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { void loadData(); }, [loadData]);

  const counts = useMemo(() => ({
    all: items.length,
    receive: items.filter(item => item.status === 'TIEP_NHAN').length,
    processing: items.filter(item => item.status === 'DANG_XU_LY').length,
    done: items.filter(item => item.status === 'HOAN_THANH').length,
  }), [items]);

  const submit = async (input: { room_id: string; title: string; description: string }, imageFile?: File) => {
    setSaving(true);
    setError(null);
    let uploadedImageUrl: string | undefined;
    try {
      if (imageFile) uploadedImageUrl = await uploadMaintenanceImage(imageFile);
      const created = mapIncident(await createMaintenanceRequest({ ...input, ...(uploadedImageUrl ? { image_url: uploadedImageUrl } : {}) }));
      setItems(current => [created, ...current]);
      setAddOpen(false);
      showToast('Đã gửi yêu cầu báo sự cố.', 'success');
    } catch (cause) {
      if (uploadedImageUrl) {
        try { await deleteUnattachedMaintenanceImage(uploadedImageUrl); } catch { /* Keep the original submission error. */ }
      }
      const message = cause instanceof Error ? cause.message : 'Không gửi được báo cáo sự cố.';
      setError(message);
      showToast(message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const openDetail = async (item: Incident) => {
    setDetailLoading(true);
    setError(null);
    try {
      setSelected(mapIncident(await getMaintenanceRequest(item.id)));
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : 'Không tải được chi tiết sự cố.';
      setError(message);
      showToast(message, 'error');
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <div className="relative -m-6 min-h-[calc(100vh-60px)] bg-[#fff9f2] p-6 font-['Inter:Regular']">
      <div className="mx-auto flex w-full max-w-[1136px] flex-col gap-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-['Inter:Extra_Bold'] text-2xl font-extrabold text-[#1f2937]">Báo cáo sự cố</p>
            <p className="mt-2 text-sm text-[#4f5e74]">Theo dõi các yêu cầu sửa chữa và tình trạng xử lý.</p>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => void loadData()} className="rounded-lg border border-[#e5e7eb] bg-white px-4 py-3 text-[13px] font-bold text-[#4f5e74]">Tải lại</button>
            <button type="button" onClick={() => { setError(null); setAddOpen(true); }} className="rounded-lg bg-[#f59e0b] px-5 py-3 text-[13px] font-bold text-white">+ Báo sự cố mới</button>
          </div>
        </div>

        {toast && <IssueToast key={toast.id} message={toast.message} variant={toast.variant} onDismiss={dismissToast} />}
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <Stat label="Tổng sự cố" value={counts.all} icon="report" />
          <Stat label="Tiếp nhận" value={counts.receive} icon="pending" />
          <Stat label="Đang xử lý" value={counts.processing} icon="wrench" />
          <Stat label="Hoàn thành" value={counts.done} icon="check" />
        </div>

        {loading ? <div role="status" className="rounded-2xl border border-[#e5e7eb] bg-white py-16 text-center text-sm text-[#4f5e74]">Đang tải báo cáo...</div> : items.length ? (
          <div className="rounded-2xl border border-[#e5e7eb] bg-white px-6 pb-2 pt-6">
            <p className="mb-4 font-['Inter:Extra_Bold'] text-base font-extrabold text-[#1f2937]">Các yêu cầu của tôi</p>
            {items.map(item => <div key={item.id} className="flex flex-col gap-4 border-t border-[#e5e7eb] py-[22px] sm:flex-row sm:items-center">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#fff3e0] text-[#d97706]" aria-hidden="true">
                <IssueIcon name={item.icon} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-['Inter:Bold'] text-[15px] font-bold text-[#1f2937]">{item.title}</p>
                <p className="mt-1.5 truncate text-[13px] text-[#4f5e74]">{item.description}</p>
                <p className="mt-1.5 text-xs text-[#8c9bae]">Phòng {item.room} · Ngày gửi: {item.date} · {item.time}</p>
              </div>
              <div className="flex items-center justify-between gap-6 sm:w-[150px] sm:flex-col sm:items-end sm:gap-3">
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${statusClass[item.status]}`}>{statusLabel[item.status]}</span>
                <button type="button" onClick={() => void openDetail(item)} className="font-['Inter:Bold'] text-[13px] font-bold text-[#d97706]">Xem chi tiết</button>
              </div>
            </div>)}
          </div>
        ) : <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-[#e5e7eb] bg-white p-10 text-center">
          <p className="font-['Inter:Extra_Bold'] text-lg font-extrabold text-[#1f2937]">Chưa có báo cáo sự cố</p>
          <p className="mt-3 text-sm text-[#4f5e74]">Bạn chưa gửi yêu cầu sửa chữa nào.</p>
        </div>}
      </div>
      {addOpen && <AddModal close={() => setAddOpen(false)} save={submit} rooms={rooms} saving={saving} error={error} />}
      {detailLoading && <div role="status" className="fixed left-1/2 top-4 z-[60] rounded-lg bg-white px-4 py-2 text-sm shadow">Đang tải chi tiết...</div>}
      {selected && <IncidentModal incident={selected} close={() => setSelected(null)} />}
    </div>
  );
}

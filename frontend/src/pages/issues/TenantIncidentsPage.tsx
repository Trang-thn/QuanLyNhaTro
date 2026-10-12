import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Incident } from '../../types/issues';
import { createMaintenanceRequest, getMaintenanceRequest, listMaintenanceRequests, listTenantMaintenanceRooms, type MaintenanceApiDTO, type MaintenanceRoomDTO } from '../../services/maintenanceService';
import { AddModal, IncidentModal, Stat } from '../../components/issues/TenantIssue';

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
    icon: '/assets/b2c71.svg',
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
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      setError(cause instanceof Error ? cause.message : 'Không tải được dữ liệu sự cố.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadData(); }, [loadData]);

  const counts = useMemo(() => ({
    all: items.length,
    receive: items.filter(item => item.status === 'TIEP_NHAN').length,
    processing: items.filter(item => item.status === 'DANG_XU_LY').length,
    done: items.filter(item => item.status === 'HOAN_THANH').length,
  }), [items]);

  const submit = async (input: { room_id: string; title: string; description: string }) => {
    setSaving(true);
    setError(null);
    try {
      const created = mapIncident(await createMaintenanceRequest(input));
      setItems(current => [created, ...current]);
      setAddOpen(false);
      setSuccess(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Không gửi được báo cáo sự cố.');
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
      setError(cause instanceof Error ? cause.message : 'Không tải được chi tiết sự cố.');
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

        {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <Stat label="Tổng sự cố" value={counts.all} icon="/assets/73fda.svg" />
          <Stat label="Tiếp nhận" value={counts.receive} icon="/assets/f807d.svg" />
          <Stat label="Đang xử lý" value={counts.processing} icon="/assets/6da05.svg" />
          <Stat label="Hoàn thành" value={counts.done} icon="/assets/8ff68.svg" />
        </div>

        {loading ? <div role="status" className="rounded-2xl border border-[#e5e7eb] bg-white py-16 text-center text-sm text-[#4f5e74]">Đang tải báo cáo...</div> : items.length ? (
          <div className="rounded-2xl border border-[#e5e7eb] bg-white px-6 pb-2 pt-6">
            <p className="mb-4 font-['Inter:Extra_Bold'] text-base font-extrabold text-[#1f2937]">Các yêu cầu của tôi</p>
            {items.map(item => <div key={item.id} className="flex flex-col gap-4 border-t border-[#e5e7eb] py-[22px] sm:flex-row sm:items-center">
              <img src={item.icon} alt="" width="44" height="44" />
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
      {success && <div role="status" className="fixed right-6 top-[76px] z-40 flex w-[350px] max-w-[calc(100vw-48px)] items-center gap-3 rounded-xl bg-white p-4 shadow-[0_8px_24px_rgba(23,43,77,0.15)]">
        <img src="/assets/90f3a.svg" alt="" width="24" height="24" />
        <p className="flex-1 text-sm font-bold text-[#1f2937]">Đã gửi yêu cầu báo sự cố.</p>
        <button type="button" onClick={() => setSuccess(false)} aria-label="Đóng"><img src="/assets/49a0f.svg" alt="" width="18" height="18" /></button>
      </div>}
      {addOpen && <AddModal close={() => setAddOpen(false)} save={submit} rooms={rooms} saving={saving} error={error} />}
      {detailLoading && <div role="status" className="fixed left-1/2 top-4 z-[60] rounded-lg bg-white px-4 py-2 text-sm shadow">Đang tải chi tiết...</div>}
      {selected && <IncidentModal incident={selected} close={() => setSelected(null)} />}
    </div>
  );
}

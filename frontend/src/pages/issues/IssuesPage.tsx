import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Issue, IssueFilter, IssueStatus } from '../../types/issues';
import { STATUS_CLASSES, STATUS_ICONS, STATUS_LABEL } from '../../data/issues/issues';
import { DetailModal, IssueCard, SummaryCard } from '../../components/issues/issues';
import { getMaintenanceRequest, listMaintenanceRequests, updateMaintenanceRequest, type MaintenanceApiDTO } from '../../services/maintenanceService';

function mapIssue(item: MaintenanceApiDTO): Issue {
  const cost = Number(item.cost);
  return {
    id: item.id,
    room_id: item.room_id,
    room: item.room_number,
    title: item.title,
    description: item.description ?? '',
    reporter: item.tenant_name || 'Người thuê',
    date: new Date(item.created_at).toLocaleDateString('vi-VN'),
    status: item.status,
    actualCost: Number.isFinite(cost) && cost > 0 ? cost : undefined,
    imageUrl: item.image_url,
  };
}

export default function IssuePage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [filter, setFilter] = useState<IssueFilter>('ALL');
  const [detail, setDetail] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const loadIssues = useCallback(async () => {
    setLoading(true);
    try {
      setIssues((await listMaintenanceRequests()).map(mapIssue));
      setError(null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Không tải được danh sách sự cố.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadIssues(); }, [loadIssues]);

  const counts = useMemo(() => ({
    ALL: issues.length,
    TIEP_NHAN: issues.filter(issue => issue.status === 'TIEP_NHAN').length,
    DANG_XU_LY: issues.filter(issue => issue.status === 'DANG_XU_LY').length,
    HOAN_THANH: issues.filter(issue => issue.status === 'HOAN_THANH').length,
  }), [issues]);
  const filteredIssues = filter === 'ALL' ? issues : issues.filter(issue => issue.status === filter);

  const openDetail = async (issue: Issue) => {
    setDetailLoading(true);
    setError(null);
    try {
      setDetail(mapIssue(await getMaintenanceRequest(issue.id)));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Không tải được chi tiết sự cố.');
    } finally {
      setDetailLoading(false);
    }
  };

  const saveIssue = async (status: IssueStatus, actualCost?: number) => {
    if (!detail) return;
    setSaving(true);
    setError(null);
    try {
      const updated = mapIssue(await updateMaintenanceRequest(detail.id, {
        status,
        ...(actualCost !== undefined ? { cost: actualCost } : {}),
      }));
      setIssues(current => current.map(issue => issue.id === updated.id ? updated : issue));
      setDetail(updated);
      setNotice('Đã cập nhật sự cố.');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Không cập nhật được sự cố.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="mx-auto flex w-full max-w-[1136px] flex-col gap-6 font-['Manrope:Regular']">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-[13px]">
          <span className="font-['Manrope:Medium'] font-medium text-[#8c9bae]">Tổng quan</span>
          <span className="text-[#8c9bae]">/</span>
          <span className="font-['Manrope:Bold'] font-bold text-[#172b4d]">Quản Lý Sự Cố</span>
        </div>
        <button type="button" onClick={() => void loadIssues()} className="rounded-lg border border-[#eadfc9] bg-white px-3 py-2 text-sm text-[#1c2534]">Tải lại</button>
      </div>

      {notice && <div role="status" className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{notice}<button className="ml-3" onClick={() => setNotice(null)}>Đóng</button></div>}
      {error && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="TỔNG SỰ CỐ" value={counts.ALL} icon="/assets/d16ad.svg" iconBackground="bg-[#f1f5f9]" />
        <SummaryCard label="TIẾP NHẬN" value={counts.TIEP_NHAN} icon={STATUS_ICONS.TIEP_NHAN} iconBackground="bg-[#fff3e0]" />
        <SummaryCard label="ĐANG XỬ LÝ" value={counts.DANG_XU_LY} icon={STATUS_ICONS.DANG_XU_LY} iconBackground="bg-[#ebf3fe]" />
        <SummaryCard label="HOÀN THÀNH" value={counts.HOAN_THANH} icon={STATUS_ICONS.HOAN_THANH} iconBackground="bg-[#e6f4ea]" />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#eadfc9] bg-white p-4">
        <div className="flex flex-wrap gap-3">
          {([['ALL', 'Tất cả'], ['TIEP_NHAN', 'Tiếp nhận'], ['DANG_XU_LY', 'Đang xử lý'], ['HOAN_THANH', 'Hoàn thành']] as const).map(([value, label]) => {
            const active = filter === value;
            return <button key={value} type="button" onClick={() => setFilter(value)} className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-[13px] ${active ? 'border-[#172b4d] bg-[#172b4d] font-bold text-[#fff9f2]' : 'border-[#eadfc9] bg-white text-[#1c2534]'}`}>
              {label}<span className={`rounded-full px-1.5 py-px text-[11px] font-bold ${active ? 'bg-[#d97706] text-white' : 'bg-[#fff9f2] text-[#d97706]'}`}>{counts[value]}</span>
            </button>;
          })}
        </div>
        <span className="text-[13px] text-[#4f5e74]">Sắp xếp: Mới nhất</span>
      </div>

      {loading ? <div role="status" className="rounded-xl bg-white py-16 text-center text-sm text-[#4f5e74]">Đang tải danh sách sự cố...</div> : issues.length === 0 ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-[20px] border border-[#eadfc9] bg-white p-10 text-center">
          <p className="font-bold text-lg text-[#1c2534]">Chưa có sự cố nào</p>
          <p className="mt-2 text-sm text-[#4f5e74]">Các báo cáo của người thuê sẽ hiển thị tại đây.</p>
        </div>
      ) : filteredIssues.length ? (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {filteredIssues.map(issue => <IssueCard key={issue.id} issue={issue} onDetail={() => void openDetail(issue)} />)}
        </div>
      ) : <div className="rounded-[20px] border border-[#eadfc9] bg-white py-20 text-center text-sm text-[#4f5e74]">Không có sự cố ở trạng thái này.</div>}

      {detailLoading && <div role="status" className="fixed left-1/2 top-4 z-[60] rounded-lg bg-white px-4 py-2 text-sm shadow">Đang tải chi tiết...</div>}
      {detail && <DetailModal issue={detail} onClose={() => setDetail(null)} onSave={(status, cost) => void saveIssue(status, cost)} saving={saving} error={error} />}
    </section>
  );
}

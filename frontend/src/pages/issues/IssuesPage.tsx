import { useMemo, useState } from 'react'
import type { IssueStatus, IssueFilter } from "../../types/issues"
import { INITIAL_ISSUES } from "../../data/issues/issues"
import { SummaryCard, IssueCard, DetailModal, CompleteModal } from "../../components/issues/issues"
export default function IssuePage() {
  const [issues, setIssues] = useState(INITIAL_ISSUES)
  const [filter, setFilter] = useState<IssueFilter>('ALL')
  const [detailId, setDetailId] = useState<string | null>(null)
  const [completeId, setCompleteId] = useState<string | null>(null)

  const counts = useMemo(
    () => {
      if (!issues.length) {
        return { ALL: 0, TIEP_NHAN: 0, DANG_XU_LY: 0, HOAN_THANH: 0 }
      }
      const hiddenIssueCounts = { TIEP_NHAN: 6, DANG_XU_LY: 9, HOAN_THANH: 5 }
      const result = {
        ALL: issues.length + 20,
        TIEP_NHAN:
          hiddenIssueCounts.TIEP_NHAN + issues.filter((issue) => issue.status === 'TIEP_NHAN').length,
        DANG_XU_LY:
          hiddenIssueCounts.DANG_XU_LY + issues.filter((issue) => issue.status === 'DANG_XU_LY').length,
        HOAN_THANH:
          hiddenIssueCounts.HOAN_THANH + issues.filter((issue) => issue.status === 'HOAN_THANH').length,
      }
      return result
    },
    [issues],
  )

  const filteredIssues = filter === 'ALL' ? issues : issues.filter((issue) => issue.status === filter)
  const detailIssue = issues.find((issue) => issue.id === detailId)
  const completeIssue = issues.find((issue) => issue.id === completeId)

  const saveIssue = (id: string, status: IssueStatus, actualCost?: number) => {
    setIssues((current) =>
      current.map((issue) => (issue.id === id ? { ...issue, status, actualCost } : issue)),
    )
    setDetailId(null)
  }

  const completeIssueById = (id: string) => {
    setIssues((current) =>
      current.map((issue) => (issue.id === id ? { ...issue, status: 'HOAN_THANH' as const } : issue)),
    )
    setCompleteId(null)
  }

  return (
    <section className="mx-auto flex w-full max-w-[1136px] flex-col gap-6 font-['Manrope:Regular']">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-[13px]">
          <span className="font-['Manrope:Medium'] font-medium text-[#8c9bae]">Tổng quan</span>
          <span className="text-[#8c9bae]">/</span>
          <span className="font-['Manrope:Bold'] font-bold text-[#172b4d]">Quản Lý Sự Cố</span>
        </div>
        <button
          type="button"
          onClick={() => setDetailId(issues[0]?.id ?? null)}
          disabled={!issues.length}
          className="flex items-center gap-2 rounded-lg bg-[#172b4d] px-[18px] py-2.5 font-['Manrope:Bold'] text-[13px] font-bold text-[#fff9f2] disabled:opacity-50"
        >
          <img src="/assets/67773.svg" alt="" width="16" height="16" />
          Báo sự cố mới
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="TỔNG SỰ CỐ" value={counts.ALL} icon="/assets/d16ad.svg" iconBackground="bg-[#f1f5f9]" />
        <SummaryCard label="TIẾP NHẬN" value={counts.TIEP_NHAN} icon="/assets/3ce3d.svg" iconBackground="bg-[#fff3e0]" />
        <SummaryCard label="ĐANG XỬ LÝ" value={counts.DANG_XU_LY} icon="/assets/a99a6.svg" iconBackground="bg-[#ebf3fe]" />
        <SummaryCard label="HOÀN THÀNH" value={counts.HOAN_THANH} icon="/assets/3ca10.svg" iconBackground="bg-[#e6f4ea]" />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#eadfc9] bg-white p-4">
        <div className="flex flex-wrap gap-3">
          {([
            ['ALL', 'Tất cả'],
            ['TIEP_NHAN', 'Tiếp nhận'],
            ['DANG_XU_LY', 'Đang xử lý'],
            ['HOAN_THANH', 'Hoàn thành'],
          ] as const).map(([value, label]) => {
            const active = filter === value
            return (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value)}
                className={`flex items-center gap-1.5 rounded-full border px-4 py-2 font-['Manrope:Medium'] text-[13px] transition ${active
                  ? "border-[#172b4d] bg-[#172b4d] font-['Manrope:Bold'] font-bold text-[#fff9f2]"
                  : 'border-[#eadfc9] bg-white text-[#1c2534] hover:bg-[#fff9f2]'
                  }`}
              >
                {label}
                <span
                  className={`rounded-full px-1.5 py-px font-['Manrope:Bold'] text-[11px] font-bold ${active ? 'bg-[#d97706] text-[#fff9f2]' : 'bg-[#fff9f2] text-[#d97706]'
                    }`}
                >
                  {counts[value]}
                </span>
              </button>
            )
          })}
        </div>
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg border border-[#eadfc9] px-3.5 py-2 font-['Manrope:Regular'] text-[13px] text-[#1c2534]"
        >
          Sắp xếp: Mới nhất
          <img src="/assets/4d319.svg" alt="" width="12" height="12" />
        </button>
      </div>

      {issues.length === 0 ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center gap-5 rounded-[20px] border border-[#eadfc9] bg-white p-10 text-center">
          <div className="flex size-20 items-center justify-center rounded-full bg-[#fff9f2]">
            <img src="/assets/5ede9.svg" alt="" width="40" height="40" />
          </div>
          <div>
            <p className="font-['Manrope:ExtraBold'] text-lg font-extrabold text-[#1c2534]">Chưa có sự cố nào</p>
            <p className="mt-2 font-['Manrope:Regular'] text-sm text-[#4f5e74]">
              Hiện chưa có yêu cầu báo sự cố.
            </p>
          </div>
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg bg-[#f59e0b] px-[18px] py-2.5 font-['Manrope:Bold'] text-[13px] font-bold text-[#fff9f2]"
          >
            <img src="/assets/67773.svg" alt="" width="16" height="16" />
            Báo sự cố mới
          </button>
        </div>
      ) : filteredIssues.length ? (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {filteredIssues.map((issue) => (
            <IssueCard
              key={issue.id}
              issue={issue}
              onDetail={() => setDetailId(issue.id)}
              onComplete={() => setCompleteId(issue.id)}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-[20px] border border-[#eadfc9] bg-white py-20 text-center font-['Manrope:Regular'] text-sm text-[#4f5e74]">
          Không có sự cố ở trạng thái này.
        </div>
      )}

      {detailIssue && (
        <DetailModal
          issue={detailIssue}
          onClose={() => setDetailId(null)}
          onSave={(status, actualCost) => saveIssue(detailIssue.id, status, actualCost)}
        />
      )}
      {completeIssue && (
        <CompleteModal
          issue={completeIssue}
          onCancel={() => setCompleteId(null)}
          onConfirm={() => completeIssueById(completeIssue.id)}
        />
      )}
    </section>
  )
}

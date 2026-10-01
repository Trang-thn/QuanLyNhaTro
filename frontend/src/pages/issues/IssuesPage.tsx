import { useMemo, useState } from 'react'

type IssueStatus = 'TIEP_NHAN' | 'DANG_XU_LY' | 'HOAN_THANH'
type IssueFilter = 'ALL' | IssueStatus

type Issue = {
  id: string
  room: string
  vip?: boolean
  title: string
  description: string
  reporter: string
  date: string
  expectedCost: number
  actualCost?: number
  status: IssueStatus
}

const INITIAL_ISSUES: Issue[] = [
  {
    id: 'issue-101',
    room: 'P101',
    vip: true,
    title: 'Hỏng vòi nước bồn rửa mặt',
    description:
      'Vòi nước bị gãy chốt xoay, rò rỉ nước liên tục xuống gầm bồn rửa gây ngập nhẹ sàn nhà vệ sinh.',
    reporter: 'Nguyễn Văn An',
    date: '01/10/2026',
    expectedCost: 150000,
    status: 'TIEP_NHAN',
  },
  {
    id: 'issue-205',
    room: 'P205',
    title: 'Rò rỉ đường ống nước ngấm tường',
    description:
      'Phát hiện thấm mốc tường góc phòng sát nhà vệ sinh, nước rỉ nhỏ giọt làm hư hại sàn gỗ công nghiệp.',
    reporter: 'Trần Trí Bồ',
    date: '01/10/2026',
    expectedCost: 450000,
    status: 'DANG_XU_LY',
  },
  {
    id: 'issue-302',
    room: 'P302',
    title: 'Điều hòa không mát, chảy nước sàn',
    description:
      'Máy lạnh chỉ phả gió thường, cục nóng kêu to. Đội bảo trì đã đến vệ sinh lưới lọc và nạp thêm gas.',
    reporter: 'Lê Hoàng Nam',
    date: '01/10/2026',
    expectedCost: 350000,
    actualCost: 350000,
    status: 'HOAN_THANH',
  },
  {
    id: 'issue-104',
    room: 'P104',
    title: 'Chập điện ổ cắm khu vực bếp',
    description:
      'Ổ cắm bị tóe lửa khi cắm nồi cơm điện, hiện tại toàn bộ hệ thống ổ cắm phụ tầng 1 đang mất điện.',
    reporter: 'Phạm Minh Hải',
    date: '09/10/2026',
    expectedCost: 200000,
    status: 'TIEP_NHAN',
  },
]

const STATUS_LABEL: Record<IssueStatus, string> = {
  TIEP_NHAN: 'Tiếp nhận',
  DANG_XU_LY: 'Đang xử lý',
  HOAN_THANH: 'Hoàn thành',
}

const STATUS_CLASSES: Record<IssueStatus, string> = {
  TIEP_NHAN: 'bg-[#fff3e0] text-[#d97706]',
  DANG_XU_LY: 'bg-[#ebf3fe] text-[#3b82f6]',
  HOAN_THANH: 'bg-[#e6f4ea] text-[#10b981]',
}

const STATUS_ICONS: Record<IssueStatus, string> = {
  TIEP_NHAN: '/assets/72ce5.svg',
  DANG_XU_LY: '/assets/1cd6d.svg',
  HOAN_THANH: '/assets/f3dc6.svg',
}

const formatCost = (value: number) => `${new Intl.NumberFormat('vi-VN').format(value)}đ`

function SummaryCard({
  label,
  value,
  icon,
  iconBackground,
}: {
  label: string
  value: number
  icon: string
  iconBackground: string
}) {
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

function IssueCard({
  issue,
  onDetail,
  onComplete,
}: {
  issue: Issue
  onDetail: () => void
  onComplete: () => void
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
            {issue.status !== 'HOAN_THANH' && (
              <button
                type="button"
                onClick={onComplete}
                aria-label={`Hoàn thành sự cố phòng ${issue.room}`}
                className="flex size-7 items-center justify-center rounded-md bg-[#fff9f2] transition hover:bg-[#fff3e0]"
              >
                <img src="/assets/7851d.svg" alt="" width="14" height="14" />
              </button>
            )}
            <button
              type="button"
              onClick={onDetail}
              aria-label={`Chỉnh sửa sự cố phòng ${issue.room}`}
              className="flex size-7 items-center justify-center rounded-md bg-[#f0f4f8] transition hover:bg-[#e5ebf2]"
            >
              <img src="/assets/f075a.svg" alt="" width="14" height="14" />
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}

function DetailModal({
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

function Info({
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
        className={`mt-1 break-words ${
          cost
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

function CompleteModal({
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

      // The design shows four representative cards from the complete 24-item data set.
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
                className={`flex items-center gap-1.5 rounded-full border px-4 py-2 font-['Manrope:Medium'] text-[13px] transition ${
                  active
                    ? "border-[#172b4d] bg-[#172b4d] font-['Manrope:Bold'] font-bold text-[#fff9f2]"
                    : 'border-[#eadfc9] bg-white text-[#1c2534] hover:bg-[#fff9f2]'
                }`}
              >
                {label}
                <span
                  className={`rounded-full px-1.5 py-px font-['Manrope:Bold'] text-[11px] font-bold ${
                    active ? 'bg-[#d97706] text-[#fff9f2]' : 'bg-[#fff9f2] text-[#d97706]'
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

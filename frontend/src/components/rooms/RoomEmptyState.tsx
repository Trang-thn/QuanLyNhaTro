interface Props {
  onAdd: () => void
}

export function RoomEmptyState({ onAdd }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-24 gap-5">
      {/* House icon */}
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center"
        style={{ background: '#fef3c7' }}
      >
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="#d97706">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </svg>
      </div>

      {/* Text */}
      <div className="text-center space-y-1">
        <p className="font-bold text-gray-800 text-base">Chưa có phòng trọ</p>
        <p className="text-sm text-gray-500">Thêm phòng đầu tiên để bắt đầu quản lý.</p>
      </div>

      {/* CTA button */}
      <button
        onClick={onAdd}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition hover:brightness-95 active:scale-95"
        style={{ background: '#f59e0b' }}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
        </svg>
        + Thêm phòng
      </button>
    </div>
  )
}

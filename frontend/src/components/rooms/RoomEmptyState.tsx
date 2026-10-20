interface Props {
  onAdd: () => void
}

export function RoomEmptyState({ onAdd }: Props) {
  return (
    <section className="bg-white rounded-2xl border border-gray-200 flex flex-col items-center justify-center px-5 py-16 sm:py-20 gap-5 text-center">
      {/* House icon */}
      <div
        aria-hidden="true"
        className="w-14 h-14 rounded-2xl flex items-center justify-center"
        style={{ background: '#fef3c7' }}
      >
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="#d97706">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </svg>
      </div>

      {/* Text */}
      <div className="text-center space-y-1">
        <h2 className="font-bold text-gray-900 text-lg">Chưa có phòng trọ</h2>
        <p className="text-sm text-gray-600">Thêm phòng đầu tiên để bắt đầu quản lý.</p>
      </div>

      {/* CTA button */}
      <button
        onClick={onAdd}
        type="button"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition hover:brightness-95 active:scale-[.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
        style={{ background: '#f59e0b' }}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
        </svg>
        + Thêm phòng
      </button>
    </section>
  )
}

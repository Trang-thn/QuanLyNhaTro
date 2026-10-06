const AMBER = '#f59e0b'

export default function FieldLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-[13px] font-semibold text-[#1f2937]">{label}</span>
      {required && <span className="text-[13px] font-semibold" style={{ color: AMBER }}>*</span>}
    </div>
  )
}


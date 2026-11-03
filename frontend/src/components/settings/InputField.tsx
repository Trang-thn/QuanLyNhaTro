import { useState } from 'react'

export default function InputField({ value, placeholder, disabled, hint }: { value?: string; placeholder?: string; disabled?: boolean; hint?: string }) {
  const [val, setVal] = useState(value ?? '')
  return (
    <div>
      <div className={`flex items-center gap-2 border border-[#e5e7eb] rounded-lg h-10 px-3 ${disabled ? 'bg-[#f3f4f6]' : 'bg-white'}`}>
        <input
          value={val}
          onChange={e => !disabled && setVal(e.target.value)}
          readOnly={disabled}
          placeholder={placeholder}
          className="flex-1 text-[14px] text-[#1f2937] outline-none bg-transparent"
          style={{ color: disabled ? '#4b5563' : '#1f2937' }}
        />
      </div>
      {hint && <p className="text-[12px] text-[#4b5563] mt-1">{hint}</p>}
    </div>
  )
}


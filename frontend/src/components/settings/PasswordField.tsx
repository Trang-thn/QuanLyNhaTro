import { useState } from 'react'

export default function PasswordField({ placeholder }: { placeholder: string }) {
  const [val, setVal] = useState('')
  const [show, setShow] = useState(false)
  return (
    <div className="flex items-center gap-2 border border-[#e5e7eb] rounded-lg h-10 px-3 bg-white">
      <input
        type={show ? 'text' : 'password'}
        value={val}
        onChange={e => setVal(e.target.value)}
        placeholder={placeholder}
        className="flex-1 text-[14px] text-[#9ca3af] outline-none bg-transparent"
      />
      <button type="button" onClick={() => setShow(p => !p)} className="shrink-0">
        <img src="/assets/b905a.svg" alt="" className="w-4 h-4 opacity-50 hover:opacity-80 transition" />
      </button>
    </div>
  )
}


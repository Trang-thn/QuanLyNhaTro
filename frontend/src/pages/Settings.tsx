import { useState } from 'react'

const AMBER = '#f59e0b'
const NAVY = '#0d2137'

function FieldLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-[13px] font-semibold text-[#1f2937]">{label}</span>
      {required && <span className="text-[13px] font-semibold" style={{ color: AMBER }}>*</span>}
    </div>
  )
}

function InputField({ value, placeholder, disabled, hint }: { value?: string; placeholder?: string; disabled?: boolean; hint?: string }) {
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

function PasswordField({ placeholder }: { placeholder: string }) {
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

function EditProfileModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: 'rgba(11,11,12,0.6)' }} onClick={onClose}>
      <div className="bg-white flex flex-col gap-6 items-start p-8 rounded-2xl w-[640px]" style={{ boxShadow: '0px 8px 12px rgba(23,43,77,0.12)' }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between w-full">
          <p className="font-bold text-[18px] text-[#172b4d]">Cập nhật thông tin cá nhân</p>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition">
            <img src="/assets/29214.svg" alt="close" className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex flex-col gap-4 w-full">
          <div className="flex gap-4">
            <div className="flex flex-col gap-1.5 flex-1">
              <FieldLabel label="Họ và tên" />
              <InputField value="Nguyễn Văn A" disabled hint="Họ tên không thể thay đổi sau khi xác thực" />
            </div>
            <div className="flex flex-col gap-1.5 flex-1">
              <FieldLabel label="Số CCCD/CMND" />
              <InputField value="012345678901" disabled hint="CCCD không thể thay đổi sau khi xác thực" />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex flex-col gap-1.5 flex-1">
              <FieldLabel label="Số điện thoại" required />
              <InputField value="0987654321" />
            </div>
            <div className="flex flex-col gap-1.5 flex-1">
              <FieldLabel label="Email" required />
              <InputField value="nguyenvana@gmail.com" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5 w-full">
            <FieldLabel label="Địa chỉ thường trú" />
            <InputField value="Số 123, Đường ABC, Quận XYZ, TP. Hà Nội" />
          </div>

          <div className="flex gap-4">
            <div className="flex flex-col gap-1.5 flex-1">
              <FieldLabel label="SĐT liên hệ khẩn cấp" />
              <InputField value="0912345678" />
            </div>
            <div className="flex flex-col gap-1.5 flex-1">
              <FieldLabel label="Mối quan hệ" />
              <InputField value="Mẹ" />
            </div>
          </div>

          {/* Warning box */}
          <div className="flex items-start gap-2 p-2.5 rounded-lg" style={{ background: '#fef3c7' }}>
            <img src="/assets/4d2f6.svg" alt="" className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            <p className="text-[12px] leading-[1.4]" style={{ color: '#d97706' }}>
              Họ tên và CCCD không thể thay đổi để đảm bảo tính pháp lý Hợp đồng.
            </p>
          </div>
        </div>

        <div className="flex gap-3 justify-end w-full">
          <button onClick={onClose} className="px-4 py-2.5 rounded-lg border border-[#e5e7eb] text-sm font-semibold text-[#4b5563] hover:bg-gray-50 transition">Hủy</button>
          <button onClick={onClose} className="px-4 py-2.5 rounded-lg text-white text-sm font-semibold transition" style={{ background: AMBER }}>Cập nhật</button>
        </div>
      </div>
    </div>
  )
}

function ChangePasswordModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: 'rgba(11,11,12,0.6)' }} onClick={onClose}>
      <div className="bg-white flex flex-col gap-6 items-start p-8 rounded-2xl w-[480px]" style={{ boxShadow: '0px 8px 12px rgba(23,43,77,0.12)' }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between w-full">
          <p className="font-bold text-[18px] text-[#172b4d]">Đổi mật khẩu</p>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition">
            <img src="/assets/29214.svg" alt="close" className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex flex-col gap-4 w-full flex-1">
          <div className="flex flex-col gap-1.5">
            <FieldLabel label="Mật khẩu hiện tại" required />
            <PasswordField placeholder="Nhập mật khẩu hiện tại" />
          </div>
          <div className="flex flex-col gap-1.5">
            <FieldLabel label="Mật khẩu mới" required />
            <PasswordField placeholder="Mật khẩu ít nhất 8 ký tự" />
          </div>
          <div className="flex flex-col gap-1.5">
            <FieldLabel label="Nhập lại mật khẩu mới" required />
            <PasswordField placeholder="Xác nhận lại mật khẩu mới" />
          </div>
        </div>

        <div className="flex gap-3 justify-end w-full">
          <button onClick={onClose} className="px-4 py-2.5 rounded-lg border border-[#e5e7eb] text-sm font-semibold text-[#4b5563] hover:bg-gray-50 transition">Hủy</button>
          <button onClick={onClose} className="px-4 py-2.5 rounded-lg text-white text-sm font-semibold transition" style={{ background: AMBER }}>Lưu mật khẩu mới</button>
        </div>
      </div>
    </div>
  )
}

export default function Settings() {
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [showChangePassword, setShowChangePassword] = useState(false)

  return (
    <div className="space-y-5 max-w-3xl">
      {/* Profile card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center gap-4 px-6 py-5 border-b border-gray-100">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold shrink-0" style={{ background: AMBER }}>A</div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold" style={{ color: NAVY }}>Admin</h2>
            <p className="text-sm text-gray-500">admin@nhatropro.vn</p>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold mt-1" style={{ background: '#fef3c7', color: '#d97706' }}>Chủ trọ</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-px bg-gray-100">
          {[
            { label: 'Họ và tên', value: 'Nguyễn Văn A' },
            { label: 'Số CCCD', value: '012345678901' },
            { label: 'Số điện thoại', value: '0987654321' },
            { label: 'Email', value: 'admin@nhatropro.vn' },
            { label: 'Địa chỉ', value: 'Số 123, Đường ABC, Quận XYZ, TP. Hà Nội', colSpan: 2 },
          ].map(f => (
            <div key={f.label} className={`bg-white px-6 py-4 ${(f as { colSpan?: number }).colSpan === 2 ? 'col-span-2' : ''}`}>
              <div className="text-[11px] text-gray-400 uppercase tracking-wide mb-0.5">{f.label}</div>
              <div className="text-sm font-medium text-gray-800">{f.value}</div>
            </div>
          ))}
        </div>
        <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
          <button
            onClick={() => setShowEditProfile(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-semibold transition"
            style={{ background: AMBER }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Cập nhật thông tin
          </button>
          <button
            onClick={() => setShowChangePassword(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition border border-gray-200 text-gray-600 hover:bg-gray-50">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Đổi mật khẩu
          </button>
        </div>
      </div>

      {/* App info */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-semibold text-sm mb-4" style={{ color: NAVY }}>Thông tin hệ thống</h3>
        <div className="space-y-3 text-sm">
          {[
            { label: 'Phiên bản', value: 'NhàTrọ Pro v2.0.0' },
            { label: 'Môi trường', value: 'Production' },
            { label: 'Cập nhật lần cuối', value: '01/10/2026' },
          ].map(f => (
            <div key={f.label} className="flex justify-between">
              <span className="text-gray-500">{f.label}</span>
              <span className="font-medium text-gray-800">{f.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      {showEditProfile && <EditProfileModal onClose={() => setShowEditProfile(false)} />}
      {showChangePassword && <ChangePasswordModal onClose={() => setShowChangePassword(false)} />}
    </div>
  )
}

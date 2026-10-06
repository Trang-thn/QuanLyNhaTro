import FieldLabel from './FieldLabel'
import PasswordField from './PasswordField'

const AMBER = '#f59e0b'

export default function ChangePasswordModal({ onClose }: { onClose: () => void }) {
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


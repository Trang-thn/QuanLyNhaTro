import FieldLabel from './FieldLabel'
import InputField from './InputField'
import type { SettingsData } from '../../types/settings'

const AMBER = '#f59e0b'

export default function EditProfileModal({ onClose, data }: { onClose: () => void; data: SettingsData }) {
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
              <InputField value={data.editProfileFields.fullName} disabled hint="Họ tên không thể thay đổi sau khi xác thực" />
            </div>
            <div className="flex flex-col gap-1.5 flex-1">
              <FieldLabel label="Số CCCD/CMND" />
              <InputField value={data.editProfileFields.identityNumber} disabled hint="CCCD không thể thay đổi sau khi xác thực" />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex flex-col gap-1.5 flex-1">
              <FieldLabel label="Số điện thoại" required />
              <InputField value={data.editProfileFields.phone} />
            </div>
            <div className="flex flex-col gap-1.5 flex-1">
              <FieldLabel label="Email" required />
              <InputField value={data.editProfileFields.email} />
            </div>
          </div>

          <div className="flex flex-col gap-1.5 w-full">
            <FieldLabel label="Địa chỉ thường trú" />
            <InputField value={data.editProfileFields.address} />
          </div>

          <div className="flex gap-4">
            <div className="flex flex-col gap-1.5 flex-1">
              <FieldLabel label="SĐT liên hệ khẩn cấp" />
              <InputField value={data.editProfileFields.emergencyPhone} />
            </div>
            <div className="flex flex-col gap-1.5 flex-1">
              <FieldLabel label="Mối quan hệ" />
              <InputField value={data.editProfileFields.emergencyRelationship} />
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


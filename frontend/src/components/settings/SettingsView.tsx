import { useEffect, useState } from 'react'
import type { SettingsData } from '../../types/settings'
import ConnectedEditProfileModal from './ConnectedEditProfileModal'
import ConnectedChangePasswordModal from './ConnectedChangePasswordModal'
import type { UpdateProfilePayload } from '../../services/settingsActions'

const AMBER = '#f59e0b'
const NAVY = '#0d2137'






export default function SettingsView({ data }: { data: SettingsData }) {
  const [viewData, setViewData] = useState(data)
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [showChangePassword, setShowChangePassword] = useState(false)
  useEffect(() => setViewData(data), [data])
  const handleProfileSaved = (profile: UpdateProfilePayload) => setViewData(current => ({
    ...current,
    email: profile.email,
    profileFields: current.profileFields.map((field, index) => ({ ...field,
      value: index === 2 ? profile.phoneNumber : index === 3 ? profile.email : index === 4 ? profile.permanentAddress : field.value,
    })),
    editProfileFields: { ...current.editProfileFields, email: profile.email, phone: profile.phoneNumber, address: profile.permanentAddress, emergencyPhone: profile.emergencyContact },
  }))

  return (
    <div className="space-y-5 max-w-3xl">
      {/* Profile card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center gap-4 px-6 py-5 border-b border-gray-100">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold shrink-0" style={{ background: AMBER }}>{viewData.avatarInitial}</div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold" style={{ color: NAVY }}>{viewData.displayName}</h2>
            <p className="text-sm text-gray-500">{viewData.email}</p>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold mt-1" style={{ background: '#fef3c7', color: '#d97706' }}>{viewData.roleLabel}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-px bg-gray-100">
          {viewData.profileFields.map(f => (
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
      {viewData.systemInfo.length > 0 && <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-semibold text-sm mb-4" style={{ color: NAVY }}>Thông tin hệ thống</h3>
        <div className="space-y-3 text-sm">
          {viewData.systemInfo.map(f => (
            <div key={f.label} className="flex justify-between">
              <span className="text-gray-500">{f.label}</span>
              <span className="font-medium text-gray-800">{f.value}</span>
            </div>
          ))}
        </div>
      </div>}

      {/* Modals */}
      {showEditProfile && <ConnectedEditProfileModal onClose={() => setShowEditProfile(false)} onSaved={handleProfileSaved} data={viewData} />}
      {showChangePassword && <ConnectedChangePasswordModal onClose={() => setShowChangePassword(false)} />}
    </div>
  )
}

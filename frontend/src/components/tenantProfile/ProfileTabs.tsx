type ProfileTab = 'profile' | 'room'

interface Props {
  activeTab: ProfileTab
  onTabChange: (tab: ProfileTab) => void
}

const AMBER = '#f59e0b'

export default function ProfileTabs({ activeTab, onTabChange }: Props) {
  return (
    <div className="flex gap-2 mb-5">
      <button
        onClick={() => onTabChange('profile')}
        className="px-4 py-2 rounded-lg text-sm font-semibold transition"
        style={{ background: activeTab === 'profile' ? AMBER : 'white', color: activeTab === 'profile' ? 'white' : '#4b5563', border: '1px solid #e5e7eb' }}>
        Hồ sơ cá nhân
      </button>
      <button
        onClick={() => onTabChange('room')}
        className="px-4 py-2 rounded-lg text-sm font-semibold transition"
        style={{ background: activeTab === 'room' ? AMBER : 'white', color: activeTab === 'room' ? 'white' : '#4b5563', border: '1px solid #e5e7eb' }}>
        Thông tin phòng &amp; Thành viên
      </button>
    </div>
  )
}

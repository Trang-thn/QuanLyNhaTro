import { useState } from 'react';
import ProfileTab from './ProfileTab';
import RoomTab from './RoomTab';

const AMBER = '#f59e0b';
const NAVY = '#0d2137';

export default function TenantProfile() {
  const [activeTab, setActiveTab] = useState<'profile' | 'room'>('profile');

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold mb-4" style={{ color: NAVY }}>Thông tin cá nhân &amp; Phòng thuê</h2>

        {/* Nút chuyển Tabs */}
        <div className="flex gap-2 mb-5">
          <button
            onClick={() => setActiveTab('profile')}
            className="px-4 py-2 rounded-lg text-sm font-semibold transition"
            style={{
              background: activeTab === 'profile' ? AMBER : 'white',
              color: activeTab === 'profile' ? 'white' : '#4b5563',
              border: '1px solid #e5e7eb',
            }}
          >
            Hồ sơ cá nhân
          </button>
          <button
            onClick={() => setActiveTab('room')}
            className="px-4 py-2 rounded-lg text-sm font-semibold transition"
            style={{
              background: activeTab === 'room' ? AMBER : 'white',
              color: activeTab === 'room' ? 'white' : '#4b5563',
              border: '1px solid #e5e7eb',
            }}
          >
            Thông tin phòng &amp; Thành viên
          </button>
        </div>

        {/* Render Tab tương ứng */}
        {activeTab === 'profile' && <ProfileTab />}
        {activeTab === 'room' && <RoomTab />}
      </div>
    </div>
  );
}
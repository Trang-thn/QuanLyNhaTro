import { Member } from '../types/tenantContract';

const NAVY = '#0d2137';
const AMBER = '#f59e0b';

interface MemberListProps {
 tenants: any[];
}

export default function MemberList({ tenants }: MemberListProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-base" style={{ color: NAVY }}>Thành viên ở cùng</h3>
          <p className="text-xs text-gray-400 mt-0.5">{tenants.length} thành viên trong phòng P101</p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-100">
          {tenants.length} thành viên
        </span>
      </div>
      <div className="divide-y divide-gray-50">
        {tenants.map((t, i) => (
          <div key={t.name} className="px-6 py-4 flex items-center gap-4">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
              style={{ background: i === 0 ? AMBER : '#94a3b8' }}
            >
              {t.name.charAt(t.name.lastIndexOf(' ') + 1)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-gray-800 text-sm">{t.name}</p>
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={i === 0 ? { background: '#fef3c7', color: AMBER } : { background: '#f1f5f9', color: '#6b7280' }}
                >
                  {t.role}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">CCCD: {t.cccd}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">Ngày vào</p>
              <p className="text-sm font-semibold text-gray-700">{t.joinDate}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
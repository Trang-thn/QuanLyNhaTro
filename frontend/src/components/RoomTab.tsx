import RoomCostDetails from './RoomCostDetails';
import RoomMembersTable from './RoomMembersTable';

const NAVY = '#0d2137';

export default function RoomTab() {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold" style={{ color: NAVY }}>Phòng P101 (Tầng 1 · Loại: VIP)</h3>
            <p className="text-sm text-gray-400 mt-0.5">Thời hạn: 01/01/2026 · 31/12/2026 (Còn 6 tháng)</p>
          </div>
          <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Đang hiệu lực
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RoomCostDetails />
          <RoomMembersTable />
        </div>
      </div>
    </div>
  );
}
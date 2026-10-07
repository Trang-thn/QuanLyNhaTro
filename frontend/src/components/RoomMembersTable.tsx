const NAVY = '#0d2137';
const AMBER = '#f59e0b';

const members = [
  { name: 'Nguyễn Văn A', phone: '0987654321', role: 'Trưởng phòng', date: '01/01/2026', isLead: true },
  { name: 'Lê Văn Nam', phone: '0912123123', role: 'Thành viên', date: '15/01/2026', isLead: false },
];

export default function RoomMembersTable() {
  return (
    <div className="border border-gray-100 rounded-xl p-4">
      <p className="font-semibold text-sm mb-3" style={{ color: NAVY }}>Thành viên cùng phòng</p>
      
      <table className="w-full text-sm">
        <thead>
          <tr>
            {['Họ tên / SĐT', 'Vai trò', 'Ngày vào'].map((h) => (
              <th key={h} className="text-left text-xs font-semibold text-gray-400 pb-2">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {members.map((m) => (
            <tr key={m.name} className="border-t border-gray-50">
              <td className="py-2.5">
                <p className="font-medium text-gray-800">{m.name}</p>
                <p className="text-xs text-gray-400">{m.phone}</p>
              </td>
              <td className="py-2.5">
                <span className={`text-xs font-semibold ${m.isLead ? '' : 'text-gray-500'}`} style={m.isLead ? { color: AMBER } : {}}>
                  {m.role}
                </span>
              </td>
              <td className="py-2.5 text-xs text-gray-500">{m.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
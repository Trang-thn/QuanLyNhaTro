import { Contract } from '../types/contract';
import { getTenantName, getRoomNumber, formatVND, formatDate } from '../data/mockData';

const NAVY = '#0d2137';

const statusLabel: Record<string, string> = {
  HIEU_LUC: 'Hiệu lực',
  KHONG_HIEU_LUC: 'Không hiệu lực',
  DA_THANH_LY: 'Đã thanh lý',
};

const statusStyle: Record<string, string> = {
  HIEU_LUC: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  KHONG_HIEU_LUC: 'bg-gray-100 text-gray-500 border-gray-200',
  DA_THANH_LY: 'bg-red-50 text-red-600 border-red-200',
};

interface ContractTableProps {
  contracts: Contract[];
  totalCount: number;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onTerminate: (id: string) => void;
}

export default function ContractTable({ contracts, totalCount, onView, onEdit, onTerminate }: ContractTableProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['Số hợp đồng', 'Phòng', 'Người đại diện', 'Ngày bắt đầu', 'Ngày kết thúc', 'Giá thuê', 'Tiền cọc', 'Ngày chốt', 'Trạng thái', 'Thao tác'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {contracts.map((c, i) => (
              <tr key={c.id} className={`border-t border-gray-50 hover:bg-blue-50/30 transition-colors ${i % 2 !== 0 ? 'bg-gray-50/40' : ''}`}>
                <td className="px-4 py-3 font-mono text-xs font-semibold" style={{ color: NAVY }}>{c.contract_number}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                    {getRoomNumber(c.room_id)}
                  </span>
                </td>
                <td className="px-4 py-3 font-medium text-gray-800">{getTenantName(c.representative_tenant_id)}</td>
                <td className="px-4 py-3 text-gray-600">{formatDate(c.start_date)}</td>
                <td className="px-4 py-3 text-gray-600">{formatDate(c.end_date)}</td>
                <td className="px-4 py-3 font-semibold text-gray-800">{formatVND(c.rental_price)}</td>
                <td className="px-4 py-3 text-gray-600">{formatVND(c.deposit_amount)}</td>
                <td className="px-4 py-3 text-gray-500">Ngày {c.billing_cycle_day}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusStyle[c.status]}`}>
                    {statusLabel[c.status]}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-3 text-xs">
                    <button className="text-blue-600 hover:text-blue-800 font-medium" onClick={() => onView(c.id)}>Xem</button>
                    <button className="text-gray-500 hover:text-gray-700 font-medium" onClick={() => onEdit(c.id)}>Sửa</button>
                    {c.status === 'HIEU_LUC' && (
                      <button className="text-orange-500 hover:text-orange-700 font-medium" onClick={() => onTerminate(c.id)}>Thanh lý</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {contracts.length === 0 && (
        <div className="text-center py-12 text-gray-400 text-sm">Không tìm thấy hợp đồng nào.</div>
      )}
      <div className="px-4 py-3 border-t border-gray-100">
        <span className="text-xs text-gray-500">Hiển thị {contracts.length} / {totalCount} hợp đồng</span>
      </div>
    </div>
  );
}
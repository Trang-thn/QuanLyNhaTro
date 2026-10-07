import { Contract } from '../../types/contract';
import { getTenantName, getRoomNumber, formatVND, formatDate } from '../../data/mockData';

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

interface ContractDetailModalProps {
  contract: Contract;
  onClose: () => void;
}

export default function ContractDetailModal({ contract, onClose }: ContractDetailModalProps) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-bold text-lg" style={{ color: NAVY }}>Chi tiết hợp đồng</h3>
            <p className="text-sm text-gray-500 font-mono">{contract.contract_number}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${statusStyle[contract.status]}`}>
              {statusLabel[contract.status]}
            </span>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          {[
            { label: 'Phòng thuê', value: getRoomNumber(contract.room_id) },
            { label: 'Người đại diện', value: getTenantName(contract.representative_tenant_id) },
            { label: 'Ngày bắt đầu', value: formatDate(contract.start_date) },
            { label: 'Ngày kết thúc', value: formatDate(contract.end_date) },
            { label: 'Giá thuê chốt', value: formatVND(contract.rental_price) + '/tháng' },
            { label: 'Tiền cọc', value: formatVND(contract.deposit_amount) },
            { label: 'Ngày chốt tiền', value: `Ngày ${contract.billing_cycle_day} hàng tháng` },
          ].map(f => (
            <div key={f.label}>
              <div className="text-gray-400 text-xs mb-0.5">{f.label}</div>
              <div className="font-semibold text-gray-800">{f.value}</div>
            </div>
          ))}
        </div>
        <button className="w-full mt-5 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50" onClick={onClose}>
          Đóng
        </button>
      </div>
    </div>
  );
}
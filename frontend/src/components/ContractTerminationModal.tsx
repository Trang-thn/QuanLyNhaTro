import { Contract } from '../../types/contract';
import { getTenantName, getRoomNumber, formatVND } from '../../data/mockData';

const NAVY = '#0d2137';

interface ContractTerminationModalProps {
  contract: Contract;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ContractTerminationModal({ contract, onClose, onConfirm }: ContractTerminationModalProps) {
  const tenant = getTenantName(contract.representative_tenant_id);
  const room = getRoomNumber(contract.room_id);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[480px]" onClick={e => e.stopPropagation()}>
        <div className="px-6 pt-5 pb-4 border-b border-gray-100 flex items-start justify-between">
          <div>
            <h3 className="font-bold text-lg" style={{ color: NAVY }}>Thanh lý hợp đồng</h3>
            <p className="text-sm text-gray-400 mt-0.5">Xác nhận kết thúc hợp đồng {contract.contract_number}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition mt-0.5">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div className="flex items-start gap-3 px-4 py-3 rounded-xl border border-orange-200 bg-orange-50">
            <svg className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-orange-800">Lưu ý trước khi thanh lý</p>
              <p className="text-xs text-orange-700 mt-0.5">Hành động này không thể hoàn tác. Hợp đồng sẽ chuyển sang trạng thái "Đã thanh lý" và phòng sẽ được trả về trạng thái trống.</p>
            </div>
          </div>

          <div className="rounded-xl p-4 border border-gray-100 space-y-3" style={{ background: '#f8fafc' }}>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><p className="text-xs text-gray-400 mb-0.5">Hợp đồng</p><p className="font-semibold text-gray-800 font-mono text-xs">{contract.contract_number}</p></div>
              <div><p className="text-xs text-gray-400 mb-0.5">Phòng</p><p className="font-semibold text-gray-800">{room}</p></div>
              <div><p className="text-xs text-gray-400 mb-0.5">Người đại diện</p><p className="font-semibold text-gray-800">{tenant}</p></div>
              <div><p className="text-xs text-gray-400 mb-0.5">Tiền cọc</p><p className="font-semibold text-gray-800">{formatVND(contract.deposit_amount)}</p></div>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Ngày thanh lý <span className="text-red-500">*</span></label>
              <input type="date" defaultValue={new Date().toISOString().split('T')[0]} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400 transition" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Tiền hoàn cọc (đ)</label>
              <input type="number" defaultValue={contract.deposit_amount} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400 transition" />
              <p className="text-xs text-gray-400 mt-1">Mặc định bằng tiền cọc ban đầu. Điều chỉnh nếu có khấu trừ.</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Ghi chú thanh lý</label>
              <textarea rows={3} placeholder="Lý do thanh lý, ghi chú bàn giao phòng..." className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400 resize-none transition" />
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex justify-between">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition">Hủy</button>
          <button onClick={onConfirm} className="px-5 py-2 rounded-lg text-white text-sm font-semibold transition" style={{ background: '#ef4444' }}>Xác nhận thanh lý</button>
        </div>
      </div>
    </div>
  );
}
import { Contract } from '../../types/contract';
import { rooms, tenants, getTenantName, getRoomNumber } from '../../data/mockData';

const NAVY = '#0d2137';
const AMBER = '#f59e0b';

interface ContractFormModalProps {
  contract?: Contract; // Nếu truyền contract vào => Modal Sửa, không truyền => Modal Thêm
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export default function ContractFormModal({ contract, onClose, onSubmit }: ContractFormModalProps) {
  const isEdit = Boolean(contract);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <div className="px-6 pt-5 pb-4 border-b border-gray-100 flex items-start justify-between">
          <div>
            <h3 className="font-bold text-lg" style={{ color: NAVY }}>
              {isEdit ? 'Chỉnh sửa hợp đồng' : 'Lập hợp đồng mới'}
            </h3>
            {isEdit && <p className="text-sm text-gray-400 mt-0.5">Cập nhật thông tin hợp đồng {contract?.contract_number}</p>}
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition mt-0.5">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Phòng thuê</label>
              {isEdit ? (
                <input defaultValue={getRoomNumber(contract!.room_id)} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400 transition" />
              ) : (
                <select className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm">
                  {rooms.filter(r => r.status === 'TRONG').map(r => (
                    <option key={r.id}>{r.room_number}</option>
                  ))}
                </select>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Người đại diện</label>
              {isEdit ? (
                <input defaultValue={getTenantName(contract!.representative_tenant_id)} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400 transition" />
              ) : (
                <select className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm">
                  {tenants.map(t => <option key={t.id}>{t.full_name}</option>)}
                </select>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Ngày bắt đầu</label>
              <input type="date" defaultValue={contract?.start_date} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400 transition" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Ngày kết thúc</label>
              <input type="date" defaultValue={contract?.end_date} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400 transition" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Giá thuê (đ/tháng)</label>
              <input type="number" defaultValue={contract?.rental_price} placeholder="2000000" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400 transition" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Tiền cọc (đ)</label>
              <input type="number" defaultValue={contract?.deposit_amount} placeholder="4000000" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400 transition" />
            </div>
            {isEdit && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Ngày chốt tiền hàng tháng</label>
                  <input type="number" defaultValue={contract?.billing_cycle_day} min={1} max={28} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400 transition" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Trạng thái</label>
                  <select defaultValue={contract?.status} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400 bg-white transition">
                    <option value="HIEU_LUC">Hiệu lực</option>
                    <option value="KHONG_HIEU_LUC">Không hiệu lực</option>
                    <option value="DA_THANH_LY">Đã thanh lý</option>
                  </select>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex justify-between gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition">
            Hủy
          </button>
          <button onClick={() => onSubmit({})} className="flex-1 py-2.5 rounded-lg text-white text-sm font-semibold transition" style={{ background: AMBER }}>
            {isEdit ? 'Lưu thay đổi' : 'Lập hợp đồng'}
          </button>
        </div>
      </div>
    </div>
  );
}
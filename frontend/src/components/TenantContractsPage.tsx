import { useState } from 'react';
import { ModalType } from '../types/tenantContract';
import { tenants,contracts } from '../data/mockData'; 
import RenewModal from './RenewModal';
import PrintModal from './PrintModal';
import ContractCard from './ContractCard';
import MemberList from './MemberList';
import RentalHistory from './RentalHistory';

const NAVY = '#0d2137';
const AMBER = '#f59e0b';

export default function TenantContractsPage() {
  const [modal, setModal] = useState<ModalType>(null);
  const [toast, setToast] = useState<string | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  }

  function handleRenewConfirm() {
    setModal(null);
    showToast('Đã gửi yêu cầu gia hạn thành công');
  }

  return (
    <div className="space-y-5">
      {/* Toast thông báo */}
      {toast && (
        <div
          className="fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl text-white text-sm font-semibold"
          style={{ background: '#22c55e', minWidth: 260 }}
        >
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          {toast}
        </div>
      )}

      {/* Header trang */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold" style={{ color: NAVY }}>Hợp đồng của tôi</h2>
          <p className="text-sm text-gray-400 mt-0.5">Xem thông tin hợp đồng thuê phòng và thành viên ở cùng</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setModal('renew')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition border"
            style={{ color: AMBER, borderColor: AMBER }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Gia hạn
          </button>
          <button
            onClick={() => setModal('print')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-white text-sm font-semibold transition"
            style={{ background: NAVY }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            In hợp đồng
          </button>
        </div>
      </div>

      {/* Chi tiết hợp đồng */}
      <ContractCard />

      {/* Thành viên ở cùng */}
      <MemberList tenants={tenants} />

      {/* Lịch sử thuê phòng */}
      <RentalHistory contracts={contracts} />

      {/* Các Modals */}
      {modal === 'renew' && <RenewModal onClose={() => setModal(null)} onConfirm={handleRenewConfirm} />}
      {modal === 'print' && <PrintModal tenants={tenants} onClose={() => setModal(null)} />}
    </div>
  );
}

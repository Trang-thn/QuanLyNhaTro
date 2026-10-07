import { useState } from 'react';

const NAVY = '#0d2137';
const AMBER = '#f59e0b';

interface RenewModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

export default function RenewModal({ onClose, onConfirm }: RenewModalProps) {
  const [newEnd, setNewEnd] = useState('2027-12-31');
  const [note, setNote] = useState('');

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(11,11,12,0.55)' }}
      onClick={onClose}
    >
      <div className="bg-white rounded-2xl w-[480px] shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="px-6 py-5 border-b border-gray-100">
          <h3 className="text-base font-bold" style={{ color: NAVY }}>Gia hạn hợp đồng</h3>
          <p className="text-sm text-gray-400 mt-0.5">Yêu cầu gia hạn hợp đồng thuê phòng</p>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div className="rounded-xl p-4 border border-gray-100" style={{ background: '#f8fafc' }}>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                { label: 'Mã hợp đồng', value: 'HD-2026-001' },
                { label: 'Phòng', value: 'P101' },
                { label: 'Ngày bắt đầu', value: '01/01/2026' },
                { label: 'Ngày kết thúc hiện tại', value: '31/12/2026' },
              ].map(f => (
                <div key={f.label}>
                  <p className="text-xs text-gray-400 mb-0.5">{f.label}</p>
                  <p className="font-semibold text-gray-800">{f.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Ngày kết thúc mới <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={newEnd}
              onChange={e => setNewEnd(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Ghi chú yêu cầu</label>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              rows={3}
              placeholder="Lý do gia hạn hoặc ghi chú thêm..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-amber-400 resize-none"
            />
          </div>

          <div className="rounded-lg px-4 py-3 text-sm" style={{ background: '#fffbeb', border: '1px solid #fde68a' }}>
            <p className="font-semibold text-amber-800 mb-0.5">Lưu ý</p>
            <p className="text-amber-700">Yêu cầu gia hạn sẽ được gửi đến chủ nhà để xét duyệt. Bạn sẽ nhận thông báo khi có kết quả.</p>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition">
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 rounded-lg text-white text-sm font-semibold transition"
            style={{ background: AMBER }}
          >
            Gửi yêu cầu gia hạn
          </button>
        </div>
      </div>
    </div>
  );
}
import { HistoryItem } from '../types/tenantContract';

const NAVY = '#0d2137';
const AMBER = '#f59e0b';

interface RentalHistoryProps {
  contracts: any[];
}

export default function RentalHistory({ contracts }: RentalHistoryProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="font-bold text-base" style={{ color: NAVY }}>Lịch sử thuê phòng</h3>
        <p className="text-xs text-gray-400 mt-0.5">Toàn bộ lịch sử thuê của bạn</p>
      </div>
      <div className="px-6 py-5">
        <div className="relative">
          <div className="absolute left-4 top-3 bottom-3 w-0.5 bg-gray-100" />
          <div className="space-y-6">
            {contracts.map(c => (
              <div key={c.contractId} className="relative flex gap-4 pl-10">
                <div
                  className="absolute left-2.5 top-1 w-3 h-3 rounded-full border-2 border-white shrink-0 z-10"
                  style={{
                    background: c.status === 'active' ? '#22c55e' : '#94a3b8',
                    outline: `2px solid ${c.status === 'active' ? '#22c55e' : '#94a3b8'}`,
                    outlineOffset: '1px',
                  }}
                />
                <div className="flex-1 rounded-xl border border-gray-100 p-4" style={{ background: c.status === 'active' ? '#f0fdf4' : '#f8fafc' }}>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold text-sm" style={{ color: NAVY }}>Phòng {c.room}</p>
                        {c.status === 'active' && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">Hiện tại</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{c.from} → {c.to}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Mã HĐ</p>
                      <p className="text-xs font-semibold" style={{ color: AMBER }}>{c.contractId}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
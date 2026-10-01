import { useState } from 'react'
import { contracts, tenants, rooms, getTenantName, getRoomNumber, formatVND, formatDate } from '../data/mockData'

const NAVY = '#0d2137'
const AMBER = '#f59e0b'

const statusLabel: Record<string, string> = {
  HIEU_LUC: 'Hiệu lực',
  KHONG_HIEU_LUC: 'Không hiệu lực',
  DA_THANH_LY: 'Đã thanh lý',
}
const statusStyle: Record<string, string> = {
  HIEU_LUC: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  KHONG_HIEU_LUC: 'bg-gray-100 text-gray-500 border-gray-200',
  DA_THANH_LY: 'bg-red-50 text-red-600 border-red-200',
}

type ContractModal =
  | { type: 'view';     id: string }
  | { type: 'edit';     id: string }
  | { type: 'thanh_ly'; id: string }
  | null

export default function Contracts() {
  const [filterStatus, setFilterStatus] = useState('ALL')
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)
  const [modal, setModal] = useState<ContractModal>(null)

  const filtered = contracts.filter(c => {
    const matchStatus = filterStatus === 'ALL' || c.status === filterStatus
    const tenant = getTenantName(c.representative_tenant_id)
    const room = getRoomNumber(c.room_id)
    const matchSearch = c.contract_number.toLowerCase().includes(search.toLowerCase()) ||
      tenant.toLowerCase().includes(search.toLowerCase()) ||
      room.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  const selectedContract = contracts.find(c => c.id === selected)

  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Đang hiệu lực', value: contracts.filter(c => c.status === 'HIEU_LUC').length, color: '#059669' },
          { label: 'Không hiệu lực', value: contracts.filter(c => c.status === 'KHONG_HIEU_LUC').length, color: '#6b7280' },
          { label: 'Đã thanh lý', value: contracts.filter(c => c.status === 'DA_THANH_LY').length, color: '#dc2626' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
            <div className="text-3xl font-bold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-sm text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex flex-wrap gap-3 items-center justify-between">
        <div className="flex gap-3 flex-wrap">
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Tìm theo mã HĐ, tên, phòng..."
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400 w-56"
          />
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400 text-gray-700">
            <option value="ALL">Tất cả trạng thái</option>
            <option value="HIEU_LUC">Hiệu lực</option>
            <option value="KHONG_HIEU_LUC">Không hiệu lực</option>
            <option value="DA_THANH_LY">Đã thanh lý</option>
          </select>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium"
          style={{ background: AMBER }}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Lập hợp đồng
        </button>
      </div>

      {/* Table */}
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
              {filtered.map((c, i) => (
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
                      <button className="text-blue-600 hover:text-blue-800 font-medium" onClick={() => setSelected(c.id)}>Xem</button>
                      <button className="text-gray-500 hover:text-gray-700 font-medium" onClick={() => setModal({ type: 'edit', id: c.id })}>Sửa</button>
                      {c.status === 'HIEU_LUC' && (
                        <button className="text-orange-500 hover:text-orange-700 font-medium" onClick={() => setModal({ type: 'thanh_ly', id: c.id })}>Thanh lý</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-sm">Không tìm thấy hợp đồng nào.</div>
        )}
        <div className="px-4 py-3 border-t border-gray-100">
          <span className="text-xs text-gray-500">Hiển thị {filtered.length} / {contracts.length} hợp đồng</span>
        </div>
      </div>

      {/* Contract detail modal */}
      {selectedContract && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-bold text-lg" style={{ color: NAVY }}>Chi tiết hợp đồng</h3>
                <p className="text-sm text-gray-500 font-mono">{selectedContract.contract_number}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${statusStyle[selectedContract.status]}`}>
                  {statusLabel[selectedContract.status]}
                </span>
                <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                { label: 'Phòng thuê', value: getRoomNumber(selectedContract.room_id) },
                { label: 'Người đại diện', value: getTenantName(selectedContract.representative_tenant_id) },
                { label: 'Ngày bắt đầu', value: formatDate(selectedContract.start_date) },
                { label: 'Ngày kết thúc', value: formatDate(selectedContract.end_date) },
                { label: 'Giá thuê chốt', value: formatVND(selectedContract.rental_price) + '/tháng' },
                { label: 'Tiền cọc', value: formatVND(selectedContract.deposit_amount) },
                { label: 'Ngày chốt tiền', value: `Ngày ${selectedContract.billing_cycle_day} hàng tháng` },
              ].map(f => (
                <div key={f.label}>
                  <div className="text-gray-400 text-xs mb-0.5">{f.label}</div>
                  <div className="font-semibold text-gray-800">{f.value}</div>
                </div>
              ))}
            </div>
            <button className="w-full mt-5 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50" onClick={() => setSelected(null)}>Đóng</button>
          </div>
        </div>
      )}

      {/* Add contract modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setShowAdd(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-lg" style={{ color: NAVY }}>Lập hợp đồng mới</h3>
              <button onClick={() => setShowAdd(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phòng thuê</label>
                <select className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm">
                  {rooms.filter(r => r.status === 'TRONG').map(r => (
                    <option key={r.id}>{r.room_number}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Người đại diện</label>
                <select className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm">
                  {tenants.map(t => <option key={t.id}>{t.full_name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ngày bắt đầu</label>
                  <input type="date" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ngày kết thúc</label>
                  <input type="date" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Giá thuê (đ/tháng)</label>
                <input type="number" placeholder="2000000" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tiền cọc (đ)</label>
                <input type="number" placeholder="4000000" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm" />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowAdd(false)} className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">Hủy</button>
              <button className="flex-1 py-2.5 rounded-lg text-white text-sm font-medium" style={{ background: AMBER }} onClick={() => setShowAdd(false)}>Lập hợp đồng</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit contract modal ── */}
      {modal?.type === 'edit' && (() => {
        const c = contracts.find(x => x.id === modal.id)
        if (!c) return null
        return (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setModal(null)}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
              <div className="px-6 pt-5 pb-4 border-b border-gray-100 flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-lg" style={{ color: NAVY }}>Chỉnh sửa hợp đồng</h3>
                  <p className="text-sm text-gray-400 mt-0.5">Cập nhật thông tin hợp đồng {c.contract_number}</p>
                </div>
                <button onClick={() => setModal(null)} className="p-1.5 rounded-lg hover:bg-gray-100 transition mt-0.5">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div className="px-6 py-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Phòng thuê</label>
                    <input defaultValue={getRoomNumber(c.room_id)} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400 transition" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Người đại diện</label>
                    <input defaultValue={getTenantName(c.representative_tenant_id)} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400 transition" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Ngày bắt đầu</label>
                    <input type="date" defaultValue={c.start_date} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400 transition" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Ngày kết thúc</label>
                    <input type="date" defaultValue={c.end_date} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400 transition" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Giá thuê (đ/tháng)</label>
                    <input type="number" defaultValue={c.rental_price} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400 transition" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Tiền cọc (đ)</label>
                    <input type="number" defaultValue={c.deposit_amount} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400 transition" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Ngày chốt tiền hàng tháng</label>
                    <input type="number" defaultValue={c.billing_cycle_day} min={1} max={28} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400 transition" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Trạng thái</label>
                    <select defaultValue={c.status} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400 bg-white transition">
                      <option value="HIEU_LUC">Hiệu lực</option>
                      <option value="KHONG_HIEU_LUC">Không hiệu lực</option>
                      <option value="DA_THANH_LY">Đã thanh lý</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-100 flex justify-between">
                <button onClick={() => setModal(null)} className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition">Hủy</button>
                <button onClick={() => setModal(null)} className="px-5 py-2 rounded-lg text-white text-sm font-semibold transition" style={{ background: AMBER }}>Lưu thay đổi</button>
              </div>
            </div>
          </div>
        )
      })()}

      {/* ── Termination modal ── */}
      {modal?.type === 'thanh_ly' && (() => {
        const c = contracts.find(x => x.id === modal.id)
        if (!c) return null
        const tenant = getTenantName(c.representative_tenant_id)
        const room   = getRoomNumber(c.room_id)
        return (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setModal(null)}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[480px]" onClick={e => e.stopPropagation()}>
              <div className="px-6 pt-5 pb-4 border-b border-gray-100 flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-lg" style={{ color: NAVY }}>Thanh lý hợp đồng</h3>
                  <p className="text-sm text-gray-400 mt-0.5">Xác nhận kết thúc hợp đồng {c.contract_number}</p>
                </div>
                <button onClick={() => setModal(null)} className="p-1.5 rounded-lg hover:bg-gray-100 transition mt-0.5">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <div className="px-6 py-5 space-y-4">
                {/* Warning */}
                <div className="flex items-start gap-3 px-4 py-3 rounded-xl border border-orange-200 bg-orange-50">
                  <svg className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
                  <div>
                    <p className="text-sm font-semibold text-orange-800">Lưu ý trước khi thanh lý</p>
                    <p className="text-xs text-orange-700 mt-0.5">Hành động này không thể hoàn tác. Hợp đồng sẽ chuyển sang trạng thái "Đã thanh lý" và phòng sẽ được trả về trạng thái trống.</p>
                  </div>
                </div>

                {/* Contract summary */}
                <div className="rounded-xl p-4 border border-gray-100 space-y-3" style={{ background: '#f8fafc' }}>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div><p className="text-xs text-gray-400 mb-0.5">Hợp đồng</p><p className="font-semibold text-gray-800 font-mono text-xs">{c.contract_number}</p></div>
                    <div><p className="text-xs text-gray-400 mb-0.5">Phòng</p><p className="font-semibold text-gray-800">{room}</p></div>
                    <div><p className="text-xs text-gray-400 mb-0.5">Người đại diện</p><p className="font-semibold text-gray-800">{tenant}</p></div>
                    <div><p className="text-xs text-gray-400 mb-0.5">Tiền cọc</p><p className="font-semibold text-gray-800">{formatVND(c.deposit_amount)}</p></div>
                  </div>
                </div>

                {/* Termination fields */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Ngày thanh lý <span className="text-red-500">*</span></label>
                    <input type="date" defaultValue={new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400 transition" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Tiền hoàn cọc (đ)</label>
                    <input type="number" defaultValue={c.deposit_amount}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400 transition" />
                    <p className="text-xs text-gray-400 mt-1">Mặc định bằng tiền cọc ban đầu. Điều chỉnh nếu có khấu trừ.</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Ghi chú thanh lý</label>
                    <textarea rows={3} placeholder="Lý do thanh lý, ghi chú bàn giao phòng..."
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400 resize-none transition" />
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-100 flex justify-between">
                <button onClick={() => setModal(null)} className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition">Hủy</button>
                <button onClick={() => setModal(null)} className="px-5 py-2 rounded-lg text-white text-sm font-semibold transition" style={{ background: '#ef4444' }}>Xác nhận thanh lý</button>
              </div>
            </div>
          </div>
        )
      })()}
    </div>
  )
}

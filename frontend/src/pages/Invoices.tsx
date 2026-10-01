import { useState } from 'react'
import { invoices, contracts, getTenantName, getRoomNumber, formatVND } from '../data/mockData'

const NAVY = '#0d2137'
const AMBER = '#f59e0b'

type InvStatus = 'CHUA_THANH_TOAN' | 'THANH_TOAN_MOT_PHAN' | 'DA_THANH_TOAN' | 'QUA_HAN'

const statusCfg: Record<string, { label: string; bg: string; color: string; border: string }> = {
  DA_THANH_TOAN:      { label: 'Đã thanh toán',        bg: '#ecfdf5', color: '#065f46', border: '#a7f3d0' },
  THANH_TOAN_MOT_PHAN:{ label: 'Thanh toán một phần',  bg: '#fff7ed', color: '#9a3412', border: '#fed7aa' },
  CHUA_THANH_TOAN:    { label: 'Chưa thanh toán',       bg: '#f9fafb', color: '#6b7280', border: '#e5e7eb' },
  QUA_HAN:            { label: 'Quá hạn',               bg: '#fef2f2', color: '#991b1b', border: '#fecaca' },
}

// derive utility readings from costs
function getReadings(inv: typeof invoices[0]) {
  const elecKwh    = Math.round(inv.electricity_cost / 3500)
  const waterM3    = Math.round(inv.water_cost / 15000)
  const prevElec   = inv.room_id === '1' ? 1200 : 800 + Number(inv.room_id) * 30
  const prevWater  = inv.room_id === '1' ? 45   : 30  + Number(inv.room_id) * 2
  return {
    prevElec, newElec: prevElec + elecKwh, elecKwh,
    prevWater, newWater: prevWater + waterM3, waterM3,
  }
}

function getContract(inv: typeof invoices[0]) {
  return contracts.find(c => c.id === inv.contract_id)
}

/* ─── Export invoice modal ─── */
function ExportModal({ inv, onClose }: { inv: typeof invoices[0]; onClose: () => void }) {
  const contract  = getContract(inv)
  const tenant    = contract ? getTenantName(contract.representative_tenant_id) : '—'
  const room      = getRoomNumber(inv.room_id)
  const r         = getReadings(inv)
  const remaining = inv.total_amount - inv.paid_amount
  const s         = statusCfg[inv.status] ?? statusCfg.CHUA_THANH_TOAN

  const rows = [
    { khoang: 'Tiền phòng',    chitiet: '—',                                                                           thanh: inv.room_price },
    { khoang: 'Tiền điện',     chitiet: `${r.prevElec} đến ${r.newElec} (${r.elecKwh} kWh × 3.500 đ)`,               thanh: inv.electricity_cost },
    { khoang: 'Tiền nước',     chitiet: `${r.prevWater} đến ${r.newWater} (${r.waterM3} m³ × 15.000 đ)`,              thanh: inv.water_cost },
    { khoang: 'Dịch vụ khác',  chitiet: 'Wifi, rác',                                                                   thanh: inv.other_service_cost },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[440px] overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="px-6 pt-6 pb-4 text-center border-b border-gray-100">
          <h3 className="font-bold text-base" style={{ color: NAVY }}>
            Hóa đơn tiền phòng tháng {inv.billing_month}/{inv.billing_year}
          </h3>
          <p className="text-xs mt-0.5" style={{ color: AMBER }}>{inv.invoice_code}</p>
        </div>

        <div className="px-6 py-4 space-y-4">
          {/* Info rows */}
          <div className="space-y-2.5">
            {[
              { label: 'Phòng', value: room },
              { label: 'Người thuê', value: tenant },
              { label: 'Hạn thanh toán', value: inv.due_date.split('-').reverse().join('/') },
            ].map(f => (
              <div key={f.label} className="flex justify-between items-center py-2 border-b border-dashed border-gray-200">
                <span className="text-sm text-gray-500">{f.label}</span>
                <span className="text-sm font-semibold text-gray-800">{f.value}</span>
              </div>
            ))}
          </div>

          {/* Cost table */}
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500 rounded-l">Khoản</th>
                <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500">Chi tiết</th>
                <th className="text-right px-3 py-2 text-xs font-semibold text-gray-500 rounded-r">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(row => (
                <tr key={row.khoang} className="border-b border-gray-50">
                  <td className="px-3 py-2.5 text-gray-700 font-medium whitespace-nowrap">{row.khoang}</td>
                  <td className="px-3 py-2.5 text-gray-400 text-xs">{row.chitiet}</td>
                  <td className="px-3 py-2.5 text-right font-medium text-gray-700 whitespace-nowrap">{formatVND(row.thanh)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Summary */}
          <div className="pt-1 space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold" style={{ color: NAVY }}>Tổng cộng</span>
              <span className="text-base font-bold" style={{ color: NAVY }}>{formatVND(inv.total_amount)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Đã trả</span>
              <span className="text-sm font-semibold text-emerald-600">{formatVND(inv.paid_amount)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold" style={{ color: AMBER }}>Còn nợ</span>
              <span className="text-sm font-bold" style={{ color: AMBER }}>{formatVND(remaining)}</span>
            </div>
          </div>

          {/* Status + history */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-gray-500">Trạng thái</span>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold border"
              style={{ background: s.bg, color: s.color, borderColor: s.border }}>{s.label}</span>
          </div>
          {inv.paid_amount > 0 && (
            <div className="text-xs text-gray-400 border-t border-gray-100 pt-2">
              {inv.due_date.split('-').reverse().join('/')} &nbsp;|&nbsp; Chuyển khoản &nbsp;|&nbsp; {formatVND(inv.paid_amount)}
            </div>
          )}
        </div>

        {/* Footer buttons */}
        <div className="px-6 py-4 border-t border-gray-100 flex gap-2">
          <button onClick={onClose} className="px-3 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition">Đóng</button>
          <button className="px-3 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition flex-1">Sao chép để gửi khách</button>
          <button className="px-3 py-2 rounded-lg text-white text-sm font-semibold transition flex-1" style={{ background: NAVY }}
            onClick={() => window.print()}>
            In hoặc lưu PDF
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── Main page ─── */
export default function Invoices() {
  const [selectedId, setSelectedId] = useState<string>(invoices[0]?.id ?? '')
  const [search, setSearch]         = useState('')
  const [showExport, setShowExport] = useState(false)
  const [payAmount, setPayAmount]   = useState('')
  const [payMethod, setPayMethod]   = useState('Tiền mặt')
  const [payNote, setPayNote]       = useState('')
  const [payHistory, setPayHistory] = useState<Record<string, { amount: number; method: string; date: string }[]>>({})

  // Derive status: mark overdue if not paid and past due_date
  const today = new Date()
  const enriched = invoices.map(inv => {
    const due = new Date(inv.due_date)
    const isOverdue = inv.status !== 'DA_THANH_TOAN' && due < today
    return { ...inv, displayStatus: isOverdue ? 'QUA_HAN' : inv.status }
  })

  const filtered = enriched.filter(inv => {
    if (!search) return true
    const contract = getContract(inv)
    const tenant = contract ? getTenantName(contract.representative_tenant_id) : ''
    return (
      inv.invoice_code.toLowerCase().includes(search.toLowerCase()) ||
      getRoomNumber(inv.room_id).toLowerCase().includes(search.toLowerCase()) ||
      tenant.toLowerCase().includes(search.toLowerCase())
    )
  })

  const selected = enriched.find(i => i.id === selectedId) ?? enriched[0]
  const selContract = selected ? getContract(selected) : null
  const selTenant   = selContract ? getTenantName(selContract.representative_tenant_id) : '—'
  const selRoom     = selected ? getRoomNumber(selected.room_id) : '—'
  const readings    = selected ? getReadings(selected) : null
  const selStatus   = selected?.displayStatus ?? 'CHUA_THANH_TOAN'
  const selS        = statusCfg[selStatus]
  const history     = selected ? (payHistory[selected.id] ?? []) : []
  const totalPaid   = selected ? selected.paid_amount + history.reduce((s, h) => s + h.amount, 0) : 0
  const remaining   = selected ? selected.total_amount - totalPaid : 0

  function handlePay() {
    if (!selected || !payAmount) return
    const amount = parseInt(payAmount.replace(/\D/g, ''), 10)
    if (isNaN(amount) || amount <= 0) return
    const now = new Date()
    const dateStr = `${String(now.getDate()).padStart(2,'0')}/${String(now.getMonth()+1).padStart(2,'0')}/${now.getFullYear()}`
    setPayHistory(prev => ({
      ...prev,
      [selected.id]: [...(prev[selected.id] ?? []), { amount, method: payMethod, date: dateStr }],
    }))
    setPayAmount('')
    setPayNote('')
  }

  return (
    <div className="flex h-full overflow-hidden gap-0 -m-6 min-h-0" style={{ height: 'calc(100vh - 60px)' }}>
      {/* ── Left panel: invoice list ── */}
      <div className="flex flex-col shrink-0 bg-white border-r border-gray-100 overflow-hidden" style={{ width: 280 }}>
        {/* Left header */}
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-sm" style={{ color: NAVY }}>Hóa đơn và thanh toán</h2>
            <p className="text-[11px] text-gray-400">Quản lý hóa đơn</p>
          </div>
          <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-500 hover:bg-gray-50 transition">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
            </svg>
            Lọc
          </button>
        </div>

        {/* Search */}
        <div className="px-3 py-2 border-b border-gray-100">
          <div className="relative">
            <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm kiếm nhanh..."
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-amber-400 bg-gray-50" />
          </div>
        </div>

        {/* Invoice list */}
        <div className="flex-1 overflow-y-auto">
          {filtered.map(inv => {
            const c = getContract(inv)
            const tenant = c ? getTenantName(c.representative_tenant_id) : '—'
            const room   = getRoomNumber(inv.room_id)
            const s      = statusCfg[inv.displayStatus]
            const isSelected = inv.id === selectedId

            return (
              <button
                key={inv.id}
                onClick={() => setSelectedId(inv.id)}
                className="w-full text-left px-4 py-3 border-b border-gray-50 transition"
                style={{ background: isSelected ? '#f0f7ff' : 'white', borderLeft: isSelected ? `3px solid ${NAVY}` : '3px solid transparent' }}
                onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = '#f9fafb' }}
                onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'white' }}
              >
                <div className="flex justify-between items-start mb-0.5">
                  <span className="text-[11px] text-gray-400">Tháng {inv.billing_month}/{inv.billing_year}</span>
                </div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-sm" style={{ color: NAVY }}>{formatVND(inv.total_amount)}</span>
                </div>
                <p className="text-xs text-gray-600 font-medium">{room} {tenant}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{inv.invoice_code} | Tạo {inv.due_date.split('-').reverse().join('/')}</p>
                <div className="mt-1.5">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold border"
                    style={{ background: s.bg, color: s.color, borderColor: s.border }}>{s.label}</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Right panel: detail ── */}
      {selected && (
        <div className="flex-1 overflow-y-auto bg-white min-w-0">
          {/* Detail header */}
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
            <div className="flex items-center gap-3 flex-wrap">
              <h3 className="font-bold text-base" style={{ color: NAVY }}>
                Hóa đơn tháng {selected.billing_month}/{selected.billing_year}
              </h3>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold border"
                style={{ background: selS.bg, color: selS.color, borderColor: selS.border }}>
                {selS.label}
              </span>
            </div>
            <button
              onClick={() => setShowExport(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-white text-xs font-semibold transition shrink-0"
              style={{ background: NAVY }}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Xuất hóa đơn
            </button>
          </div>

          <div className="px-6 py-4 space-y-5">
            {/* Tenant info */}
            <p className="text-sm text-gray-500">
              Phòng <strong className="text-gray-800">{selRoom}</strong> &nbsp;
              <strong className="text-gray-800">{selTenant}</strong> &nbsp;|&nbsp; Mã thanh toán: {selected.invoice_code}
            </p>

            {/* Utility readings */}
            <section>
              <h4 className="font-semibold text-sm mb-2" style={{ color: NAVY }}>
                Chỉ số điện nước (tổng hợp cả tháng {selected.billing_month})
              </h4>
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ background: '#f8fafc' }}>
                      {['Loại', 'Cũ', 'Mới', 'Dùng', 'Thành tiền'].map(h => (
                        <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-gray-100">
                      <td className="px-4 py-2.5 text-gray-700 font-medium">Điện (kWh)</td>
                      <td className="px-4 py-2.5 text-gray-500">{readings?.prevElec}</td>
                      <td className="px-4 py-2.5 text-gray-500">{readings?.newElec}</td>
                      <td className="px-4 py-2.5 font-semibold" style={{ color: NAVY }}>{readings?.elecKwh}</td>
                      <td className="px-4 py-2.5 font-semibold text-right" style={{ color: NAVY }}>{formatVND(selected.electricity_cost)}</td>
                    </tr>
                    <tr className="border-t border-gray-100">
                      <td className="px-4 py-2.5 text-gray-700 font-medium">Nước (m³)</td>
                      <td className="px-4 py-2.5 text-gray-500">{readings?.prevWater}</td>
                      <td className="px-4 py-2.5 text-gray-500">{readings?.newWater}</td>
                      <td className="px-4 py-2.5 font-semibold" style={{ color: NAVY }}>{readings?.waterM3}</td>
                      <td className="px-4 py-2.5 font-semibold text-right" style={{ color: NAVY }}>{formatVND(selected.water_cost)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Cost breakdown */}
            <section>
              <h4 className="font-semibold text-sm mb-2" style={{ color: NAVY }}>Chi phí</h4>
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="divide-y divide-gray-100">
                  {[
                    { label: 'Tiền phòng',               value: selected.room_price },
                    { label: 'Tiền điện',                value: selected.electricity_cost },
                    { label: 'Tiền nước',                value: selected.water_cost },
                    { label: 'Dịch vụ khác (wifi, rác...)', value: selected.other_service_cost },
                  ].map(row => (
                    <div key={row.label} className="flex justify-between items-center px-4 py-2.5">
                      <span className="text-sm text-gray-600">{row.label}</span>
                      <span className="text-sm font-medium text-gray-700">{formatVND(row.value)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center px-4 py-3" style={{ background: '#f8fafc' }}>
                    <span className="font-bold text-sm" style={{ color: NAVY }}>Tổng cộng</span>
                    <span className="font-bold text-base" style={{ color: NAVY }}>{formatVND(selected.total_amount)}</span>
                  </div>
                  <div className="flex justify-between items-center px-4 py-2.5">
                    <span className="text-sm text-gray-500">Đã trả</span>
                    <span className="text-sm font-semibold text-emerald-600">{formatVND(totalPaid)}</span>
                  </div>
                  <div className="flex justify-between items-center px-4 py-2.5">
                    <span className="text-sm font-bold text-red-500">Còn nợ</span>
                    <span className="text-base font-bold text-red-500">{formatVND(Math.max(0, remaining))}</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Payment history */}
            <section>
              <h4 className="font-semibold text-sm mb-2" style={{ color: NAVY }}>Lịch sử thanh toán</h4>
              <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
                {selected.paid_amount > 0 && (
                  <div className="flex items-center justify-between px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700">{formatVND(selected.paid_amount)} – Chuyển khoản</p>
                      <p className="text-xs text-gray-400">{selected.due_date.split('-').reverse().join('/')}</p>
                    </div>
                    <span className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">Xác nhận</span>
                  </div>
                )}
                {history.map((h, i) => (
                  <div key={i} className="flex items-center justify-between px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700">{formatVND(h.amount)} – {h.method}</p>
                      <p className="text-xs text-gray-400">{h.date}</p>
                    </div>
                    <span className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">Xác nhận</span>
                  </div>
                ))}
                {selected.paid_amount === 0 && history.length === 0 && (
                  <div className="px-4 py-4 text-sm text-gray-400 text-center">Chưa có lịch sử thanh toán</div>
                )}
              </div>
            </section>

            {/* Record new payment */}
            {remaining > 0 && (
              <section>
                <h4 className="font-semibold text-sm mb-3" style={{ color: NAVY }}>Ghi nhận thanh toán mới</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1">Số tiền thanh toán (đ)</label>
                    <input
                      type="text"
                      value={payAmount}
                      onChange={e => setPayAmount(e.target.value)}
                      placeholder={String(remaining)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-amber-400 transition"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1">Hình thức</label>
                    <select value={payMethod} onChange={e => setPayMethod(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-amber-400 transition bg-white">
                      <option>Tiền mặt</option>
                      <option>Chuyển khoản</option>
                      <option>Ví điện tử</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1">Ghi chú</label>
                    <textarea
                      value={payNote} onChange={e => setPayNote(e.target.value)}
                      placeholder="Nhập ghi chú..."
                      rows={3}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-amber-400 transition resize-none"
                    />
                  </div>
                  <button
                    onClick={handlePay}
                    className="w-full py-3 rounded-xl text-white font-semibold text-sm transition"
                    style={{ background: NAVY }}>
                    Ghi nhận thanh toán
                  </button>
                </div>
              </section>
            )}
          </div>
        </div>
      )}

      {/* Export modal */}
      {showExport && selected && (
        <ExportModal inv={selected} onClose={() => setShowExport(false)} />
      )}
    </div>
  )
}

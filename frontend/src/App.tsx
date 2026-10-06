import { useState } from 'react'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Settings from './pages/Settings'
import TenantApp from './TenantApp'

type Page = 'dashboard' | 'settings'

const NAVY = '#0d2137'
const AMBER = '#f59e0b'

const navItems: { id: Page; label: string; icon: React.ReactNode }[] = [
  {
    id: 'dashboard', label: 'Tổng quan',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>,
  },
  {
    id: 'settings', label: 'Cài đặt',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>,
  },
]

const pageTitles: Record<Page, string> = {
  dashboard: 'Tổng quan',
  settings: 'Cài đặt',
}

function LogoutModal({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: 'rgba(11,11,12,0.6)' }} onClick={onCancel}>
      <div className="bg-white flex flex-col gap-6 items-center p-8 rounded-2xl shadow-2xl w-[420px]" style={{ boxShadow: '0px 8px 12px rgba(23,43,77,0.12)' }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-center rounded-[20px] w-10 h-10" style={{ background: '#ffedec' }}>
          <img src="/assets/12139.svg" alt="" className="w-5 h-5" />
        </div>
        <div className="text-center">
          <p className="font-bold text-[18px] text-[#172b4d] mb-2">Xác nhận đăng xuất</p>
          <p className="text-[14px] text-[#4b5563]">Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?</p>
        </div>
        <div className="flex gap-3 justify-end w-full">
          <button onClick={onCancel} className="px-4 py-2.5 rounded-lg border border-[#e5e7eb] text-sm font-semibold text-[#4b5563] hover:bg-gray-50 transition">Hủy</button>
          <button onClick={onConfirm} className="px-4 py-2.5 rounded-lg text-white text-sm font-semibold transition" style={{ background: '#e53e3e' }}>Đăng xuất</button>
        </div>
      </div>
    </div>
  )
}

function ExportReportModal({ onClose }: { onClose: () => void }) {
  const [reportType, setReportType] = useState(0)
  const [fileFormat, setFileFormat] = useState<'excel' | 'pdf'>('excel')
  const [fromDate, setFromDate] = useState('01/01/2026')
  const [toDate, setToDate] = useState('30/09/2026')

  const reportTypes = [
    'Báo cáo Doanh thu & Dòng tiền',
    'Báo cáo Công nợ & Hóa đơn chưa thanh toán',
    'Báo cáo Điện nước & Mức tiêu thụ',
    'Báo cáo Tỷ lệ lấp đầy & Khách thuê',
  ]

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: 'rgba(11,11,12,0.6)' }} onClick={onClose}>
      <div className="bg-white flex flex-col gap-6 items-start p-8 rounded-2xl w-[640px]" style={{ boxShadow: '0px 8px 12px rgba(23,43,77,0.12)' }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between w-full">
          <p className="font-bold text-[18px] text-[#172b4d]">Xuất báo cáo thống kê</p>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition">
            <img src="/assets/29214.svg" alt="close" className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Report type */}
        <div className="flex flex-col gap-3 w-full">
          <p className="text-[13px] font-semibold text-[#1f2937]">Loại báo cáo muốn xuất</p>
          <div className="flex flex-col gap-2.5">
            {reportTypes.map((label, i) => (
              <label key={i} className="flex items-center gap-3 cursor-pointer">
                <div
                  className="shrink-0 w-5 h-5 rounded-full border-2 cursor-pointer flex items-center justify-center transition"
                  style={{
                    borderColor: reportType === i ? AMBER : '#e5e7eb',
                    borderWidth: reportType === i ? 6 : 2,
                    background: 'white',
                  }}
                  onClick={() => setReportType(i)}
                />
                <span
                  className="text-[14px] cursor-pointer"
                  style={{ fontWeight: reportType === i ? 600 : 400, color: '#1f2937' }}
                  onClick={() => setReportType(i)}>
                  {label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Date range */}
        <div className="flex gap-4 w-full">
          <div className="flex flex-col gap-1.5 flex-1">
            <p className="text-[13px] font-semibold text-[#1f2937]">Từ ngày</p>
            <div className="flex items-center gap-2 border border-[#e5e7eb] rounded-lg h-10 px-3">
              <input
                type="text" value={fromDate} onChange={e => setFromDate(e.target.value)}
                className="flex-1 text-[14px] text-[#1f2937] outline-none bg-transparent" />
              <img src="/assets/f9c59.svg" alt="" className="w-4 h-4 shrink-0" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5 flex-1">
            <p className="text-[13px] font-semibold text-[#1f2937]">Đến ngày</p>
            <div className="flex items-center gap-2 border border-[#e5e7eb] rounded-lg h-10 px-3">
              <input
                type="text" value={toDate} onChange={e => setToDate(e.target.value)}
                className="flex-1 text-[14px] text-[#1f2937] outline-none bg-transparent" />
              <img src="/assets/f9c59.svg" alt="" className="w-4 h-4 shrink-0" />
            </div>
          </div>
        </div>

        {/* File format */}
        <div className="flex flex-col gap-2 w-full">
          <p className="text-[13px] font-semibold text-[#1f2937]">Định dạng file xuất</p>
          <div className="flex gap-3">
            <button
              onClick={() => setFileFormat('excel')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition"
              style={{ background: fileFormat === 'excel' ? AMBER : 'white', color: fileFormat === 'excel' ? 'white' : '#4b5563', border: fileFormat === 'excel' ? 'none' : '1px solid #e5e7eb' }}>
              <img src="/assets/75865.svg" alt="" className="w-4 h-4" />
              File Excel (.xlsx)
            </button>
            <button
              onClick={() => setFileFormat('pdf')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition"
              style={{ background: fileFormat === 'pdf' ? AMBER : 'white', color: fileFormat === 'pdf' ? 'white' : '#4b5563', border: fileFormat === 'pdf' ? 'none' : '1px solid #e5e7eb' }}>
              <img src="/assets/9a94e.svg" alt="" className="w-4 h-4" />
              File PDF (.pdf)
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 justify-end w-full">
          <button onClick={onClose} className="px-4 py-2.5 rounded-lg border border-[#e5e7eb] text-sm font-semibold text-[#4b5563] hover:bg-gray-50 transition">Hủy</button>
          <button onClick={onClose} className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-white text-sm font-semibold transition" style={{ background: AMBER }}>
            <img src="/assets/b30d5.svg" alt="" className="w-3.5 h-3.5" />
            Tải báo cáo
          </button>
        </div>
      </div>
    </div>
  )
}

function Sidebar({ currentPage, onNavigate, onLogoutClick, collapsed, onToggle }: {
  currentPage: Page
  onNavigate: (p: Page) => void
  onLogoutClick: () => void
  collapsed: boolean
  onToggle: () => void
}) {

  return (
    <div
      className="flex flex-col h-full transition-all duration-300 shrink-0"
      style={{ background: NAVY, width: collapsed ? 64 : 240, minWidth: collapsed ? 64 : 240 }}>
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        {!collapsed && (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: AMBER }}>
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
            </div>
            <div>
              <div className="text-white font-bold text-sm leading-tight">QUẢN LÝ NHÀ TRỌ</div>
              <div className="text-[10px]" style={{ color: 'rgba(255,255,255,0.45)' }}>Hệ thống SaaS tối ưu</div>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto shrink-0" style={{ background: AMBER }}>
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
          </div>
        )}
        {!collapsed && (
          <button onClick={onToggle} className="transition p-1 rounded ml-1" style={{ color: 'rgba(255,255,255,0.45)' }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        )}
        {collapsed && (
          <button onClick={onToggle} className="transition p-1 rounded absolute left-14 top-4 rounded-full z-10" style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 overflow-y-auto">
        {navItems.map(item => {
          const isActive = currentPage === item.id
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              title={collapsed ? item.label : undefined}
              className="flex items-center gap-3 mx-3 py-2 px-3 text-left transition-all relative rounded-lg mb-0.5"
              style={{
                width: 'calc(100% - 24px)',
                background: isActive ? AMBER : 'transparent',
                color: isActive ? '#fff' : 'rgba(255,255,255,0.55)',
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
            >
              <span className="shrink-0 transition" style={{ color: isActive ? 'white' : 'rgba(255,255,255,0.5)' }}>
                {item.icon}
              </span>
              {!collapsed && (
                <span className="text-sm font-medium leading-tight flex-1">{item.label}</span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Bottom: user + logout */}
      <div className="border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        {!collapsed && (
          <div className="px-4 py-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ background: AMBER }}>A</div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-sm font-medium truncate">Admin</div>
              <div className="text-[11px] truncate" style={{ color: 'rgba(255,255,255,0.45)' }}>Chủ trọ</div>
            </div>
          </div>
        )}
        <button
          onClick={onLogoutClick}
          title="Đăng xuất"
          className="w-full flex items-center gap-3 px-4 py-3 transition"
          style={{ color: 'rgba(255,255,255,0.45)' }}
          onMouseEnter={e => e.currentTarget.style.color = '#f87171'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.45)'}
        >
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {!collapsed && <span className="text-sm">Đăng xuất</span>}
        </button>
      </div>
    </div>
  )
}

export default function App() {
  const [role, setRole] = useState<'admin' | 'tenant' | null>(null)
  const [currentPage, setCurrentPage] = useState<Page>('dashboard')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)

  if (!role) {
    return <Login onLogin={(r) => { setRole(r); setCurrentPage('dashboard') }} />
  }

  if (role === 'tenant') {
    return <TenantApp onLogout={() => setRole(null)} />
  }
  const pageTitle = pageTitles[currentPage]

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#f0f5fb' }}>
      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onLogoutClick={() => setShowLogoutModal(true)}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(p => !p)}
      />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 px-6 py-0 flex items-center justify-between shrink-0" style={{ height: 60 }}>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400">Hệ thống</span>
            <span className="text-gray-300">/</span>
            <span className="font-semibold" style={{ color: NAVY }}>{pageTitle}</span>
          </div>
          <div className="flex items-center gap-3">
            {/* Export report button */}
            <button
              onClick={() => setShowExportModal(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white text-xs font-semibold transition"
              style={{ background: AMBER }}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Xuất báo cáo
            </button>
            {/* User avatar */}
            <div className="flex items-center gap-2 pl-3 border-l border-gray-200 cursor-pointer" onClick={() => setCurrentPage('settings')}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: AMBER }}>A</div>
              <div className="hidden sm:block">
                <div className="text-sm font-semibold" style={{ color: NAVY }}>Admin</div>
                <div className="text-[11px] text-gray-400">Chủ trọ</div>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-auto p-6">
          {currentPage === 'dashboard'      && <Dashboard />}
          {currentPage === 'settings'       && <Settings role="admin" />}
        </main>
      </div>

      {/* Logout confirmation modal */}
      {showLogoutModal && (
        <LogoutModal
          onConfirm={() => { setRole(null); setShowLogoutModal(false) }}
          onCancel={() => setShowLogoutModal(false)}
        />
      )}

      {/* Export report modal */}
      {showExportModal && (
        <ExportReportModal onClose={() => setShowExportModal(false)} />
      )}
    </div>
  )
}

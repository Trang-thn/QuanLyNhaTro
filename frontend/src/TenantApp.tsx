import { useState } from 'react'
import TenantDashboard from './pages/TenantDashboard'
import TenantProfile from './pages/TenantProfile'
import TenantContracts from './pages/TenantContracts'
import Invoices from './pages/Invoices'
import Maintenance from './pages/Maintenance'
import Notifications from './pages/Notifications'
import Settings from './pages/Settings'

type TenantPage = 'dashboard' | 'profile' | 'contracts' | 'invoices' | 'incidents' | 'settings'

const AMBER = '#f59e0b'
const NAVY = '#0d2137'

const tenantNavItems: { id: TenantPage; label: string; icon: React.ReactNode }[] = [
  {
    id: 'dashboard', label: 'Tổng quan',
    icon: <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: 18, height: 18 }}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>,
  },
  {
    id: 'profile', label: 'Hồ sơ & Phòng ở',
    icon: <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: 18, height: 18 }}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>,
  },
  {
    id: 'contracts', label: 'Hợp đồng của tôi',
    icon: <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: 18, height: 18 }}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>,
  },
  {
    id: 'invoices', label: 'Hóa đơn & Thanh toán',
    icon: <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: 18, height: 18 }}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
    </svg>,
  },
  {
    id: 'incidents', label: 'Báo cáo sự cố',
    icon: <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: 18, height: 18 }}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>,
  },
  {
    id: 'settings', label: 'Cài đặt tài khoản',
    icon: <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: 18, height: 18 }}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>,
  },
]

const pageTitles: Record<TenantPage, string> = {
  dashboard: 'Tổng quan',
  profile: 'Hồ sơ & Phòng ở',
  contracts: 'Hợp đồng của tôi',
  invoices: 'Hóa đơn & Thanh toán',
  incidents: 'Báo cáo sự cố',
  settings: 'Cài đặt tài khoản',
}

interface Props { onLogout: () => void }

export default function TenantApp({ onLogout }: Props) {
  const [currentPage, setCurrentPage] = useState<TenantPage>('dashboard')
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  const pageTitle = pageTitles[currentPage]

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#fdf6f0' }}>
      {/* Tenant sidebar */}
      <div className="flex flex-col h-full shrink-0" style={{ background: NAVY, width: 220 }}>
        {/* Logo */}
        <div className="px-4 py-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: AMBER }}>
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
            </div>
            <div>
              <div className="text-white font-bold text-xs leading-tight tracking-wide">LANDLORD SAAS</div>
              <div className="text-[10px]" style={{ color: 'rgba(255,255,255,0.45)' }}>Cổng thông tin Khách thuê</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 overflow-y-auto">
          {tenantNavItems.map(item => {
            const isActive = currentPage === item.id
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className="w-full flex items-center gap-3 mx-3 py-2 px-3 text-left transition-all rounded-lg mb-0.5"
                style={{
                  width: 'calc(100% - 24px)',
                  background: isActive ? AMBER : 'transparent',
                  color: isActive ? 'white' : 'rgba(255,255,255,0.55)',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
              >
                <span className="shrink-0" style={{ color: isActive ? 'white' : 'rgba(255,255,255,0.5)' }}>
                  {item.icon}
                </span>
                <span className="text-[13px] font-medium leading-tight">{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* User + logout */}
        <div className="border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <div className="px-4 py-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ background: AMBER }}>N</div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-[13px] font-medium truncate">Nguyễn Văn A</div>
              <div className="text-[11px] truncate" style={{ color: 'rgba(255,255,255,0.45)' }}>Phòng P101</div>
            </div>
          </div>
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center gap-3 px-4 py-3 transition text-left"
            style={{ color: 'rgba(255,255,255,0.45)' }}
            onMouseEnter={e => e.currentTarget.style.color = '#f87171'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.45)'}
          >
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="text-sm">Đăng xuất</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-100 px-6 flex items-center justify-between shrink-0" style={{ height: 60 }}>
          <div className="flex items-center gap-2 text-sm">
            {currentPage !== 'dashboard' && (
              <>
                <button onClick={() => setCurrentPage('dashboard')} className="text-gray-400 hover:text-gray-600 transition">Tổng quan</button>
                <span className="text-gray-300">/</span>
              </>
            )}
            <span className="font-semibold" style={{ color: NAVY }}>{pageTitle}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input placeholder="Tìm kiếm..." className="pl-9 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400 w-44 bg-gray-50" />
            </div>
            <button className="relative p-2 rounded-lg hover:bg-gray-100 transition">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 text-white text-[9px] font-bold rounded-full flex items-center justify-center" style={{ background: '#e53e3e' }}>1</span>
            </button>
            <div className="flex items-center gap-2 pl-3 border-l border-gray-200 cursor-pointer" onClick={() => setCurrentPage('settings')}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: AMBER }}>N</div>
              <div className="hidden sm:block">
                <div className="text-sm font-semibold" style={{ color: NAVY }}>Nguyễn Văn A</div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          {currentPage === 'dashboard' && <TenantDashboard linked={true} />}
          {currentPage === 'profile'   && <TenantProfile />}
          {currentPage === 'contracts' && <TenantContracts />}
          {currentPage === 'invoices'  && <Invoices />}
          {currentPage === 'incidents' && <Maintenance />}
          {currentPage === 'settings'  && <Settings />}
        </main>
      </div>

      {/* Logout modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: 'rgba(11,11,12,0.6)' }} onClick={() => setShowLogoutModal(false)}>
          <div className="bg-white flex flex-col gap-6 items-center p-8 rounded-2xl w-[420px]" style={{ boxShadow: '0px 8px 12px rgba(23,43,77,0.12)' }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-center rounded-[20px] w-10 h-10" style={{ background: '#ffedec' }}>
              <img src="/assets/12139.svg" alt="" className="w-5 h-5" />
            </div>
            <div className="text-center">
              <p className="font-bold text-[18px] text-[#172b4d] mb-2">Xác nhận đăng xuất</p>
              <p className="text-[14px] text-[#4b5563]">Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?</p>
            </div>
            <div className="flex gap-3 justify-end w-full">
              <button onClick={() => setShowLogoutModal(false)} className="px-4 py-2.5 rounded-lg border border-[#e5e7eb] text-sm font-semibold text-[#4b5563]">Hủy</button>
              <button onClick={onLogout} className="px-4 py-2.5 rounded-lg text-white text-sm font-semibold" style={{ background: '#e53e3e' }}>Đăng xuất</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

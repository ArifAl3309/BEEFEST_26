'use client'

import { useState } from 'react'
import { Zap, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Swirling } from '@/components/ui/swirling'
import LoadingOverlay from '@/components/ui/LoadingOverlay'

interface NavbarProps {
  tenantName: string
  userFullName: string
  isConnected: boolean
}

export default function Navbar({ isConnected }: NavbarProps) {
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async () => {
    if (loggingOut) return
    setLoggingOut(true)

    try {
      // 1. Bersihkan session auth di browser client
      const supabase = createClient()
      await supabase.auth.signOut()

      // 2. Bersihkan cookie auth di server route
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch {
      // ignore
    } finally {
      // 3. Force full browser hard-redirect ke halaman login & bersihkan cache
      window.location.href = '/login'
    }
  }

  return (
    <header className="sticky top-0 z-50 h-16 border-b border-slate-800/80 bg-[#080C16]/95 backdrop-blur-xl px-3 sm:px-7 flex items-center justify-between gap-2">
      {/* Brand: Logo & Title */}
      <div className="flex items-center gap-2 sm:gap-3.5 flex-shrink-0">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center shadow-inner flex-shrink-0">
          <Zap size={18} className="text-sky-400 sm:w-5 sm:h-5" />
        </div>
        <span className="font-black text-lg sm:text-2xl tracking-[0.16em] sm:tracking-[0.2em] text-white leading-none flex items-center select-none">
          SPECTRA
        </span>
      </div>

      {/* Right Controls: Telemetry Live Status + Alert Bell + Logout Button */}
      <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
        {/* Live Indicator Chip */}
        <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-slate-900 border border-slate-800 shadow-inner flex-shrink-0">
          <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full flex-shrink-0 ${isConnected ? 'bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse-live' : 'bg-red-500'}`} />
          <span className="text-[10px] sm:text-xs font-bold text-slate-200 tracking-wide whitespace-nowrap">
            {isConnected ? 'Live' : 'Offline'}
          </span>
        </div>

        {/* Device Alert Bell Toggle */}
        <button
          type="button"
          onClick={async () => {
            const { deviceNotification } = await import('@/lib/deviceNotification')
            const granted = await deviceNotification.requestPermission()
            if (granted) {
              deviceNotification.notify('🔔 SPECTRA Device Alert Aktif', {
                body: 'Sistem notifikasi OS telah terhubung untuk panel Waspada & Bahaya.',
                status: 'warning',
              })
            }
          }}
          title="Aktifkan Notifikasi Sistem Laptop / HP"
          className="flex items-center justify-center p-1.5 sm:px-3 sm:py-1.5 rounded-xl text-xs font-bold text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-all duration-200 whitespace-nowrap flex-shrink-0"
        >
          <span className="text-xs sm:text-[13px]">🔔</span>
          <span className="hidden sm:inline ml-1.5">Notif Device</span>
        </button>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          title="Keluar dari sesi"
          className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-xl text-xs font-bold text-slate-300 hover:text-red-400 hover:bg-red-500/10 border border-slate-800/80 hover:border-red-500/30 transition-all duration-200 disabled:opacity-50 flex-shrink-0"
        >
          {loggingOut ? (
            <Swirling className="w-3.5 h-3.5 text-red-400" duration="1s" />
          ) : (
            <LogOut size={13} className="sm:w-3.5 sm:h-3.5" />
          )}
          <span className="text-[11px] sm:text-xs">{loggingOut ? 'Keluar...' : 'Keluar'}</span>
        </button>
      </div>

      {/* Logout Fullscreen Overlay */}
      <LoadingOverlay
        show={loggingOut}
        message="Menutup Sesi Aman..."
        subMessage="Membersihkan token dan mengarahkan kembali ke Gateway..."
      />
    </header>
  )
}

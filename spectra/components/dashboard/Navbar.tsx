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
    <header className="sticky top-0 z-50 h-16 border-b border-slate-800/80 bg-[#080C16]/95 backdrop-blur-xl px-4 sm:px-7 flex items-center justify-between gap-2">
      {/* Brand: Logo & Title */}
      <div className="flex items-center gap-2.5 sm:gap-3.5">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center shadow-inner flex-shrink-0">
          <Zap size={20} className="text-sky-400" />
        </div>
        <span className="font-black text-xl sm:text-2xl tracking-[0.18em] sm:tracking-[0.2em] text-white leading-none flex items-center select-none">
          SPECTRA
        </span>
      </div>

      {/* Right Controls: Telemetry Live Status + Logout Button */}
      <div className="flex items-center gap-2 sm:gap-3.5">
        {/* Live Indicator Chip */}
        <div className="flex items-center gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 shadow-inner">
          <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400 shadow-[0_0_10px_#34d399] animate-pulse-live' : 'bg-red-500'}`} />
          <span className="text-[11px] sm:text-xs font-bold text-slate-200 tracking-wide whitespace-nowrap">
            {isConnected ? 'Telemetry Live' : 'Offline'}
          </span>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-300 hover:text-red-400 hover:bg-red-500/10 border border-slate-800/80 hover:border-red-500/30 transition-all duration-200 disabled:opacity-50"
        >
          {loggingOut ? (
            <Swirling className="w-4 h-4 text-red-400" duration="1s" />
          ) : (
            <LogOut size={15} />
          )}
          <span>{loggingOut ? 'Keluar...' : 'Keluar'}</span>
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

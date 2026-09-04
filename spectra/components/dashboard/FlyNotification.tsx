'use client'

import { useEffect } from 'react'
import { AlertTriangle, ShieldAlert, X } from 'lucide-react'
import { deviceNotification } from '@/lib/deviceNotification'

export interface FlyAlertData {
  id: string
  panelId?: string
  panelName: string
  locationLabel: string
  status: 'warning' | 'danger'
  message: string
  time: string
}

interface FlyNotificationProps {
  alert: FlyAlertData | null
  onDismiss: () => void
  onOpenPanel?: (panelId: string) => void
}

export default function FlyNotification({ alert, onDismiss, onOpenPanel }: FlyNotificationProps) {
  // Pemicu Native OS Notification & Sound saat ada Alert baru
  useEffect(() => {
    if (alert) {
      const title = alert.status === 'danger'
        ? `🚨 BAHAYA KELISTRIKAN: ${alert.panelName}`
        : `⚠️ PERINGATAN BEBAN: ${alert.panelName}`
      
      deviceNotification.notify(title, {
        body: `${alert.locationLabel ? `[${alert.locationLabel}] ` : ''}${alert.message}`,
        status: alert.status,
        panelId: alert.panelId,
      })
    }
  }, [alert])

  if (!alert) return null

  const isDanger = alert.status === 'danger'

  const handleClick = () => {
    if (alert.panelId && onOpenPanel) {
      onOpenPanel(alert.panelId)
    }
  }

  return (
    <div
      key={alert.id}
      className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 pointer-events-auto max-w-[520px] w-[92vw] pb-5 animate-in fade-in slide-in-from-bottom-6 duration-300 ease-out"
    >
      <div
        onClick={handleClick}
        role="button"
        tabIndex={0}
        title="Klik untuk langsung membuka titik dan spesifikasi deteksi panel ini"
        className={`group p-3.5 sm:p-4 rounded-[22px] backdrop-blur-2xl border shadow-2xl flex items-center justify-between gap-3.5 transition-all duration-300 cursor-pointer select-none hover:scale-[1.01] active:scale-[0.99] ${
          isDanger
            ? 'bg-[#18080C]/95 border-red-500/70 hover:border-red-400 shadow-[0_10px_35px_rgba(239,68,68,0.35)] text-white ring-1 ring-red-500/30'
            : 'bg-[#1A1208]/95 border-amber-500/70 hover:border-amber-400 shadow-[0_10px_35px_rgba(245,158,11,0.28)] text-white ring-1 ring-amber-500/30'
        }`}
      >
        {/* Left Icon Badge */}
        <div
          className={`p-2.5 rounded-2xl border flex-shrink-0 transition-colors duration-300 ${
            isDanger
              ? 'bg-red-500/20 border-red-500/50 text-red-400 animate-pulse'
              : 'bg-amber-500/20 border-amber-500/50 text-amber-400'
          }`}
        >
          {isDanger ? <ShieldAlert size={22} /> : <AlertTriangle size={22} />}
        </div>

        {/* Message Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                isDanger
                  ? 'bg-red-500 text-white shadow-sm shadow-red-500/40'
                  : 'bg-amber-500 text-slate-950 font-extrabold'
              }`}
            >
              {isDanger ? 'STATUS BAHAYA / ANOMALI' : 'STATUS WASPADA BEBAN'}
            </span>
            <span className="text-xs text-slate-400 font-mono font-medium">{alert.time}</span>
          </div>

          <div className="flex items-baseline gap-2">
            <h4 className="text-sm font-black text-white tracking-tight truncate group-hover:text-sky-300 transition-colors">
              {alert.panelName}
            </h4>
            <span className="text-[11px] text-sky-400 font-bold opacity-80 group-hover:opacity-100 flex-shrink-0">
              Lihat Detail →
            </span>
          </div>

          <p className="text-xs text-slate-300 font-medium leading-relaxed truncate mt-0.5">
            {alert.message}
          </p>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onDismiss()
          }}
          title="Tutup notifikasi"
          className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors flex-shrink-0"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}

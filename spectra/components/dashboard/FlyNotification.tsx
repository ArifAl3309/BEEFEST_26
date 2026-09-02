'use client'

import { AlertTriangle, ShieldAlert, X } from 'lucide-react'

export interface FlyAlertData {
  id: string
  panelName: string
  locationLabel: string
  status: 'warning' | 'danger'
  message: string
  time: string
}

interface FlyNotificationProps {
  alert: FlyAlertData | null
  onDismiss: () => void
}

export default function FlyNotification({ alert, onDismiss }: FlyNotificationProps) {
  if (!alert) return null

  const isDanger = alert.status === 'danger'

  return (
    <div
      key={alert.id}
      className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 pointer-events-auto max-w-[560px] w-[92vw] pb-6 animate-in fade-in slide-in-from-bottom-8 duration-500 ease-out transition-all"
    >
      <div
        className={`p-4 sm:p-5 rounded-3xl backdrop-blur-2xl border shadow-2xl flex items-center justify-between gap-4 transition-all duration-500 ease-out ${
          isDanger
            ? 'bg-[#18080C]/95 border-red-500/70 shadow-[0_10px_40px_rgba(239,68,68,0.35)] text-white ring-1 ring-red-500/30'
            : 'bg-[#1A1208]/95 border-amber-500/70 shadow-[0_10px_40px_rgba(245,158,11,0.3)] text-white ring-1 ring-amber-500/30'
        }`}
      >
        {/* Left Icon Badge with Smooth Pulse */}
        <div
          className={`p-3 rounded-2xl border flex-shrink-0 transition-colors duration-500 ${
            isDanger
              ? 'bg-red-500/20 border-red-500/50 text-red-400 animate-pulse'
              : 'bg-amber-500/20 border-amber-500/50 text-amber-400'
          }`}
        >
          {isDanger ? <ShieldAlert size={24} /> : <AlertTriangle size={24} />}
        </div>

        {/* Message Content */}
        <div className="min-w-0 flex-1 transition-all duration-300">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full transition-colors duration-500 ${
                isDanger
                  ? 'bg-red-500 text-white shadow-sm shadow-red-500/50'
                  : 'bg-amber-500 text-slate-950 font-extrabold'
              }`}
            >
              {isDanger ? 'STATUS BAHAYA / ANOMALI' : 'STATUS WASPADA BEBAN'}
            </span>
            <span className="text-xs text-slate-400 font-mono font-semibold">{alert.time}</span>
          </div>

          <h4 className="text-sm font-black text-white tracking-tight truncate">
            {alert.panelName}
          </h4>
          <p className="text-xs text-slate-300 font-medium leading-relaxed mt-0.5">
            {alert.message}
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={onDismiss}
          className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors flex-shrink-0"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  )
}

'use client'

import { PanelStatus } from '@/lib/types'

export default function StatusBadge({ status }: { status: PanelStatus }) {
  const map = {
    normal: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 shadow-emerald-500/10',
    warning: 'bg-amber-500/15 text-amber-300 border-amber-500/40 shadow-amber-500/10',
    danger: 'bg-red-500/25 text-red-300 border-red-500/50 shadow-red-500/20 animate-pulse',
  }
  const label = { normal: 'NORMAL', warning: 'WASPADA', danger: 'BAHAYA KRITIS' }

  return (
    <span
      className={`inline-flex items-center justify-center px-3.5 py-1.5 min-w-[100px] text-center text-xs font-black uppercase tracking-wider border rounded-xl shadow-md transition-all ${map[status]}`}
    >
      {label[status]}
    </span>
  )
}

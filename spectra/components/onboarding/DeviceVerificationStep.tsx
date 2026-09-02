'use client'

import { Cpu, CheckCircle2 } from 'lucide-react'

export default function DeviceVerificationStep() {
  return (
    <div className="flex flex-col gap-4 py-2">
      <div className="p-4 rounded-xl bg-[--bg-elevated] border border-[--border] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-[--cyan-glow] text-[--cyan]">
            <Cpu size={22} />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Modul Kontrol ESP32-S3</h4>
            <p className="text-xs text-[--text-muted]">Edge Processing Unit (FFT Arc Detection)</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs text-[--status-normal] font-semibold">
          <CheckCircle2 size={16} />
          <span>Siap Dihubungkan</span>
        </div>
      </div>
      <p className="text-xs text-[--text-secondary]">
        Setelah proses ini selesai, panel distribusi dapat dipetakan langsung pada denah digital interaktif di Command Center.
      </p>
    </div>
  )
}

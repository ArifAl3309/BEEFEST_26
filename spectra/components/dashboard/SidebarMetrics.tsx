'use client'

import { useState } from 'react'
import { PanelWithReading } from '@/lib/types'
import { fmt, formatTimestamp } from '@/lib/utils'
import StatusBadge from '@/components/ui/StatusBadge'
import MetricCard from './MetricCard'
import PlnEmergencyModal from './PlnEmergencyModal'
import AddToolModal from './AddToolModal'
import { ShieldAlert, CheckCircle2, ArrowLeft, Plus, MapPin, Trash2 } from 'lucide-react'

interface SidebarMetricsProps {
  panel: PanelWithReading | null
  panels: PanelWithReading[]
  selectedPanelId: string | null
  onSelectPanel: (id: string | null) => void
  onDeletePanel: (id: string) => void
  onRefreshPanels: () => void
}

export default function SidebarMetrics({
  panel,
  panels,
  selectedPanelId,
  onSelectPanel,
  onDeletePanel,
  onRefreshPanels,
}: SidebarMetricsProps) {
  const [plnModalOpen, setPlnModalOpen] = useState(false)
  const [addModalOpen, setAddModalOpen] = useState(false)

  const getStatusCircle = (status?: string, arcDetected?: boolean) => {
    if (arcDetected || status === 'danger') {
      return (
        <div className="w-8 h-8 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center flex-shrink-0 shadow-[0_0_12px_rgba(239,68,68,0.6)]">
          <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
        </div>
      )
    }
    if (status === 'warning') {
      return (
        <div className="w-8 h-8 rounded-full bg-amber-500/20 border-2 border-amber-500 flex items-center justify-center flex-shrink-0 shadow-[0_0_12px_rgba(245,158,11,0.5)]">
          <span className="w-3 h-3 rounded-full bg-amber-400" />
        </div>
      )
    }
    if (status === 'normal') {
      return (
        <div className="w-8 h-8 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center flex-shrink-0 shadow-[0_0_12px_rgba(16,185,129,0.5)]">
          <span className="w-3 h-3 rounded-full bg-emerald-400" />
        </div>
      )
    }
    return (
      <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-600 flex items-center justify-center flex-shrink-0">
        <span className="w-3 h-3 rounded-full bg-slate-500" />
      </div>
    )
  }

  return (
    <div className="w-full lg:w-[380px] flex-shrink-0 border-t lg:border-t-0 lg:border-l border-slate-800/80 bg-[#090D17]/95 flex flex-col min-h-[480px] lg:h-full overflow-hidden">
      {/* ─────────────────────────────────────────────────────────────
          VIEW A: DETAIL TELEMETRI PANEL (Ketika ada titik yang dipilih)
          ───────────────────────────────────────────────────────────── */}
      {panel ? (
        <div className="flex-1 flex flex-col h-full overflow-y-auto p-6 sm:p-7 gap-5 animate-in fade-in duration-200">
          {/* Back button & Header */}
          <div className="flex items-start justify-between border-b border-slate-800/80 pb-4 gap-3">
            <div className="min-w-0 flex-1">
              <button
                onClick={() => onSelectPanel(null)}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors mb-2 group"
              >
                <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-1" />
                <span>Kembali ke Daftar Titik</span>
              </button>
              <h2 className="text-xl font-black text-white tracking-tight leading-tight truncate">{panel.name}</h2>
              <p className="text-xs text-slate-400 font-medium mt-1 leading-normal truncate">{panel.location_label || 'Lokasi Belum Ditentukan'}</p>
            </div>
            <div className="flex-shrink-0 pt-1">
              <StatusBadge status={panel.latest_reading?.status || 'normal'} />
            </div>
          </div>

          {/* Emergency PLN Dispatch Alert */}
          {panel.latest_reading?.status === 'danger' && (
            <button
              onClick={() => setPlnModalOpen(true)}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 text-white text-xs font-black tracking-wide flex items-center justify-center gap-2 hover:opacity-95 shadow-lg shadow-red-500/25 transition-all animate-pulse"
            >
              <ShieldAlert size={18} />
              <span>BANTUAN DARURAT POSKO PLN</span>
            </button>
          )}

          {/* Metric Cards List */}
          <div className="flex flex-col gap-2.5">
            <MetricCard label="Tegangan Fase" value={fmt(panel.latest_reading?.voltage)} unit="V" icon="zap" />
            <MetricCard
              label="Arus Beban"
              value={fmt(panel.latest_reading?.current_a)}
              unit="A"
              icon="activity"
              isDanger={panel.latest_reading?.status === 'danger'}
            />
            <MetricCard label="Konsumsi Daya" value={fmt(panel.latest_reading?.power)} unit="W" icon="cpu" />
            <MetricCard
              label="Suhu Busbar / Panel"
              value={fmt(panel.latest_reading?.temperature_panel)}
              unit="°C"
              icon="temp"
              isDanger={(panel.latest_reading?.temperature_panel || 0) > 60}
            />
            <MetricCard label="Suhu Sekitar (Ambient)" value={fmt(panel.latest_reading?.temperature_ambient)} unit="°C" icon="temp" />
            <MetricCard label="Frekuensi Listrik" value={fmt(panel.latest_reading?.frequency)} unit="Hz" icon="freq" />
          </div>

          {/* Action: Hapus Panel Button */}
          <button
            type="button"
            onClick={() => onDeletePanel(panel.id)}
            className="w-full py-3 px-4 rounded-2xl bg-red-600/15 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30 text-xs font-black tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-md shadow-red-500/10"
          >
            <Trash2 size={16} />
            <span>Hapus Titik Panel Ini</span>
          </button>

          {/* Edge Status & Sync */}
          <div className="mt-auto pt-4 border-t border-slate-800/80 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Analisis Edge FFT:</span>
              <span className={`font-bold flex items-center gap-1.5 ${panel.latest_reading?.arc_detected ? 'text-red-400' : 'text-emerald-400'}`}>
                <CheckCircle2 size={15} />
                {panel.latest_reading?.arc_detected ? 'Arc Terdeteksi' : 'Bebas Anomali'}
              </span>
            </div>
            <div className="text-xs text-slate-500 text-center font-mono font-medium tracking-tight">
              Sinkronisasi: {formatTimestamp(panel.latest_reading?.created_at || '')}
            </div>
          </div>
        </div>
      ) : (
        /* ─────────────────────────────────────────────────────────────
           VIEW B: DAFTAR DISPLAY CARD TITIK PANEL & TOMBOL ADD TOOLS
           ───────────────────────────────────────────────────────────── */
        <div className="flex-1 flex flex-col h-full overflow-hidden p-6 sm:p-7 gap-4 animate-in fade-in duration-200">
          {/* Header Title */}
          <div className="border-b border-slate-800/80 pb-3.5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-white tracking-tight">Daftar Titik Panel</h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5">{panels.length} Modul Terhubung</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-xs font-black tracking-wide text-sky-400">
              Live Hub
            </span>
          </div>

          {/* Scrollable List of Panel Display Cards */}
          <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1">
            {panels.map((p) => {
              const r = p.latest_reading
              const isSelected = p.id === selectedPanelId

              return (
                <div
                  key={p.id}
                  onClick={() => onSelectPanel(p.id)}
                  className={`group relative p-4 rounded-2xl bg-[#0F1626]/90 border transition-all duration-200 cursor-pointer flex items-center justify-between gap-3.5 ${
                    isSelected
                      ? 'border-blue-500 bg-[#131E35] shadow-lg shadow-blue-500/15'
                      : 'border-slate-800/80 hover:border-slate-700 hover:bg-[#131B2E]'
                  }`}
                >
                  {/* Left: Status Circle Ring + Info */}
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    {getStatusCircle(r?.status, r?.arc_detected)}
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-black text-white tracking-tight truncate group-hover:text-sky-300 transition-colors leading-snug">
                        {p.name}
                      </h4>
                      <p className="text-xs text-slate-400 font-medium truncate mt-0.5 leading-normal">
                        {p.location_label || 'Gedung Sekolah'}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-300 font-mono font-bold">
                        <span>{fmt(r?.voltage, 'V')}</span>
                        <span className="text-slate-600">•</span>
                        <span>{fmt(r?.current_a, 'A')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        onDeletePanel(p.id)
                      }}
                      title="Hapus Titik"
                      className="p-2 rounded-xl bg-red-500/15 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30 transition-all opacity-0 group-hover:opacity-100 shadow-sm"
                    >
                      <Trash2 size={15} />
                    </button>

                    <div className="p-2 rounded-xl bg-blue-500/10 text-sky-400 opacity-80 group-hover:opacity-100 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <MapPin size={16} />
                    </div>
                  </div>
                </div>
              )
            })}

            {panels.length === 0 && (
              <div className="py-12 text-center text-xs text-slate-500 font-medium">
                Belum ada titik panel listrik yang terpasang.
              </div>
            )}
          </div>

          {/* Bottom Fixed Action: Add Tools Button */}
          <div className="pt-3 border-t border-slate-800/80">
            <button
              onClick={() => setAddModalOpen(true)}
              className="w-full h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white text-xs font-black tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
            >
              <Plus size={19} />
              <span>Tambah Alat Baru</span>
            </button>
          </div>
        </div>
      )}

      {/* Emergency PLN Modal */}
      {panel && (
        <PlnEmergencyModal
          isOpen={plnModalOpen}
          onClose={() => setPlnModalOpen(false)}
          panel={panel}
        />
      )}

      {/* Add Tool Modal */}
      <AddToolModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onToolAdded={onRefreshPanels}
      />
    </div>
  )
}

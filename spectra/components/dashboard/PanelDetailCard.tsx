'use client'

import { useState, useRef, useEffect } from 'react'
import { Zap, Activity, Thermometer, ShieldAlert, ShieldCheck, X, GripHorizontal, Trash2 } from 'lucide-react'
import { PanelWithReading } from '@/lib/types'
import { fmt } from '@/lib/utils'

interface PanelDetailCardProps {
  panel: PanelWithReading
  onClose: () => void
  onDeletePanel?: (id: string) => void
  onDiscoverMore?: () => void
}

export default function PanelDetailCard({
  panel,
  onClose,
  onDeletePanel,
  onDiscoverMore,
}: PanelDetailCardProps) {
  const r = panel.latest_reading
  const isDanger = r?.status === 'danger'
  const isWarning = r?.status === 'warning'

  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const dragStartRef = useRef({ x: 0, y: 0, startOffset: { x: 0, y: 0 } })

  useEffect(() => {
    setOffset({ x: 0, y: 0 })
  }, [panel.id])

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsDragging(true)
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      startOffset: { ...offset },
    }
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return
      const dx = e.clientX - dragStartRef.current.x
      const dy = e.clientY - dragStartRef.current.y
      setOffset({
        x: dragStartRef.current.startOffset.x + dx,
        y: dragStartRef.current.startOffset.y + dy,
      })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging])

  const getStatusColor = () => {
    if (isDanger) return 'text-red-500 bg-red-500/10 border-red-500/20'
    if (isWarning) return 'text-amber-500 bg-amber-500/10 border-amber-500/20'
    return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
  }

  return (
    <div
      className="absolute z-40 w-72 bg-white text-slate-900 rounded-[26px] p-5 shadow-2xl transition-shadow pointer-events-auto border border-slate-100/90 select-none animate-in fade-in zoom-in-95 duration-200"
      style={{
        left: `${panel.floor_x > 60 ? panel.floor_x - 26 : panel.floor_x + 3}%`,
        top: `${panel.floor_y > 65 ? panel.floor_y - 36 : panel.floor_y - 6}%`,
        transform: `translate(${offset.x}px, ${offset.y}px)`,
        cursor: isDragging ? 'grabbing' : 'default',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Draggable Top Grip Bar */}
      <div
        onMouseDown={handleMouseDown}
        className="w-full h-5 -mt-2.5 -mb-1 flex items-center justify-center cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 transition-colors"
        title="Tahan dan geser untuk memindahkan posisi kartu"
      >
        <GripHorizontal size={18} />
      </div>

      {/* Top Controls: Status Icon + Actions */}
      <div className="flex items-center justify-between mb-3 mt-1">
        <div className={`p-2.5 rounded-2xl border ${getStatusColor()} flex items-center justify-center`}>
          {isDanger ? (
            <ShieldAlert size={19} className="text-red-600 animate-pulse" />
          ) : (
            <ShieldCheck size={19} className="text-slate-800" />
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {/* Tombol Hapus Titik */}
          <button
            type="button"
            onClick={() => {
              if (onDeletePanel) onDeletePanel(panel.id)
            }}
            title="Hapus Titik Panel Ini"
            className="p-2 rounded-full bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 transition-all border border-red-200 shadow-sm"
          >
            <Trash2 size={16} />
          </button>

          {/* Tombol Tutup */}
          <button
            type="button"
            onClick={onClose}
            title="Tutup Card"
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Header: Nama Gedung / Titik Panel */}
      <div className="mb-3">
        <h3 className="text-base font-extrabold text-slate-900 tracking-tight leading-snug">
          {panel.name}
        </h3>
        <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
          {panel.location_label || 'Lokasi Belum Ditentukan'}
        </p>
      </div>

      {/* Telemetry Information List */}
      <div className="flex flex-col gap-2 py-2.5 border-t border-b border-slate-100 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-slate-500 font-semibold text-[11px]">
            <Zap size={13} className="text-blue-600" />
            <span>Tegangan</span>
          </div>
          <span className="font-extrabold text-slate-800 font-mono text-xs">{fmt(r?.voltage, 'V')}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-slate-500 font-semibold text-[11px]">
            <Activity size={13} className="text-cyan-600" />
            <span>Arus Beban</span>
          </div>
          <span className="font-extrabold text-slate-800 font-mono text-xs">{fmt(r?.current_a, 'A')}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-slate-500 font-semibold text-[11px]">
            <Thermometer size={13} className="text-amber-500" />
            <span>Suhu Panel</span>
          </div>
          <span className={`font-extrabold font-mono text-xs ${(r?.temperature_panel || 0) > 60 ? 'text-red-600' : 'text-slate-800'}`}>
            {fmt(r?.temperature_panel, '°C')}
          </span>
        </div>
      </div>

      {/* Action CTA: Discover More (Masuk ke halaman analitik detail) */}
      <div className="mt-3.5 flex items-center justify-between">
        <button
          onClick={onDiscoverMore}
          className="text-[11px] font-black uppercase tracking-wider text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1.5 group"
        >
          <span>DISCOVER MORE</span>
          <span className="text-sm font-bold transition-transform group-hover:translate-x-1">→</span>
        </button>
      </div>
    </div>
  )
}

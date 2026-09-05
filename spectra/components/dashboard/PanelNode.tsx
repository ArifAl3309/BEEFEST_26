'use client'

import { PanelWithReading } from '@/lib/types'

interface PanelNodeProps {
  panel: PanelWithReading
  isSelected: boolean
  isDragMode?: boolean
  onSelect: () => void
  onToggleDragMode?: () => void
  onPositionChange?: (x: number, y: number) => void
}

export default function PanelNode({
  panel,
  isSelected,
  isDragMode = false,
  onSelect,
  onToggleDragMode,
  onPositionChange,
}: PanelNodeProps) {
  const status = panel.latest_reading?.status || 'normal'

  const colorMap = {
    normal: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
  }

  // HTML5 Drag Event Handlers
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('panelId', panel.id)
  }

  // Pointer / Touch Dragging Handler untuk Mode Drag (Bekerja lancar di desktop & HP)
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!isDragMode) return
    e.stopPropagation()

    const target = e.currentTarget as HTMLElement
    const container = target.closest('[data-transform-layer="true"]') as HTMLElement
    if (!container) return

    target.setPointerCapture(e.pointerId)

    const onPointerMove = (moveEvt: PointerEvent) => {
      const rect = container.getBoundingClientRect()
      const relX = (moveEvt.clientX - rect.left) / rect.width
      const relY = (moveEvt.clientY - rect.top) / rect.height
      const newX = Math.round(Math.max(2, Math.min(98, relX * 100)) * 10) / 10
      const newY = Math.round(Math.max(2, Math.min(98, relY * 100)) * 10) / 10
      if (onPositionChange) {
        onPositionChange(newX, newY)
      }
    }

    const onPointerUp = (upEvt: PointerEvent) => {
      target.releasePointerCapture(upEvt.pointerId)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
    }

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
  }

  return (
    <div
      data-panel-node="true"
      draggable
      onDragStart={handleDragStart}
      onPointerDown={handlePointerDown}
      onClick={(e) => {
        e.stopPropagation()
        onSelect()
      }}
      onDoubleClick={(e) => {
        e.stopPropagation()
        if (onToggleDragMode) {
          onToggleDragMode()
        }
      }}
      title={
        isDragMode
          ? `[MODE GESER AKTIF] Klik & geser titik ke posisi baru di denah. Double-click untuk mengunci posisi.`
          : `${panel.name} (${panel.location_label || 'Tanpa Label'})\n• Klik 1x: Buka detail metrik\n• Double-click (2x): Masuk mode geser/pindah posisi`
      }
      style={{
        position: 'absolute',
        left: `${panel.floor_x}%`,
        top: `${panel.floor_y}%`,
        transform: `translate(-50%, -50%) ${isDragMode ? 'scale(1.4)' : isSelected ? 'scale(1.25)' : 'scale(1)'}`,
        touchAction: isDragMode ? 'none' : 'auto',
      }}
      className={`group p-2 rounded-full transition-all duration-200 select-none ${
        isDragMode
          ? 'z-40 cursor-move ring-4 ring-cyan-400 ring-offset-2 ring-offset-slate-950 animate-bounce'
          : isSelected
          ? 'z-30 cursor-pointer'
          : 'hover:scale-115 z-20 cursor-pointer'
      }`}
    >
      {/* Visual Indicator Ring with glow */}
      <div
        className={`w-7 h-7 rounded-full border-2 border-white flex items-center justify-center shadow-lg transition-all duration-300 ${
          status === 'danger' ? 'animate-pulse-danger' : ''
        }`}
        style={{
          backgroundColor: colorMap[status],
          boxShadow: isDragMode
            ? `0 0 30px #38bdf8, 0 0 0 4px #38bdf8`
            : isSelected
            ? `0 0 24px ${colorMap[status]}, 0 0 0 4px rgba(255,255,255,0.35)`
            : `0 0 14px ${colorMap[status]}`,
        }}
      >
        <span className="w-2 h-2 rounded-full bg-white transition-transform duration-300" />
      </div>

      {/* Mode Geser Floating Badge */}
      {isDragMode ? (
        <div className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap bg-cyan-500 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded-full shadow-lg pointer-events-none uppercase tracking-wider animate-pulse">
          Geser Posisi
        </div>
      ) : (
        /* Floating Tag Label Name */
        <div className="absolute top-9 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-950/85 backdrop-blur-md px-2.5 py-1 rounded-md border border-slate-700/60 text-[10px] font-semibold text-slate-200 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-200">
          {panel.name}
        </div>
      )}
    </div>
  )
}

'use client'

import { PanelWithReading } from '@/lib/types'

interface PanelNodeProps {
  panel: PanelWithReading
  isSelected: boolean
  interactionMode?: 'cursor' | 'hand'
  onSelect: () => void
}

export default function PanelNode({
  panel,
  isSelected,
  onSelect,
}: PanelNodeProps) {
  const status = panel.latest_reading?.status || 'normal'

  const colorMap = {
    normal: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
  }

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('panelId', panel.id)
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onClick={(e) => {
        e.stopPropagation()
        onSelect()
      }}
      title={`${panel.name} (${panel.location_label || 'Tanpa Label'})\nKlik untuk melihat info, atau tahan & geser untuk memindahkan posisi.`}
      style={{
        position: 'absolute',
        left: `${panel.floor_x}%`,
        top: `${panel.floor_y}%`,
        transform: `translate(-50%, -50%) ${isSelected ? 'scale(1.25)' : 'scale(1)'}`,
      }}
      className={`group p-2 rounded-full transition-all duration-300 ease-out select-none cursor-grab active:cursor-grabbing ${
        isSelected ? 'z-30' : 'hover:scale-115 z-20'
      }`}
    >
      {/* Visual Indicator Ring with glow */}
      <div
        className={`w-7 h-7 rounded-full border-2 border-white flex items-center justify-center shadow-lg transition-all duration-300 ${
          status === 'danger' ? 'animate-pulse-danger' : ''
        }`}
        style={{
          backgroundColor: colorMap[status],
          boxShadow: isSelected
            ? `0 0 24px ${colorMap[status]}, 0 0 0 4px rgba(255,255,255,0.35)`
            : `0 0 14px ${colorMap[status]}`,
        }}
      >
        <span className="w-2 h-2 rounded-full bg-white transition-transform duration-300" />
      </div>

      {/* Floating Tag Label Name */}
      <div className="absolute top-9 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-950/85 backdrop-blur-md px-2.5 py-1 rounded-md border border-slate-700/60 text-[10px] font-semibold text-slate-200 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-200">
        {panel.name}
      </div>
    </div>
  )
}

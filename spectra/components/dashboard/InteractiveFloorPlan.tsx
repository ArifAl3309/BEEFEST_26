'use client'

import { useRef, useState, useEffect } from 'react'
import { PanelWithReading } from '@/lib/types'
import PanelNode from './PanelNode'
import PanelDetailCard from './PanelDetailCard'
import {
  MousePointer,
  Hand,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Building2,
} from 'lucide-react'

interface FloorPlanProps {
  panels: PanelWithReading[]
  selectedPanelId: string | null
  tenantName: string
  userFullName: string
  onSelectPanel: (id: string | null) => void
  onNodeMoved: (id: string, x: number, y: number) => void
  onDeletePanel?: (id: string) => void
  onOpenDiscoverMore?: (panel: PanelWithReading) => void
}

export default function InteractiveFloorPlan({
  panels,
  selectedPanelId,
  tenantName,
  userFullName,
  onSelectPanel,
  onNodeMoved,
  onDeletePanel,
  onOpenDiscoverMore,
}: FloorPlanProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const transformLayerRef = useRef<HTMLDivElement>(null)

  const [mode, setMode] = useState<'cursor' | 'hand'>('cursor')

  // Transform states: zoom & pan offsets
  const [scale, setScale] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })

  const selectedPanel = panels.find((p) => p.id === selectedPanelId) || null

  // 1. Mouse Wheel Zoom Presisi Tinggi Berpusat Tepat Pada Posisi Kursor Mouse
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      const rect = el.getBoundingClientRect()

      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top

      const zoomFactor = e.deltaY > 0 ? 0.88 : 1.14

      setScale((prevScale) => {
        const nextScale = Math.max(0.5, Math.min(prevScale * zoomFactor, 3.5))
        if (nextScale === prevScale) return prevScale

        setPan((prevPan) => ({
          x: mouseX - (mouseX - prevPan.x) * (nextScale / prevScale),
          y: mouseY - (mouseY - prevPan.y) * (nextScale / prevScale),
        }))

        return nextScale
      })
    }

    el.addEventListener('wheel', handleWheel, { passive: false })
    return () => el.removeEventListener('wheel', handleWheel)
  }, [])

  // 2. Pan Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (mode === 'hand') {
      setIsPanning(true)
      setStartPos({ x: e.clientX - pan.x, y: e.clientY - pan.y })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning && mode === 'hand') {
      setPan({
        x: e.clientX - startPos.x,
        y: e.clientY - startPos.y,
      })
    }
  }

  const handleMouseUp = () => {
    setIsPanning(false)
  }

  const resetView = () => {
    setScale(1)
    setPan({ x: 0, y: 0 })
  }

  const handleZoomButton = (factor: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    setScale((prevScale) => {
      const nextScale = Math.max(0.5, Math.min(prevScale * factor, 3.5))
      if (nextScale === prevScale) return prevScale

      setPan((prevPan) => ({
        x: centerX - (centerX - prevPan.x) * (nextScale / prevScale),
        y: centerY - (centerY - prevPan.y) * (nextScale / prevScale),
      }))

      return nextScale
    })
  }

  // 3. Drag and Drop Node Handler
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    if (!transformLayerRef.current) return

    const panelId = e.dataTransfer.getData('panelId')
    if (!panelId) return

    const rect = transformLayerRef.current.getBoundingClientRect()
    const relativeX = (e.clientX - rect.left) / rect.width
    const relativeY = (e.clientY - rect.top) / rect.height

    const x = Math.round(Math.max(2, Math.min(98, relativeX * 100)) * 10) / 10
    const y = Math.round(Math.max(2, Math.min(98, relativeY * 100)) * 10) / 10

    onNodeMoved(panelId, x, y)

    await fetch('/api/panels/update-position', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ panelId, floor_x: x, floor_y: y }),
    })
  }

  return (
    <div className="relative w-full h-full flex flex-col gap-3.5 select-none">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between z-30 flex-wrap gap-2">
        {/* Profile Card */}
        <div className="flex items-center gap-3.5 p-2 pr-5 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-800 shadow-xl">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-400 flex items-center justify-center text-white font-black text-sm shadow-md shadow-blue-500/20">
            {userFullName ? userFullName.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="flex flex-col">
            <div className="text-sm font-black text-white tracking-tight leading-snug">
              {userFullName || 'Operator'}
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
              <Building2 size={13} className="text-slate-500" />
              <span className="truncate max-w-[200px]">{tenantName || 'Tenant Sekolah'}</span>
            </div>
          </div>
        </div>

        {/* Right Controls: Mode & Zoom */}
        <div className="flex items-center gap-2.5">
          {/* Mode Selector */}
          <div className="flex items-center gap-1 p-1.5 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-800 shadow-xl">
            <button
              type="button"
              onClick={() => setMode('cursor')}
              title="Mode Kursor (Detail & Geser Titik)"
              className={`p-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                mode === 'cursor'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <MousePointer size={18} />
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('hand')
                onSelectPanel(null)
              }}
              title="Mode Geser Denah (Pan Navigation)"
              className={`p-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                mode === 'hand'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Hand size={18} />
            </button>
          </div>

          {/* Zoom Buttons */}
          <div className="flex items-center gap-1 p-1.5 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-800 shadow-xl">
            <button
              type="button"
              onClick={() => handleZoomButton(1.15)}
              title="Perbesar (Zoom In)"
              className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <ZoomIn size={18} />
            </button>
            <button
              type="button"
              onClick={() => handleZoomButton(0.85)}
              title="Perkecil (Zoom Out)"
              className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <ZoomOut size={18} />
            </button>
            <button
              type="button"
              onClick={resetView}
              title="Reset Ukuran & Posisi"
              className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Viewport Container */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => {
          if (!isPanning) onSelectPanel(null)
        }}
        className={`relative flex-1 w-full rounded-[30px] overflow-hidden border border-slate-800/80 bg-[#070B14] shadow-2xl ${
          mode === 'hand'
            ? isPanning
              ? 'cursor-grabbing'
              : 'cursor-grab'
            : 'cursor-default'
        }`}
        style={{ minHeight: '540px' }}
      >
        {/* Fixed Compass Indicator */}
        <div className="absolute top-5 right-5 z-20 pointer-events-none flex flex-col items-center justify-center w-11 h-11 rounded-full bg-[#0E1626]/90 border border-slate-700/60 shadow-xl backdrop-blur-md">
          <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[10px] border-b-sky-400" />
          <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[10px] border-t-slate-500" />
          <span className="absolute -top-1.5 text-[9px] font-black text-sky-400 tracking-tighter">
            U
          </span>
        </div>

        {/* Transform Layer Denah Arsitektur */}
        <div
          ref={transformLayerRef}
          className="relative w-full h-full"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
            transformOrigin: '0 0',
            transition: isPanning ? 'none' : 'transform 0.05s ease-out',
          }}
        >
          <img
            src="/floor-plan-placeholder.svg"
            alt="Denah Gedung Sekolah"
            className="w-full h-full object-cover pointer-events-none opacity-95 select-none"
          />

          {panels.map((panel) => (
            <PanelNode
              key={panel.id}
              panel={panel}
              isSelected={panel.id === selectedPanelId}
              onSelect={() => {
                onSelectPanel(panel.id)
              }}
            />
          ))}

          {selectedPanel && (
            <PanelDetailCard
              panel={selectedPanel}
              onClose={() => onSelectPanel(null)}
              onDeletePanel={onDeletePanel}
              onDiscoverMore={() => {
                if (onOpenDiscoverMore) {
                  onOpenDiscoverMore(selectedPanel)
                }
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}

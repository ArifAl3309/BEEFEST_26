'use client'

import { useRef, useState, useEffect } from 'react'
import { PanelWithReading } from '@/lib/types'
import PanelNode from './PanelNode'
import PanelDetailCard from './PanelDetailCard'
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Building2,
  ImagePlus,
  RefreshCw,
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

  // Transform states: zoom & pan offsets
  const [scale, setScale] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)

  // Drag node state: panel yang sedang dalam mode drag aktif (double-click)
  const [dragPanelId, setDragPanelId] = useState<string | null>(null)

  // Custom Floor Plan Image State (Mendukung upload denah baru & ganti denah)
  const [floorPlanUrl, setFloorPlanUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Muat custom floor plan tersimpan jika ada
    const saved = localStorage.getItem('spectra_custom_floor_plan')
    if (saved) {
      setFloorPlanUrl(saved)
    }
  }, [])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const result = event.target?.result as string
      if (result) {
        setFloorPlanUrl(result)
        try {
          localStorage.setItem('spectra_custom_floor_plan', result)
        } catch {
          // kuota localStorage overflow (jika gambar sangat besar)
        }
      }
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveFloorPlan = () => {
    if (confirm('Apakah Anda yakin ingin menghapus denah ini dan mengunggah denah baru?')) {
      setFloorPlanUrl(null)
      localStorage.removeItem('spectra_custom_floor_plan')
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
        fileInputRef.current.click()
      }
    }
  }

  // Refs untuk sinkronisasi nilai state terkini secara real-time pada event listener
  const transformRef = useRef({ scale: 1, pan: { x: 0, y: 0 } })
  useEffect(() => {
    transformRef.current = { scale, pan }
  }, [scale, pan])

  const selectedPanel = panels.find((p) => p.id === selectedPanelId) || null

  // 1. Mouse Wheel Zoom Presisi Tinggi & Ultra-Smooth Berpusat Tepat Pada Posisi Kursor Mouse
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      const rect = el.getBoundingClientRect()

      // Posisi kursor mouse relatif terhadap container viewport
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top

      const { scale: currentScale, pan: currentPan } = transformRef.current

      // Sensitivity zoom factor yang halus
      const zoomIntensity = 0.0018
      const factor = Math.exp(-e.deltaY * zoomIntensity)
      const nextScale = Math.max(0.5, Math.min(currentScale * factor, 4.0))

      if (Math.abs(nextScale - currentScale) < 0.0001) return

      // Hitung koordinat pan baru agar titik di bawah kursor mouse tetap tepat di posisi kursor
      const nextPanX = mouseX - (mouseX - currentPan.x) * (nextScale / currentScale)
      const nextPanY = mouseY - (mouseY - currentPan.y) * (nextScale / currentScale)

      transformRef.current = { scale: nextScale, pan: { x: nextPanX, y: nextPanY } }
      setScale(nextScale)
      setPan({ x: nextPanX, y: nextPanY })
    }

    el.addEventListener('wheel', handleWheel, { passive: false })
    return () => el.removeEventListener('wheel', handleWheel)
  }, [])

  // 2. Pan Handlers (Mouse Window Listener & Touch untuk HP/Tablet)
  const isPanningRef = useRef(false)
  const startPosRef = useRef({ x: 0, y: 0 })

  const handleMouseDown = (e: React.MouseEvent) => {
    // Jangan pan jika user mengklik tombol atau elemen node panel / mode drag
    if ((e.target as HTMLElement)?.closest('button, [data-interactive="true"], [data-panel-node="true"]')) return
    e.preventDefault() // Cegah seleksi teks dan ghost drag native browser

    isPanningRef.current = true
    setIsPanning(true)
    startPosRef.current = { x: e.clientX - transformRef.current.pan.x, y: e.clientY - transformRef.current.pan.y }
  }

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isPanningRef.current) return
      const nextPanX = e.clientX - startPosRef.current.x
      const nextPanY = e.clientY - startPosRef.current.y

      transformRef.current.pan = { x: nextPanX, y: nextPanY }
      setPan({ x: nextPanX, y: nextPanY })
    }

    const handleGlobalMouseUp = () => {
      if (isPanningRef.current) {
        isPanningRef.current = false
        setIsPanning(false)
      }
    }

    window.addEventListener('mousemove', handleGlobalMouseMove)
    window.addEventListener('mouseup', handleGlobalMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove)
      window.removeEventListener('mouseup', handleGlobalMouseUp)
    }
  }, [])

  // Touch Support untuk HP / Tablet
  const touchStartRef = useRef<{ x: number; y: number; dist: number }>({ x: 0, y: 0, dist: 0 })

  const handleTouchStart = (e: React.TouchEvent) => {
    if ((e.target as HTMLElement)?.closest('button, [data-interactive="true"], [data-panel-node="true"]')) return

    if (e.touches.length === 1) {
      setIsPanning(true)
      touchStartRef.current = {
        x: e.touches[0].clientX - pan.x,
        y: e.touches[0].clientY - pan.y,
        dist: 0,
      }
    } else if (e.touches.length === 2) {
      setIsPanning(false)
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      touchStartRef.current.dist = Math.hypot(dx, dy)
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isPanning) {
      setPan({
        x: e.touches[0].clientX - touchStartRef.current.x,
        y: e.touches[0].clientY - touchStartRef.current.y,
      })
    } else if (e.touches.length === 2 && touchStartRef.current.dist > 0) {
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      const newDist = Math.hypot(dx, dy)
      const ratio = newDist / touchStartRef.current.dist

      setScale((prevScale) => Math.max(0.5, Math.min(prevScale * ratio, 4.0)))
      touchStartRef.current.dist = newDist
    }
  }

  const handleTouchEnd = () => {
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
      const nextScale = Math.max(0.5, Math.min(prevScale * factor, 4.0))
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
      {/* Top Toolbar (Responsif penuh untuk HP kecil hingga Desktop) */}
      <div className="flex items-center justify-between z-30 gap-2 w-full">
        {/* Profile Card */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 p-1.5 sm:p-2 pr-3 sm:pr-5 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-800 shadow-xl min-w-0 flex-1 sm:flex-initial">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-400 flex items-center justify-center text-white font-black text-xs sm:text-sm shadow-md shadow-blue-500/20 flex-shrink-0">
            {userFullName ? userFullName.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="flex flex-col justify-center min-w-0 flex-1">
            <div className="text-xs sm:text-sm font-black text-white tracking-tight leading-none truncate">
              {userFullName || 'Operator'}
            </div>
            <div className="flex items-center gap-1 text-[11px] sm:text-xs font-medium text-slate-400 mt-1">
              <Building2 size={12} className="text-slate-500 flex-shrink-0" />
              <span className="truncate max-w-[130px] sm:max-w-[200px] leading-tight">{tenantName || 'Tenant Sekolah'}</span>
            </div>
          </div>
        </div>

        {/* Right Controls: Hidden File Input + Zoom Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
          {/* Hidden File Input (Dipicu oleh tombol floating di dalam denah) */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />

          {/* Zoom Buttons */}
          <div className="flex items-center gap-0.5 sm:gap-1 p-1 sm:p-1.5 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-800 shadow-xl">
            <button
              type="button"
              onClick={() => handleZoomButton(1.15)}
              title="Perbesar (Zoom In)"
              className="p-1.5 sm:p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <ZoomIn size={16} className="sm:w-[18px] sm:h-[18px]" />
            </button>
            <button
              type="button"
              onClick={() => handleZoomButton(0.85)}
              title="Perkecil (Zoom Out)"
              className="p-1.5 sm:p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <ZoomOut size={16} className="sm:w-[18px] sm:h-[18px]" />
            </button>
            <button
              type="button"
              onClick={resetView}
              title="Reset Ukuran & Posisi"
              className="p-1.5 sm:p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <RotateCcw size={15} className="sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Viewport Container */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => {
          if (!isPanning) onSelectPanel(null)
        }}
        className={`relative flex-1 w-full rounded-[30px] overflow-hidden border border-slate-800/80 bg-[#070B14] shadow-2xl transition-[cursor] touch-none select-none ${
          isPanning ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        style={{ minHeight: '380px' }}
      >
        {/* Floating Floor Plan Upload Button (Always Visible in Top-Left of Denah) */}
        <div className="absolute top-5 left-5 z-20 flex items-center gap-2">
          {floorPlanUrl ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                handleRemoveFloorPlan()
              }}
              title="Hapus denah saat ini dan ganti gambar denah baru"
              className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-900/95 hover:bg-red-500/20 text-slate-200 hover:text-red-400 border border-slate-700/80 hover:border-red-500/40 text-xs font-bold transition-all shadow-2xl backdrop-blur-md"
            >
              <RefreshCw size={14} className="text-sky-400" />
              <span>Hapus &amp; Ganti Denah</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                fileInputRef.current?.click()
              }}
              title="Unggah blueprint denah gedung sekolah"
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-black tracking-wide transition-all shadow-[0_0_20px_rgba(14,165,233,0.4)] backdrop-blur-md active:scale-95"
            >
              <ImagePlus size={16} />
              <span>Masukkan Denah</span>
            </button>
          )}
        </div>

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
          data-transform-layer="true"
          className="relative w-full h-full will-change-transform"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
            transformOrigin: '0 0',
            transition: isPanning ? 'none' : 'transform 0.15s cubic-bezier(0.2, 0.8, 0.2, 1)',
          }}
        >
          {floorPlanUrl ? (
            <img
              src={floorPlanUrl}
              alt="Denah Gedung Sekolah Kustom"
              className="w-full h-full object-contain pointer-events-none opacity-95 select-none"
            />
          ) : (
            <img
              src="/floor-plan-placeholder.svg"
              alt="Denah Gedung Sekolah Standar"
              className="w-full h-full object-cover pointer-events-none opacity-95 select-none"
            />
          )}

          {panels.map((panel) => (
            <PanelNode
              key={panel.id}
              panel={panel}
              isSelected={panel.id === selectedPanelId}
              isDragMode={dragPanelId === panel.id}
              onSelect={() => {
                onSelectPanel(panel.id)
              }}
              onToggleDragMode={() => {
                setDragPanelId((prev) => (prev === panel.id ? null : panel.id))
              }}
              onPositionChange={async (newX, newY) => {
                onNodeMoved(panel.id, newX, newY)
                await fetch('/api/panels/update-position', {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ panelId: panel.id, floor_x: newX, floor_y: newY }),
                })
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

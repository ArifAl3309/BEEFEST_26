'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import InteractiveFloorPlan from '@/components/dashboard/InteractiveFloorPlan'
import SidebarMetrics from '@/components/dashboard/SidebarMetrics'
import PanelDiscoverView from '@/components/dashboard/PanelDiscoverView'
import FlyNotification, { FlyAlertData } from '@/components/dashboard/FlyNotification'
import { PanelWithReading, SensorReading } from '@/lib/types'
import { createClient } from '@/lib/supabase/client'

interface ProfileQueryResponse {
  full_name: string
  tenants: { name: string } | null
}

export default function DashboardPage() {
  const [panels, setPanels] = useState<PanelWithReading[]>([])
  const [selectedPanelId, setSelectedPanelId] = useState<string | null>(null)
  const [discoverPanel, setDiscoverPanel] = useState<PanelWithReading | null>(null)

  const [userProfile, setUserProfile] = useState<{ fullName: string; tenantName: string }>({
    fullName: '',
    tenantName: '',
  })

  // State untuk Fly Notification (Alert di tengah bawah layar)
  const [activeAlert, setActiveAlert] = useState<FlyAlertData | null>(null)
  const lastAlertTimeRef = useRef<Record<string, number>>({})

  // 1. Fetch User Profile
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        supabase
          .from('profiles')
          .select('full_name, tenants(name)')
          .eq('id', session.user.id)
          .single()
          .then(({ data }) => {
            if (data) {
              const profileData = data as unknown as ProfileQueryResponse
              setUserProfile({
                fullName: profileData.full_name || 'William',
                tenantName: profileData.tenants?.name || 'SMA Labschool Rawamangun',
              })
            }
          })
      }
    })
  }, [])

  // Helper untuk memicu Fly Notification jika status waspada atau bahaya
  const triggerFlyAlert = useCallback((panelId: string, panelName: string, locationLabel: string, reading: SensorReading) => {
    if (reading.status === 'warning' || reading.status === 'danger') {
      const now = Date.now()
      const lastTime = lastAlertTimeRef.current[reading.panel_id] || 0

      // Beri jeda 8 detik antar alert per panel agar tidak spam
      if (now - lastTime > 8000) {
        lastAlertTimeRef.current[reading.panel_id] = now
        const message =
          reading.status === 'danger'
            ? `Terdeteksi lonjakan panas kritis (${reading.temperature_panel}°C) & anomali mikro-arc flash!`
            : `Peningkatan arus beban (${reading.current_a}A) dan suhu panel mendekati batas aman (${reading.temperature_panel}°C).`

        setActiveAlert({
          id: `${reading.panel_id}-${now}`,
          panelId,
          panelName,
          locationLabel,
          status: reading.status as 'warning' | 'danger',
          message,
          time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        })
      }
    }
  }, [])

  // 2. Fetch Latest Panels & Readings
  const fetchPanels = useCallback(() => {
    fetch('/api/readings/latest')
      .then((res) => res.json())
      .then((json) => {
        if (json.data) {
          json.data.forEach((p: PanelWithReading) => {
            if (p.latest_reading) {
              triggerFlyAlert(p.id, p.name, p.location_label || '', p.latest_reading)
            }
          })

          setPanels((prev) => {
            if (prev.length === 0) return json.data
            return json.data.map((newP: PanelWithReading) => {
              const existing = prev.find((e) => e.id === newP.id)
              return existing ? { ...newP, floor_x: existing.floor_x, floor_y: existing.floor_y } : newP
            })
          })

          // Update data panel aktif di Discover More jika sedang dibuka
          setDiscoverPanel((prev) => {
            if (!prev) return null
            const updated = json.data.find((p: PanelWithReading) => p.id === prev.id)
            return updated || prev
          })
        }
      })
      .catch(() => {})
  }, [triggerFlyAlert])

  // Inisialisasi awal + Auto Polling setiap 2.5 detik
  useEffect(() => {
    fetchPanels()
    const interval = setInterval(fetchPanels, 2500)
    return () => clearInterval(interval)
  }, [fetchPanels])

  // 3. Delete Panel Handler
  const handleDeletePanel = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus titik panel ini dari denah?')) return

    try {
      const res = await fetch(`/api/panels?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        setPanels((prev) => prev.filter((p) => p.id !== id))
        if (selectedPanelId === id) setSelectedPanelId(null)
        if (discoverPanel?.id === id) setDiscoverPanel(null)
      }
    } catch {
      alert('Gagal menghapus titik panel.')
    }
  }

  // 4. Supabase Realtime Subscription (WebSocket Push)
  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel('realtime-readings')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'sensor_readings' },
        (payload) => {
          const reading = payload.new as SensorReading
          setPanels((prev) =>
            prev.map((p) => {
              if (p.id === reading.panel_id) {
                triggerFlyAlert(p.name, p.location_label || '', reading)
                return { ...p, latest_reading: reading }
              }
              return p
            })
          )

          setDiscoverPanel((prev) => {
            if (prev && prev.id === reading.panel_id) {
              return { ...prev, latest_reading: reading }
            }
            return prev
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [triggerFlyAlert])

  const selectedPanel = panels.find((p) => p.id === selectedPanelId) || discoverPanel || null

  return (
    <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden w-full min-h-[calc(100vh-64px)] lg:h-[calc(100vh-64px)] relative">
      {/* ─────────────────────────────────────────────────────────────
          MAIN CONTENT AREA (Kiri-Tengah di Desktop, Atas di Mobile)
          - Jika discoverPanel aktif: Tampilkan Halaman Detail (Chart, Historis, Spesifikasi)
          - Jika tidak: Tampilkan Interactive Floor Plan Denah
          ───────────────────────────────────────────────────────────── */}
      <div className="flex-1 p-3.5 sm:p-5 flex flex-col min-w-0 h-[500px] sm:h-[600px] lg:h-full flex-shrink-0 lg:flex-shrink">
        {discoverPanel ? (
          <PanelDiscoverView panel={discoverPanel} onBack={() => setDiscoverPanel(null)} />
        ) : (
          <InteractiveFloorPlan
            panels={panels}
            selectedPanelId={selectedPanelId}
            tenantName={userProfile.tenantName}
            userFullName={userProfile.fullName}
            onSelectPanel={setSelectedPanelId}
            onNodeMoved={(id, x, y) => {
              setPanels((prev) =>
                prev.map((p) => (p.id === id ? { ...p, floor_x: x, floor_y: y } : p))
              )
            }}
            onDeletePanel={handleDeletePanel}
            onOpenDiscoverMore={(panel) => {
              setSelectedPanelId(panel.id)
              setDiscoverPanel(panel)
            }}
          />
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          SIDEBAR AREA (Kanan di Desktop, Bawah di Mobile)
          ───────────────────────────────────────────────────────────── */}
      <SidebarMetrics
        panel={selectedPanel}
        panels={panels}
        selectedPanelId={selectedPanelId}
        onSelectPanel={(id) => {
          setSelectedPanelId(id)
          if (!id) setDiscoverPanel(null)
          else {
            const found = panels.find((p) => p.id === id)
            if (found && discoverPanel) setDiscoverPanel(found)
          }
        }}
        onDeletePanel={handleDeletePanel}
        onRefreshPanels={fetchPanels}
      />

      {/* Fly Notification Alert */}
      <FlyNotification
        alert={activeAlert}
        onDismiss={() => setActiveAlert(null)}
        onOpenPanel={(panelId) => {
          setSelectedPanelId(panelId)
          const target = panels.find((p) => p.id === panelId)
          if (target) {
            setDiscoverPanel(target)
          }
          setActiveAlert(null)
        }}
      />
    </div>
  )
}

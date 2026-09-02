'use client'

import { useState } from 'react'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import { PhoneCall, Send, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { PanelWithReading } from '@/lib/types'

interface PlnModalProps {
  isOpen: boolean
  onClose: () => void
  panel: PanelWithReading | null
}

export default function PlnEmergencyModal({ isOpen, onClose, panel }: PlnModalProps) {
  const [dispatched, setDispatched] = useState(false)
  const [loading, setLoading] = useState(false)

  if (!panel) return null

  const handleDispatch = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/emergency/pln', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          panel_id: panel.id,
          tenant_id: panel.tenant_id,
          panel_name: panel.name,
          danger_reason: panel.latest_reading?.arc_detected ? 'Deteksi Arc Flash Tegangan Tinggi' : 'Kelebihan Beban Kritis',
        }),
      })
      if (res.ok) setDispatched(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Bantuan Darurat Posko PLN 123">
      <div className="flex flex-col gap-4">
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3">
          <AlertTriangle size={22} className="text-red-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-bold text-red-300">Peringatan Bahaya Kebakaran: </span>
            <span className="text-gray-300">
              Anomali kelistrikan kritis terdeteksi pada <b>{panel.name}</b>.
            </span>
          </div>
        </div>

        {dispatched ? (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center flex flex-col items-center gap-2">
            <CheckCircle2 size={28} className="text-emerald-400" />
            <p className="text-xs font-semibold text-white">Tiket Darurat Berhasil Dikirim ke Posko PLN Terdekat.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 pt-2">
            <a
              href="tel:123"
              className="h-11 px-4 rounded-lg bg-[--bg-elevated] hover:bg-slate-700 border border-[--border] text-xs font-semibold text-white flex items-center justify-center gap-2"
            >
              <PhoneCall size={16} className="text-amber-400" />
              Telepon 123
            </a>
            <Button variant="danger" onClick={handleDispatch} disabled={loading}>
              <Send size={16} />
              {loading ? 'Mengirim...' : 'Kirim Dispatch'}
            </Button>
          </div>
        )}
      </div>
    </Modal>
  )
}

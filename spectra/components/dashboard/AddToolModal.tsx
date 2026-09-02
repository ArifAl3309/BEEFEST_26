'use client'

import { useState } from 'react'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import { PlusCircle, Sparkles, KeyRound } from 'lucide-react'

interface AddToolModalProps {
  isOpen: boolean
  onClose: () => void
  onToolAdded: () => void
}

export default function AddToolModal({ isOpen, onClose, onToolAdded }: AddToolModalProps) {
  const [panelName, setPanelName] = useState('')
  const [activationCode, setActivationCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!panelName || !activationCode) {
      setError('Nama panel dan Activation Code wajib diisi.')
      return
    }

    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/panels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: panelName,
          location_label: `Modul (${activationCode.toUpperCase().trim()})`,
          floor_x: 50.0,
          floor_y: 50.0,
        }),
      })

      if (res.ok) {
        setPanelName('')
        setActivationCode('')
        onToolAdded()
        onClose()
      } else {
        setError('Gagal menambahkan perangkat panel.')
      }
    } catch {
      setError('Terjadi gangguan server.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Registrasi Titik Panel Listrik Baru">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Info Box dengan Keterangan Kode Aktivasi */}
        <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-500/25 text-xs text-slate-300 flex items-start gap-3">
          <Sparkles size={20} className="text-sky-400 flex-shrink-0 mt-0.5" />
          <span className="leading-relaxed font-medium">
            Masukkan Kode Aktivasi perangkat fisik yang tertera pada label barcode unit hardware SPECTRA baru Anda untuk mendaftarkan titik panel.
          </span>
        </div>

        {/* Input Activation Code */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <KeyRound size={15} className="text-sky-400" />
              Activation Code Modul Baru
            </span>
            <span className="text-[11px] text-slate-500 font-normal">Wajib</span>
          </label>
          <input
            id="add-activation-code"
            type="text"
            placeholder="Contoh: SPEC-MODUL-8891"
            value={activationCode}
            onChange={(e) => setActivationCode(e.target.value.toUpperCase())}
            disabled={loading}
            className="w-full bg-[#080C16] border border-slate-700/80 rounded-xl px-4 py-3 text-sm font-mono font-bold text-white uppercase placeholder-slate-500/60 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 transition-all"
          />
        </div>

        {/* Input Nama Titik Panel */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-300">
            Nama Titik Panel
          </label>
          <input
            id="add-panel-name"
            type="text"
            placeholder="Contoh: Panel Distribusi Lab Multimedia Lt.2"
            value={panelName}
            onChange={(e) => setPanelName(e.target.value)}
            disabled={loading}
            className="w-full bg-[#080C16] border border-slate-700/80 rounded-xl px-4 py-3 text-sm font-semibold text-white placeholder-slate-500/60 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 transition-all"
          />
        </div>

        {error && <p className="text-xs text-red-400 font-bold">{error}</p>}

        <div className="flex justify-end gap-3 pt-3 border-t border-slate-800/80 mt-1">
          <Button variant="ghost" type="button" onClick={onClose} disabled={loading} className="text-xs font-bold">
            Batal
          </Button>
          <Button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs px-5 h-11">
            <PlusCircle size={17} />
            <span>{loading ? 'Menambahkan...' : 'Simpan & Pasang Titik'}</span>
          </Button>
        </div>
      </form>
    </Modal>
  )
}

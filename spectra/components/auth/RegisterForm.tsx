'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { KeyRound, ShieldAlert, Zap, ArrowLeft, User, Mail, Lock, Sparkles } from 'lucide-react'
import Button from '@/components/ui/Button'
import { Swirling } from '@/components/ui/swirling'
import LoadingOverlay from '@/components/ui/LoadingOverlay'

export default function RegisterForm() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [activationCode, setActivationCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!fullName || !email || !password || !activationCode) {
      setError('Semua kolom dan Kode Aktivasi wajib diisi.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password, activationCode }),
      })
      const json = await res.json()

      if (!res.ok) {
        setError(json.error || 'Pendaftaran gagal.')
        return
      }

      // Login otomatis lalu redirect ke onboarding
      const loginRes = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (loginRes.ok) {
        router.push('/onboarding')
      } else {
        router.push('/login')
      }
    } catch {
      setError('Gagal menghubungi server pendaftaran.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full relative overflow-hidden bg-[#0C1222]/90 backdrop-blur-2xl border border-sky-500/20 rounded-[32px] p-8 sm:p-10 shadow-[0_10px_40px_-10px_rgba(14,165,233,0.25),0_0_25px_-5px_rgba(99,102,241,0.15)] transition-all duration-500 ease-out hover:-translate-y-1.5 hover:border-sky-400/50 hover:shadow-[0_20px_50px_-10px_rgba(14,165,233,0.4),0_0_35px_5px_rgba(56,189,248,0.25)] group">
      {/* Decorative Glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-sky-500/25 rounded-full blur-3xl pointer-events-none transition-opacity duration-500 group-hover:opacity-100 opacity-60" />

      {/* Brand Header */}
      <div className="flex flex-col items-center gap-3.5 mb-7 text-center">
        <div className="p-3.5 rounded-2xl bg-gradient-to-tr from-sky-500/20 to-blue-600/20 border border-sky-500/30 shadow-lg shadow-sky-500/10">
          <Zap size={28} className="text-sky-400" />
        </div>
        <div>
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-2xl font-black tracking-[0.2em] text-white">SPECTRA</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-sky-500/15 border border-sky-500/30 text-[11px] font-bold text-sky-400">
              ACTIVATION
            </span>
          </div>
          <p className="text-sm text-slate-400 font-medium mt-1.5 max-w-[340px]">
            Aktivasi Perangkat Kontrol & Daftarkan Akun Sekolah Baru
          </p>
        </div>
      </div>

      {/* Form Sign Up */}
      <form onSubmit={handleRegister} className="flex flex-col gap-4">
        {/* Activation Code Box Highlight */}
        <div className="p-4 rounded-2xl bg-blue-950/30 border border-blue-500/30 flex flex-col gap-2">
          <label className="text-xs font-bold text-sky-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <KeyRound size={14} className="text-sky-400" />
              Kode Aktivasi Perangkat (Tenant ID)
            </span>
            <span className="text-xs text-sky-400/80 font-medium">Wajib</span>
          </label>
          <input
            type="text"
            placeholder="Contoh: SPEC-SMAN1BKS"
            value={activationCode}
            onChange={(e) => setActivationCode(e.target.value.toUpperCase())}
            disabled={loading}
            className="w-full bg-[#080C16] border border-blue-500/40 rounded-xl px-4 py-3 text-sm font-mono font-bold text-white uppercase placeholder-slate-600 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 transition-all"
          />
          <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5 mt-0.5">
            <Sparkles size={13} className="text-sky-400 flex-shrink-0" />
            Tertera pada stiker fisik box unit kontrol ESP32
          </span>
        </div>

        {/* Input Nama Lengkap */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <User size={14} className="text-slate-400" />
            Nama Lengkap Penanggung Jawab
          </label>
          <input
            type="text"
            placeholder="Drs. H. Bambang, M.Pd"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={loading}
            className="w-full bg-[#080C16] border border-slate-800 rounded-xl px-4 py-3 text-sm font-semibold text-white placeholder-slate-600 focus:outline-none focus:border-slate-600 focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>

        {/* Input Email */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Mail size={14} className="text-slate-400" />
            Email Resmi Sekolah
          </label>
          <input
            type="email"
            placeholder="sarpras@sman1bekasi.sch.id"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="w-full bg-[#080C16] border border-slate-800 rounded-xl px-4 py-3 text-sm font-semibold text-white placeholder-slate-600 focus:outline-none focus:border-slate-600 focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>

        {/* Input Password */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Lock size={14} className="text-slate-400" />
            Kata Sandi Akun
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            className="w-full bg-[#080C16] border border-slate-800 rounded-xl px-4 py-3 text-sm font-semibold text-white placeholder-slate-600 focus:outline-none focus:border-slate-600 focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>

        {error && (
          <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/25 text-xs font-bold text-red-400 animate-in fade-in duration-200">
            <ShieldAlert size={16} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="w-full mt-2 h-12 text-sm font-black tracking-wide bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-white shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all rounded-2xl flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Swirling className="w-4 h-4 text-white" duration="1s" />
              <span>Memvalidasi Perangkat & Mendaftarkan...</span>
            </>
          ) : (
            'Aktivasi Perangkat & Lanjut Setup Denah →'
          )}
        </Button>
      </form>

      {/* Full-Screen Swirling Loading Overlay */}
      <LoadingOverlay
        show={loading}
        message="Mengaktivasi Perangkat..."
        subMessage="Memverifikasi Tenant ID & Menyiapkan Blueprint Sekolah..."
      />

      {/* Back to Login */}
      <div className="mt-6 pt-5 border-t border-slate-800/80 flex justify-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors group"
        >
          <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-1 text-sky-400" />
          <span>Sudah memiliki akun? Masuk</span>
        </Link>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Zap, ShieldAlert, ArrowRight, Mail, Lock, Sparkles } from 'lucide-react'
import Button from '@/components/ui/Button'
import { Swirling } from '@/components/ui/swirling'
import LoadingOverlay from '@/components/ui/LoadingOverlay'

export default function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email || !password) {
      setError('Email dan Kata Sandi wajib diisi.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const json = await res.json()

      if (!res.ok) {
        setError(json.error || 'Login gagal.')
        return
      }

      // User yang sudah terdaftar di database langsung diarahkan ke Dashboard
      router.push('/dashboard')
    } catch {
      setError('Gagal terhubung ke server.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full relative overflow-hidden bg-[#0C1222]/90 backdrop-blur-2xl border border-slate-800/90 rounded-[32px] p-8 sm:p-10 shadow-2xl shadow-black/90 transition-all duration-300 hover:border-slate-700/80">
      {/* Ambient Top Glow */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <div className="flex flex-col items-center gap-3.5 mb-7 text-center">
        <div className="p-3.5 rounded-2xl bg-gradient-to-tr from-sky-500/20 to-blue-600/20 border border-sky-500/30 shadow-lg shadow-sky-500/10">
          <Zap size={28} className="text-sky-400" />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-[0.25em] text-white">SPECTRA</h1>
          <p className="text-xs text-slate-400 font-semibold mt-1">
            Command Center Pemantauan Kelistrikan Sekolah
          </p>
        </div>
      </div>

      {/* Form Login */}
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        {/* Input Email */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Mail size={14} className="text-slate-400" />
            Email Sekolah
          </label>
          <input
            type="email"
            placeholder="sarpras@sekolah.sch.id"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="w-full bg-[#080C16] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-white placeholder-slate-600 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 transition-all"
          />
        </div>

        {/* Input Password */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Lock size={14} className="text-slate-400" />
            Kata Sandi
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            className="w-full bg-[#080C16] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-white placeholder-slate-600 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 transition-all"
          />
        </div>

        {error && (
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-xs font-bold text-red-400 animate-in fade-in duration-200">
            <ShieldAlert size={16} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="w-full mt-2 h-12 text-xs font-extrabold tracking-wide bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-white shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all rounded-2xl flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Swirling className="w-4 h-4 text-white" duration="1s" />
              <span>Mengautentikasi Sesi...</span>
            </>
          ) : (
            'Masuk ke Command Center'
          )}
        </Button>
      </form>

      {/* Full-Screen Swirling Loading Overlay */}
      <LoadingOverlay
        show={loading}
        message="Mengautentikasi Akun..."
        subMessage="Membuka akses Command Center SPECTRA..."
      />

      {/* Promoted Activation Box */}
      <div className="mt-6 pt-5 border-t border-slate-800/80">
        <Link
          href="/signup"
          className="group block p-3.5 rounded-2xl bg-[#080D1A] border border-blue-500/20 hover:border-blue-500/50 hover:bg-blue-950/30 transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-sky-400 animate-pulse" />
              <div>
                <div className="text-xs font-bold text-white group-hover:text-sky-300 transition-colors">
                  Baru Pasang Unit SPECTRA?
                </div>
                <div className="text-[11px] text-slate-400 font-medium">
                  Aktivasi Perangkat / SIGN UP Sekolah
                </div>
              </div>
            </div>
            <ArrowRight size={16} className="text-sky-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>
    </div>
  )
}

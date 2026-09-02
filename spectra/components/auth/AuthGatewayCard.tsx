'use client'

import { useState } from 'react'
import { Zap } from 'lucide-react'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'

export default function AuthGatewayCard() {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login')

  return (
    <div className="w-full bg-[rgba(14,18,30,0.85)] backdrop-blur-xl border border-[--border] rounded-2xl p-8 shadow-2xl shadow-black/80">
      {/* Brand Header */}
      <div className="flex flex-col items-center gap-2 mb-6 text-center">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/30">
            <Zap size={24} className="text-[--cyan] animate-pulse" />
          </div>
          <span className="text-2xl font-bold tracking-[0.25em] text-white">SPECTRA</span>
        </div>
        <p className="text-xs text-[--text-secondary]">
          Electrical Safety & Command Center Multi-Tenant
        </p>
      </div>

      {/* Tabs Switcher */}
      <div className="grid grid-cols-2 p-1 mb-6 rounded-xl bg-[--bg-elevated] border border-[--border]">
        <button
          type="button"
          onClick={() => setActiveTab('login')}
          className={`py-2 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'login'
              ? 'bg-[--blue] text-white shadow-lg'
              : 'text-[--text-secondary] hover:text-white'
          }`}
        >
          Masuk Akun
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('register')}
          className={`py-2 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'register'
              ? 'bg-[--blue] text-white shadow-lg'
              : 'text-[--text-secondary] hover:text-white'
          }`}
        >
          Aktivasi Perangkat
        </button>
      </div>

      {/* Forms */}
      {activeTab === 'login' ? <LoginForm /> : <RegisterForm />}
    </div>
  )
}

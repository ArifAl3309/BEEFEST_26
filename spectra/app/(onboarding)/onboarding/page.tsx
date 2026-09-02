'use client'

import DotMatrixBackground from '@/components/auth/DotMatrixBackground'
import OnboardingWizard from '@/components/onboarding/OnboardingWizard'

export default function OnboardingPage() {
  return (
    <main className="relative min-h-screen w-full flex items-center justify-center p-6 overflow-hidden bg-black text-white">
      {/* WebGL Dot Matrix Shader Canvas Background (Sama persis dengan Login/Signup) */}
      <DotMatrixBackground />

      {/* Radial Vignette Shadow */}
      <div
        className="fixed inset-0 z-10 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.95) 100%)',
        }}
      />

      {/* Onboarding Card Container */}
      <div className="relative z-20 w-full max-w-2xl bg-[#0C1222]/90 border border-slate-800/90 rounded-[28px] p-8 shadow-2xl backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-500">
        <OnboardingWizard />
      </div>
    </main>
  )
}

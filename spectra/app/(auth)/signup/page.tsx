'use client'

import DotMatrixBackground from '@/components/auth/DotMatrixBackground'
import RegisterForm from '@/components/auth/RegisterForm'

export default function SignUpPage() {
  return (
    <main className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-black text-white">
      {/* WebGL Dot Matrix Shader Canvas */}
      <DotMatrixBackground />

      {/* Radial Vignette Shadow */}
      <div
        className="fixed inset-0 z-10 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.95) 100%)',
        }}
      />

      {/* Sign Up Card Container */}
      <div className="relative z-20 w-full max-w-[480px] px-5 py-8 animate-in fade-in zoom-in-95 duration-500">
        <RegisterForm />
      </div>
    </main>
  )
}

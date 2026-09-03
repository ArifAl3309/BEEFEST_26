'use client'

import { X } from 'lucide-react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-[--bg-surface] border border-[--border-strong] p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-[--border] gap-3">
          <h3 className="text-lg font-black text-white tracking-tight leading-tight">{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-xl text-[--text-muted] hover:text-white hover:bg-white/10 transition-colors flex-shrink-0">
            <X size={18} />
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  )
}

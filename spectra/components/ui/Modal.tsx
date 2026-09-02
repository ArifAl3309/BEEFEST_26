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
        <div className="flex items-center justify-between pb-4 border-b border-[--border]">
          <h3 className="text-base font-bold text-white">{title}</h3>
          <button onClick={onClose} className="p-1 rounded-lg text-[--text-muted] hover:text-white">
            <X size={18} />
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  )
}

import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'danger' | 'ghost'
  children: React.ReactNode
}

export default function Button({ variant = 'primary', children, className = '', ...props }: ButtonProps) {
  const base = 'h-11 px-4 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    primary: 'bg-[--blue] hover:bg-[--blue-hover] text-white shadow-lg shadow-blue-500/20 active:scale-[0.98]',
    danger: 'bg-[--status-danger] hover:bg-red-600 text-white shadow-lg shadow-red-500/20 active:scale-[0.98]',
    ghost: 'bg-transparent hover:bg-[--bg-elevated] text-[--text-secondary] hover:text-white border border-[--border]',
  }

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}

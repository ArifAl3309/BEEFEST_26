import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  helperText?: string
  rightElement?: React.ReactNode
}

export default function Input({ label, helperText, rightElement, id, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label htmlFor={id} className="text-xs font-semibold text-[--text-secondary]">
        {label}
      </label>
      <div className="relative flex items-center">
        <input
          id={id}
          className={`w-full h-11 px-3.5 rounded-lg text-sm bg-[--bg-elevated] text-[--text-primary] border border-[--border] placeholder:text-[--text-muted] focus:outline-none focus:border-[--blue] focus:ring-2 focus:ring-[--blue-glow] transition-all disabled:opacity-50 ${
            rightElement ? 'pr-11' : ''
          } ${className}`}
          {...props}
        />
        {rightElement && <div className="absolute right-3 flex items-center">{rightElement}</div>}
      </div>
      {helperText && <p className="text-[11px] text-[--text-muted]">{helperText}</p>}
    </div>
  )
}

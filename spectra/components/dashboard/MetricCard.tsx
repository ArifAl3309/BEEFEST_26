'use client'

import { Zap, Activity, Cpu, Thermometer, Radio } from 'lucide-react'

interface MetricCardProps {
  label: string
  value: string
  unit: string
  icon: 'zap' | 'activity' | 'cpu' | 'temp' | 'freq'
  isDanger?: boolean
}

export default function MetricCard({ label, value, unit, icon, isDanger }: MetricCardProps) {
  const icons = {
    zap: <Zap size={15} className={isDanger ? 'text-red-400' : 'text-blue-400'} />,
    activity: <Activity size={15} className={isDanger ? 'text-red-400' : 'text-sky-400'} />,
    cpu: <Cpu size={15} className={isDanger ? 'text-red-400' : 'text-indigo-400'} />,
    temp: <Thermometer size={15} className={isDanger ? 'text-red-400' : 'text-amber-400'} />,
    freq: <Radio size={15} className={isDanger ? 'text-red-400' : 'text-slate-400'} />,
  }

  return (
    <div
      className={`p-3.5 rounded-2xl bg-[#0F1626]/80 border transition-all duration-300 flex items-center justify-between ${
        isDanger
          ? 'border-red-500/40 bg-red-950/20 shadow-[0_0_15px_rgba(239,68,68,0.15)]'
          : 'border-slate-800/80 hover:border-slate-700/80 hover:bg-[#131C30]'
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="p-2.5 rounded-xl bg-[#090D17] border border-slate-800/70 shadow-inner flex-shrink-0 flex items-center justify-center">
          {icons[icon]}
        </div>
        <span className="text-[13px] text-slate-300 font-medium truncate leading-tight">{label}</span>
      </div>
      <div className="text-right flex items-baseline justify-end gap-1 flex-shrink-0 pl-3">
        <span className="font-mono text-lg font-black tracking-tight text-white leading-none">{value}</span>
        <span className="text-xs font-bold text-slate-400 leading-none">{unit}</span>
      </div>
    </div>
  )
}

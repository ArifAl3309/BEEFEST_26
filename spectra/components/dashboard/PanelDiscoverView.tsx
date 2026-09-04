'use client'

import { useState, useEffect, useCallback } from 'react'
import { PanelWithReading, SensorReading } from '@/lib/types'
import { fmt, formatDateTimeParts } from '@/lib/utils'
import StatusBadge from '@/components/ui/StatusBadge'
import {
  ArrowLeft,
  Cpu,
  Thermometer,
  ShieldCheck,
  AlertTriangle,
  HardDrive,
  Download,
} from 'lucide-react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
} from 'recharts'

interface PanelDiscoverViewProps {
  panel: PanelWithReading
  onBack: () => void
}

export default function PanelDiscoverView({ panel, onBack }: PanelDiscoverViewProps) {
  const [chartData, setChartData] = useState<SensorReading[]>([])
  const [logs, setLogs] = useState<SensorReading[]>([])
  const [activeTab, setActiveTab] = useState<'thermal' | 'electrical' | 'fft'>('thermal')
  const [loading, setLoading] = useState(true)

  // Fetch Historical Telemetry Data
  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch(`/api/readings/history?panelId=${panel.id}`)
      const json = await res.json()
      if (json.data) {
        setChartData(json.data.chartData || [])
        setLogs(json.data.logs || [])
      }
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [panel.id])

  useEffect(() => {
    fetchHistory()
    const interval = setInterval(fetchHistory, 3000)
    return () => clearInterval(interval)
  }, [fetchHistory])

  // Format data untuk Recharts (Format Lengkap: Jam:Menit:Detik WIB)
  const formattedChartData = chartData.map((d) => {
    const time = new Date(d.created_at).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
    return {
      time,
      tempPanel: d.temperature_panel || 0,
      tempAmbient: d.temperature_ambient || 0,
      current: d.current_a || 0,
      voltage: d.voltage || 0,
      power: d.power || 0,
      status: d.status,
    }
  })

  // Export CSV Handler
  const handleExportCSV = () => {
    if (logs.length === 0) return
    const headers = 'Waktu,Status,Tegangan(V),Arus(A),Daya(W),Suhu Panel(C),Suhu Ambient(C),Frekuensi(Hz),Arc Detected\n'
    const rows = logs
      .map(
        (l) =>
          `"${l.created_at}","${l.status}",${l.voltage},${l.current_a},${l.power},${l.temperature_panel},${l.temperature_ambient},${l.frequency},${l.arc_detected}`
      )
      .join('\n')

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `SPECTRA_${panel.name.replace(/\s+/g, '_')}_Log.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const latest = panel.latest_reading

  return (
    <div className="w-full h-full overflow-y-auto pr-2 pb-16 flex flex-col gap-6 animate-in fade-in duration-300">
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER SECTION (Nama & Lokasi Titik + Status Badge & Export)
          ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-[28px] bg-[#0C1222]/90 border border-slate-800/80 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 hover:bg-slate-800/80 transition-all group"
            title="Kembali ke Denah Interaktif"
          >
            <ArrowLeft size={20} className="transition-transform group-hover:-translate-x-1 text-sky-400" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-widest text-sky-400">
                SPECTRA DETAILED ANALYTICS
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
              <span className="text-xs text-slate-400 font-medium">{panel.location_label || 'Gedung Sekolah'}</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight mt-1">{panel.name}</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Status Badge diperbesar dan konsisten rounded-xl */}
          <StatusBadge status={latest?.status || 'normal'} />
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 text-xs font-bold transition-all shadow-md"
          >
            <Download size={15} className="text-sky-400" />
            <span>Ekspor CSV</span>
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. INTERACTIVE TELEMETRY CHARTS
          ───────────────────────────────────────────────────────────── */}
      <div className="p-6 rounded-[30px] bg-[#0A0F1D]/95 border border-slate-800/90 shadow-2xl flex flex-col gap-5">
        {/* Chart Tab Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
          <div>
            <h2 className="text-lg font-black text-white tracking-tight">Tren & Grafik Dinamis Real-Time</h2>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Visualisasi time-series 30 data sampling telemetri terakhir
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950/80 border border-slate-800">
            <button
              onClick={() => setActiveTab('thermal')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'thermal'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Termal & Suhu
            </button>
            <button
              onClick={() => setActiveTab('electrical')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'electrical'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Arus & Daya
            </button>
            <button
              onClick={() => setActiveTab('fft')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'fft'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Stabilitas Tegangan
            </button>
          </div>
        </div>

        {/* Chart Canvas Area */}
        <div className="w-full h-72 pt-2">
          {formattedChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              {activeTab === 'thermal' ? (
                <AreaChart data={formattedChartData}>
                  <defs>
                    <linearGradient id="colorTempPanel" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorTempAmbient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#38BDF8" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                  <XAxis dataKey="time" stroke="#64748B" fontSize={11} />
                  <YAxis stroke="#64748B" fontSize={11} unit="°C" domain={['dataMin - 5', 'dataMax + 10']} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderColor: '#334155',
                      borderRadius: '16px',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="tempPanel"
                    name="Suhu Busbar/Panel"
                    stroke="#EF4444"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorTempPanel)"
                    activeDot={{ r: 4, strokeWidth: 1, stroke: '#fff' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="tempAmbient"
                    name="Suhu Ambient"
                    stroke="#38BDF8"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorTempAmbient)"
                    activeDot={{ r: 4, strokeWidth: 1, stroke: '#fff' }}
                  />
                </AreaChart>
              ) : activeTab === 'electrical' ? (
                <LineChart data={formattedChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                  <XAxis dataKey="time" stroke="#64748B" fontSize={11} />
                  <YAxis yAxisId="left" stroke="#38BDF8" fontSize={11} unit="A" />
                  <YAxis yAxisId="right" orientation="right" stroke="#A855F7" fontSize={11} unit="W" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderColor: '#334155',
                      borderRadius: '16px',
                      fontSize: '12px',
                    }}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="current"
                    name="Arus Beban (A)"
                    stroke="#38BDF8"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 4, strokeWidth: 1, stroke: '#fff' }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="power"
                    name="Konsumsi Daya (W)"
                    stroke="#A855F7"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, strokeWidth: 1, stroke: '#fff' }}
                  />
                </LineChart>
              ) : (
                <AreaChart data={formattedChartData}>
                  <defs>
                    <linearGradient id="colorFFT" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                  <XAxis dataKey="time" stroke="#64748B" fontSize={11} />
                  <YAxis stroke="#64748B" fontSize={11} unit="V" domain={[200, 240]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderColor: '#334155',
                      borderRadius: '16px',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="voltage"
                    name="Stabilitas Tegangan (V)"
                    stroke="#10B981"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorFFT)"
                    activeDot={{ r: 4, strokeWidth: 1, stroke: '#fff' }}
                  />
                </AreaChart>
              )}
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-slate-500">
              {loading ? 'Memuat data grafik...' : 'Belum ada data telemetri yang terekam.'}
            </div>
          )}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. SPESIFIKASI ALAT SPECTRA & HARDWARE PANEL
          ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Modul IoT SPECTRA */}
        <div className="p-5 rounded-[26px] bg-[#0C1222]/90 border border-slate-800/90 flex flex-col gap-3 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-sky-400">
              <Cpu size={20} />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">Modul Kontrol SPECTRA</h3>
              <p className="text-[11px] text-slate-400 font-semibold">ESP32-S3 Dual-Core DSP</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 pt-2 border-t border-slate-800/80 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Processor:</span>
              <span className="font-mono font-bold text-slate-200">Xtensa LX7 @ 240MHz</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">FFT Sampling:</span>
              <span className="font-mono font-bold text-emerald-400">2048 Points / Window</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">LoRa Fallback:</span>
              <span className="font-mono font-bold text-sky-400">SX1278 (433MHz)</span>
            </div>
          </div>
        </div>

        {/* Card 2: Sensor PZEM-004T & MLX90614 */}
        <div className="p-5 rounded-[26px] bg-[#0C1222]/90 border border-slate-800/90 flex flex-col gap-3 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Thermometer size={20} />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">Sensor Termal & Daya</h3>
              <p className="text-[11px] text-slate-400 font-semibold">PZEM-004T + MLX90614</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 pt-2 border-t border-slate-800/80 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Thermal FOV:</span>
              <span className="font-mono font-bold text-slate-200">90° Non-Contact IR</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Rentang Tegangan:</span>
              <span className="font-mono font-bold text-slate-200">80 ~ 260 VAC</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Max Current Load:</span>
              <span className="font-mono font-bold text-slate-200">100A CT Transformer</span>
            </div>
          </div>
        </div>

        {/* Card 3: Storage & Local Logging */}
        <div className="p-5 rounded-[26px] bg-[#0C1222]/90 border border-slate-800/90 flex flex-col gap-3 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <HardDrive size={20} />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">Penyimpanan & RTC</h3>
              <p className="text-[11px] text-slate-400 font-semibold">MicroSD + DS3231 RTC</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 pt-2 border-t border-slate-800/80 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Local Blackbox:</span>
              <span className="font-mono font-bold text-slate-200">MicroSD SPI FAT32</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Time Sync RTC:</span>
              <span className="font-mono font-bold text-slate-200">DS3231 I2C Battery</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Cloud Sync:</span>
              <span className="font-mono font-bold text-emerald-400">PostgreSQL CDC Live</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. LOG HISTORIS KEJADIAN TELEMETRI
          ───────────────────────────────────────────────────────────── */}
      <div className="p-6 rounded-[30px] bg-[#0A0F1D]/95 border border-slate-800/90 shadow-2xl flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div>
            <h3 className="text-base font-black text-white tracking-wide">Riwayat Log Kejadian & Anomali</h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Catatan telemetri realtime yang terekam pada database cloud
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono font-bold text-slate-300">
            {logs.length} Records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3.5 px-4 font-semibold">Waktu (WIB)</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold">Tegangan</th>
                <th className="py-3.5 px-4 font-semibold">Arus</th>
                <th className="py-3.5 px-4 font-semibold">Daya</th>
                <th className="py-3.5 px-4 font-semibold">Suhu Busbar</th>
                <th className="py-3.5 px-4 font-semibold">Suhu Ambient</th>
                <th className="py-3.5 px-4 font-semibold">FFT Arc</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {logs.map((log) => {
                const isDanger = log.status === 'danger'
                const isWarning = log.status === 'warning'
                const dt = formatDateTimeParts(log.created_at)

                return (
                  <tr
                    key={log.id}
                    className={`hover:bg-slate-900/50 transition-colors h-14 ${
                      isDanger
                        ? 'bg-red-950/20 text-red-300'
                        : isWarning
                        ? 'bg-amber-950/20 text-amber-300'
                        : 'text-slate-300'
                    }`}
                  >
                    <td className="py-2.5 px-4 font-mono text-xs align-middle whitespace-nowrap">
                      <div className="flex flex-col justify-center leading-tight">
                        <span className="font-bold text-slate-200">{dt.time}</span>
                        <span className="text-[11px] text-slate-400 mt-0.5">{dt.date}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 align-middle">
                      <span
                        className={`inline-flex items-center justify-center min-w-[84px] px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider ${
                          isDanger
                            ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                            : isWarning
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-xs align-middle">
                      {fmt(log.voltage, 'V')}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-xs align-middle">
                      {fmt(log.current_a, 'A')}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-xs align-middle">
                      {fmt(log.power, 'W')}
                    </td>
                    <td
                      className={`py-3.5 px-4 font-mono font-bold text-xs align-middle ${
                        (log.temperature_panel || 0) > 60 ? 'text-red-400' : ''
                      }`}
                    >
                      {fmt(log.temperature_panel, '°C')}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs align-middle">
                      {fmt(log.temperature_ambient, '°C')}
                    </td>
                    <td className="py-3.5 px-4 align-middle">
                      {log.arc_detected ? (
                        <span className="text-red-400 font-bold inline-flex items-center gap-1.5 text-xs">
                          <AlertTriangle size={14} className="flex-shrink-0" />
                          <span>Arc Flash</span>
                        </span>
                      ) : (
                        <span className="text-emerald-400 font-semibold inline-flex items-center gap-1.5 text-xs">
                          <ShieldCheck size={14} className="flex-shrink-0" />
                          <span>Normal</span>
                        </span>
                      )}
                    </td>
                  </tr>
                )
              })}

              {logs.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500 font-medium">
                    Belum ada riwayat telemetri untuk titik panel ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

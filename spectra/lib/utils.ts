import { PanelStatus } from '@/lib/types'

export function getStatusLabel(status: PanelStatus): string {
  const map: Record<PanelStatus, string> = {
    normal: 'Normal',
    warning: 'Waspada',
    danger: 'Bahaya Kritis',
  }
  return map[status] || 'Normal'
}

export function fmt(value: number | null | undefined, unit = ''): string {
  if (value === null || value === undefined || isNaN(value)) return '--'
  return `${value.toFixed(1)}${unit ? ' ' + unit : ''}`
}

export function formatTimestamp(iso: string): string {
  if (!iso) return '--'
  const d = new Date(iso)
  const time = d.toLocaleTimeString('id-ID', { hour12: false })
  const date = d.toLocaleDateString('id-ID')
  return `${time} WIB (${date})`
}

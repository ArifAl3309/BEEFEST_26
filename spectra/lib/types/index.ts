export type PanelStatus = 'normal' | 'warning' | 'danger'
export type UserRole = 'admin' | 'operator'

export interface Tenant {
  id: string
  name: string
  activation_code: string
  address: string | null
  latitude: number | null
  longitude: number | null
  onboarding_completed: boolean
  is_active: boolean
  created_at: string
}

export interface Profile {
  id: string
  full_name: string
  role: UserRole
  tenant_id: string
  created_at: string
}

export interface Panel {
  id: string
  tenant_id: string
  name: string
  location_label: string | null
  floor_x: number
  floor_y: number
  is_active: boolean
  created_at: string
}

export interface SensorReading {
  id: string
  panel_id: string
  tenant_id: string
  voltage: number
  current_a: number
  power: number
  temperature_panel: number
  temperature_ambient: number
  frequency: number | null
  power_factor: number | null
  arc_detected: boolean
  status: PanelStatus
  created_at: string
}

export interface Alert {
  id: string
  panel_id: string
  tenant_id: string
  status: 'warning' | 'danger'
  message: string
  pln_dispatched: boolean
  acknowledged: boolean
  created_at: string
}

export interface PanelWithReading extends Panel {
  latest_reading: SensorReading | null
}

export interface PlnEmergencyPayload {
  panel_id: string
  tenant_id: string
  panel_name: string
  school_name: string
  address: string
  coordinates: { lat: number | null; lng: number | null }
  danger_reason: string
  current_voltage: number
  current_temp: number
}

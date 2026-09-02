import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { schoolName, address, latitude, longitude } = await request.json()
    const supabase = createClient()

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ data: null, error: 'Sesi tidak sah.' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('tenant_id')
      .eq('id', session.user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ data: null, error: 'Profil tidak ditemukan.' }, { status: 404 })
    }

    const { error: updateError } = await supabase
      .from('tenants')
      .update({
        name: schoolName,
        address: address,
        latitude: parseFloat(latitude) || null,
        longitude: parseFloat(longitude) || null,
        onboarding_completed: true,
      })
      .eq('id', profile.tenant_id)

    if (updateError) {
      return NextResponse.json({ data: null, error: updateError.message }, { status: 500 })
    }

    // Inisialisasi 3 Panel Listrik default jika tenant belum memiliki panel
    const { data: existingPanels } = await supabase
      .from('panels')
      .select('id')
      .eq('tenant_id', profile.tenant_id)

    if (!existingPanels || existingPanels.length === 0) {
      const defaultPanels = [
        { tenant_id: profile.tenant_id, name: 'Panel Distribusi Utama (MDB)', location_label: 'Gedung Utama Lt.1', floor_x: 24.0, floor_y: 35.0 },
        { tenant_id: profile.tenant_id, name: 'Panel Laboratorium Komputer', location_label: 'Gedung Rektorat Lt.2', floor_x: 52.0, floor_y: 32.0 },
        { tenant_id: profile.tenant_id, name: 'Panel Aula & Sarpras', location_label: 'Gedung Serbaguna Lt.1', floor_x: 74.0, floor_y: 42.0 },
      ]

      for (const p of defaultPanels) {
        const { data: createdPanel } = await supabase.from('panels').insert(p).select().single()
        if (createdPanel) {
          await supabase.from('sensor_readings').insert({
            panel_id: createdPanel.id,
            tenant_id: profile.tenant_id,
            voltage: 220.5,
            current_a: 14.2,
            power: 3131.1,
            temperature_panel: 38.4,
            temperature_ambient: 28.0,
            frequency: 50.0,
            power_factor: 0.95,
            arc_detected: false,
            status: 'normal',
          })
        }
      }
    }

    return NextResponse.json({ data: { success: true }, error: null })
  } catch {
    return NextResponse.json({ data: null, error: 'Gagal menyelesaikan onboarding.' }, { status: 500 })
  }
}

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ data: null, error: 'Unauthorized' }, { status: 401 })

  // 1. Ambil tenant_id pengguna yang sedang login
  const { data: profile } = await supabase
    .from('profiles')
    .select('tenant_id')
    .eq('id', session.user.id)
    .single()

  if (!profile?.tenant_id) {
    return NextResponse.json({ data: [], error: null })
  }

  // 2. Ambil HANYA panel milik tenant sekolah yang bersangkutan
  const { data: panels, error: panelsError } = await supabase
    .from('panels')
    .select('*')
    .eq('tenant_id', profile.tenant_id)
    .eq('is_active', true)
    .order('name', { ascending: true })

  if (panelsError || !panels) {
    return NextResponse.json({ data: null, error: panelsError?.message || 'Error' }, { status: 500 })
  }
  return NextResponse.json({ data: panels, error: null })
}

export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ data: null, error: 'Unauthorized' }, { status: 401 })

  const { name, location_label, floor_x, floor_y } = await request.json()
  const { data: profile } = await supabase.from('profiles').select('tenant_id').eq('id', session.user.id).single()

  if (!profile) return NextResponse.json({ data: null, error: 'Profile not found' }, { status: 404 })

  const { data: panel, error } = await supabase
    .from('panels')
    .insert({
      tenant_id: profile.tenant_id,
      name,
      location_label: location_label || 'Gedung Sekolah',
      floor_x: floor_x ?? 50.0,
      floor_y: floor_y ?? 50.0,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ data: null, error: error.message }, { status: 500 })

  // Insert initial default reading for the new panel
  await supabase.from('sensor_readings').insert({
    panel_id: panel.id,
    tenant_id: profile.tenant_id,
    voltage: 220.0,
    current_a: 12.5,
    power: 2750.0,
    temperature_panel: 38.0,
    temperature_ambient: 28.5,
    frequency: 50.0,
    power_factor: 0.95,
    arc_detected: false,
    status: 'normal',
  })

  return NextResponse.json({ data: panel, error: null })
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ data: null, error: 'Panel ID wajib disertakan' }, { status: 400 })

    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return NextResponse.json({ data: null, error: 'Unauthorized' }, { status: 401 })

    const { error } = await supabase
      .from('panels')
      .delete()
      .eq('id', id)

    if (error) return NextResponse.json({ data: null, error: error.message }, { status: 500 })
    return NextResponse.json({ data: { success: true }, error: null })
  } catch {
    return NextResponse.json({ data: null, error: 'Gagal menghapus titik panel' }, { status: 500 })
  }
}

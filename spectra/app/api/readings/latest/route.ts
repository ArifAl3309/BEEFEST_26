import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { DUMMY_PANELS } from '@/lib/dummyData'

export async function GET() {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  
  // Jika session belum ada atau sedang preview demo, kembalikan DUMMY_PANELS agar kanvas & sidebar langsung hidup
  if (!session) {
    return NextResponse.json({ data: DUMMY_PANELS, error: null })
  }

  // 1. Ambil tenant_id pengguna yang sedang login
  const { data: profile } = await supabase
    .from('profiles')
    .select('tenant_id')
    .eq('id', session.user.id)
    .single()

  if (!profile?.tenant_id) {
    return NextResponse.json({ data: DUMMY_PANELS, error: null })
  }

  // 2. Ambil HANYA panel milik tenant sekolah ini
  const { data: panels, error: panelsError } = await supabase
    .from('panels')
    .select('*')
    .eq('tenant_id', profile.tenant_id)
    .eq('is_active', true)
    .order('name', { ascending: true })

  if (panelsError || !panels || panels.length === 0) {
    // Jika belum ada panel di DB sekolah baru, fallback langsung ke DUMMY_PANELS agar langsung tampil
    return NextResponse.json({ data: DUMMY_PANELS, error: null })
  }

  const panelsWithReadings = await Promise.all(
    panels.map(async (panel) => {
      const { data: reading } = await supabase
        .from('sensor_readings')
        .select('*')
        .eq('panel_id', panel.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      return {
        ...panel,
        latest_reading: reading || null,
      }
    })
  )

  return NextResponse.json({ data: panelsWithReadings, error: null })
}

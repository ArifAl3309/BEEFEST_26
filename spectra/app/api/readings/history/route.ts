import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const panelId = searchParams.get('panelId')

    if (!panelId) {
      return NextResponse.json({ data: null, error: 'panelId parameter is required' }, { status: 400 })
    }

    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return NextResponse.json({ data: null, error: 'Unauthorized' }, { status: 401 })

    // Ambil 30 pembacaan sensor terakhir untuk chart & riwayat tabel
    const { data, error } = await supabase
      .from('sensor_readings')
      .select('*')
      .eq('panel_id', panelId)
      .order('created_at', { ascending: false })
      .limit(30)

    if (error) {
      return NextResponse.json({ data: null, error: error.message }, { status: 500 })
    }

    // Urutkan ascending untuk grafik
    const chronologicalData = (data || []).slice().reverse()

    return NextResponse.json({
      data: {
        chartData: chronologicalData,
        logs: data || []
      },
      error: null
    })
  } catch {
    return NextResponse.json({ data: null, error: 'Gagal mengambil data riwayat telemetri' }, { status: 500 })
  }
}

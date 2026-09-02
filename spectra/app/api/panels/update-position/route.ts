import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function PATCH(request: Request) {
  try {
    const { panelId, floor_x, floor_y } = await request.json()
    const supabase = createClient()

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return NextResponse.json({ data: null, error: 'Unauthorized' }, { status: 401 })

    const { data, error } = await supabase
      .from('panels')
      .update({
        floor_x: Math.max(0, Math.min(100, floor_x)),
        floor_y: Math.max(0, Math.min(100, floor_y)),
      })
      .eq('id', panelId)
      .select()
      .single()

    if (error) return NextResponse.json({ data: null, error: error.message }, { status: 500 })
    return NextResponse.json({ data, error: null })
  } catch {
    return NextResponse.json({ data: null, error: 'Gagal memperbarui posisi node' }, { status: 500 })
  }
}

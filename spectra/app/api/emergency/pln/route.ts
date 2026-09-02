import { createClient, createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const payload = await request.json()
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return NextResponse.json({ data: null, error: 'Unauthorized' }, { status: 401 })

    const admin = createAdminClient()

    // 1. Catat ke tabel alerts
    const { error: alertError } = await admin
      .from('alerts')
      .insert({
        panel_id: payload.panel_id,
        tenant_id: payload.tenant_id,
        status: 'danger',
        message: `DISPATCH PLN: ${payload.danger_reason || 'Bahaya Anomali Arus/Suhu Kritis'} pada ${payload.panel_name}`,
        pln_dispatched: true,
      })

    if (alertError) {
      return NextResponse.json({ data: null, error: alertError.message }, { status: 500 })
    }

    // 2. Mocking Call ke PLN API Gateway
    const mockTicketId = `PLN-${Date.now().toString().slice(-6)}`

    return NextResponse.json({
      data: {
        success: true,
        ticketId: mockTicketId,
        message: 'Laporan darurat berhasil didispatch ke Posko PLN Terdekat.',
        dispatchedAt: new Date().toISOString(),
      },
      error: null,
    })
  } catch {
    return NextResponse.json({ data: null, error: 'Gagal mengirim sinyal darurat PLN.' }, { status: 500 })
  }
}

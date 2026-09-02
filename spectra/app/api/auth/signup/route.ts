import { createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { fullName, email, password, activationCode } = await request.json()

    if (!fullName || !email || !password || !activationCode) {
      return NextResponse.json({ data: null, error: 'Seluruh field dan Kode Aktivasi wajib diisi.' }, { status: 400 })
    }

    const admin = createAdminClient()
    const cleanCode = activationCode.trim().toUpperCase()

    // 1. Verifikasi Kode Aktivasi Perangkat Fisik (Tenant)
    const { data: tenant, error: tenantError } = await admin
      .from('tenants')
      .select('id, name, onboarding_completed, is_active')
      .eq('activation_code', cleanCode)
      .single()

    if (tenantError || !tenant) {
      return NextResponse.json({ data: null, error: 'Kode Aktivasi Perangkat tidak valid atau tidak terdaftar.' }, { status: 404 })
    }

    if (!tenant.is_active) {
      return NextResponse.json({ data: null, error: 'Kode Aktivasi ini telah dinonaktifkan.' }, { status: 403 })
    }

    // 2. Buat Pengguna di Supabase Auth
    const { data: authUser, error: authError } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName },
    })

    if (authError || !authUser.user) {
      return NextResponse.json({ data: null, error: authError?.message || 'Gagal mendaftarkan akun.' }, { status: 400 })
    }

    // 3. Hubungkan profil ke Tenant
    const { error: profileError } = await admin
      .from('profiles')
      .insert({
        id: authUser.user.id,
        full_name: fullName,
        role: 'operator',
        tenant_id: tenant.id,
      })

    if (profileError) {
      return NextResponse.json({ data: null, error: 'Gagal mengaitkan akun dengan data sekolah.' }, { status: 500 })
    }

    return NextResponse.json({
      data: {
        userId: authUser.user.id,
        tenantId: tenant.id,
        tenantName: tenant.name,
        onboardingCompleted: tenant.onboarding_completed,
      },
      error: null,
    })
  } catch {
    return NextResponse.json({ data: null, error: 'Terjadi kegagalan server saat pendaftaran.' }, { status: 500 })
  }
}

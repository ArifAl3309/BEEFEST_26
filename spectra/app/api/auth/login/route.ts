import { createClient, createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

interface TenantData {
  id: string
  name: string
  onboarding_completed: boolean
  is_active: boolean
}

interface ProfileWithTenant {
  full_name: string
  role: 'admin' | 'operator'
  tenant_id: string
  tenants: TenantData | null
}

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ data: null, error: 'Email dan kata sandi wajib diisi.' }, { status: 400 })
    }

    const supabase = createClient()
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError || !authData.user) {
      return NextResponse.json({ data: null, error: 'Email atau kata sandi tidak valid.' }, { status: 401 })
    }

    const adminClient = createAdminClient()
    const { data: profile, error: profileError } = await adminClient
      .from('profiles')
      .select('full_name, role, tenant_id, tenants(id, name, onboarding_completed, is_active)')
      .eq('id', authData.user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ data: null, error: 'Profil sekolah tidak ditemukan.' }, { status: 404 })
    }

    const typedProfile = profile as unknown as ProfileWithTenant
    const tenant = typedProfile.tenants
    if (tenant && !tenant.is_active) {
      await supabase.auth.signOut()
      return NextResponse.json({ data: null, error: 'Akun sekolah sedang non-aktif. Hubungi administrator.' }, { status: 403 })
    }

    return NextResponse.json({
      data: {
        userId: authData.user.id,
        fullName: typedProfile.full_name,
        role: typedProfile.role,
        tenantId: typedProfile.tenant_id,
        tenantName: tenant?.name ?? '',
        onboardingCompleted: tenant?.onboarding_completed ?? false,
      },
      error: null,
    })
  } catch {
    return NextResponse.json({ data: null, error: 'Terjadi kesalahan internal server.' }, { status: 500 })
  }
}

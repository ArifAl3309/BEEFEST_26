import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardClientLayout from '@/components/dashboard/DashboardClientLayout'

interface ProfileData {
  full_name: string
  tenant_id: string
  tenants: { name: string } | null
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, tenant_id, tenants(name)')
    .eq('id', session.user.id)
    .single()

  const typedProfile = profile as unknown as ProfileData
  const tenantName = typedProfile?.tenants?.name || ''

  return (
    <DashboardClientLayout
      tenantName={tenantName}
      userFullName={typedProfile?.full_name || 'Operator'}
    >
      {children}
    </DashboardClientLayout>
  )
}

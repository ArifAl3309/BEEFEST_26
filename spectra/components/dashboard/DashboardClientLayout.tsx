'use client'

import { useState, useEffect } from 'react'
import Navbar from './Navbar'
import { createClient } from '@/lib/supabase/client'

interface LayoutProps {
  tenantName: string
  userFullName: string
  children: React.ReactNode
}

export default function DashboardClientLayout({ tenantName, userFullName, children }: LayoutProps) {
  const [isConnected, setIsConnected] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel('system-liveness')
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED')
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-[--bg-base]">
      <Navbar tenantName={tenantName} userFullName={userFullName} isConnected={isConnected} />
      <div className="flex-1 flex overflow-hidden">{children}</div>
    </div>
  )
}

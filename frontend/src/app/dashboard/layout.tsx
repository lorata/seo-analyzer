'use client'

import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Sidebar from '@/components/layout/Sidebar'
import Footer from '@/components/layout/Footer'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1">
        {sidebarOpen && <Sidebar />}
        <main className="flex-1 overflow-auto">
          <div className="container py-8">
            {children}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  )
}

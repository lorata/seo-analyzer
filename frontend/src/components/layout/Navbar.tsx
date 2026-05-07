'use client'

import Link from 'next/link'
import { Menu } from 'lucide-react'

interface NavbarProps {
  onMenuClick: () => void
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <button
              onClick={onMenuClick}
              className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
            >
              <Menu size={20} />
            </button>
            <Link href="/dashboard" className="font-bold text-xl text-primary">
              SEO Analyzer Pro
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-primary rounded-full"></div>
          </div>
        </div>
      </div>
    </nav>
  )
}

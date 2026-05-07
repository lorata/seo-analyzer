'use client'

import Link from 'next/link'
import { startAudit } from '@/services/auditService'
import { BarChart3, Settings } from 'lucide-react'
import { useState } from 'react'

interface WebsiteCardProps {
  website: any
}

export default function WebsiteCard({ website }: WebsiteCardProps) {
  const [loading, setLoading] = useState(false)

  const handleStartAudit = async () => {
    setLoading(true)
    try {
      const audit = await startAudit(website.id)
      // Redirect to audit page
      window.location.href = `/dashboard/audit/${audit.id}`
    } catch (err) {
      console.error('Failed to start audit:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition">
      <div className="bg-gradient-to-r from-primary to-secondary h-2"></div>
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-dark mb-1">{website.name}</h3>
          <p className="text-sm text-gray-600">{website.domain}</p>
        </div>

        {website.description && (
          <p className="text-sm text-gray-700 mb-4 line-clamp-2">
            {website.description}
          </p>
        )}

        <div className="mb-6 p-4 bg-light rounded-lg">
          <p className="text-xs text-gray-600 mb-1">Estimated Pages</p>
          <p className="text-2xl font-bold text-primary">{website.page_count}</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleStartAudit}
            disabled={loading}
            className="flex-1 bg-primary text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-600 transition disabled:opacity-50"
          >
            <BarChart3 size={18} />
            {loading ? 'Starting...' : 'Audit'}
          </button>
          <Link
            href={`/dashboard/website/${website.id}/settings`}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center justify-center"
          >
            <Settings size={18} />
          </Link>
        </div>
      </div>
    </div>
  )
}

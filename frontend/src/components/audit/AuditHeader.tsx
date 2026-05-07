'use client'

import { Download, Filter } from 'lucide-react'
import { useState } from 'react'

interface AuditHeaderProps {
  audit: any
  auditId: string
}

export default function AuditHeader({ audit, auditId }: AuditHeaderProps) {
  const [showDownloadMenu, setShowDownloadMenu] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-success'
      case 'running':
        return 'bg-blue-100 text-primary'
      case 'pending':
        return 'bg-gray-100 text-gray-700'
      case 'failed':
        return 'bg-red-100 text-danger'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  if (!audit) return null

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold text-dark mb-2">SEO Audit Report</h1>
          <p className="text-gray-600">Domain: {audit.website_id}</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <button
              onClick={() => setShowDownloadMenu(!showDownloadMenu)}
              className="bg-primary text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition"
            >
              <Download size={20} />
              Download Report
            </button>
            {showDownloadMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <button className="w-full px-4 py-2 text-left hover:bg-gray-100 border-b">PDF</button>
                <button className="w-full px-4 py-2 text-left hover:bg-gray-100 border-b">Excel</button>
                <button className="w-full px-4 py-2 text-left hover:bg-gray-100">Both</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(audit.status)}`}>
          {audit.status?.toUpperCase()}
        </span>
        <span className="text-gray-600">Completed: {audit.completed_at ? new Date(audit.completed_at).toLocaleDateString() : 'Pending'}</span>
      </div>
    </div>
  )
}

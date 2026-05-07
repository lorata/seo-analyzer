'use client'

import { useEffect, useState } from 'react'
import WebsiteCard from '@/components/dashboard/WebsiteCard'
import CreateWebsiteModal from '@/components/dashboard/CreateWebsiteModal'
import { getWebsites } from '@/services/websiteService'
import { Plus } from 'lucide-react'

export default function DashboardPage() {
  const [websites, setWebsites] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    const fetchWebsites = async () => {
      try {
        const data = await getWebsites()
        setWebsites(data.data || [])
      } catch (err) {
        console.error('Failed to fetch websites:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchWebsites()
  }, [showCreateModal])

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-dark mb-2">Dashboard</h1>
          <p className="text-gray-600">Manage your websites and SEO audits</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-primary text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition"
        >
          <Plus size={20} />
          New Website
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : websites.length === 0 ? (
        <div className="bg-white rounded-lg p-12 text-center">
          <p className="text-gray-500 mb-4">No websites yet</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="text-primary hover:underline"
          >
            Create your first website
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {websites.map((website: any) => (
            <WebsiteCard key={website.id} website={website} />
          ))}
        </div>
      )}

      {showCreateModal && (
        <CreateWebsiteModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  )
}

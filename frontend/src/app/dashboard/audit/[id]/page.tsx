'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import AuditTabs from '@/components/audit/AuditTabs'
import AuditHeader from '@/components/audit/AuditHeader'
import IssuesList from '@/components/audit/IssuesList'
import { getAudit, getAuditIssues } from '@/services/auditService'
import { Activity } from 'lucide-react'

export default function AuditPage() {
  const params = useParams()
  const auditId = params.id as string
  const [audit, setAudit] = useState(null)
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    const fetchAudit = async () => {
      try {
        const auditData = await getAudit(auditId)
        setAudit(auditData)

        const issuesData = await getAuditIssues(auditId)
        setIssues(issuesData.data || [])
      } catch (err) {
        console.error('Failed to fetch audit:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAudit()
  }, [auditId])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Activity className="animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <AuditHeader audit={audit} auditId={auditId} />
      <AuditTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="mt-8">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Total Issues</p>
              <p className="text-3xl font-bold text-dark">{issues.length}</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Critical</p>
              <p className="text-3xl font-bold text-danger">
                {issues.filter(i => i.type === 'critical').length}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Warnings</p>
              <p className="text-3xl font-bold text-warning">
                {issues.filter(i => i.type === 'warning').length}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Info</p>
              <p className="text-3xl font-bold text-blue-500">
                {issues.filter(i => i.type === 'info').length}
              </p>
            </div>
          </div>
        )}

        {(activeTab === 'issues' || activeTab === 'overview') && (
          <IssuesList issues={issues} />
        )}
      </div>
    </div>
  )
}

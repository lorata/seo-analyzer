'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface IssuesListProps {
  issues: any[]
}

export default function IssuesList({ issues }: IssuesListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [filterType, setFilterType] = useState<string>('all')

  const filteredIssues = filterType === 'all' 
    ? issues 
    : issues.filter(issue => issue.type === filterType)

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'critical':
        return 'bg-red-100 text-danger border-red-300'
      case 'warning':
        return 'bg-yellow-100 text-warning border-yellow-300'
      case 'info':
        return 'bg-blue-100 text-primary border-blue-300'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Meta Tags':
        return 'bg-purple-100 text-purple-700'
      case 'Performance':
        return 'bg-orange-100 text-orange-700'
      case 'Security':
        return 'bg-red-100 text-red-700'
      case 'Technical SEO':
        return 'bg-blue-100 text-blue-700'
      case 'Mobile':
        return 'bg-green-100 text-green-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div>
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setFilterType('all')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filterType === 'all'
              ? 'bg-primary text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All ({issues.length})
        </button>
        <button
          onClick={() => setFilterType('critical')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filterType === 'critical'
              ? 'bg-danger text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Critical ({issues.filter(i => i.type === 'critical').length})
        </button>
        <button
          onClick={() => setFilterType('warning')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filterType === 'warning'
              ? 'bg-warning text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Warnings ({issues.filter(i => i.type === 'warning').length})
        </button>
        <button
          onClick={() => setFilterType('info')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filterType === 'info'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Info ({issues.filter(i => i.type === 'info').length})
        </button>
      </div>

      <div className="space-y-4">
        {filteredIssues.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-500">No issues found</p>
          </div>
        ) : (
          filteredIssues.map((issue) => (
            <div
              key={issue.id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition"
            >
              <button
                onClick={() =>
                  setExpandedId(expandedId === issue.id ? null : issue.id)
                }
                className="w-full px-6 py-4 flex items-start justify-between hover:bg-gray-50 transition"
              >
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                        getTypeColor(issue.type)
                      }`}
                    >
                      {issue.type?.toUpperCase()}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        getCategoryColor(issue.category)
                      }`}
                    >
                      {issue.category}
                    </span>
                  </div>
                  <h3 className="font-bold text-dark">{issue.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {issue.description}
                  </p>
                </div>
                <ChevronDown
                  size={20}
                  className={`flex-shrink-0 text-gray-400 transition ${
                    expandedId === issue.id ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {expandedId === issue.id && (
                <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
                  <div className="mb-4">
                    <h4 className="font-semibold text-dark mb-2">Recommendation</h4>
                    <p className="text-gray-700 text-sm">{issue.recommendation}</p>
                  </div>
                  <div className="mb-4">
                    <h4 className="font-semibold text-dark mb-2">How to Fix</h4>
                    <p className="text-gray-700 text-sm">{issue.how_to_fix}</p>
                  </div>
                  {issue.affected_pages && (
                    <div>
                      <h4 className="font-semibold text-dark mb-2">Affected Pages</h4>
                      <p className="text-gray-700 text-sm">{issue.affected_pages} page(s)</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

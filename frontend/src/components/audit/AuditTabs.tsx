'use client'

interface AuditTabsProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'issues', label: 'Issues' },
  { id: 'recommendations', label: 'Recommendations' },
  { id: 'keywords', label: 'Keywords' },
]

export default function AuditTabs({ activeTab, setActiveTab }: AuditTabsProps) {
  return (
    <div className="border-b border-gray-200">
      <div className="flex gap-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-4 font-medium border-b-2 transition ${
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-600 hover:text-dark'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  )
}

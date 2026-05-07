'use client'

import { useState, useEffect } from 'react'
import { researchKeywords } from '@/services/keywordService'
import { Search } from 'lucide-react'

export default function KeywordResearch() {
  const [query, setQuery] = useState('')
  const [keywords, setKeywords] = useState([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    try {
      const results = await researchKeywords(query)
      setKeywords(results)
    } catch (err) {
      console.error('Keyword research error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-dark mb-4">Keyword Research</h2>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter keyword to research..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition disabled:opacity-50"
          >
            <Search size={20} />
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>
      </div>

      {keywords.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Keyword</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Search Volume</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Difficulty</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-dark">CPC</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Trend</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-dark">Action</th>
              </tr>
            </thead>
            <tbody>
              {keywords.map((keyword, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-medium text-dark">{keyword.keyword}</td>
                  <td className="px-6 py-4 text-gray-700">{keyword.searchVolume?.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      {keyword.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">${keyword.cpc?.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      keyword.trend === 'rising'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {keyword.trend}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-primary hover:underline text-sm font-medium">
                      Track
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

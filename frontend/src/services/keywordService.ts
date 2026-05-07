import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
})

export const researchKeywords = async (query: string, limit = 20) => {
  const response = await api.post('/keywords/research', { query, limit })
  return response.data
}

export const getTrackedKeywords = async (
  websiteId: string,
  page = 1,
  limit = 20
) => {
  const response = await api.get(`/keywords/tracked/${websiteId}`, {
    params: { page, limit },
  })
  return response.data
}

export const trackKeyword = async (
  websiteId: string,
  data: { keyword: string; url: string }
) => {
  const response = await api.post(`/keywords/track/${websiteId}`, data)
  return response.data
}

export const getRankingHistory = async (keywordId: string, days = 30) => {
  const response = await api.get(`/keywords/history/${keywordId}`, {
    params: { days },
  })
  return response.data
}

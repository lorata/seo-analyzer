import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
})

export const getWebsites = async (page = 1, limit = 10) => {
  const response = await api.get('/websites', { params: { page, limit } })
  return response.data
}

export const getWebsite = async (id: string) => {
  const response = await api.get(`/websites/${id}`)
  return response.data
}

export const createWebsite = async (data: {
  domain: string
  name: string
  description?: string
  pageCount: number
}) => {
  const response = await api.post('/websites', data)
  return response.data
}

export const updateWebsite = async (
  id: string,
  data: Partial<{
    name: string
    description: string
    pageCount: number
  }>
) => {
  const response = await api.put(`/websites/${id}`, data)
  return response.data
}

export const deleteWebsite = async (id: string) => {
  const response = await api.delete(`/websites/${id}`)
  return response.data
}

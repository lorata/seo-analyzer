import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
})

export const startAudit = async (websiteId: string) => {
  const response = await api.post('/audit/start', { websiteId })
  return response.data
}

export const getAudit = async (auditId: string) => {
  const response = await api.get(`/audit/${auditId}`)
  return response.data
}

export const getAuditIssues = async (
  auditId: string,
  severity?: string,
  page = 1,
  limit = 20
) => {
  const response = await api.get(`/audit/${auditId}/issues`, {
    params: { severity, page, limit },
  })
  return response.data
}

export const getAuditReport = async (auditId: string) => {
  const response = await api.get(`/audit/${auditId}/report`)
  return response.data
}

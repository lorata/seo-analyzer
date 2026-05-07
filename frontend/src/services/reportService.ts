import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
})

export const generateReport = async (
  auditId: string,
  reportType: 'pdf' | 'excel' | 'both' = 'pdf'
) => {
  const response = await api.post('/reports/generate', {
    auditId,
    reportType,
  })
  return response.data
}

export const getReport = async (reportId: string) => {
  const response = await api.get(`/reports/${reportId}`)
  return response.data
}

export const downloadReport = async (reportId: string) => {
  const response = await api.get(`/reports/${reportId}/download`, {
    responseType: 'blob',
  })
  return response.data
}

export const listReports = async (
  auditId: string,
  page = 1,
  limit = 10
) => {
  const response = await api.get(`/reports/audit/${auditId}`, {
    params: { page, limit },
  })
  return response.data
}

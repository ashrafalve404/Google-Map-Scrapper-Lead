import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

export const searchAPI = {
  start: (query, location) => api.post('/search', { query, location }),
  getAll: () => api.get('/searches'),
  getStatus: (id) => api.get(`/search/${id}/status`),
  getPlaces: (id, params) => api.get(`/search/${id}/places`, { params }),
  exportCSV: (id) => window.open(`/api/search/${id}/export`, '_blank'),
  delete: (id) => api.delete(`/search/${id}`),
}

export const statsAPI = {
  get: () => api.get('/stats'),
}

export default api

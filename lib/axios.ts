import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// ── Request interceptor ─────────────────────────────────────────────────────
// Axios automatically reads the XSRF-TOKEN cookie and sends it as
// X-XSRF-TOKEN on every mutating request — no manual handling needed.
api.interceptors.request.use((config) => {
  return config
})

// ── Response interceptor ────────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear the Zustand auth store and redirect to login.
      // Dynamic import avoids a circular dependency (store → axios → store).
      import('@/stores/auth-store').then(({ useAuthStore }) => {
        useAuthStore.getState().clearUser()
      })

      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  },
)

export default api

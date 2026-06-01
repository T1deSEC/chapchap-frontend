import axios from 'axios'
import type { AxiosResponse } from 'axios'
import { useAuthStore } from '../store/authStore'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '',
})

export function unwrapApiResponse(res: AxiosResponse): AxiosResponse {
  if (
    res.data !== null &&
    typeof res.data === 'object' &&
    'success' in res.data &&
    'data' in res.data
  ) {
    res.data = (res.data as { data: unknown }).data
  }
  return res
}

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

let isRefreshing = false
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: unknown) => void }> = []

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token!)))
  failedQueue = []
}

apiClient.interceptors.response.use(
  (res) => unwrapApiResponse(res),
  async (error) => {
    const original = error.config

    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error)
    }

    if (original.url?.includes('/api/auth/refresh')) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      }).then((token) => {
        original.headers.Authorization = `Bearer ${token}`
        return apiClient(original)
      })
    }

    original._retry = true
    isRefreshing = true

    const { refreshToken, setTokens, logout } = useAuthStore.getState()

    if (!refreshToken) {
      logout()
      window.location.href = '/login'
      return Promise.reject(error)
    }

    try {
      const res = await apiClient.post<{ accessToken: string; refreshToken: string }>(
        '/api/auth/refresh',
        { refreshToken }
      )
      const { accessToken, refreshToken: newRefresh } = res.data
      setTokens(accessToken, newRefresh)
      processQueue(null, accessToken)
      original.headers.Authorization = `Bearer ${accessToken}`
      return apiClient(original)
    } catch (err) {
      processQueue(err)
      logout()
      window.location.href = '/login'
      return Promise.reject(err)
    } finally {
      isRefreshing = false
    }
  }
)

export default apiClient

import apiClient from './client'
import type { AuthResponse } from '../types'

export const login = (email: string, password: string) =>
  apiClient.post<AuthResponse>('/api/auth/login', { email, password })

export const register = (name: string, email: string, password: string, skinType: string, registrationToken: string) =>
  apiClient.post<AuthResponse>('/api/auth/register', { name, email, password, skinType, registrationToken })

export const refreshTokens = (refreshToken: string) =>
  apiClient.post<{ accessToken: string; refreshToken: string }>('/api/auth/refresh', { refreshToken })

export const logoutApi = () =>
  apiClient.post('/api/auth/logout')

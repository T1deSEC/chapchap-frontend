import apiClient from './client'
import type { AuthResponse } from '../types'

export const login = (email: string, password: string) =>
  apiClient.post<AuthResponse>('/api/auth/login', { email, password })

export const register = (
  name: string,
  email: string,
  password: string,
  skinType: string
) =>
  apiClient.post<AuthResponse>('/api/auth/register', {
    name,
    email,
    password,
    skinType,
  })

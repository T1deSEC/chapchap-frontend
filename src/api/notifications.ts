import apiClient from './client'
import type { Notification, PageResponse } from '../types'

export const getNotifications = (page = 0, size = 20) =>
  apiClient.get<PageResponse<Notification>>('/api/notifications', { params: { page, size } })

export const getUnreadCount = () =>
  apiClient.get<number>('/api/notifications/unread-count')

export const markAsRead = (id: number) =>
  apiClient.put(`/api/notifications/${id}/read`)

export const markAllAsRead = () =>
  apiClient.put('/api/notifications/read-all')

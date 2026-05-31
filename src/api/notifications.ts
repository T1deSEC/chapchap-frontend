import apiClient from './client'

export interface Notification {
  id: number
  icon: string
  title: string
  body: string
  createdAt: string
}

export const getNotifications = () =>
  apiClient.get<Notification[]>('/api/notifications')

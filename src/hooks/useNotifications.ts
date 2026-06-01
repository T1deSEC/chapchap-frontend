import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
} from '../api/notifications'

export const useNotifications = (page = 0, size = 20) =>
  useQuery({
    queryKey: ['notifications', page, size],
    queryFn: () => getNotifications(page, size).then((r) => r.data),
  })

export const useUnreadCount = () =>
  useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: () => getUnreadCount().then((r) => r.data.count),
  })

export const useMarkAsReadMutation = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => markAsRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  })
}

export const useMarkAllAsReadMutation = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => markAllAsRead(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  })
}

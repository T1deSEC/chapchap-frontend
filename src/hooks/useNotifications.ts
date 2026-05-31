import { useQuery } from '@tanstack/react-query'
import { getNotifications } from '../api/notifications'

export const useNotifications = () =>
  useQuery({
    queryKey: ['notifications'],
    queryFn: () => getNotifications().then((r) => r.data),
  })

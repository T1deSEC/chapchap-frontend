import { Link } from 'react-router-dom'
import { useNotifications, useMarkAsReadMutation, useMarkAllAsReadMutation } from '../../hooks/useNotifications'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

const TYPE_ICON: Record<string, string> = {
  INGREDIENT_ANALYSIS: 'science',
  ROUTINE_CONFLICT:    'warning',
  ROUTINE_CAUTION:     'info',
}

export default function NotificationPage() {
  const { data: notifications = [], isLoading } = useNotifications()
  const { mutate: markOne } = useMarkAsReadMutation()
  const { mutate: markAll } = useMarkAllAsReadMutation()

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark">
      <div className="sticky top-0 z-10 flex h-14 items-center border-b border-gray-200 dark:border-gray-800 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm px-4">
        <Link to="/home" className="flex size-10 shrink-0 items-center justify-start">
          <span className="material-symbols-outlined text-gray-800 dark:text-gray-200">arrow_back_ios_new</span>
        </Link>
        <h1 className="flex-1 text-center text-lg font-bold text-gray-900 dark:text-gray-100 pr-10">알림</h1>
        {notifications.some((n) => !n.read) && (
          <button
            type="button"
            onClick={() => markAll()}
            className="text-xs font-medium text-primary whitespace-nowrap"
          >
            전체 읽음
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8"><LoadingSpinner /></div>
      ) : (
        <div className="flex flex-col gap-3 p-4">
          {notifications.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => !n.read && markOne(n.id)}
              className={`flex items-start gap-4 rounded-lg border p-4 text-left w-full transition-colors ${
                n.read
                  ? 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                  : 'border-primary/30 bg-primary/5 dark:bg-primary/10'
              }`}
            >
              <div className="mt-1 flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <span className="material-symbols-outlined text-primary">
                  {TYPE_ICON[n.type] ?? 'notifications'}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-base font-bold text-gray-900 dark:text-gray-100">{n.title}</p>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{n.body}</p>
              </div>
              <p className="shrink-0 text-xs text-gray-500 dark:text-gray-400">{n.createdAt}</p>
            </button>
          ))}
          {notifications.length === 0 && (
            <div className="flex flex-col items-center py-16 text-gray-400 dark:text-gray-600 gap-3">
              <span className="material-symbols-outlined text-5xl">notifications_off</span>
              <p className="text-sm">알림이 없습니다.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

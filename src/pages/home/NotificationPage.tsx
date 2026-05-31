import { Link } from 'react-router-dom'
import { useNotifications } from '../../hooks/useNotifications'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

export default function NotificationPage() {
  const { data: notifications = [], isLoading } = useNotifications()

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark">
      <div className="sticky top-0 z-10 flex h-14 items-center border-b border-gray-200 dark:border-gray-800 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm px-4">
        <Link to="/home" className="flex size-10 shrink-0 items-center justify-start">
          <span className="material-symbols-outlined text-gray-800 dark:text-gray-200">
            arrow_back_ios_new
          </span>
        </Link>
        <h1 className="flex-1 text-center text-lg font-bold text-gray-900 dark:text-gray-100 pr-10">
          알림
        </h1>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="flex flex-col gap-3 p-4">
          {notifications.map((n) => (
            <div
              key={n.id}
              className="flex items-start gap-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4"
            >
              <div className="mt-1 flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <span className="material-symbols-outlined text-primary">{n.icon}</span>
              </div>
              <div className="flex-1">
                <p className="text-base font-bold text-gray-900 dark:text-gray-100">{n.title}</p>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{n.body}</p>
              </div>
              <p className="shrink-0 text-xs text-gray-500 dark:text-gray-400">{n.createdAt}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

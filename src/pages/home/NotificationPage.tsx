import { motion } from 'framer-motion'
import { useNotifications, useMarkAsReadMutation, useMarkAllAsReadMutation } from '../../hooks/useNotifications'
import { SubpageHeader } from '../../components/SubpageHeader'
import { NotificationSkeleton } from '../../components/skeletons/NotificationSkeleton'
import { formatRelativeDate } from '../../utils/formatDate'

const TYPE_ICON: Record<string, string> = {
  INGREDIENT_ANALYSIS: 'science',
  ROUTINE_CONFLICT:    'warning',
  ROUTINE_CAUTION:     'info',
}

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
}

export default function NotificationPage() {
  const { data: notifications = [], isLoading } = useNotifications()
  const { mutate: markOne } = useMarkAsReadMutation()
  const { mutate: markAll } = useMarkAllAsReadMutation()

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark">
      <SubpageHeader
        title="알림"
        rightAction={
          notifications.some((n) => !n.read) ? (
            <button
              type="button"
              onClick={() => markAll()}
              className="text-xs font-medium text-primary whitespace-nowrap"
            >
              전체 읽음
            </button>
          ) : undefined
        }
      />

      {isLoading ? (
        <NotificationSkeleton />
      ) : (
        <motion.div
          className="flex flex-col gap-3 p-4"
          variants={listVariants}
          initial="hidden"
          animate="visible"
        >
          {notifications.map((n) => (
            <motion.button
              key={n.id}
              type="button"
              variants={itemVariants}
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
              <p className="shrink-0 text-xs text-gray-500 dark:text-gray-400">
                {formatRelativeDate(n.createdAt)}
              </p>
            </motion.button>
          ))}
          {notifications.length === 0 && (
            <div className="flex flex-col items-center py-16 text-gray-400 dark:text-gray-600 gap-3">
              <span className="material-symbols-outlined text-5xl">notifications_off</span>
              <p className="text-sm">알림이 없습니다.</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}

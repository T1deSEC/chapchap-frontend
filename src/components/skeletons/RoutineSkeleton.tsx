export function RoutineSkeleton() {
  return (
    <div className="p-4 space-y-3 animate-pulse">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 rounded-xl bg-white dark:bg-gray-800 p-3">
          <div className="w-14 h-14 rounded-lg bg-gray-200 dark:bg-gray-700 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

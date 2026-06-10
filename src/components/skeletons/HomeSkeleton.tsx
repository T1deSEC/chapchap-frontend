export function HomeSkeleton() {
  return (
    <div className="p-4 space-y-5 animate-pulse">
      <div className="h-28 bg-gray-200 dark:bg-gray-700 rounded-xl" />
      <div className="space-y-2">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-xl" />
          <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-xl" />
        </div>
      </div>
      <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl" />
    </div>
  )
}

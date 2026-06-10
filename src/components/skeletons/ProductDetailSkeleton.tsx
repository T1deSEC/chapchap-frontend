export function ProductDetailSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-64 bg-gray-200 dark:bg-gray-700 w-full" />
      <div className="p-4 space-y-3">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5" />
        <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl mt-4" />
      </div>
    </div>
  )
}

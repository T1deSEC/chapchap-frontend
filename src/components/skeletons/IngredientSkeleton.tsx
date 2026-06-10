export function IngredientSkeleton() {
  return (
    <div className="px-4 space-y-3 animate-pulse">
      <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-xl" />
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-3 items-center">
          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0" />
          <div className="flex-1 space-y-1">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

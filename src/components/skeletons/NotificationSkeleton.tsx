export function NotificationSkeleton() {
  return (
    <div className="flex flex-col gap-3 p-4 animate-pulse">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-start gap-4 rounded-lg border border-gray-100 p-4">
          <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-full" />
          </div>
          <div className="w-10 h-3 bg-gray-200 rounded shrink-0" />
        </div>
      ))}
    </div>
  )
}

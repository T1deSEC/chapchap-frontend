export function formatRelativeDate(iso: string): string {
  const now = new Date()
  const date = new Date(iso)
  const diffMin = Math.floor((now.getTime() - date.getTime()) / 60000)
  const diffHour = Math.floor(diffMin / 60)

  if (diffMin < 1) return '방금'
  if (diffMin < 60) return `${diffMin}분 전`
  if (diffHour < 24) return `${diffHour}시간 전`

  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  if (date.toDateString() === yesterday.toDateString()) return '어제'

  return `${date.getMonth() + 1}월 ${date.getDate()}일`
}

import { useQuery } from '@tanstack/react-query'
import { getWeatherTip } from '../../../api/home'

export function WeatherTipCard() {
  const { data, isLoading } = useQuery({
    queryKey: ['weatherTip'],
    queryFn: () => getWeatherTip(),
    staleTime: 60 * 60 * 1000, // 1 hour (matches backend cache TTL)
  })

  if (isLoading) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 animate-pulse dark:bg-blue-900/20 dark:border-blue-800">
        <div className="h-4 bg-blue-200 dark:bg-blue-700 rounded w-1/3 mb-2" />
        <div className="h-4 bg-blue-200 dark:bg-blue-700 rounded w-3/4" />
      </div>
    )
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 dark:bg-blue-900/20 dark:border-blue-800">
      <p className="text-sm font-semibold text-blue-800 dark:text-blue-300">☁️ 오늘의 피부 팁</p>
      <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
        {data?.message ?? '오늘도 꼼꼼한 스킨케어로 건강한 피부를 유지하세요.'}
      </p>
    </div>
  )
}

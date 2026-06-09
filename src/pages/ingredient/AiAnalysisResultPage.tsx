import { Link } from 'react-router-dom'
import { useAnalysisStore } from '../../store/analysisStore'

const SAFETY_STYLES = {
  safe:    { badge: 'bg-green-500', text: '안전', border: '' },
  caution: { badge: 'bg-yellow-400', text: '주의', border: 'border border-yellow-400' },
  warning: { badge: 'bg-red-500',   text: '위험', border: 'border-2 border-red-500' },
}

export default function AiAnalysisResultPage() {
  const result = useAnalysisStore((s) => s.ingredientResult)

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background-light dark:bg-background-dark gap-4">
        <p className="text-gray-500 dark:text-gray-400">분석 결과가 없습니다.</p>
        <Link to="/ingredient" className="text-primary font-medium">돌아가기</Link>
      </div>
    )
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-x-hidden pb-24">
      <div className="sticky top-0 z-10 flex items-center justify-between bg-background-light p-4 dark:bg-background-dark border-b border-gray-200 dark:border-gray-800">
        <Link to="/ingredient" className="flex size-10 items-center justify-center text-[#111318] dark:text-white">
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <h2 className="flex-1 text-center text-lg font-bold text-[#111318] dark:text-white">AI 성분 진단 결과</h2>
        <div className="size-10" />
      </div>

      <div className="flex flex-col gap-4 p-4">
        {/* 안전 점수 */}
        <div className="flex flex-col items-center gap-2 rounded-xl bg-white dark:bg-gray-900/50 p-6">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">종합 안전 점수</p>
          <p className="text-5xl font-bold text-primary">{result.safetyScore}<span className="text-2xl">점</span></p>
        </div>

        {/* 요약 */}
        {result.summary && (
          <div className="rounded-xl bg-white dark:bg-gray-900/50 p-4">
            <h3 className="font-bold text-[#111318] dark:text-white mb-2">분석 요약</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{result.summary}</p>
          </div>
        )}

        {/* 성분 분석 */}
        {result.ingredientAnalysis.length > 0 && (
          <div className="rounded-xl bg-white dark:bg-gray-900/50 p-4">
            <h3 className="font-bold text-[#111318] dark:text-white mb-3">성분별 분석</h3>
            <div className="flex flex-col gap-2">
              {result.ingredientAnalysis.map((ing) => {
                const style = SAFETY_STYLES[ing.safetyLevel]
                const displayName = ing.koName || ing.inciName
                return (
                  <div key={ing.inciName} className={`rounded-lg p-3 bg-gray-50 dark:bg-gray-800 ${style.border}`}>
                    <div className="flex items-center gap-2">
                      <span className={`flex h-5 w-5 items-center justify-center rounded-full ${style.badge} text-xs font-bold text-white shrink-0`}>
                        {ing.safetyLevel === 'warning' ? '!' : '✓'}
                      </span>
                      <span className="font-semibold text-[#111318] dark:text-white">{displayName}</span>
                    </div>
                    <p className="mt-1 pl-7 text-sm text-gray-500 dark:text-gray-400">{ing.assessment}</p>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* 추천 사항 */}
        {result.recommendations.length > 0 && (
          <div className="rounded-xl bg-white dark:bg-gray-900/50 p-4">
            <h3 className="font-bold text-[#111318] dark:text-white mb-3">추천 사항</h3>
            <ul className="flex flex-col gap-2">
              {result.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <span className="material-symbols-outlined text-primary text-base mt-0.5 shrink-0">lightbulb</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

import { Link } from 'react-router-dom'
import { useAnalysisStore } from '../../store/analysisStore'

const STATUS_CONFIG = {
  good: {
    label: '안전',
    icon: 'check_circle',
    bgColor: 'bg-green-500',
    textColor: 'text-green-500 dark:text-green-400',
  },
  caution: {
    label: '경고',
    icon: 'priority_high',
    bgColor: 'bg-red-500',
    textColor: 'text-red-500 dark:text-red-400',
  },
  conflict: {
    label: '경고',
    icon: 'priority_high',
    bgColor: 'bg-red-500',
    textColor: 'text-red-500 dark:text-red-400',
  },
}

export default function AiRoutineResultPage() {
  const result = useAnalysisStore((s) => s.routineResult)

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background-light dark:bg-background-dark">
        <p className="text-gray-500">분석 결과가 없습니다.</p>
        <Link to="/routine" className="mt-4 text-primary font-medium">루틴으로 돌아가기</Link>
      </div>
    )
  }

  const config = STATUS_CONFIG[result.status] ?? STATUS_CONFIG.conflict

  return (
    <div className="mx-auto flex max-w-sm flex-col min-h-screen bg-background-light dark:bg-background-dark">
      <header className="relative flex items-center justify-center p-4">
        <Link to="/routine" className="absolute left-4 text-gray-800 dark:text-gray-200">
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </Link>
        <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">AI 안전 진단</h1>
      </header>

      <main className="flex-grow flex flex-col items-center px-6 pt-12">
        <div className={`mb-4 flex h-24 w-24 items-center justify-center rounded-full ${config.bgColor}`}>
          <span className="material-symbols-outlined text-5xl text-white">{config.icon}</span>
        </div>
        <h2 className={`mb-8 text-2xl font-bold ${config.textColor}`}>{config.label}</h2>

        <div className="w-full rounded-2xl bg-white p-6 text-left shadow-sm dark:bg-gray-800">
          {result.conflictingPairs.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-500">science</span>
                <h3 className="font-bold text-gray-900 dark:text-gray-100">충돌 성분 쌍:</h3>
              </div>
              <ul className="mt-2 pl-8 flex flex-col gap-1">
                {result.conflictingPairs.map((pair, i) => (
                  <li key={i} className="text-gray-700 dark:text-gray-300 text-sm">
                    <span className="font-medium">{pair.ingredient1}</span>
                    <span className="mx-2 text-red-400">×</span>
                    <span className="font-medium">{pair.ingredient2}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.recommendation && (
            <div className="mb-6">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-500">lightbulb</span>
                <h3 className="font-bold text-gray-900 dark:text-gray-100">권장 사용 방법:</h3>
              </div>
              <p className="mt-1 pl-8 text-gray-700 dark:text-gray-300">{result.recommendation}</p>
            </div>
          )}

          {result.suggestedAdjustments.length > 0 && (
            <div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-500">auto_awesome</span>
                <h3 className="font-bold text-gray-900 dark:text-gray-100">루틴 조정 추천:</h3>
              </div>
              <ul className="mt-2 pl-8 flex flex-col gap-2">
                {result.suggestedAdjustments.map((adj, i) => (
                  <li key={i} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                    <span className="material-symbols-outlined text-primary text-base shrink-0">arrow_right</span>
                    <span>{adj}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>

      <footer className="p-6">
        <Link to="/routine" className="w-full rounded-lg bg-primary py-4 font-bold text-white text-center block">
          확인
        </Link>
      </footer>
    </div>
  )
}

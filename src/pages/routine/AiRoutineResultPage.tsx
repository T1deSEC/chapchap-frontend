import { Link } from 'react-router-dom'
import { useAnalysisStore } from '../../store/analysisStore'

const STATUS_CONFIG = {
  safe: {
    label: '안전',
    icon: 'check_circle',
    bgColor: 'bg-green-500',
    haloColor: 'bg-green-200 dark:bg-green-900/50',
    textColor: 'text-green-500 dark:text-green-400',
  },
  warning: {
    label: '주의',
    icon: 'warning',
    bgColor: 'bg-yellow-400',
    haloColor: 'bg-yellow-200 dark:bg-yellow-900/50',
    textColor: 'text-yellow-500 dark:text-yellow-400',
  },
  conflict: {
    label: '경고',
    icon: 'priority_high',
    bgColor: 'bg-red-500',
    haloColor: 'bg-red-200 dark:bg-red-900/50',
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
        <div className="relative mb-4 flex h-24 w-24 items-center justify-center">
          <div className={`absolute h-full w-full rounded-full ${config.haloColor} opacity-50`} />
          <div className={`flex h-[72px] w-[72px] items-center justify-center rounded-full ${config.bgColor}`}>
            <span className="material-symbols-outlined text-5xl text-white">{config.icon}</span>
          </div>
        </div>
        <h2 className={`mb-8 text-2xl font-bold ${config.textColor}`}>{config.label}</h2>

        <div className="w-full rounded-2xl bg-white p-6 text-left shadow-sm dark:bg-gray-800">
          {result.conflictingIngredients.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-500">science</span>
                <h3 className="font-bold text-gray-900 dark:text-gray-100">핵심 충돌 성분:</h3>
              </div>
              <p className="mt-1 pl-8 text-gray-700 dark:text-gray-300">
                {result.conflictingIngredients.join(', ')}
              </p>
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

          {result.suggestedProducts.length > 0 && (
            <div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-500">auto_awesome</span>
                <h3 className="font-bold text-gray-900 dark:text-gray-100">루틴 수정 추천 제품:</h3>
              </div>
              <div className="mt-4 space-y-4">
                {result.suggestedProducts.map((product, idx) => (
                  <div key={product.id}>
                    <div className="flex items-center gap-4 rounded-lg bg-gray-100 p-3 dark:bg-gray-700">
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} className="h-16 w-16 rounded-md object-cover" />
                      ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded-md bg-white dark:bg-gray-600">
                          <span className="material-symbols-outlined text-gray-300">image</span>
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-gray-800 dark:text-gray-200">{product.brand}</p>
                        <p className="text-gray-600 dark:text-gray-400">{product.name}</p>
                      </div>
                    </div>
                    {idx < result.suggestedProducts.length - 1 && (
                      <div className="flex justify-center">
                        <span className="material-symbols-outlined text-3xl text-gray-400 dark:text-gray-500">arrow_downward</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.status === 'safe' && result.conflictingIngredients.length === 0 && (
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-green-500">check_circle</span>
              <p className="text-gray-700 dark:text-gray-300">{result.recommendation || '현재 루틴에 성분 충돌이 없습니다.'}</p>
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

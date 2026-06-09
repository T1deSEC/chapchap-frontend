import { useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useProductDetail, useAiIngredientAnalysisMutation, useProductAiAnalysis } from '../../hooks/useIngredient'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

const getIngredientDisplayName = (ing: { koName: string; inciName: string }) =>
  ing.koName || ing.inciName

const SAFETY_BADGE: Record<string, string> = {
  '안전': 'bg-green-500',
  '주의': 'bg-yellow-400',
  '위험': 'bg-red-500',
}

const BAR_COLORS: Record<string, string> = {
  primary: 'bg-primary',
  warning: 'bg-yellow-400',
  danger:  'bg-red-500',
}

const TEXT_COLORS: Record<string, string> = {
  primary: 'text-primary',
  warning: 'text-yellow-400',
  danger:  'text-red-500',
}

export default function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>()
  const id = Number(productId)
  const { data: product, isLoading: isProductLoading } = useProductDetail(id)
  const { data: analysis, isLoading: isAnalysisLoading } = useProductAiAnalysis(id)
  const navigate = useNavigate()
  const { mutateAsync: runAnalysis, isPending: isAnalyzing } = useAiIngredientAnalysisMutation(id)

  const analysisMap = useMemo(() => {
    if (!analysis) return new Map<string, (typeof analysis.ingredientAnalysis)[number]>()
    return new Map(analysis.ingredientAnalysis.map((ing) => [ing.inciName, ing]))
  }, [analysis])

  const handleAiAnalysis = () => {
    navigate('/ingredient/ai-loading')
    runAnalysis()
      .then(() => navigate('/ingredient/ai-result'))
      .catch(() => navigate(`/ingredient/${productId}`))
  }

  if (isProductLoading || isAnalysisLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    )
  }

  if (!product) return null

  const circumference = 2 * Math.PI * 45

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-x-hidden">
      <div className="flex-1 pb-24">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200/80 bg-background-light/80 p-4 pb-3 backdrop-blur-sm dark:border-gray-800/80 dark:bg-background-dark/80">
          <Link to="/ingredient" className="flex size-10 items-center justify-center text-[#111318] dark:text-white">
            <span className="material-symbols-outlined text-3xl">arrow_back_ios_new</span>
          </Link>
          <h1 className="text-[#111318] dark:text-white text-lg font-bold">성분 분석</h1>
          <div className="size-10" />
        </header>

        <main className="flex flex-col">
          <div className="flex flex-col items-center gap-4 bg-white p-6 dark:bg-gray-900/50">
            {product.imageUrl && (
              <div className="relative size-24 shrink-0">
                <img src={product.imageUrl} alt={product.name} className="size-full object-contain" />
              </div>
            )}
            <div className="text-center">
              <p className="text-sm text-[#616f89] dark:text-gray-400">{product.brand}</p>
              <h2 className="mt-1 text-xl font-bold text-[#111318] dark:text-white">{product.name}</h2>
            </div>

            {analysis ? (
              <div className="relative size-32">
                <svg className="size-full" viewBox="0 0 100 100">
                  <circle className="stroke-current text-gray-200 dark:text-gray-700" cx="50" cy="50" r="45" fill="transparent" strokeWidth="10" />
                  <circle
                    className="stroke-current text-primary"
                    cx="50" cy="50" r="45" fill="transparent" strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference - (circumference * analysis.safetyScore) / 100}
                    style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xs font-medium text-[#616f89] dark:text-gray-400">안전 점수</span>
                  <span className="text-3xl font-bold text-primary">{analysis.safetyScore}</span>
                </div>
              </div>
            ) : (
              <div className="flex size-32 items-center justify-center rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600">
                <div className="flex flex-col items-center gap-1">
                  <span className="material-symbols-outlined text-gray-400">help_outline</span>
                  <span className="text-center text-xs text-gray-400 dark:text-gray-500">분석 전</span>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 flex flex-col gap-4 p-4">
            <h3 className="text-lg font-bold text-[#111318] dark:text-white">전 성분 리스트</h3>
            <div className="flex flex-col gap-2">
              {product.ingredients.map((ing) => {
                const aiIng = analysisMap.get(ing.inciName)
                const safetyLevel = aiIng?.safetyLevel
                return (
                  <div
                    key={ing.inciName}
                    className={`rounded-lg p-3 ${safetyLevel === '위험' ? 'border-2 border-red-500 bg-red-500/10 dark:bg-red-500/20' : 'bg-white dark:bg-gray-900/50'}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`flex size-5 items-center justify-center rounded-full text-xs font-bold text-white ${safetyLevel ? SAFETY_BADGE[safetyLevel] : 'bg-primary'}`}>
                          {safetyLevel === '위험' ? '!' : ing.concentrationOrder}
                        </span>
                        <span className={`font-semibold ${safetyLevel === '위험' ? 'text-red-500' : 'text-[#111318] dark:text-white'}`}>
                          {getIngredientDisplayName(ing)}
                        </span>
                      </div>
                      {safetyLevel === '위험' && (
                        <div className="flex items-center gap-1 rounded-full bg-red-500/20 px-2 py-0.5">
                          <span className="material-symbols-outlined text-sm text-red-500">error</span>
                          <span className="text-xs font-bold text-red-500">충돌</span>
                        </div>
                      )}
                    </div>
                    <p className={`mt-1 pl-7 text-sm ${safetyLevel === '위험' ? 'text-red-500/80' : 'text-[#616f89] dark:text-gray-400'}`}>
                      {(ing.functionTags ?? []).join(' · ')}
                    </p>
                    {aiIng?.assessment && (
                      <p className="mt-1 pl-7 text-xs text-[#616f89] dark:text-gray-500">{aiIng.assessment}</p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {product.skinImpacts.length > 0 && (
            <div className="mt-2 p-4">
              <h3 className="text-lg font-bold text-[#111318] dark:text-white">내 피부에 미치는 영향</h3>
              <div className="mt-4 flex flex-col gap-4 rounded-xl bg-white p-4 dark:bg-gray-900/50">
                {product.skinImpacts.map((impact) => (
                  <div key={impact.label} className="flex items-center gap-4">
                    <span className="w-16 shrink-0 text-sm font-medium text-[#616f89] dark:text-gray-400">{impact.label}</span>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                      <div className={`h-full rounded-full ${BAR_COLORS[impact.color]}`} style={{ width: `${impact.score}%` }} />
                    </div>
                    <span className={`w-16 text-right text-sm font-bold ${TEXT_COLORS[impact.color]}`}>{impact.level}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4 px-4 pb-4">
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={handleAiAnalysis}
                disabled={isAnalyzing}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-lg font-bold text-white disabled:opacity-50"
              >
                <span className="material-symbols-outlined">auto_awesome</span>
                <span>{analysis ? 'AI 성분 재진단' : 'AI 성분 진단'}</span>
              </button>
              <button type="button" className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-primary py-2.5 text-lg font-bold text-primary">
                <span className="material-symbols-outlined">add_task</span>
                <span>루틴에 추가</span>
              </button>
              <Link
                to={`/ingredient/${productId}/feedback`}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-lg font-bold text-white"
              >
                <span className="material-symbols-outlined">rate_review</span>
                <span>피드백 제출</span>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

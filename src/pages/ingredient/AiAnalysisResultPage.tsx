import { Link } from 'react-router-dom'
import { useAnalysisStore } from '../../store/analysisStore'
import type { AiIngredientResult } from '../../types'

export default function AiAnalysisResultPage() {
  const raw = useAnalysisStore((s) => s.ingredientResult)

  let result: AiIngredientResult = { recommendedProducts: [] }
  if (raw?.summary) {
    try { result = JSON.parse(raw.summary) as AiIngredientResult } catch { /* ignore */ }
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-x-hidden pb-24">
      <div className="sticky top-0 z-10 flex items-center justify-between bg-background-light p-4 dark:bg-background-dark">
        <Link to="/ingredient" className="flex size-10 items-center justify-center rounded-full text-[#111318] dark:text-white">
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <h2 className="flex-1 text-center text-lg font-bold leading-tight tracking-[-0.015em] text-[#111318] dark:text-white">
          AI 성분 진단 결과
        </h2>
        <div className="flex size-12 shrink-0 items-center justify-center" />
      </div>

      <div className="flex flex-col gap-4 px-4 pt-2">
        {result.recommendedProducts.map((p) => (
          <Link
            key={p.id}
            to={`/ingredient/${p.id}`}
            className="block rounded-xl bg-white p-4 shadow-[0_4px_12px_rgba(0,0,0,0.05)] dark:bg-zinc-800"
          >
            <div className="flex items-center gap-4">
              {p.imageUrl ? (
                <img src={p.imageUrl} alt={p.name} className="h-20 w-20 rounded-lg object-cover" />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700">
                  <span className="material-symbols-outlined text-gray-300 text-3xl">image</span>
                </div>
              )}
              <div className="flex flex-1 flex-col gap-1">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{p.brand}</p>
                <p className="text-base font-bold text-gray-800 dark:text-white">{p.name}</p>
                <div className="flex h-6 items-center gap-2 pt-1">
                  <div className="relative h-2 w-full rounded-full bg-blue-100 dark:bg-blue-900/50">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${p.recommendScore}%` }} />
                  </div>
                  <p className="whitespace-nowrap text-sm font-bold text-primary">{p.recommendScore}% 추천</p>
                </div>
              </div>
            </div>
          </Link>
        ))}

        {result.recommendedProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <span className="material-symbols-outlined text-5xl mb-2">science</span>
            <p className="text-sm">분석 결과가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  )
}

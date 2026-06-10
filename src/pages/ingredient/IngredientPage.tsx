import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useProductSearch } from '../../hooks/useIngredient'
import {
  useIngredientRecommendation,
  useGenerateRecommendationMutation,
} from '../../hooks/useIngredientRecommendation'

export default function IngredientPage() {
  const [query, setQuery] = useState('')
  const { data: recommendation, isLoading: recLoading } = useIngredientRecommendation()
  const { data: searchResults = [] } = useProductSearch(query, '전체')
  const generateMutation = useGenerateRecommendationMutation()

  const handleGenerate = () => generateMutation.mutate()

  const formatDate = (iso: string) => {
    const d = new Date(iso)
    return `${d.getMonth() + 1}월 ${d.getDate()}일`
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-x-hidden pb-24">
      {/* 헤더 */}
      <div className="sticky top-0 z-10 flex items-center justify-between bg-background-light p-4 pb-2 dark:bg-background-dark">
        <div className="flex size-12 shrink-0 items-center justify-center" />
        <h2 className="flex-1 text-center text-lg font-bold leading-tight tracking-[-0.015em] text-[#111318] dark:text-white">
          성분
        </h2>
        <div className="flex size-12 shrink-0 items-center justify-center" />
      </div>

      {/* AI 추천 섹션 */}
      <div className="px-4 pt-4 pb-2">
        <h3 className="text-[18px] font-bold text-[#111318] dark:text-white mb-3">
          내 피부 맞춤 성분 추천
        </h3>

        {recLoading ? (
          <div className="flex items-center justify-center py-10">
            <span className="material-symbols-outlined animate-spin text-primary text-4xl">
              progress_activity
            </span>
          </div>
        ) : recommendation == null ? (
          /* Empty State */
          <div className="flex flex-col items-center gap-4 rounded-2xl bg-white px-6 py-10 text-center shadow-[0_4px_12px_rgba(0,0,0,0.05)] dark:bg-zinc-800">
            <div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
              <span className="material-symbols-outlined text-3xl text-primary">
                science
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-base font-bold text-[#111318] dark:text-white">
                아직 추천 성분이 없어요
              </p>
              <p className="text-sm text-[#616f89] dark:text-gray-400">
                내 피부 타입과 고민을 바탕으로
                <br />
                AI가 맞춤 성분과 화장품을 찾아드립니다
              </p>
            </div>
            <button
              type="button"
              onClick={handleGenerate}
              disabled={generateMutation.isPending}
              className="flex h-11 items-center gap-2 rounded-full bg-primary px-6 text-sm font-bold text-white disabled:opacity-60"
            >
              {generateMutation.isPending ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-base">
                    progress_activity
                  </span>
                  AI 분석 중...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base">auto_awesome</span>
                  AI 성분 추천 받기
                </>
              )}
            </button>
            {generateMutation.isError && (
              <p className="text-xs text-red-500">
                AI 서비스가 일시적으로 불안정합니다. 잠시 후 다시 시도해주세요.
              </p>
            )}
          </div>
        ) : (
          /* 추천 결과 */
          <div className="flex flex-col gap-4">
            {/* 요약 */}
            <div className="rounded-xl bg-primary/5 px-4 py-3 dark:bg-primary/10">
              <p className="text-sm text-[#111318] dark:text-white leading-relaxed">
                {recommendation.summary}
              </p>
            </div>

            {/* 추천 성분 */}
            {recommendation.recommendedIngredients.length > 0 && (
              <div className="flex flex-col gap-2">
                <p className="text-sm font-bold text-[#111318] dark:text-white">
                  ✨ 추천 성분
                </p>
                {recommendation.recommendedIngredients.map((ing) => (
                  <div
                    key={ing.ingredientId}
                    className="rounded-xl bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.05)] dark:bg-zinc-800"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                        <span className="material-symbols-outlined text-base">check</span>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <p className="text-sm font-bold text-[#111318] dark:text-white">
                          {ing.koName || ing.inciName}
                        </p>
                        {ing.koName && (
                          <p className="text-xs text-[#616f89] dark:text-gray-400">
                            {ing.inciName}
                          </p>
                        )}
                        <p className="text-xs text-[#616f89] dark:text-gray-400 mt-1">
                          {ing.reason}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 기피 성분 */}
            {recommendation.ingredientsToAvoid.length > 0 && (
              <div className="flex flex-col gap-2">
                <p className="text-sm font-bold text-[#111318] dark:text-white">
                  ⚠️ 피해야 할 성분
                </p>
                {recommendation.ingredientsToAvoid.map((ing) => (
                  <div
                    key={ing.ingredientId}
                    className="rounded-xl bg-red-50 p-4 dark:bg-red-900/20"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-500">
                        <span className="material-symbols-outlined text-base">block</span>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <p className="text-sm font-bold text-[#111318] dark:text-white">
                          {ing.koName || ing.inciName}
                        </p>
                        {ing.koName && (
                          <p className="text-xs text-[#616f89] dark:text-gray-400">
                            {ing.inciName}
                          </p>
                        )}
                        <p className="text-xs text-[#616f89] dark:text-gray-400 mt-1">
                          {ing.reason}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 추천 화장품 */}
            {recommendation.recommendedProducts.length > 0 && (
              <div className="flex flex-col gap-2">
                <p className="text-sm font-bold text-[#111318] dark:text-white">
                  🏆 내 피부에 맞는 화장품
                </p>
                {recommendation.recommendedProducts.map((product) => (
                  <Link
                    key={product.productId}
                    to={`/ingredient/${product.productId}`}
                    className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.05)] dark:bg-zinc-800"
                  >
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">
                      {product.rankOrder}
                    </div>
                    <div className="flex flex-1 flex-col gap-0.5">
                      <p className="text-xs text-[#616f89] dark:text-gray-400">
                        {product.brand}
                      </p>
                      <p className="text-sm font-bold text-[#111318] dark:text-white">
                        {product.name}
                      </p>
                    </div>
                    <span className="material-symbols-outlined text-[#616f89]">
                      chevron_right
                    </span>
                  </Link>
                ))}
              </div>
            )}

            {/* 다시 추천받기 */}
            <div className="flex items-center justify-between pt-1">
              <p className="text-xs text-[#616f89] dark:text-gray-400">
                마지막 업데이트: {formatDate(recommendation.createdAt)}
              </p>
              <button
                type="button"
                onClick={handleGenerate}
                disabled={generateMutation.isPending}
                className="flex items-center gap-1 rounded-full border border-[#e0e4ef] px-3 py-1.5 text-xs font-medium text-[#616f89] disabled:opacity-60 dark:border-zinc-600 dark:text-gray-400"
              >
                {generateMutation.isPending ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-sm">
                      progress_activity
                    </span>
                    분석 중...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-sm">refresh</span>
                    다시 추천받기
                  </>
                )}
              </button>
            </div>
            {generateMutation.isError && (
              <p className="text-xs text-red-500 text-center">
                AI 서비스가 일시적으로 불안정합니다. 잠시 후 다시 시도해주세요.
              </p>
            )}
          </div>
        )}
      </div>

      {/* 구분선 */}
      <div className="mx-4 my-4 h-px bg-[#e0e4ef] dark:bg-zinc-700" />

      {/* 제품 성분 검색 */}
      <div className="px-4 pb-2">
        <h3 className="text-[18px] font-bold text-[#111318] dark:text-white mb-3">
          제품 성분 검색
        </h3>
        <div className="flex h-12 w-full items-stretch rounded-lg">
          <div className="flex items-center justify-center rounded-l-lg bg-white py-2 pl-4 text-[#616f89] dark:bg-zinc-800 dark:text-gray-400">
            <span className="material-symbols-outlined">search</span>
          </div>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex w-full flex-1 rounded-r-lg border-none bg-white px-4 pl-2 text-base text-[#111318] placeholder:text-[#616f89] focus:outline-0 focus:ring-0 dark:bg-zinc-800 dark:text-white dark:placeholder:text-gray-400"
            placeholder="제품 또는 성분 검색..."
          />
        </div>
      </div>

      {searchResults.length > 0 && (
        <div className="px-4">
          <h2 className="pb-3 pt-2 text-base font-bold text-[#111318] dark:text-white">
            검색 결과
          </h2>
          {searchResults.map((item) => (
            <div key={item.id} className="pb-3">
              <Link
                to={`/ingredient/${item.id}`}
                className="flex items-center justify-between gap-4 rounded-xl bg-white p-4 shadow-[0_4px_12px_rgba(0,0,0,0.05)] dark:bg-zinc-800"
              >
                <div className="flex flex-1 flex-col gap-1">
                  {item.brand && (
                    <p className="text-sm font-normal leading-normal text-[#616f89] dark:text-gray-400">
                      {item.brand}
                    </p>
                  )}
                  <p className="text-base font-bold leading-tight text-[#111318] dark:text-white">
                    {item.name}
                  </p>
                </div>
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                  <span className="material-symbols-outlined">water_bottle</span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

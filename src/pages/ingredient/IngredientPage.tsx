import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useIngredientSearch, useAiIngredientAnalysisMutation } from '../../hooks/useIngredient'

const CATEGORIES = ['전체', '미백', '진정', '보습', '안티에이징', '여드름 케어', '자외선 차단']

export default function IngredientPage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('전체')

  const { data: results = [] } = useIngredientSearch(query, filter)
  const { mutate: runAnalysis, isPending } = useAiIngredientAnalysisMutation()

  const handleAiAnalysis = () => {
    runAnalysis(undefined, {
      onSuccess: () => navigate('/ingredient/ai-result'),
    })
    navigate('/ingredient/ai-loading')
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-x-hidden pb-24">
      <div className="sticky top-0 z-10 flex items-center justify-between bg-background-light p-4 pb-2 dark:bg-background-dark">
        <div className="flex size-12 shrink-0 items-center justify-center" />
        <h2 className="flex-1 text-center text-lg font-bold leading-tight tracking-[-0.015em] text-[#111318] dark:text-white">
          성분
        </h2>
        <div className="flex size-12 shrink-0 items-center justify-center" />
      </div>

      <div className="px-4 py-3">
        <button
          type="button"
          onClick={handleAiAnalysis}
          disabled={isPending}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary py-3.5 text-white disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
          <p className="text-base font-bold">AI 성분 진단</p>
        </button>
      </div>

      <div className="px-4 py-3">
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

      <div className="flex gap-3 overflow-x-auto whitespace-nowrap px-4 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setFilter(cat)}
            className={`flex h-8 shrink-0 cursor-pointer items-center justify-center rounded-full px-4 text-sm font-medium ${
              filter === cat
                ? 'bg-primary text-white'
                : 'bg-white text-[#111318] dark:bg-zinc-800 dark:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {results.length > 0 && (
        <>
          <h2 className="px-4 pb-3 pt-5 text-[22px] font-bold leading-tight tracking-[-0.015em] text-[#111318] dark:text-white">
            상위 결과
          </h2>
          {results.map((item) => (
            <div key={item.id} className="px-4 pb-4">
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
                  {item.description && (
                    <p className="text-sm text-[#616f89] dark:text-gray-400">{item.description}</p>
                  )}
                </div>
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                  <span className="material-symbols-outlined">
                    {item.type === 'ingredient' ? 'science' : 'water_bottle'}
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </>
      )}
    </div>
  )
}

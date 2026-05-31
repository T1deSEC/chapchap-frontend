import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDiaryEntries } from '../../hooks/useHome'
import { useRecommendedProducts } from '../../hooks/useProducts'
import ProductCard from './components/ProductCard'
import DiaryCalendar from './components/DiaryCalendar'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

export default function HomePage() {
  const navigate = useNavigate()
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth() + 1)

  const { data: diaryEntries = [], isLoading: diaryLoading } = useDiaryEntries(year, month)
  const { data: products = [], isLoading: productsLoading } = useRecommendedProducts()

  return (
    <div className="mx-auto flex flex-col max-w-sm md:max-w-xl lg:max-w-3xl px-4">
      {/* Header */}
      <header className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
            strokeWidth="2" stroke="#135bec" width="32" height="32">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M12 2.25c3.5 3.75 7.5 7.25 7.5 11.25A7.5 7.5 0 1 1 4.5 13.5c0-4 4-7.5 7.5-11.25z" />
          </svg>
          <span className="text-lg font-bold text-gray-900 dark:text-white">CHAPCHAP</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/home/notifications">
            <span className="material-symbols-outlined text-gray-600 dark:text-gray-400">
              notifications
            </span>
          </Link>
          <Link to="/home/settings">
            <span className="material-symbols-outlined text-gray-600 dark:text-gray-400">
              settings
            </span>
          </Link>
        </div>
      </header>

      <main className="flex-grow p-4 space-y-6 pb-28">
        {/* 피부 상태 알림 카드 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3 dark:bg-blue-900/20 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-blue-500 mt-0.5">info</span>
            <div>
              <p className="font-bold text-blue-800 dark:text-blue-300">피부 상태 알림</p>
              <p className="text-sm text-blue-700 dark:text-blue-400">
                날씨가 건조하니 보습에 신경쓰세요!
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate('/home/diary/write')}
            className="w-full bg-primary text-white font-bold py-2.5 rounded-lg text-sm text-center"
          >
            오늘의 루틴 기록하기
          </button>
        </div>

        {/* 추천 제품 */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white">추천 제품</h2>
            <Link to="/home/recommend" className="text-sm text-primary font-medium">
              더보기
            </Link>
          </div>
          {productsLoading ? (
            <div className="flex justify-center py-4">
              <LoadingSpinner size={32} />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {products.slice(0, 2).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>

        {/* 피부 일기 캘린더 */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white">피부 일기</h2>
          </div>
          {diaryLoading ? (
            <div className="flex justify-center py-4">
              <LoadingSpinner size={32} />
            </div>
          ) : (
            <DiaryCalendar
              year={year}
              month={month}
              entries={diaryEntries}
              onMonthChange={(y, m) => { setYear(y); setMonth(m) }}
            />
          )}
        </section>
      </main>
    </div>
  )
}

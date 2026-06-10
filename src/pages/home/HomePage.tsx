import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDiaryEntries } from '../../hooks/useHome'
import { useIngredientRecommendation } from '../../hooks/useIngredientRecommendation'
import { useUnreadCount } from '../../hooks/useNotifications'
import ProductCard from './components/ProductCard'
import DiaryCalendar from './components/DiaryCalendar'
import { WeatherTipCard } from './components/WeatherTipCard'
import { HomeSkeleton } from '../../components/skeletons/HomeSkeleton'

export default function HomePage() {
  const navigate = useNavigate()
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth() + 1)

  const { data: unreadCount } = useUnreadCount()
  const { data: diaryEntries = [], isLoading: diaryLoading } = useDiaryEntries(year, month)
  const { data: recommendation, isLoading: recLoading } = useIngredientRecommendation()

  const todayStr = new Date().toISOString().split('T')[0]
  const hasTodayDiary = diaryEntries.some((e) => e.logDate === todayStr)

  if (recLoading || diaryLoading) return <HomeSkeleton />

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
            <div className="relative">
              <span className="material-symbols-outlined text-gray-600 dark:text-gray-400">
                notifications
              </span>
              {unreadCount != null && unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1 leading-none">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </div>
          </Link>
          <Link to="/home/settings">
            <span className="material-symbols-outlined text-gray-600 dark:text-gray-400">
              settings
            </span>
          </Link>
        </div>
      </header>

      <main className="flex-grow p-4 space-y-6 pb-28">
        {/* 날씨 피부 팁 */}
        <WeatherTipCard />

        {/* 오늘 일기 미작성 시 유도 카드 */}
        {!hasTodayDiary && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-3 dark:bg-blue-900/20 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-blue-500 mt-0.5">edit_note</span>
              <div>
                <p className="font-bold text-blue-800 dark:text-blue-300">오늘 피부 기록</p>
                <p className="text-sm text-blue-700 dark:text-blue-400">
                  오늘 피부 기록을 아직 안 했어요 📝
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate('/home/diary/write')}
              className="w-full bg-primary text-white font-bold py-2.5 rounded-lg text-sm text-center"
            >
              지금 기록하러 가기
            </button>
          </div>
        )}

        {/* 추천 제품 */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white">추천 제품</h2>
            <Link to="/home/recommend" className="text-sm text-primary font-medium">
              더보기
            </Link>
          </div>
          {recommendation ? (
            <div className="grid grid-cols-2 gap-4">
              {recommendation.recommendedProducts.slice(0, 2).map((rp) => (
                <ProductCard
                  key={rp.productId}
                  product={{ id: rp.productId, name: rp.name, brand: rp.brand, category: '', imageUrl: rp.imageUrl }}
                />
              ))}
            </div>
          ) : (
            <p className="rounded-xl bg-white dark:bg-gray-800 px-4 py-6 text-center text-sm text-gray-400 dark:text-gray-500">
              아직 AI 추천 결과가 없어요.<br />성분 탭에서 분석을 먼저 진행해보세요.
            </p>
          )}
        </section>

        {/* 피부 일기 캘린더 */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white">피부 일기</h2>
          </div>
          <DiaryCalendar
            year={year}
            month={month}
            entries={diaryEntries}
            onMonthChange={(y, m) => { setYear(y); setMonth(m) }}
            onDayClick={(entry) => navigate(`/home/diary/${entry.id}`)}
          />
        </section>
      </main>
    </div>
  )
}

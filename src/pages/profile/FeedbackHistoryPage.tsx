import { Link } from 'react-router-dom'
import { useFeedbackHistory } from '../../hooks/useProfile'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

export default function FeedbackHistoryPage() {
  const { data: records = [], isLoading } = useFeedbackHistory()
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-x-hidden">
      <header className="sticky top-0 z-10 flex items-center bg-white dark:bg-background-dark dark:border-b dark:border-white/10 p-4 pb-2 justify-between">
        <Link to="/profile" className="flex size-12 shrink-0 items-center justify-start text-[#111318] dark:text-white">
          <span className="material-symbols-outlined text-2xl">arrow_back_ios_new</span>
        </Link>
        <h1 className="flex-1 text-center text-lg font-bold text-[#111318] dark:text-white">내 피드백 기록</h1>
        <div className="size-12 shrink-0" />
      </header>
      <main className="flex-grow pb-24">
        {isLoading ? (
          <div className="flex justify-center py-8"><LoadingSpinner /></div>
        ) : records.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center mt-20 p-8">
            <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600">rate_review</span>
            <p className="mt-4 text-base font-medium text-gray-500 dark:text-gray-400">아직 작성한 피드백이 없어요.</p>
          </div>
        ) : (
          records.map((record) => (
            <div key={record.id}>
              <div className="p-4 pb-0">
                <div className="flex items-stretch justify-between gap-4 rounded-xl bg-white dark:bg-background-dark/50 p-4 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
                  <div className="flex flex-[2_2_0px] flex-col gap-4">
                    <div className="flex flex-col gap-1">
                      <p className="text-base font-bold text-[#111318] dark:text-white">{record.productName}</p>
                      <p className="text-sm text-[#616f89] dark:text-gray-400">{record.createdAt}</p>
                    </div>
                    <Link to={`/ingredient/${record.productId}`} className="flex h-8 w-fit min-w-[84px] items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-white">자세히 보기</Link>
                  </div>
                  {record.imageUrl ? (
                    <div className="aspect-square w-24 flex-shrink-0 rounded-lg bg-cover bg-center" style={{ backgroundImage: `url(${record.imageUrl})` }} />
                  ) : (
                    <div className="aspect-square w-24 flex-shrink-0 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <span className="material-symbols-outlined text-gray-300">image</span>
                    </div>
                  )}
                </div>
              </div>
              {record.tags.length > 0 && (
                <div className="flex gap-2 p-4 pt-3 overflow-x-auto">
                  {record.tags.map((tag) => (
                    <div key={tag} className="flex h-8 shrink-0 items-center justify-center rounded-full bg-primary/10 px-3 dark:bg-primary/20">
                      <p className="text-sm font-medium text-primary dark:text-primary/90">{tag}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </main>
    </div>
  )
}

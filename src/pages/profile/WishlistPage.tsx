import { Link } from 'react-router-dom'
import { useWishlist } from '../../hooks/useWishlist'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

export default function WishlistPage() {
  const { data: items = [], isLoading } = useWishlist()
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-x-hidden">
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200/80 dark:border-gray-800/80 bg-background-light/80 dark:bg-background-dark/80 p-4 pb-3 backdrop-blur-sm">
        <Link to="/profile" className="flex size-10 shrink-0 items-center justify-center text-gray-800 dark:text-gray-200">
          <span className="material-symbols-outlined text-2xl">arrow_back_ios_new</span>
        </Link>
        <h1 className="flex-1 text-center text-lg font-bold text-gray-900 dark:text-gray-50">찜한 제품</h1>
        <div className="size-10 shrink-0" />
      </div>
      <main className="flex-grow px-4 py-6">
        {isLoading ? (
          <div className="flex justify-center py-8"><LoadingSpinner /></div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center gap-6 py-16">
            <div className="flex size-24 items-center justify-center rounded-full bg-primary/10 text-primary"><span className="material-symbols-outlined text-5xl">favorite</span></div>
            <p className="text-lg font-bold text-gray-900 dark:text-gray-50">아직 찜한 제품이 없어요.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {items.map((item) => (
              <div key={item.productId} className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900/50">
                <div className="flex items-start gap-4">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.productName} className="h-24 w-24 shrink-0 rounded-lg object-cover" />
                  ) : (
                    <div className="h-24 w-24 shrink-0 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <span className="material-symbols-outlined text-gray-300 text-3xl">image</span>
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{item.brand}</span>
                    <h3 className="font-bold text-gray-800 dark:text-gray-100">{item.productName}</h3>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link to={`/ingredient/${item.productId}`} className="flex h-10 flex-1 items-center justify-center rounded-lg bg-gray-100 text-sm font-bold text-gray-700 dark:bg-gray-800 dark:text-gray-300">상세 보기</Link>
                  <button type="button" className="flex h-10 flex-1 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white">루틴에 추가</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

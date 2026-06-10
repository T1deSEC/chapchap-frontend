import { Link } from 'react-router-dom'
import { useWishlist } from '../../hooks/useWishlist'
import { SubpageHeader } from '../../components/SubpageHeader'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

export default function WishlistPage() {
  const { data: items = [], isLoading } = useWishlist()
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-x-hidden">
      <SubpageHeader title="위시리스트" />
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

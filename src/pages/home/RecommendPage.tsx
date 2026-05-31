import { Link } from 'react-router-dom'
import { useRecommendedProducts } from '../../hooks/useProducts'
import ProductCard from './components/ProductCard'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

export default function RecommendPage() {
  const { data: products = [], isLoading } = useRecommendedProducts()

  return (
    <div className="max-w-sm mx-auto min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <header className="sticky top-0 z-10 flex items-center justify-between p-4 bg-background-light dark:bg-background-dark border-b border-gray-200 dark:border-gray-700">
        <Link to="/home">
          <span className="material-symbols-outlined text-gray-800 dark:text-gray-200">
            arrow_back_ios_new
          </span>
        </Link>
        <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100 absolute left-1/2 -translate-x-1/2">
          추천 제품 전체보기
        </h1>
        <div className="w-6" />
      </header>

      <main className="flex-1 p-4 pb-28">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

import { motion } from 'framer-motion'
import { useIngredientRecommendation } from '../../hooks/useIngredientRecommendation'
import { SubpageHeader } from '../../components/SubpageHeader'
import ProductCard from './components/ProductCard'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

const listVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }
const itemVariants = { hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0, transition: { duration: 0.2 } } }

export default function RecommendPage() {
  const { data: recommendation, isLoading } = useIngredientRecommendation()
  const products = recommendation?.recommendedProducts.map((rp) => ({
    id: rp.productId,
    name: rp.name,
    brand: rp.brand,
    category: '',
    imageUrl: rp.imageUrl,
  })) ?? []

  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="max-w-sm mx-auto min-h-screen flex flex-col bg-background-light dark:bg-background-dark"
    >
      <SubpageHeader title="추천 제품 전체보기" backTo="/home" />

      <main className="flex-1 p-4 pb-28">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            {products.length === 0 && (
              <div className="flex flex-col items-center py-20 text-center">
                <span className="text-5xl mb-3">✨</span>
                <p className="font-semibold text-gray-700 dark:text-gray-300">추천 제품이 없어요</p>
                <p className="text-sm text-gray-500 mt-1">성분 분석을 먼저 진행해보세요</p>
              </div>
            )}
            <motion.div
              className="grid grid-cols-2 gap-4"
              variants={listVariants}
              initial="hidden"
              animate="visible"
            >
              {products.map((product) => (
                <motion.div key={product.id} variants={itemVariants}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </main>
    </motion.div>
  )
}

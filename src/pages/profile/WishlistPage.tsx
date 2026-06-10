import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const listVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }
const itemVariants = { hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0, transition: { duration: 0.2 } } }
import { useWishlist, useRemoveFromWishlistMutation } from '../../hooks/useWishlist'
import { SubpageHeader } from '../../components/SubpageHeader'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import { useToast } from '../../hooks/useToast'

export default function WishlistPage() {
  const { data: items = [], isLoading } = useWishlist()
  const { mutate: removeFromWishlist } = useRemoveFromWishlistMutation()
  const { showSuccess, showError } = useToast()

  const handleRemove = (productId: number) => {
    removeFromWishlist(productId, {
      onSuccess: () => showSuccess('위시리스트에서 삭제했습니다'),
      onError: () => showError('오류가 발생했습니다'),
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-x-hidden"
    >
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
          <motion.div
            className="flex flex-col gap-4"
            variants={listVariants}
            initial="hidden"
            animate="visible"
          >
            {items.map((item) => (
              <motion.div key={item.productId} variants={itemVariants} className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900/50">
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
                  <button type="button" onClick={() => handleRemove(item.productId)} className="flex h-10 flex-1 items-center justify-center rounded-lg bg-red-50 text-sm font-bold text-red-500 dark:bg-red-900/20 dark:text-red-400">삭제</button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>
    </motion.div>
  )
}

import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { Product } from '../../../types'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link to={`/ingredient/${product.id}`}>
    <motion.div whileTap={{ scale: 0.97 }} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex flex-col dark:bg-gray-800 dark:border-gray-700">
      <div className="w-full aspect-square bg-gray-50 dark:bg-gray-700 flex items-center justify-center">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="material-symbols-outlined text-4xl text-gray-300">image</span>
        )}
      </div>
      <div className="p-3 flex flex-col flex-grow text-xs space-y-2">
        <p className="font-bold text-gray-800 dark:text-white text-sm leading-tight">
          {product.name}
        </p>
        <p className="text-gray-500 dark:text-gray-400 text-[11px]">{product.brand}</p>
      </div>
    </motion.div>
    </Link>
  )
}

import type { Product } from '../../../types'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex flex-col dark:bg-gray-800 dark:border-gray-700">
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
        {(product.keyIngredients?.length ?? 0) > 0 && (
          <div>
            <p className="text-gray-400 dark:text-gray-500 text-[10px]">유사 성분</p>
            <p className="font-medium text-gray-700 dark:text-gray-300 text-[11px]">
              {product.keyIngredients.join(', ')}
            </p>
          </div>
        )}
        <div className="flex items-center gap-1.5 flex-wrap mt-auto pt-1">
          {(product.skinTypes ?? []).map((type) => (
            <span
              key={type}
              className="bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-200 px-2 py-0.5 rounded-full text-[10px] font-medium"
            >
              {type}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

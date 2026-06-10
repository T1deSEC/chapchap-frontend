import { useState, useEffect, useRef, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useProductSearch } from '../../hooks/useProductSearch'
import type { Product } from '../../types'
import LoadingSpinner from '../ui/LoadingSpinner'

interface Props {
  isOpen: boolean
  onClose: () => void
  existingProductIds: Set<number>
  onConfirm: (products: Product[]) => void
}

export default function ProductPickerSheet({ isOpen, onClose, existingProductIds, onConfirm }: Props) {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [selected, setSelected] = useState<Map<number, Product>>(new Map())
  const sentinelRef = useRef<HTMLDivElement>(null)

  // 300ms 디바운스
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 300)
    return () => clearTimeout(t)
  }, [query])

  // 시트 닫힐 때 상태 초기화
  useEffect(() => {
    if (!isOpen) {
      setQuery('')
      setDebouncedQuery('')
      setSelected(new Map())
    }
  }, [isOpen])

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useProductSearch(debouncedQuery)

  const allProducts = data?.pages.flatMap((p) => p.content) ?? []

  // 무한 스크롤 sentinel
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  )

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const observer = new IntersectionObserver(handleObserver, { threshold: 0.1 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [handleObserver])

  const toggleSelect = (product: Product) => {
    if (existingProductIds.has(product.id)) return
    setSelected((prev) => {
      const next = new Map(prev)
      if (next.has(product.id)) next.delete(product.id)
      else next.set(product.id, product)
      return next
    })
  }

  const handleConfirm = () => {
    onConfirm(Array.from(selected.values()))
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 오버레이 */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 z-40"
            onClick={onClose}
          />

          {/* 시트 */}
          <motion.div
            key="sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-x-0 bottom-0 z-50 bg-white dark:bg-gray-900 rounded-t-2xl max-h-[80vh] flex flex-col shadow-xl"
          >
        {/* 헤더 */}
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 px-4 py-3">
          <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">제품 선택</h3>
          <button type="button" onClick={onClose} className="text-gray-500">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* 검색란 */}
        <div className="px-4 py-2">
          <div className="flex items-center gap-2 rounded-xl bg-gray-100 dark:bg-gray-800 px-3 py-2">
            <span className="material-symbols-outlined text-gray-400" style={{ fontSize: '20px' }}>search</span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="제품명 또는 브랜드 검색"
              className="flex-1 bg-transparent text-sm text-gray-900 dark:text-gray-100 outline-none placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* 제품 그리드 */}
        <div className="flex-1 overflow-y-auto px-4 pb-2">
          {isLoading ? (
            <div className="flex justify-center py-8"><LoadingSpinner size={32} /></div>
          ) : allProducts.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-400">검색 결과가 없습니다</p>
          ) : (
            <div className="grid grid-cols-2 gap-3 py-2">
              {allProducts.map((product) => {
                const isAdded = existingProductIds.has(product.id)
                const isSelected = selected.has(product.id)
                return (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => toggleSelect(product)}
                    disabled={isAdded}
                    className={`relative flex flex-col items-start rounded-xl border-2 p-3 text-left transition-colors ${
                      isAdded
                        ? 'border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 opacity-50'
                        : isSelected
                        ? 'border-primary bg-primary/5 dark:bg-primary/10'
                        : 'border-gray-100 bg-white dark:border-gray-700 dark:bg-gray-800'
                    }`}
                  >
                    {(isAdded || isSelected) && (
                      <div className={`absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full ${isAdded ? 'bg-gray-300' : 'bg-primary'}`}>
                        <span className="material-symbols-outlined text-white" style={{ fontSize: '14px' }}>check</span>
                      </div>
                    )}
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} className="mb-2 h-16 w-full rounded-lg object-cover" />
                    ) : (
                      <div className="mb-2 flex h-16 w-full items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700">
                        <span className="material-symbols-outlined text-gray-300">image</span>
                      </div>
                    )}
                    <p className="line-clamp-1 text-xs font-semibold text-gray-900 dark:text-gray-100">{product.name}</p>
                    <p className="line-clamp-1 text-xs text-gray-400">{product.brand}</p>
                  </button>
                )
              })}
            </div>
          )}

          {/* 무한 스크롤 sentinel */}
          <div ref={sentinelRef} className="h-4" />
          {isFetchingNextPage && (
            <div className="flex justify-center py-2"><LoadingSpinner size={20} /></div>
          )}
          {!hasNextPage && allProducts.length > 0 && (
            <p className="py-2 text-center text-xs text-gray-300">더 이상 제품이 없습니다</p>
          )}
        </div>

        {/* 추가 버튼 */}
        <div className="border-t border-gray-100 dark:border-gray-800 px-4 py-3">
          <button
            type="button"
            onClick={handleConfirm}
            disabled={selected.size === 0}
            className="w-full rounded-xl bg-primary py-3 text-sm font-bold text-white disabled:opacity-40"
          >
            {selected.size > 0 ? `루틴에 추가 (${selected.size}개)` : '제품을 선택해주세요'}
          </button>
        </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

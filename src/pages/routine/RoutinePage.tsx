import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  useRoutineItems,
  useUpsertRoutineMutation,
  useDeleteRoutineMutation,
  useAiRoutineAnalysisMutation,
} from '../../hooks/useRoutine'
import ProductPickerSheet from '../../components/routine/ProductPickerSheet'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import type { RoutineItem, Product } from '../../types'

type RoutineTime = 'morning' | 'evening'
const toPeriod = (t: RoutineTime) => (t === 'morning' ? 'AM' : 'PM') as 'AM' | 'PM'

// --- SortableProductCard ---
function SortableProductCard({
  item,
  onRemove,
}: {
  item: RoutineItem
  onRemove: (productId: number) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.productId,
  })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-4 bg-white dark:bg-gray-800 px-4 min-h-[72px] py-2 rounded-xl shadow-sm"
    >
      <Link
        to={`/ingredient/${item.productId}`}
        className="flex items-center gap-4 flex-1 min-w-0"
        onClick={(e) => isDragging && e.preventDefault()}
      >
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.productName} className="size-14 rounded-lg object-cover shrink-0" />
        ) : (
          <div className="size-14 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-gray-300">image</span>
          </div>
        )}
        <div className="flex flex-col justify-center min-w-0">
          <p className="text-[#111318] dark:text-white text-base font-medium leading-normal line-clamp-1">
            {item.productName}
          </p>
          <p className="text-[#616f89] dark:text-gray-400 text-sm font-normal leading-normal">
            {item.brand}
          </p>
        </div>
      </Link>
      <div className="shrink-0 flex items-center gap-2">
        <button
          type="button"
          aria-label={`${item.productName} 루틴에서 제거`}
          onClick={() => onRemove(item.productId)}
          className="text-gray-400 dark:text-gray-500 flex size-7 items-center justify-center"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>close</span>
        </button>
        <div
          {...attributes}
          {...listeners}
          className="text-[#616f89] dark:text-gray-400 flex size-7 items-center justify-center cursor-grab active:cursor-grabbing"
        >
          <span className="material-symbols-outlined">drag_handle</span>
        </div>
      </div>
    </div>
  )
}

// --- RoutinePage ---
export default function RoutinePage() {
  const navigate = useNavigate()
  const [time, setTime] = useState<RoutineTime>('morning')
  const [isPickerOpen, setIsPickerOpen] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [localProducts, setLocalProducts] = useState<RoutineItem[]>([])

  const { data: routine, isLoading } = useRoutineItems(time)
  const { mutate: upsert } = useUpsertRoutineMutation()
  const { mutate: deleteRoutine, isPending: isDeleting } = useDeleteRoutineMutation()
  const { mutate: runAnalysis, isPending: isAnalyzing } = useAiRoutineAnalysisMutation(
    routine != null ? { ...routine, products: localProducts } : null,
    time
  )

  // 서버 데이터와 로컬 상태 동기화
  useEffect(() => {
    setLocalProducts(routine?.products ?? [])
  }, [routine])

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

  const toPayload = (products: RoutineItem[]) => ({
    routinePeriod: toPeriod(time),
    products: products.map((p, i) => ({ productId: p.productId, stepOrder: i + 1 })),
  })

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIdx = localProducts.findIndex((p) => p.productId === active.id)
    const newIdx = localProducts.findIndex((p) => p.productId === over.id)
    const reordered = arrayMove(localProducts, oldIdx, newIdx)
    setLocalProducts(reordered)
    upsert(toPayload(reordered))
  }

  const handleRemove = (productId: number) => {
    const updated = localProducts.filter((p) => p.productId !== productId)
    setLocalProducts(updated)
    upsert(toPayload(updated))
  }

  const handleAddProducts = (products: Product[]) => {
    const newItems: RoutineItem[] = products.map((p, i) => ({
      productId: p.id,
      stepOrder: localProducts.length + i + 1,
      productName: p.name,
      brand: p.brand,
      imageUrl: p.imageUrl,
    }))
    const updated = [...localProducts, ...newItems]
    setLocalProducts(updated)
    upsert(toPayload(updated))
  }

  const handleReset = () => {
    deleteRoutine(toPeriod(time), {
      onSuccess: () => setShowResetConfirm(false),
    })
  }

  const handleAiAnalysis = () => {
    runAnalysis(undefined, {
      onSuccess: () => navigate('/routine/ai-result'),
    })
    navigate('/routine/ai-loading')
  }

  const existingIds = new Set(localProducts.map((p) => p.productId))

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-x-hidden pb-24">
      {/* 헤더 */}
      <div className="flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between sticky top-0 z-10">
        <Link to="/home" className="flex size-12 shrink-0 items-center">
          <span className="material-symbols-outlined text-[#111318] dark:text-white">arrow_back_ios_new</span>
        </Link>
        <h2 className="text-[#111318] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
          루틴 관리
        </h2>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="제품 추가"
            onClick={() => setIsPickerOpen(true)}
            className="flex size-10 cursor-pointer items-center justify-center rounded-lg text-[#111318] dark:text-white"
          >
            <span className="material-symbols-outlined">add</span>
          </button>
          {routine && (
            <button
              type="button"
              aria-label="루틴 초기화"
              onClick={() => setShowResetConfirm(true)}
              className="flex size-10 cursor-pointer items-center justify-center rounded-lg text-gray-400 dark:text-gray-500"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>delete_sweep</span>
            </button>
          )}
        </div>
      </div>

      {/* 아침/저녁 탭 */}
      <div className="flex px-4 py-3">
        <div className="flex h-10 flex-1 items-center justify-center rounded-lg bg-gray-200 dark:bg-gray-700 p-1">
          {(['morning', 'evening'] as RoutineTime[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTime(t)}
              className={`flex h-full flex-1 items-center justify-center overflow-hidden rounded-md px-2 text-sm font-medium leading-normal transition-all ${
                time === t
                  ? 'bg-white dark:bg-gray-900 text-primary shadow-[0_0_4px_rgba(0,0,0,0.1)]'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              {t === 'morning' ? '아침' : '저녁'}
            </button>
          ))}
        </div>
      </div>

      {/* 제품 목록 */}
      <div className="flex flex-col gap-2 px-4 py-2">
        {isLoading ? (
          <div className="flex justify-center py-8"><LoadingSpinner size={32} /></div>
        ) : localProducts.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-12 text-center">
            <span className="material-symbols-outlined text-5xl text-gray-200 dark:text-gray-700">
              checklist
            </span>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              아직 루틴이 없어요.<br />제품을 추가해 루틴을 시작해보세요.
            </p>
            <button
              type="button"
              onClick={() => setIsPickerOpen(true)}
              className="rounded-xl bg-primary px-6 py-2 text-sm font-bold text-white"
            >
              제품 추가
            </button>
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext
              items={localProducts.map((p) => p.productId)}
              strategy={verticalListSortingStrategy}
            >
              {localProducts.map((item) => (
                <SortableProductCard key={item.productId} item={item} onRemove={handleRemove} />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* 제품 추가 버튼 (목록이 있을 때만) */}
      {localProducts.length > 0 && (
        <div className="px-4 py-2">
          <button
            type="button"
            onClick={() => setIsPickerOpen(true)}
            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800/50 py-4 text-primary"
          >
            <span className="material-symbols-outlined">add</span>
            <span className="text-base font-semibold">제품 추가</span>
          </button>
        </div>
      )}

      {/* AI 안전 진단 */}
      <div className="px-4 py-4">
        <button
          type="button"
          onClick={handleAiAnalysis}
          disabled={isAnalyzing || localProducts.length === 0}
          className="flex w-full items-center justify-center gap-3 rounded-xl bg-primary px-4 py-3 text-white shadow-lg shadow-primary/30 disabled:opacity-50"
        >
          <span className="material-symbols-outlined">verified</span>
          <span className="text-base font-bold">AI 안전 진단</span>
        </button>
      </div>

      {/* 루틴 초기화 확인 다이얼로그 */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-gray-900 p-6 shadow-xl">
            <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">루틴 초기화</h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              현재 {time === 'morning' ? '아침' : '저녁'} 루틴의 모든 제품이 삭제됩니다. 계속할까요?
            </p>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 rounded-xl border border-gray-200 dark:border-gray-700 py-2 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleReset}
                disabled={isDeleting}
                className="flex-1 rounded-xl bg-red-500 py-2 text-sm font-bold text-white disabled:opacity-50"
              >
                {isDeleting ? '삭제 중...' : '초기화'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 제품 추가 바텀 시트 */}
      <ProductPickerSheet
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        existingProductIds={existingIds}
        onConfirm={handleAddProducts}
      />
    </div>
  )
}

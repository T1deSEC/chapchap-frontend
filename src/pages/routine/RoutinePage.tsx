import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useRoutineItems, useRemoveRoutineItemMutation, useAiRoutineAnalysisMutation } from '../../hooks/useRoutine'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

type RoutineTime = 'morning' | 'evening'

const RECOMMENDED_ROUTINES = [
  { id: 1, name: '정화 루틴', description: '살리실산과 나이아신아마이드로 피지 조절 및 여드름 예방에 초점을 맞춘 루틴', skinTypes: ['건성', '여드름성'] },
  { id: 2, name: '보습 강화', description: '히알루론산과 세라마이드로 피부에 깊은 보습을 제공하고 피부 장벽을 복구하여 진정시킵니다.', skinTypes: ['건성', '민감성'] },
  { id: 3, name: '안티에이징 필수품', description: '레티놀과 펩타이드와 같은 강력한 성분으로 잔주름과 주름을 개선하여 젊고 빛나는 피부를 가꾸세요.', skinTypes: ['건성', '주름/탄력 저하'] },
]

export default function RoutinePage() {
  const navigate = useNavigate()
  const [time, setTime] = useState<RoutineTime>('morning')

  const { data: items = [], isLoading } = useRoutineItems(time)
  const { mutate: removeItem } = useRemoveRoutineItemMutation()
  const { mutate: runAnalysis, isPending } = useAiRoutineAnalysisMutation(items, time)

  const handleAiAnalysis = () => {
    runAnalysis(undefined, {
      onSuccess: () => navigate('/routine/ai-result'),
    })
    navigate('/routine/ai-loading')
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-x-hidden pb-24">
      <div className="flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between sticky top-0 z-10">
        <Link to="/home" className="flex size-12 shrink-0 items-center">
          <span className="material-symbols-outlined text-[#111318] dark:text-white">arrow_back_ios_new</span>
        </Link>
        <h2 className="text-[#111318] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">루틴 관리</h2>
        <div className="flex w-12 items-center justify-end">
          <button type="button" aria-label="제품 추가" className="flex size-12 cursor-pointer items-center justify-center rounded-lg text-[#111318] dark:text-white">
            <span className="material-symbols-outlined">add</span>
          </button>
        </div>
      </div>

      <div className="flex px-4 py-3">
        <div className="flex h-10 flex-1 items-center justify-center rounded-lg bg-gray-200 dark:bg-gray-700 p-1">
          {(['morning', 'evening'] as RoutineTime[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTime(t)}
              className={`flex h-full flex-1 items-center justify-center overflow-hidden rounded-md px-2 text-sm font-medium leading-normal transition-all ${
                time === t ? 'bg-white dark:bg-gray-900 text-primary shadow-[0_0_4px_rgba(0,0,0,0.1)]' : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              {t === 'morning' ? '아침' : '저녁'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2 px-4 py-2">
        {isLoading ? (
          <div className="flex justify-center py-4"><LoadingSpinner size={32} /></div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 bg-white dark:bg-gray-800 px-4 min-h-[72px] py-2 rounded-xl shadow-sm">
              <div className="flex items-center gap-4 flex-1">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.productName} className="size-14 rounded-lg object-cover" />
                ) : (
                  <div className="size-14 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <span className="material-symbols-outlined text-gray-300">image</span>
                  </div>
                )}
                <div className="flex flex-col justify-center flex-1">
                  <p className="text-[#111318] dark:text-white text-base font-medium leading-normal line-clamp-1">{item.productName}</p>
                  <p className="text-[#616f89] dark:text-gray-400 text-sm font-normal leading-normal">{item.brand}</p>
                </div>
              </div>
              <div className="shrink-0 flex items-center gap-2">
                <button type="button" aria-label={`${item.productName} 제거`} onClick={() => removeItem(item.id)} className="text-gray-400 dark:text-gray-500 flex size-7 items-center justify-center">
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>close</span>
                </button>
                <div className="text-[#616f89] dark:text-gray-400 flex size-7 items-center justify-center cursor-grab">
                  <span className="material-symbols-outlined">drag_handle</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="px-4 py-2">
        <button type="button" className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800/50 py-4 text-primary">
          <span className="material-symbols-outlined">add</span>
          <span className="text-base font-semibold">제품 추가</span>
        </button>
      </div>

      <div className="px-4 py-4">
        <button type="button" onClick={handleAiAnalysis} disabled={isPending} className="flex w-full items-center justify-center gap-3 rounded-xl bg-primary px-4 py-3 text-white shadow-lg shadow-primary/30 disabled:opacity-50">
          <span className="material-symbols-outlined">verified</span>
          <span className="text-base font-bold">AI 안전 진단</span>
        </button>
      </div>

      <div className="px-4 py-4 space-y-3">
        <h3 className="text-lg font-bold text-[#111318] dark:text-white">당신을 위한 추천 루틴</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">사용자의 피부 타입, 피부 고민을 고려하여 다른 사용자가 좋다고 평가하며 사용 중인 화장품들로 구성된 루틴들이 보여집니다.</p>
        <div className="flex space-x-4 overflow-x-auto pb-4 pt-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {RECOMMENDED_ROUTINES.map((routine, idx) => (
            <div key={routine.id} className="flex-shrink-0 w-3/4 max-w-xs rounded-xl bg-white dark:bg-gray-800 p-4 shadow-sm flex flex-col">
              <div className="flex flex-wrap gap-2">
                {routine.skinTypes.map((type) => (
                  <span key={type} className="text-xs font-semibold text-primary bg-primary/10 dark:bg-primary/20 px-2 py-1 rounded-full">{type}</span>
                ))}
              </div>
              <p className="mt-2 text-base font-bold text-[#111318] dark:text-white">{routine.name}</p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 flex-1">{routine.description}</p>
              <button type="button" className={`mt-4 w-full h-10 rounded-lg text-sm font-bold ${idx === 0 ? 'bg-primary text-white' : 'bg-primary/20 dark:bg-primary/30 text-primary'}`}>루틴 보기</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

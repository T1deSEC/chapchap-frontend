import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUpdateSkinProfileMutation } from '../../hooks/useProfile'
import { useAuthStore } from '../../store/authStore'
import Button from '../../components/ui/Button'

const SKIN_TYPES = ['지성', '건성', '복합성', '수부지', '민감성']
const SKIN_CONCERNS = ['여드름', '붉은 기/홍조', '주름/탄력 저하', '건조함/속당김', '모공', '잡티/색소침착']
const MAX_CONCERNS = 3

export default function SkinProfileSetupPage() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const [skinType, setSkinType] = useState(user?.skinType ?? '건성')
  const [skinConcerns, setSkinConcerns] = useState<string[]>([])
  const { mutate, isPending } = useUpdateSkinProfileMutation()

  const toggleConcern = (c: string) => setSkinConcerns((prev) => prev.includes(c) ? prev.filter((x) => x !== c) : prev.length >= MAX_CONCERNS ? prev : [...prev, c])
  const handleSave = () => mutate({ skinType, skinConcerns }, { onSuccess: () => navigate('/profile') })

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-x-hidden">
      <div className="flex-1 pb-32">
        <div className="sticky top-0 z-10 flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between border-b border-gray-200 dark:border-gray-800">
          <Link to="/profile" className="flex size-12 shrink-0 items-center justify-start -ml-2">
            <span className="material-symbols-outlined text-2xl text-gray-800 dark:text-gray-200">arrow_back_ios_new</span>
          </Link>
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex-1 text-center">피부 프로필 재설정</h2>
          <div className="flex size-12 shrink-0 items-center" />
        </div>
        <p className="text-base font-normal pb-3 pt-6 px-4 text-gray-700 dark:text-gray-300">정확한 분석을 위해 현재 피부 상태를 알려주세요.</p>
        <h3 className="text-lg font-bold px-4 pb-2 pt-4 text-gray-900 dark:text-gray-100">나의 피부 타입은?</h3>
        <div className="flex flex-col gap-3 p-4">
          {SKIN_TYPES.map((type) => (
            <label key={type} className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-all ${skinType === type ? 'border-primary bg-primary/10 dark:bg-primary/20' : 'border-gray-200 dark:border-gray-700'}`}>
              <div className="flex grow flex-col"><p className="text-sm font-medium text-gray-800 dark:text-gray-200">{type}</p></div>
              <input type="radio" name="skin_type" value={type} checked={skinType === type} onChange={() => setSkinType(type)} className="h-5 w-5 accent-primary" />
            </label>
          ))}
        </div>
        <h3 className="text-lg font-bold px-4 pb-2 pt-4 text-gray-900 dark:text-gray-100">
          가장 큰 피부 고민을 모두 선택해주세요. <span className="font-medium text-gray-500">(최대 {MAX_CONCERNS}개)</span>
        </h3>
        <div className="flex flex-wrap gap-3 p-4">
          {SKIN_CONCERNS.map((concern) => (
            <button key={concern} type="button" onClick={() => toggleConcern(concern)} disabled={!skinConcerns.includes(concern) && skinConcerns.length >= MAX_CONCERNS}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors disabled:opacity-40 ${skinConcerns.includes(concern) ? 'border-primary bg-primary text-white' : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'}`}>
              {concern}
            </button>
          ))}
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 w-full bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm p-4 pb-8">
        <Button fullWidth onClick={handleSave} loading={isPending}>변경사항 저장하기</Button>
      </div>
    </div>
  )
}

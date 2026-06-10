import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCreateDiaryMutation } from '../../hooks/useHome'
import { SubpageHeader } from '../../components/SubpageHeader'
import Button from '../../components/ui/Button'
import { useToast } from '../../hooks/useToast'

const MOOD_OPTIONS = [
  { value: 'terrible', emoji: '😡' },
  { value: 'bad',      emoji: '😠' },
  { value: 'neutral',  emoji: '😐' },
  { value: 'good',     emoji: '🙂' },
  { value: 'great',    emoji: '😊' },
] as const

type MoodValue = typeof MOOD_OPTIONS[number]['value']

const SKIN_KEYWORDS = [
  '건조함', '유분 많음', '트러블', '홍조', '각질 부각', '민감/따가움', '해당 없음',
]

export default function DiaryWritePage() {
  const navigate = useNavigate()
  const today = new Date().toISOString().split('T')[0]
  const [y, m, d] = today.split('-')

  const [mood, setMood] = useState<MoodValue | ''>('')
  const [keywords, setKeywords] = useState<string[]>([])
  const [note, setNote] = useState('')

  const { mutate, isPending } = useCreateDiaryMutation()
  const { showSuccess, showError } = useToast()

  const toggleKeyword = (kw: string) =>
    setKeywords((prev) =>
      prev.includes(kw) ? prev.filter((k) => k !== kw) : [...prev, kw]
    )

  const handleSave = () => {
    if (!mood) return
    mutate(
      { skinStatus: mood, keywords, memo: note, logDate: today },
      {
        onSuccess: () => {
          showSuccess('일기가 저장되었습니다')
          navigate('/home')
        },
        onError: () => showError('저장 중 오류가 발생했습니다'),
      }
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
      <SubpageHeader title="오늘의 피부 기록" />

      <main className="flex-grow overflow-y-auto p-6 pb-28 space-y-8">
        {/* 기분 선택 */}
        <section>
          <h2 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-4 text-center">
            오늘의 피부 상태는 어떤가요?
          </h2>
          <div className="flex justify-center items-center gap-2 bg-white dark:bg-gray-800 p-3 rounded-full shadow-sm w-fit mx-auto">
            {MOOD_OPTIONS.map(({ value, emoji }) => (
              <button
                key={value}
                type="button"
                aria-pressed={mood === value}
                onClick={() => setMood(value)}
                className={`p-2 rounded-full transition-colors ${
                  mood === value
                    ? 'ring-2 ring-primary bg-blue-100 dark:bg-blue-900/50'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <span className="text-4xl">{emoji}</span>
              </button>
            ))}
          </div>
        </section>

        {/* 키워드 */}
        <section>
          <h2 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-3">
            오늘 피부 상태 키워드
          </h2>
          <div className="flex overflow-x-auto gap-2 pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {SKIN_KEYWORDS.map((kw) => (
              <button
                key={kw}
                type="button"
                aria-pressed={keywords.includes(kw)}
                onClick={() => toggleKeyword(kw)}
                className={`flex-shrink-0 px-4 py-2 text-sm font-medium rounded-full border shadow-sm whitespace-nowrap transition-colors ${
                  keywords.includes(kw)
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                }`}
              >
                {kw}
              </button>
            ))}
          </div>
        </section>

        {/* 메모 */}
        <section>
          <h2 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-3">메모</h2>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="자세한 내용을 기록해 보세요."
            className="w-full h-32 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 placeholder-gray-400 focus:ring-primary focus:border-primary resize-none"
          />
        </section>

        {/* 버튼 */}
        <div className="space-y-3">
          <Button fullWidth onClick={handleSave} loading={isPending} disabled={!mood}>
            저장
          </Button>
          <button
            type="button"
            onClick={() => navigate('/home')}
            className="w-full text-primary font-medium py-3.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-center"
          >
            취소
          </button>
        </div>
      </main>
    </div>
  )
}

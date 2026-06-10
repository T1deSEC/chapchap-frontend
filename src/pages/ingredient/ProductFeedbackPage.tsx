import { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useSubmitFeedbackMutation } from '../../hooks/useFeedback'
import Button from '../../components/ui/Button'
import { useToast } from '../../hooks/useToast'

const REACTIONS = ['좋음', '변화 없음', '트러블 발생'] as const
type Reaction = typeof REACTIONS[number]

export const mapReaction = (
  reaction: '좋음' | '변화 없음' | '트러블 발생'
): 'good' | 'neutral' | 'trouble' => {
  const map = {
    '좋음': 'good',
    '변화 없음': 'neutral',
    '트러블 발생': 'trouble',
  } as const
  return map[reaction]
}

const USAGE_PERIODS = ['1주일 미만', '1-2주', '2-4주', '1개월 이상']

export default function ProductFeedbackPage() {
  const { productId } = useParams<{ productId: string }>()
  const navigate = useNavigate()

  const [reaction, setReaction] = useState<Reaction>('좋음')
  const [rating, setRating] = useState(4)
  const [hoverRating, setHoverRating] = useState(0)
  const [usagePeriod, setUsagePeriod] = useState('2-4주')
  const [comment, setComment] = useState('')

  const { mutate, isPending } = useSubmitFeedbackMutation()
  const { showSuccess, showError } = useToast()

  const handleSubmit = () => {
    const memo = [usagePeriod, `${rating}점`, comment].filter(Boolean).join(' / ')
    mutate(
      { productId: Number(productId), reaction: mapReaction(reaction), memo },
      {
        onSuccess: () => {
          showSuccess('피드백이 저장되었습니다')
          navigate(`/ingredient/${productId}`)
        },
        onError: () => showError('저장 중 오류가 발생했습니다'),
      }
    )
  }

  const displayRating = hoverRating || rating

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark">
      <div className="flex-1 pb-24">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200/80 bg-background-light/80 p-4 pb-3 backdrop-blur-sm dark:border-gray-800/80 dark:bg-background-dark/80">
          <Link to={`/ingredient/${productId}`} className="flex size-10 items-center justify-center text-gray-600 dark:text-gray-300">
            <span className="material-symbols-outlined text-3xl">arrow_back_ios_new</span>
          </Link>
          <h1 className="text-lg font-bold text-[#111318] dark:text-white">피드백 입력</h1>
          <div className="size-10" />
        </header>

        <main className="flex flex-col gap-6 p-4 pt-6">
          <div className="flex flex-col gap-3">
            <label className="text-base font-bold text-[#111318] dark:text-white">피부 반응</label>
            <div className="grid grid-cols-3 gap-3">
              {REACTIONS.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setReaction(r)}
                  className={`flex h-12 items-center justify-center rounded-lg text-sm font-medium transition-all ${
                    reaction === r
                      ? 'bg-primary text-white ring-2 ring-primary'
                      : 'bg-white dark:bg-gray-800 text-[#111318] dark:text-white ring-1 ring-gray-300 dark:ring-gray-700'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-base font-bold text-[#111318] dark:text-white">만족도</label>
            <div className="flex items-center justify-center gap-2 py-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  aria-label={`별 ${star}개`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="cursor-pointer transition-transform hover:scale-110"
                >
                  <span
                    className="material-symbols-outlined text-4xl"
                    style={
                      star <= displayRating
                        ? { fontVariationSettings: "'FILL' 1", color: '#FACC15' }
                        : { color: '#D1D5DB' }
                    }
                  >
                    star
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <label htmlFor="usage-period" className="text-base font-bold text-[#111318] dark:text-white">사용 기간</label>
            <div className="relative">
              <select
                id="usage-period"
                value={usagePeriod}
                onChange={(e) => setUsagePeriod(e.target.value)}
                className="h-12 w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 text-[#111318] dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-primary focus:outline-none"
              >
                {USAGE_PERIODS.map((p) => <option key={p}>{p}</option>)}
              </select>
              <span className="material-symbols-outlined pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">expand_more</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <label htmlFor="comment" className="text-base font-bold text-[#111318] dark:text-white">추가 코멘트 (선택)</label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="제품 사용 경험에 대해 더 자세히 알려주세요."
              className="min-h-[120px] w-full resize-none rounded-lg border border-gray-300 bg-white p-4 text-[#111318] dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-primary focus:outline-none"
            />
          </div>
        </main>
      </div>

      <footer className="fixed bottom-0 left-0 right-0 z-10 bg-background-light p-4 dark:bg-background-dark">
        <Button fullWidth onClick={handleSubmit} loading={isPending}>
          피드백 제출
        </Button>
      </footer>
    </div>
  )
}

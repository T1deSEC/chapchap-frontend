import { motion } from 'framer-motion'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useDiaryEntry, useDeleteDiaryMutation } from '../../hooks/useHome'
import { SubpageHeader } from '../../components/SubpageHeader'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

const MOOD_MAP: Record<string, string> = {
  great: '😊', good: '🙂', neutral: '😐', bad: '😠', terrible: '😡',
}

export default function DiaryDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: entry, isLoading } = useDiaryEntry(Number(id))
  const { mutate: deleteEntry, isPending } = useDeleteDiaryMutation()

  const handleDelete = () => {
    if (!entry) return
    deleteEntry(entry.id, { onSuccess: () => navigate('/home') })
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    )
  }

  if (!entry) return null

  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="max-w-sm mx-auto min-h-screen flex flex-col bg-white dark:bg-background-dark"
    >
      <SubpageHeader title="피부 일기" />

      <main className="flex-1 overflow-y-auto px-4 pt-4 pb-28 space-y-8">
        {/* 기분 */}
        <section>
          <h3 className="text-gray-900 dark:text-gray-100 text-lg font-bold pb-3">이 날의 피부 상태</h3>
          <div className="flex justify-center items-center p-4">
            <div className="flex size-24 items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-md ring-2 ring-primary">
              <span className="text-6xl">{MOOD_MAP[entry.skinStatus] ?? '😐'}</span>
            </div>
          </div>
        </section>

        {/* 키워드 */}
        {entry.keywords.length > 0 && (
          <section>
            <h3 className="text-gray-900 dark:text-gray-100 text-lg font-bold pb-3">피부 상태 키워드</h3>
            <div className="flex gap-2 flex-wrap">
              {entry.keywords.map((kw) => (
                <div key={kw} className="flex h-9 items-center rounded-full bg-primary/20 px-4">
                  <p className="text-primary text-sm font-medium">#{kw}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 메모 */}
        {entry.memo && (
          <section>
            <h3 className="text-gray-900 dark:text-gray-100 text-lg font-bold pb-3">메모</h3>
            <div className="w-full rounded-xl bg-white dark:bg-gray-800 p-4 shadow-sm">
              <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
                {entry.memo}
              </p>
            </div>
          </section>
        )}

        {/* 버튼 */}
        <section className="flex flex-col items-center gap-3">
          <Link
            to="/home/diary/write"
            className="flex h-12 w-full items-center justify-center rounded-xl bg-primary text-base font-bold text-white"
          >
            수정하기
          </Link>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            className="text-sm font-medium text-gray-500 dark:text-gray-400 disabled:opacity-50"
          >
            삭제
          </button>
        </section>
      </main>
    </motion.div>
  )
}

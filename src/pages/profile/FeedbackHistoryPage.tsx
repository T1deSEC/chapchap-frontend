import { motion } from 'framer-motion'
import { useFeedbackHistory, useDeleteFeedbackMutation } from '../../hooks/useFeedback'
import { SubpageHeader } from '../../components/SubpageHeader'
import { formatRelativeDate } from '../../utils/formatDate'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../../hooks/useToast'

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
}

const REACTION_LABEL: Record<string, string> = {
  good: '좋음',
  neutral: '변화 없음',
  trouble: '트러블 발생',
}

export default function FeedbackHistoryPage() {
  const { data: records = [], isLoading } = useFeedbackHistory()
  const { mutate: deleteFeedback } = useDeleteFeedbackMutation()
  const navigate = useNavigate()
  const { showSuccess, showError } = useToast()

  const handleEdit = (productId: number) => {
    const record = records.find((r) => r.productId === productId)
    navigate(`/ingredient/${productId}/feedback`, { state: { feedback: record } })
  }

  const handleDelete = (productId: number) => {
    deleteFeedback(productId, {
      onSuccess: () => showSuccess('피드백이 삭제되었습니다'),
      onError: () => showError('삭제 중 오류가 발생했습니다'),
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-x-hidden"
    >
      <SubpageHeader title="내 피드백 기록" />
      <main className="flex-grow pb-24">
        {isLoading ? (
          <div className="flex flex-col gap-3 p-4 animate-pulse">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-28 bg-gray-200 dark:bg-gray-700 rounded-xl" />
            ))}
          </div>
        ) : records.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center mt-20 p-8">
            <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600">rate_review</span>
            <p className="mt-4 text-base font-medium text-gray-500 dark:text-gray-400">아직 작성한 피드백이 없어요.</p>
          </div>
        ) : (
          <motion.div variants={listVariants} initial="hidden" animate="visible">
            {records.map((record) => (
              <motion.div key={record.productId} variants={itemVariants}>
                <div className="p-4 pb-0">
                  <div className="flex items-stretch justify-between gap-4 rounded-xl bg-white dark:bg-background-dark/50 p-4 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
                    <div className="flex flex-[2_2_0px] flex-col gap-3">
                      <div className="flex flex-col gap-1">
                        <p className="text-base font-bold text-[#111318] dark:text-white">{record.productName}</p>
                        <p className="text-sm text-[#616f89] dark:text-gray-400">
                          {formatRelativeDate(record.createdAt)}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="flex h-7 items-center justify-center rounded-full bg-primary/10 px-3 text-xs font-medium text-primary dark:bg-primary/20">
                          {REACTION_LABEL[record.reaction] ?? record.reaction}
                        </span>
                        {record.usagePeriod && (
                          <span className="flex h-7 items-center justify-center rounded-full bg-gray-100 px-3 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                            {record.usagePeriod}
                          </span>
                        )}
                        {record.rating != null && (
                          <span className="flex items-center gap-0.5 text-xs font-medium text-yellow-500">
                            <span
                              className="material-symbols-outlined text-sm"
                              style={{ fontVariationSettings: "'FILL' 1" }}
                            >star</span>
                            {record.rating}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(record.productId)}
                          className="flex h-8 w-fit min-w-[56px] items-center justify-center rounded-lg bg-primary px-3 text-sm font-medium text-white"
                        >
                          수정
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(record.productId)}
                          className="flex h-8 w-fit min-w-[56px] items-center justify-center rounded-lg bg-red-50 px-3 text-sm font-medium text-red-500 dark:bg-red-900/20 dark:text-red-400"
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                    {record.imageUrl ? (
                      <div
                        className="aspect-square w-24 flex-shrink-0 rounded-lg bg-cover bg-center"
                        style={{ backgroundImage: `url(${record.imageUrl})` }}
                      />
                    ) : (
                      <div className="aspect-square w-24 flex-shrink-0 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                        <span className="material-symbols-outlined text-gray-300">image</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>
    </motion.div>
  )
}

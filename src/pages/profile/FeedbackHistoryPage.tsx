import { motion } from 'framer-motion'
import { useFeedbackHistory } from '../../hooks/useFeedback'
import { SubpageHeader } from '../../components/SubpageHeader'
import { formatRelativeDate } from '../../utils/formatDate'
import { Link } from 'react-router-dom'

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
}

export default function FeedbackHistoryPage() {
  const { data: records = [], isLoading } = useFeedbackHistory()

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
                    <div className="flex flex-[2_2_0px] flex-col gap-4">
                      <div className="flex flex-col gap-1">
                        <p className="text-base font-bold text-[#111318] dark:text-white">{record.productName}</p>
                        <p className="text-sm text-[#616f89] dark:text-gray-400">
                          {formatRelativeDate(record.createdAt)}
                        </p>
                      </div>
                      <Link
                        to={`/ingredient/${record.productId}`}
                        className="flex h-8 w-fit min-w-[84px] items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-white"
                      >
                        자세히 보기
                      </Link>
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
                <div className="flex gap-2 p-4 pt-3">
                  <div className="flex h-8 shrink-0 items-center justify-center rounded-full bg-primary/10 px-3 dark:bg-primary/20">
                    <p className="text-sm font-medium text-primary dark:text-primary/90">
                      {record.reaction === 'good' ? '좋음' : record.reaction === 'neutral' ? '변화 없음' : '트러블 발생'}
                    </p>
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

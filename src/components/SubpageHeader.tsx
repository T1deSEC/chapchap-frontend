import { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

interface SubpageHeaderProps {
  title: string
  onBack?: () => void
  rightAction?: ReactNode
}

export function SubpageHeader({ title, onBack, rightAction }: SubpageHeaderProps) {
  const navigate = useNavigate()
  const handleBack = onBack ?? (() => navigate(-1))

  return (
    <header className="sticky top-0 z-10 h-14 bg-white/90 backdrop-blur-sm border-b border-gray-100 dark:bg-gray-900/90 dark:border-gray-800 flex items-center px-4">
      <button
        type="button"
        onClick={handleBack}
        className="w-8 h-8 flex items-center justify-center -ml-1"
      >
        <span className="material-symbols-outlined text-xl text-gray-800 dark:text-gray-200">
          arrow_back_ios_new
        </span>
      </button>
      <h1 className="flex-1 text-center text-base font-bold text-gray-900 dark:text-gray-100">
        {title}
      </h1>
      <div className="w-8 h-8 flex items-center justify-center">
        {rightAction ?? null}
      </div>
    </header>
  )
}

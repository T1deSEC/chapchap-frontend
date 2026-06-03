import { Link } from 'react-router-dom'
import { useNotificationSettings, useUpdateNotificationSettingsMutation } from '../../hooks/useProfile'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import type { NotificationSettings } from '../../types'

interface ToggleRowProps {
  label: string
  description: string
  checked: boolean
  onChange: (v: boolean) => void
  disabled: boolean
}

function ToggleRow({ label, description, checked, onChange, disabled }: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between px-4 py-4 border-t border-gray-200 dark:border-gray-800 first:border-t-0">
      <div className="flex flex-col gap-0.5 flex-1 mr-4">
        <p className="text-base font-medium text-gray-900 dark:text-white">{label}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none disabled:opacity-50 ${checked ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`}
        />
      </button>
    </div>
  )
}

export default function NotificationSettingsPage() {
  const { data: settings, isLoading } = useNotificationSettings()
  const { mutate, isPending } = useUpdateNotificationSettingsMutation()

  const handleToggle = (key: keyof NotificationSettings, value: boolean) => {
    if (!settings) return
    mutate({ ...settings, [key]: value })
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark">
      <header className="sticky top-0 z-10 flex h-14 items-center border-b border-gray-200/80 bg-white/80 px-4 backdrop-blur-sm dark:border-gray-800/80 dark:bg-background-dark/80">
        <Link to="/home/settings" className="flex h-10 w-10 items-center justify-center -ml-2">
          <span className="material-symbols-outlined text-2xl text-gray-900 dark:text-white">arrow_back_ios_new</span>
        </Link>
        <h1 className="flex-1 text-center text-lg font-bold text-gray-900 dark:text-white">알림 설정</h1>
        <div className="w-8" />
      </header>
      <main className="flex-1 px-4 py-6">
        {isLoading ? (
          <div className="flex justify-center py-8"><LoadingSpinner /></div>
        ) : (
          <div className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900/50">
            <ToggleRow
              label="성분 분석 알림"
              description="AI 성분 분석 완료 시 알림을 받습니다"
              checked={settings?.ingredientAnalysisEnabled ?? true}
              onChange={(v) => handleToggle('ingredientAnalysisEnabled', v)}
              disabled={isPending}
            />
            <ToggleRow
              label="성분 추천 알림"
              description="맞춤 성분 추천 완료 시 알림을 받습니다"
              checked={settings?.ingredientRecommendEnabled ?? true}
              onChange={(v) => handleToggle('ingredientRecommendEnabled', v)}
              disabled={isPending}
            />
            <ToggleRow
              label="루틴 분석 알림"
              description="루틴 충돌·주의 분석 완료 시 알림을 받습니다"
              checked={settings?.routineAnalysisEnabled ?? true}
              onChange={(v) => handleToggle('routineAnalysisEnabled', v)}
              disabled={isPending}
            />
          </div>
        )}
      </main>
    </div>
  )
}

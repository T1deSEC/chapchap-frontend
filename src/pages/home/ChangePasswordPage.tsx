import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUpdatePasswordMutation } from '../../hooks/useProfile'
import Button from '../../components/ui/Button'

export default function ChangePasswordPage() {
  const navigate = useNavigate()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const { mutate, isPending } = useUpdatePasswordMutation()

  const handleSave = () => {
    if (!currentPassword) { setError('현재 비밀번호를 입력해주세요.'); return }
    if (!newPassword) { setError('새 비밀번호를 입력해주세요.'); return }
    if (newPassword.length < 8) { setError('새 비밀번호는 8자 이상이어야 합니다.'); return }
    if (newPassword !== confirmPassword) { setError('새 비밀번호가 일치하지 않습니다.'); return }
    setError('')
    mutate(
      { currentPassword, newPassword },
      {
        onSuccess: () => navigate('/home/settings'),
        onError: (err: unknown) => {
          const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
          setError(msg ?? '비밀번호 변경에 실패했습니다.')
        },
      }
    )
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark">
      <header className="sticky top-0 z-10 flex h-14 items-center border-b border-gray-200/80 bg-white/80 px-4 backdrop-blur-sm dark:border-gray-800/80 dark:bg-background-dark/80">
        <Link to="/home" className="flex h-10 w-10 items-center justify-center -ml-2">
          <span className="material-symbols-outlined text-2xl text-gray-900 dark:text-white">arrow_back_ios_new</span>
        </Link>
        <h1 className="flex-1 text-center text-lg font-bold text-gray-900 dark:text-white">비밀번호 변경</h1>
        <div className="w-8" />
      </header>
      <main className="flex-1 flex flex-col gap-4 px-4 py-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">현재 비밀번호</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-base text-gray-900 dark:text-white focus:border-primary focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">새 비밀번호</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-base text-gray-900 dark:text-white focus:border-primary focus:outline-none"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">8자 이상 입력해주세요.</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">새 비밀번호 확인</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-base text-gray-900 dark:text-white focus:border-primary focus:outline-none"
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <div className="mt-2">
          <Button fullWidth onClick={handleSave} loading={isPending}>저장하기</Button>
        </div>
      </main>
    </div>
  )
}

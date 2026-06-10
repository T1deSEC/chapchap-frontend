import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUpdateNicknameMutation } from '../../hooks/useProfile'
import { useAuthStore } from '../../store/authStore'
import Button from '../../components/ui/Button'
import { useToast } from '../../hooks/useToast'

export default function ChangeNicknamePage() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const updateUser = useAuthStore((s) => s.updateUser)
  const [nickname, setNickname] = useState(user?.name ?? '')
  const [error, setError] = useState('')
  const { mutate, isPending } = useUpdateNicknameMutation()
  const { showSuccess, showError } = useToast()

  const handleSave = () => {
    const trimmed = nickname.trim()
    if (!trimmed) { setError('닉네임을 입력해주세요.'); return }
    if (trimmed.length > 50) { setError('닉네임은 50자 이하여야 합니다.'); return }
    setError('')
    mutate(trimmed, {
      onSuccess: () => {
        updateUser({ name: trimmed })
        showSuccess('닉네임이 변경되었습니다')
        navigate('/home/settings')
      },
      onError: () => {
        showError('변경 중 오류가 발생했습니다')
        setError('닉네임 변경에 실패했습니다.')
      },
    })
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark">
      <header className="sticky top-0 z-10 flex h-14 items-center border-b border-gray-200/80 bg-white/80 px-4 backdrop-blur-sm dark:border-gray-800/80 dark:bg-background-dark/80">
        <Link to="/home/settings" className="flex h-10 w-10 items-center justify-center -ml-2">
          <span className="material-symbols-outlined text-2xl text-gray-900 dark:text-white">arrow_back_ios_new</span>
        </Link>
        <h1 className="flex-1 text-center text-lg font-bold text-gray-900 dark:text-white">닉네임 변경</h1>
        <div className="w-8" />
      </header>
      <main className="flex-1 px-4 py-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          새 닉네임
        </label>
        <input
          type="text"
          maxLength={50}
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-base text-gray-900 dark:text-white focus:border-primary focus:outline-none"
        />
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        <div className="mt-6">
          <Button fullWidth onClick={handleSave} loading={isPending}>저장하기</Button>
        </div>
      </main>
    </div>
  )
}

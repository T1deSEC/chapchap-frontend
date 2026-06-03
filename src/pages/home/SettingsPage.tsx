import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

function SettingRow({ label, value, to }: { label: string; value?: string; to?: string }) {
  const inner = (
    <>
      <p className="text-base text-gray-900 dark:text-white">{label}</p>
      <div className="flex items-center gap-2">
        {value && <p className="text-base text-gray-500 dark:text-gray-400">{value}</p>}
        {to && <span className="material-symbols-outlined text-lg text-gray-400">arrow_forward_ios</span>}
      </div>
    </>
  )
  if (to) {
    return (
      <Link to={to} className="flex min-h-[56px] items-center justify-between px-4">
        {inner}
      </Link>
    )
  }
  return (
    <div className="flex min-h-[56px] items-center justify-between px-4">
      {inner}
    </div>
  )
}

function Divider() {
  return <div className="mx-4 h-[1px] bg-gray-200 dark:bg-gray-800" />
}

export default function SettingsPage() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark">
      <header className="sticky top-0 z-10 flex h-14 items-center border-b border-gray-200/80 bg-white/80 px-4 backdrop-blur-sm dark:border-gray-800/80 dark:bg-background-dark/80">
        <Link to="/profile" className="flex h-10 w-10 items-center justify-center -ml-2">
          <span className="material-symbols-outlined text-2xl text-gray-900 dark:text-white">
            arrow_back_ios_new
          </span>
        </Link>
        <h1 className="flex-1 text-center text-lg font-bold text-gray-900 dark:text-white">설정</h1>
        <div className="w-8" />
      </header>

      <main className="flex-1 px-4 py-6">
        <div className="flex flex-col gap-8">
          <section>
            <h2 className="px-2 pb-2 text-base font-semibold text-gray-500 dark:text-gray-400">계정</h2>
            <div className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900/50">
              <SettingRow label="닉네임" value={user?.name ?? '-'} to="/home/settings/change-nickname" />
              <Divider />
              <SettingRow label="이메일" value={user?.email ?? '-'} />
              <Divider />
              <SettingRow label="비밀번호 변경" to="/home/settings/change-password" />
              <Divider />
              <SettingRow label="피부 타입/피부 고민 설정" to="/profile/skin-setup" />
            </div>
          </section>

          <section>
            <h2 className="px-2 pb-2 text-base font-semibold text-gray-500 dark:text-gray-400">앱 기능</h2>
            <div className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900/50">
              <SettingRow label="알림 설정" to="/home/settings/notifications" />
            </div>
          </section>

          <section>
            <h2 className="px-2 pb-2 text-base font-semibold text-gray-500 dark:text-gray-400">기타</h2>
            <div className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900/50">
              <SettingRow label="버전 정보" value="v1.0.0" />
              <Divider />
              <div className="flex min-h-[56px] items-center px-4">
                <button type="button" onClick={handleLogout} className="text-base text-red-500">
                  로그아웃
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

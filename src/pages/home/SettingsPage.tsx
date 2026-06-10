import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { SubpageHeader } from '../../components/SubpageHeader'

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
      <SubpageHeader title="설정" />

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

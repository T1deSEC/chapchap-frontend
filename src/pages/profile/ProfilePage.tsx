import { Link, useNavigate } from 'react-router-dom'
import { useProfile } from '../../hooks/useProfile'
import { useAuthStore } from '../../store/authStore'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

const GENDER_LABEL: Record<string, string> = { 여성: '여성', 남성: '남성' }

export default function ProfilePage() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const { data: profile, isLoading } = useProfile()

  const handleLogout = () => { logout(); navigate('/login', { replace: true }) }

  const skinRows: [string, string][] = profile
    ? [
        ['피부 타입', profile.skinType ?? '-'],
        ['피부 고민', profile.skinConcerns.join(', ') || '-'],
        ['성별', profile.gender ? (GENDER_LABEL[profile.gender] ?? profile.gender) : '-'],
        ['출생연도', profile.birthYear ? String(profile.birthYear) : '-'],
      ]
    : []

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-x-hidden pb-24">
      <div className="flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between sticky top-0 z-10 border-b border-b-[#dbdfe6]/50 dark:border-b-[#2a303c]">
        <div className="flex size-12 shrink-0 items-center justify-start" />
        <h2 className="text-[#111318] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">마이</h2>
        <div className="size-12 shrink-0" />
      </div>
      <div className="flex flex-col gap-6 p-4">
        {/* 프로필 카드 */}
        <div className="flex w-full flex-col gap-4 items-start bg-white dark:bg-background-dark dark:border dark:border-[#2a303c] p-4 rounded-xl shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary/20 dark:bg-primary/30">
              <span className="material-symbols-outlined text-4xl text-primary">person</span>
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-[#111318] dark:text-white text-[22px] font-bold leading-tight">{user?.name ?? '-'}</p>
              <p className="text-[#616f89] dark:text-gray-400 text-base font-normal leading-normal">{user?.email ?? '-'}</p>
            </div>
          </div>
          <Link
            to="/home/settings"
            className="flex w-full cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-primary/10 dark:bg-primary/20 text-primary text-sm font-bold"
          >
            프로필 편집
          </Link>
        </div>
        {/* 피부 프로필 */}
        <div className="flex flex-col bg-white dark:bg-background-dark dark:border dark:border-[#2a303c] rounded-xl shadow-sm overflow-hidden">
          <h3 className="text-[#111318] dark:text-white text-lg font-bold px-4 pt-4 pb-2">내 피부 프로필</h3>
          {isLoading ? (
            <div className="flex justify-center py-4"><LoadingSpinner size={24} /></div>
          ) : (
            <div className="px-4 grid grid-cols-[30%_1fr] gap-x-4">
              {skinRows.map(([label, value]) => (
                <div key={label} className="col-span-2 grid grid-cols-subgrid border-t border-t-[#dbdfe6] dark:border-t-[#2a303c] py-4">
                  <p className="text-[#616f89] dark:text-gray-400 text-sm">{label}</p>
                  <p className="text-[#111318] dark:text-white text-sm">{value}</p>
                </div>
              ))}
            </div>
          )}
          <Link to="/profile/skin-setup" className="block p-4 pt-2">
            <div className="flex w-full cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold">
              피부 타입/피부 고민 설정
            </div>
          </Link>
        </div>
        {/* 내 기록 */}
        <div className="flex flex-col bg-white dark:bg-background-dark dark:border dark:border-[#2a303c] rounded-xl shadow-sm overflow-hidden">
          <h3 className="text-[#111318] dark:text-white text-lg font-bold px-4 pt-4 pb-2">내 기록</h3>
          <Link to="/profile/feedback-history" className="flex items-center justify-between p-4 border-t border-t-[#dbdfe6] dark:border-t-[#2a303c] hover:bg-black/5">
            <span className="text-sm font-medium text-[#111318] dark:text-white">피드백 기록</span>
            <span className="material-symbols-outlined text-[#616f89]">arrow_forward_ios</span>
          </Link>
          <Link to="/profile/wishlist" className="flex items-center justify-between p-4 border-t border-t-[#dbdfe6] dark:border-t-[#2a303c] hover:bg-black/5">
            <span className="text-sm font-medium text-[#111318] dark:text-white">찜한 제품</span>
            <span className="material-symbols-outlined text-[#616f89]">arrow_forward_ios</span>
          </Link>
        </div>
        {/* 설정 */}
        <div className="flex flex-col bg-white dark:bg-background-dark dark:border dark:border-[#2a303c] rounded-xl shadow-sm overflow-hidden">
          <h3 className="text-[#111318] dark:text-white text-lg font-bold px-4 pt-4 pb-2">설정</h3>
          <div className="flex flex-col">
            <Link to="/home/settings/notifications" className="flex items-center justify-between p-4 border-t border-t-[#dbdfe6] dark:border-t-[#2a303c] hover:bg-black/5">
              <span className="text-sm font-medium text-[#111318] dark:text-white">알림 설정</span>
              <span className="material-symbols-outlined text-[#616f89]">arrow_forward_ios</span>
            </Link>
            <div className="flex items-center justify-between p-4 border-t border-t-[#dbdfe6] dark:border-t-[#2a303c] opacity-40 cursor-not-allowed">
              <span className="text-sm font-medium text-[#111318] dark:text-white">개인정보처리방침</span>
              <span className="material-symbols-outlined text-[#616f89]">arrow_forward_ios</span>
            </div>
            <div className="flex items-center justify-between p-4 border-t border-t-[#dbdfe6] dark:border-t-[#2a303c] opacity-40 cursor-not-allowed">
              <span className="text-sm font-medium text-[#111318] dark:text-white">서비스 약관</span>
              <span className="material-symbols-outlined text-[#616f89]">arrow_forward_ios</span>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center justify-between p-4 border-t border-t-[#dbdfe6] dark:border-t-[#2a303c] hover:bg-black/5 w-full text-left"
            >
              <span className="text-sm font-medium text-[#111318] dark:text-white">로그아웃</span>
              <span className="material-symbols-outlined text-[#616f89]">arrow_forward_ios</span>
            </button>
          </div>
        </div>
        <div className="text-center py-4"><p className="text-[#616f89] dark:text-gray-500 text-xs">버전 1.0.2</p></div>
      </div>
    </div>
  )
}

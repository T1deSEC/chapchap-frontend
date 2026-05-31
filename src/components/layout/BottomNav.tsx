import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/home', icon: 'home', label: '홈' },
  { to: '/ingredient', icon: 'science', label: '성분' },
  { to: '/routine', icon: 'checklist', label: '루틴' },
  { to: '/profile', icon: 'person', label: '마이' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 h-24 border-t border-gray-200 bg-white/80 backdrop-blur-lg dark:border-gray-700 dark:bg-background-dark/80">
      <div className="mx-auto flex h-full max-w-md items-center justify-around px-2">
        {tabs.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 ${
                isActive ? 'text-primary' : 'text-gray-600 dark:text-gray-400'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className="material-symbols-outlined text-2xl"
                  style={
                    isActive
                      ? { fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" }
                      : undefined
                  }
                >
                  {icon}
                </span>
                <span className={`text-xs ${isActive ? 'font-bold' : 'font-medium'}`}>
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

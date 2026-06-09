export default function AiRoutineLoadingPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-white dark:bg-zinc-900">
      <div className="flex flex-col items-center justify-center gap-6">
        <div className="relative h-48 w-48">
          <svg className="absolute inset-0" viewBox="0 0 100 125">
            <defs>
              <clipPath id="routine-loading-drop-clip">
                <path d="M50 0C50 0 15 45 15 70C15 89.33 30.67 105 50 105C69.33 105 85 89.33 85 70C85 45 50 0 50 0Z" />
              </clipPath>
            </defs>
            <path className="text-blue-100 dark:text-blue-900/50" fill="currentColor" d="M50 0C50 0 15 45 15 70C15 89.33 30.67 105 50 105C69.33 105 85 89.33 85 70C85 45 50 0 50 0Z" />
            <g clipPath="url(#routine-loading-drop-clip)">
              <rect className="fill-primary" x="0" y="0" width="100" height="125" style={{ animation: 'drop-fill-animation 3s ease-in-out infinite' }} />
            </g>
          </svg>
          <style>{`
            @keyframes drop-fill-animation {
              0%, 100% { transform: translateY(125px); }
              50%       { transform: translateY(0px); }
            }
          `}</style>
        </div>
        <p className="text-lg font-semibold text-zinc-700 dark:text-zinc-300">AI 안전 진단 중...</p>
      </div>
    </div>
  )
}

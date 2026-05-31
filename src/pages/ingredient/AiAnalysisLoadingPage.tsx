export default function AiAnalysisLoadingPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-white dark:bg-zinc-900">
      <div className="flex flex-col items-center justify-center gap-6">
        <div className="relative h-48 w-48">
          <svg className="absolute inset-0 text-blue-100 dark:text-blue-900/50" fill="currentColor" viewBox="0 0 100 125">
            <path d="M50 0C50 0 15 45 15 70C15 89.33 30.67 105 50 105C69.33 105 85 89.33 85 70C85 45 50 0 50 0Z" />
          </svg>
          <div className="absolute inset-x-0 bottom-0 bg-primary" style={{ animation: 'fill-animation 3s ease-in-out infinite' }} />
          <style>{`
            @keyframes fill-animation {
              0%, 100% { height: 0%; }
              50%       { height: 80%; }
            }
          `}</style>
        </div>
        <p className="text-lg font-semibold text-zinc-700 dark:text-zinc-300">AI 성분 진단 중...</p>
      </div>
    </div>
  )
}

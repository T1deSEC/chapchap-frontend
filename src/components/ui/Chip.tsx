interface ChipProps {
  children: React.ReactNode
  active?: boolean
  onClick?: () => void
}

export default function Chip({ children, active, onClick }: ChipProps) {
  return (
    <div
      onClick={onClick}
      className={`flex h-8 shrink-0 cursor-pointer items-center justify-center rounded-full px-4 text-sm font-medium transition-colors ${
        active
          ? 'bg-primary text-white'
          : 'bg-white text-gray-800 dark:bg-zinc-800 dark:text-white'
      }`}
    >
      {children}
    </div>
  )
}

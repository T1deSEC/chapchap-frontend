export default function LoadingSpinner({ size = 48 }: { size?: number }) {
  return (
    <div
      className="animate-spin rounded-full border-4 border-primary border-t-transparent"
      style={{ width: size, height: size }}
      role="status"
      aria-label="로딩 중"
    />
  )
}

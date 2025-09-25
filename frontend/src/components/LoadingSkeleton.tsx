interface LoadingSkeletonProps {
  lines?: number
  className?: string
}

export function LoadingSkeleton({ lines = 3, className = "" }: LoadingSkeletonProps) {
  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`bg-gray-200 rounded h-4 ${i === lines - 1 ? "w-3/4" : "w-full"} ${i > 0 ? "mt-3" : ""}`}
        />
      ))}
    </div>
  )
}

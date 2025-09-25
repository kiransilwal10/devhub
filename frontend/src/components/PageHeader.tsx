import type { ReactNode } from "react"

interface PageHeaderProps {
  title: string
  subtitle?: string
  children?: ReactNode
}

export function PageHeader({ title, subtitle, children }: PageHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900 text-balance">{title}</h1>
      {subtitle && <p className="mt-2 text-lg text-gray-600 text-pretty">{subtitle}</p>}
      {children && <div className="mt-4">{children}</div>}
    </div>
  )
}

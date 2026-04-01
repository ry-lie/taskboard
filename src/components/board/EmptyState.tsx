// Empty state shown when a board column has no tasks
interface EmptyStateProps {
  title: string
  description: string
}

export default function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-gray-300 bg-white/60 px-4 py-8 text-center">
      <p className="text-sm font-semibold text-gray-600">{title}</p>
      <p className="mt-2 text-sm leading-6 text-gray-400">{description}</p>
    </div>
  )
}
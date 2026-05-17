import { Link } from 'react-router-dom'

interface SubjectCardProps {
  to: string
  icon: string
  title: string
  description: string
  accent: string
  available?: boolean
}

export default function SubjectCard({
  to,
  icon,
  title,
  description,
  accent,
  available = true,
}: SubjectCardProps) {
  const card = (
    <div
      className={`group relative flex flex-col gap-4 rounded-xl border p-6 transition-all duration-200 ${
        available
          ? 'cursor-pointer border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 dark:border-white/10 dark:bg-surface dark:hover:border-white/20 dark:hover:bg-white/5'
          : 'cursor-not-allowed border-gray-100 bg-gray-50 opacity-50 dark:border-white/5 dark:bg-surface/50'
      }`}
    >
      <div className={`flex h-12 w-12 items-center justify-center rounded-lg text-2xl ${accent}`}>
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">{description}</p>
      </div>
      {available ? (
        <span className="mt-auto text-xs font-medium text-indigo-600 group-hover:text-indigo-500 dark:text-indigo-400 dark:group-hover:text-indigo-300">
          Jetzt üben →
        </span>
      ) : (
        <span className="mt-auto text-xs text-gray-400 dark:text-slate-600">Demnächst verfügbar</span>
      )}
    </div>
  )

  if (!available) return card

  return <Link to={to} className="block no-underline">{card}</Link>
}

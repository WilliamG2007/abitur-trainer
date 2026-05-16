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
          ? 'cursor-pointer border-white/10 bg-surface hover:border-white/20 hover:bg-white/5'
          : 'cursor-not-allowed border-white/5 bg-surface/50 opacity-50'
      }`}
    >
      <div className={`flex h-12 w-12 items-center justify-center rounded-lg text-2xl ${accent}`}>
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-white">{title}</h3>
        <p className="mt-1 text-sm text-slate-400">{description}</p>
      </div>
      {available ? (
        <span className="mt-auto text-xs font-medium text-indigo-400 group-hover:text-indigo-300">
          Jetzt üben →
        </span>
      ) : (
        <span className="mt-auto text-xs text-slate-600">Demnächst verfügbar</span>
      )}
    </div>
  )

  if (!available) return card

  return <Link to={to} className="block no-underline">{card}</Link>
}

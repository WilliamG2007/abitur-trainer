import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useAnalytics } from '../hooks/useAnalytics'

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-gray-200 dark:bg-white/5 ${className}`} />
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-white/10 dark:bg-white/[0.03]">
      <p className="mb-1 text-xs font-medium text-gray-400 dark:text-slate-500">{label}</p>
      <p className="text-2xl font-bold leading-none text-gray-900 dark:text-white">{value}</p>
      {sub && <p className="mt-1 text-xs text-gray-400 dark:text-slate-600">{sub}</p>}
    </div>
  )
}

export default function Profile() {
  const { user } = useAuth()
  const meta = user?.user_metadata ?? {}
  const displayLabel = meta.display_name || meta.username || user?.email || '?'

  const { getStats, loading, error } = useAnalytics()
  const stats = useMemo(() => getStats(null), [getStats])

  return (
    <div className="mx-auto max-w-lg px-6 py-12">
      <Link to="/" className="mb-8 inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-900 dark:text-slate-500 dark:hover:text-white">
        ← Zurück
      </Link>

      <div className="mb-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-lg font-bold text-white">
            {displayLabel[0]?.toUpperCase() ?? '?'}
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">{displayLabel}</h1>
            <p className="text-sm text-gray-400 dark:text-slate-500">{user?.email}</p>
          </div>
        </div>
        <Link
          to="/settings"
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-500 transition-colors hover:border-gray-300 hover:text-gray-900 dark:border-white/10 dark:text-slate-400 dark:hover:border-white/20 dark:hover:text-white"
        >
          Einstellungen
        </Link>
      </div>

      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-slate-500">Übersicht</h2>
        <Link to="/analytics" className="text-xs text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
          Vollständige Statistiken →
        </Link>
      </div>

      {error && (
        <p className="mb-4 text-xs text-red-500 dark:text-red-400">Statistiken konnten nicht geladen werden.</p>
      )}

      {loading ? (
        <div className="grid grid-cols-2 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-white/10 dark:bg-white/[0.03]">
              <Skeleton className="mb-2 h-3 w-16" />
              <Skeleton className="h-7 w-12" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <StatCard label="Bearbeitet" value={stats.totalAttempted} sub="Aufgaben gesamt" />
          <StatCard label="Ø Score" value={stats.totalAttempted > 0 ? `${stats.avgPct}%` : '–'} sub="über alle Fächer" />
          <StatCard label="Punkte" value={stats.totalAttempted > 0 ? `${stats.totalScore}/${stats.totalMaxScore}` : '–'} sub="erreicht / möglich" />
          <StatCard
            label="Volle Punktzahl"
            value={stats.fullMarks}
            sub={stats.zeroPts > 0 ? `${stats.zeroPts} × Null` : stats.totalAttempted > 0 ? 'Kein Totalausfall' : '–'}
          />
        </div>
      )}

      {!loading && stats.totalAttempted === 0 && (
        <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50 px-5 py-8 text-center dark:border-white/5 dark:bg-white/[0.02]">
          <p className="text-sm text-gray-400 dark:text-slate-500">Noch keine Aufgaben bearbeitet.</p>
          <Link to="/math" className="mt-3 inline-block text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
            Jetzt üben →
          </Link>
        </div>
      )}
    </div>
  )
}

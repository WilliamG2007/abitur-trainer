import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useStats } from '../hooks/useStats'
import { TOPICS } from '../data/topics'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts'

// ---------------------------------------------------------------------------
// Skeleton helpers
// ---------------------------------------------------------------------------
function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-white/5 ${className}`} />
}

function StatCardSkeleton() {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <Skeleton className="mb-2 h-3 w-20" />
      <Skeleton className="h-7 w-12" />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Stat card
// ---------------------------------------------------------------------------
function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <p className="mb-1 text-xs font-medium text-slate-500">{label}</p>
      <p className="text-2xl font-bold text-white leading-none">{value}</p>
      {sub && <p className="mt-1 text-xs text-slate-600">{sub}</p>}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Score bar chart
// ---------------------------------------------------------------------------
function ScoreChart({ buckets }: { buckets: { label: string; count: number }[] }) {
  return (
    <div className="rounded-xl border border-white/10 bg-surface p-5">
      <p className="mb-4 text-xs font-medium uppercase tracking-wide text-slate-500">
        Score-Verteilung
      </p>
      <ResponsiveContainer width="100%" height={140}>
        <BarChart data={buckets} barCategoryGap="28%">
          <XAxis
            dataKey="label"
            tick={{ fill: '#64748b', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fill: '#64748b', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            width={20}
          />
          <Tooltip
            cursor={{ fill: 'rgba(255,255,255,0.03)' }}
            contentStyle={{
              background: '#1a1d27',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 8,
              fontSize: 12,
            }}
            labelStyle={{ color: '#94a3b8' }}
            itemStyle={{ color: '#e2e8f0' }}
          />
          <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Topic progress bars
// ---------------------------------------------------------------------------
function TopicProgressBar({
  label,
  attempted,
  total,
  avgPct,
  accentClass,
}: {
  label: string
  attempted: number
  total: number
  avgPct: number
  accentClass: string
}) {
  const fillPct = total > 0 ? (attempted / total) * 100 : 0
  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-2">
        <span className="text-xs text-slate-300">{label}</span>
        <span className="text-xs text-slate-500">
          {attempted}/{total}
          {attempted > 0 && (
            <span className="ml-2 text-slate-600">Ø {avgPct}%</span>
          )}
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
        <div
          className={`h-full rounded-full transition-all ${accentClass}`}
          style={{ width: `${fillPct}%` }}
        />
      </div>
    </div>
  )
}

const TOPIC_ACCENT_CLASS: Record<string, string> = {
  analysis: 'bg-indigo-500',
  stochastik: 'bg-violet-500',
  geometrie: 'bg-sky-500',
}

// ---------------------------------------------------------------------------
// Statistics section
// ---------------------------------------------------------------------------
function StatsSection() {
  const { stats, loading, error } = useStats()

  if (error) {
    return (
      <p className="text-xs text-red-400">Statistik konnte nicht geladen werden: {error}</p>
    )
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-3">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
        <Skeleton className="h-[192px] w-full" />
        <div className="rounded-xl border border-white/10 bg-surface p-5">
          <Skeleton className="mb-4 h-3 w-32" />
          <div className="flex flex-col gap-4">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (!stats || stats.totalAttempted === 0) {
    return (
      <div className="rounded-xl border border-white/10 bg-surface py-10 text-center">
        <p className="text-2xl">📊</p>
        <p className="mt-2 text-sm font-medium text-white">Noch keine Aufgaben bearbeitet</p>
        <p className="mt-1 text-xs text-slate-500">
          Löse deine erste Aufgabe, um deine Statistiken hier zu sehen.
        </p>
        <Link
          to="/math"
          className="mt-4 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
        >
          Zu Mathematik →
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Metric cards */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          label="Bearbeitet"
          value={stats.totalAttempted}
          sub="Aufgaben"
        />
        <StatCard
          label="Ø Score"
          value={`${stats.avgPct}%`}
          sub="über alle Aufgaben"
        />
        <StatCard
          label="Punkte gesamt"
          value={`${stats.totalScore} / ${stats.totalMaxScore}`}
          sub="erreicht / möglich"
        />
        <StatCard
          label="Volle Punktzahl"
          value={stats.fullMarks}
          sub={stats.zeroPts > 0 ? `${stats.zeroPts} × 0 Punkte` : 'Kein Totalausfall'}
        />
      </div>

      {/* Bar chart */}
      <ScoreChart buckets={stats.scoreBuckets} />

      {/* Topic progress */}
      <div className="rounded-xl border border-white/10 bg-surface p-5">
        <p className="mb-4 text-xs font-medium uppercase tracking-wide text-slate-500">
          Fortschritt nach Thema
        </p>
        <div className="flex flex-col gap-4">
          {TOPICS.map((t) => {
            const ts = stats.topicStats.find((s) => s.topicId === t.id)
            return (
              <TopicProgressBar
                key={t.id}
                label={t.label}
                attempted={ts?.attempted ?? 0}
                total={ts?.total ?? 0}
                avgPct={ts?.avgPct ?? 0}
                accentClass={TOPIC_ACCENT_CLASS[t.id] ?? 'bg-indigo-500'}
              />
            )
          })}
        </div>

        {/* Best / weakest callouts */}
        {(stats.bestTopic || stats.weakestTopic) && (
          <div className="mt-4 flex flex-wrap gap-2 border-t border-white/5 pt-4">
            {stats.bestTopic && stats.bestTopic !== stats.weakestTopic && (
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">
                Stärkstes: {stats.bestTopic.label} ({stats.bestTopic.avgPct}%)
              </span>
            )}
            {stats.weakestTopic && (
              <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs text-amber-400">
                Schwächstes: {stats.weakestTopic.label} ({stats.weakestTopic.avgPct}%)
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function Profile() {
  const { user } = useAuth()
  const meta = user?.user_metadata ?? {}
  const displayLabel = meta.display_name || meta.username || user?.email || '?'

  return (
    <div className="mx-auto max-w-lg px-6 py-12">
      <Link to="/" className="mb-8 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-white">
        ← Zurück
      </Link>

      {/* Header */}
      <div className="mb-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-lg font-bold text-white">
            {displayLabel[0]?.toUpperCase() ?? '?'}
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">{displayLabel}</h1>
            <p className="text-sm text-slate-500">{user?.email}</p>
          </div>
        </div>
        <Link
          to="/settings"
          className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-400 transition-colors hover:border-white/20 hover:text-white"
        >
          Einstellungen
        </Link>
      </div>

      {/* Stats */}
      <div className="mb-2">
        <h2 className="mb-4 text-xs font-medium uppercase tracking-wide text-slate-500">
          Statistik
        </h2>
        <StatsSection />
      </div>
    </div>
  )
}

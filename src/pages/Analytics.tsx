import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAnalytics, SUBJECTS } from '../hooks/useAnalytics'
import type { FilteredStats } from '../hooks/useAnalytics'
import { useTheme } from '../hooks/useTheme'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts'

const ACCENT: Record<string, { bar: string; text: string; bg: string }> = {
  math:        { bar: 'bg-indigo-500',  text: 'text-indigo-600 dark:text-indigo-300',  bg: 'bg-indigo-500/10' },
  deutsch:     { bar: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-300', bg: 'bg-emerald-500/10' },
  englisch:    { bar: 'bg-sky-500',     text: 'text-sky-600 dark:text-sky-300',     bg: 'bg-sky-500/10' },
  physik:      { bar: 'bg-amber-500',   text: 'text-amber-600 dark:text-amber-300',   bg: 'bg-amber-500/10' },
  geschichte:  { bar: 'bg-rose-500',    text: 'text-rose-600 dark:text-rose-300',    bg: 'bg-rose-500/10' },
  analysis:    { bar: 'bg-indigo-500',  text: 'text-indigo-600 dark:text-indigo-300',  bg: 'bg-indigo-500/10' },
  stochastik:  { bar: 'bg-violet-500',  text: 'text-violet-600 dark:text-violet-300',  bg: 'bg-violet-500/10' },
  geometrie:   { bar: 'bg-sky-500',     text: 'text-sky-600 dark:text-sky-300',     bg: 'bg-sky-500/10' },
}
const DEFAULT_ACCENT = { bar: 'bg-slate-500', text: 'text-gray-600 dark:text-slate-300', bg: 'bg-slate-500/10' }
function accent(id: string) { return ACCENT[id] ?? DEFAULT_ACCENT }

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-gray-200 dark:bg-white/5 ${className}`} />
}

function SkeletonStats() {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-white/10 dark:bg-white/[0.03]">
            <Skeleton className="mb-2 h-3 w-16" />
            <Skeleton className="h-7 w-12" />
          </div>
        ))}
      </div>
      <Skeleton className="h-44 w-full rounded-xl" />
      <Skeleton className="h-40 w-full rounded-xl" />
    </div>
  )
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

function ScoreChart({ buckets }: { buckets: { label: string; count: number }[] }) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const tooltipStyle = isDark
    ? { background: '#1a1d27', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 12 }
    : { background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 12 }
  const labelColor = isDark ? '#94a3b8' : '#6b7280'
  const itemColor = isDark ? '#e2e8f0' : '#111827'
  const cursorFill = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'
  const tickColor = isDark ? '#64748b' : '#9ca3af'

  return (
    <div className="rounded-xl border border-gray-200 bg-surface p-5 dark:border-white/10">
      <p className="mb-4 text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-slate-500">Score-Verteilung</p>
      <ResponsiveContainer width="100%" height={140}>
        <BarChart data={buckets} barCategoryGap="28%">
          <XAxis dataKey="label" tick={{ fill: tickColor, fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis allowDecimals={false} tick={{ fill: tickColor, fontSize: 10 }} axisLine={false} tickLine={false} width={20} />
          <Tooltip
            cursor={{ fill: cursorFill }}
            contentStyle={tooltipStyle}
            labelStyle={{ color: labelColor }}
            itemStyle={{ color: itemColor }}
          />
          <Bar dataKey="count" name="Aufgaben" fill="#6366f1" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

function BreakdownBars({ stats, selectedSubject }: { stats: FilteredStats; selectedSubject: string | null }) {
  const heading = selectedSubject ? 'Themen' : 'Fächer'

  return (
    <div className="rounded-xl border border-gray-200 bg-surface p-5 dark:border-white/10">
      <p className="mb-4 text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-slate-500">
        {heading}-Übersicht
      </p>

      <div className="flex flex-col gap-4">
        {stats.breakdownStats.map((b) => {
          const a = accent(b.id)
          const fillPct = b.total > 0 ? (b.attempted / b.total) * 100 : 0
          return (
            <div key={b.id}>
              <div className="mb-1 flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-gray-700 dark:text-slate-300">{b.label}</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400 dark:text-slate-600">
                    {b.attempted}/{b.total}
                  </span>
                  {b.attempted > 0 && (
                    <span className={`text-xs font-medium ${a.text}`}>
                      Ø {b.avgPct}%
                    </span>
                  )}
                </div>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-white/5">
                <div
                  className={`h-full rounded-full transition-all ${a.bar}`}
                  style={{ width: `${fillPct}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {(stats.bestBreakdown || stats.weakestBreakdown) && (
        <div className="mt-4 flex flex-wrap gap-2 border-t border-gray-100 pt-4 dark:border-white/5">
          {stats.bestBreakdown && stats.bestBreakdown !== stats.weakestBreakdown && (
            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-600 dark:text-emerald-400">
              Stärkstes: {stats.bestBreakdown.label} ({stats.bestBreakdown.avgPct}%)
            </span>
          )}
          {stats.weakestBreakdown && (
            <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs text-amber-600 dark:text-amber-400">
              Schwächstes: {stats.weakestBreakdown.label} ({stats.weakestBreakdown.avgPct}%)
            </span>
          )}
        </div>
      )}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="rounded-xl border border-gray-200 bg-surface py-14 text-center dark:border-white/10">
      <p className="text-3xl">📊</p>
      <p className="mt-3 text-sm font-medium text-gray-900 dark:text-white">Noch keine Aufgaben bearbeitet</p>
      <p className="mt-1 text-xs text-gray-400 dark:text-slate-500">
        Löse deine erste Aufgabe, um Statistiken zu sehen.
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

const TABS = [{ id: null, label: 'Alle' }, ...SUBJECTS]

function TabBar({ selected, onChange }: { selected: string | null; onChange: (id: string | null) => void }) {
  return (
    <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
      {TABS.map((tab) => {
        const isActive = tab.id === selected
        const a = tab.id ? accent(tab.id) : null
        return (
          <button
            key={String(tab.id)}
            onClick={() => onChange(tab.id)}
            className={`shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              isActive
                ? tab.id
                  ? `${a!.bg} ${a!.text} border border-current/20`
                  : 'bg-gray-200 text-gray-900 dark:bg-white/10 dark:text-white'
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-slate-500 dark:hover:bg-white/5 dark:hover:text-slate-300'
            }`}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}

export default function Analytics() {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
  const { getStats, loading, error } = useAnalytics()

  const stats = useMemo(() => getStats(selectedSubject), [getStats, selectedSubject])

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Link to="/profile" className="mb-8 inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-900 dark:text-slate-500 dark:hover:text-white">
        ← Profil
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Statistiken</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">Dein Lernfortschritt auf einen Blick.</p>
      </div>

      <div className="mb-6">
        <TabBar selected={selectedSubject} onChange={setSelectedSubject} />
      </div>

      {error && <p className="text-sm text-red-500 dark:text-red-400">Fehler: {error}</p>}
      {loading && <SkeletonStats />}
      {!loading && !error && stats.totalAttempted === 0 && <EmptyState />}

      {!loading && !error && stats.totalAttempted > 0 && (
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard label="Bearbeitet" value={stats.totalAttempted} sub="Aufgaben" />
            <StatCard label="Ø Score" value={`${stats.avgPct}%`} sub="Durchschnitt" />
            <StatCard label="Punkte" value={`${stats.totalScore}/${stats.totalMaxScore}`} sub="erreicht / möglich" />
            <StatCard label="Volle Punkte" value={stats.fullMarks} sub={stats.zeroPts > 0 ? `${stats.zeroPts} × Null` : '–'} />
          </div>

          <ScoreChart buckets={stats.scoreBuckets} />
          <BreakdownBars stats={stats} selectedSubject={selectedSubject} />
        </div>
      )}
    </div>
  )
}

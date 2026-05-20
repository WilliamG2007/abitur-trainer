import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAnalytics, SUBJECTS } from '../hooks/useAnalytics'
import type { FilteredStats } from '../hooks/useAnalytics'
import { useAttemptHistory } from '../hooks/useAttemptHistory'
import type { AttemptEntry } from '../hooks/useAttemptHistory'
import { useTheme } from '../hooks/useTheme'
import { TOPICS } from '../data/topics'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts'

// Build label lookups from TOPICS
const SUBTOPIC_LABELS: Record<string, string> = {}
const TOPIC_LABELS: Record<string, string> = {}
for (const t of TOPICS) {
  TOPIC_LABELS[t.id] = t.label
  for (const s of t.subtopics) SUBTOPIC_LABELS[s.id] = s.label
}

// Chevron icon
function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="16" height="16" viewBox="0 0 16 16" fill="none"
      className={`shrink-0 text-gray-400 transition-transform duration-200 dark:text-slate-600 ${open ? 'rotate-180' : ''}`}
    >
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

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

// ── Attempt History ──────────────────────────────────────────────────────────

function scoreColor(score: number, max: number) {
  const pct = max > 0 ? score / max : 0
  if (pct >= 1) return 'text-emerald-500 dark:text-emerald-400'
  if (pct > 0) return 'text-amber-500 dark:text-amber-400'
  return 'text-red-500 dark:text-red-400'
}

function AttemptCard({ entry }: { entry: AttemptEntry }) {
  const [expanded, setExpanded] = useState(false)
  const [showMusterloesung, setShowMusterloesung] = useState(false)

  const date = new Date(entry.attemptedAt).toLocaleDateString('de-DE', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
  const sc = scoreColor(entry.score, entry.maxScore)
  const topicLabel = TOPIC_LABELS[entry.topic] ?? entry.topic
  const subtopicLabel = SUBTOPIC_LABELS[entry.subtopic] ?? entry.subtopic
  const displayTitle = entry.questionTitle && entry.questionTitle !== '–'
    ? entry.questionTitle
    : entry.questionText
      ? entry.questionText.replace(/\$[^$]*\$/g, '…').slice(0, 80)
      : subtopicLabel

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-surface dark:border-white/10">
      {/* Collapsed header — always visible */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-start gap-4 p-4 text-left transition-colors hover:bg-gray-50 dark:hover:bg-white/[0.02]"
      >
        {/* Solution thumbnail */}
        <div className="shrink-0">
          {entry.solutionImage ? (
            <img
              src={entry.solutionImage}
              alt="Lösung"
              className="h-14 w-20 rounded border border-gray-200 bg-[#0a0c13] object-contain dark:border-white/10"
            />
          ) : entry.solutionText ? (
            <div className="flex h-14 w-20 items-start justify-start overflow-hidden rounded border border-gray-200 bg-gray-50 p-1 dark:border-white/10 dark:bg-white/[0.03]">
              <span className="line-clamp-4 text-[8px] leading-snug text-gray-500 dark:text-slate-500">
                {entry.solutionText.slice(0, 120)}
              </span>
            </div>
          ) : (
            <div className="flex h-14 w-20 items-center justify-center rounded border border-gray-200 bg-gray-50 text-xs text-gray-400 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-600">
              –
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          {/* Labels row */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-500 dark:bg-white/5 dark:text-slate-500">
              {topicLabel}
            </span>
            <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-500 dark:bg-white/5 dark:text-slate-500">
              {subtopicLabel}
            </span>
            <span className="text-[10px] text-gray-300 dark:text-slate-700">·</span>
            <span className="text-[10px] text-gray-400 dark:text-slate-600">Versuch {entry.attemptNumber}</span>
            <span className="text-[10px] text-gray-300 dark:text-slate-700">·</span>
            <span className="text-[10px] text-gray-400 dark:text-slate-600">{date}</span>
          </div>
          {/* Title */}
          <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{displayTitle}</p>
          {/* Score */}
          <p className={`text-sm font-semibold ${sc}`}>
            {entry.score} / {entry.maxScore} BE
          </p>
        </div>

        <Chevron open={expanded} />
      </button>

      {/* Expanded body */}
      {expanded && (
        <div className="flex flex-col gap-5 border-t border-gray-100 p-4 dark:border-white/5">
          {/* Full question text */}
          {entry.questionText && (
            <div>
              <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-slate-500">Aufgabe</p>
              <p className="text-sm leading-relaxed text-gray-700 dark:text-slate-300">{entry.questionText}</p>
            </div>
          )}

          {/* Solution */}
          {entry.solutionImage && (
            <div>
              <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-slate-500">Deine Lösung</p>
              <img
                src={entry.solutionImage}
                alt="Lösung"
                className="max-h-96 w-full rounded-lg border border-gray-200 bg-[#0a0c13] object-contain dark:border-white/10"
              />
            </div>
          )}
          {entry.solutionText && (
            <div>
              <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-slate-500">Deine Lösung (Text)</p>
              <pre className="whitespace-pre-wrap rounded-lg border border-gray-100 bg-gray-50 p-4 text-sm text-gray-700 dark:border-white/5 dark:bg-white/[0.02] dark:text-slate-300">
                {entry.solutionText}
              </pre>
            </div>
          )}

          {/* AI feedback */}
          {entry.feedback && (
            <div>
              <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-slate-500">KI-Feedback</p>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700 dark:text-slate-300">
                {entry.feedback}
              </p>
            </div>
          )}

          {/* Musterlösung toggle */}
          {entry.erwartungshorizont && (
            <div>
              <button
                onClick={() => setShowMusterloesung((v) => !v)}
                className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 transition-colors hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                <Chevron open={showMusterloesung} />
                Musterlösung ansehen
              </button>
              {showMusterloesung && (
                <pre className="mt-2 whitespace-pre-wrap rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-4 text-sm text-gray-700 dark:text-slate-300">
                  {entry.erwartungshorizont}
                </pre>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function AttemptHistory() {
  const { attempts, loading, error } = useAttemptHistory()

  if (loading) return (
    <div className="flex flex-col gap-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-24 animate-pulse rounded-xl bg-gray-100 dark:bg-white/5" />
      ))}
    </div>
  )
  if (error) return <p className="text-sm text-red-500">{error}</p>
  if (attempts.length === 0) return (
    <p className="text-sm text-gray-400 dark:text-slate-500">Noch keine Versuche gespeichert.</p>
  )

  return (
    <div className="flex flex-col gap-3">
      {attempts.map((entry) => (
        <AttemptCard key={entry.id} entry={entry} />
      ))}
    </div>
  )
}

// ── Tabs ─────────────────────────────────────────────────────────────────────

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

type PageTab = 'stats' | 'verlauf'

export default function Analytics() {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
  const [pageTab, setPageTab] = useState<PageTab>('stats')
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

      {/* Page-level tabs: Statistiken vs Verlauf */}
      <div className="mb-6 flex gap-1 rounded-lg border border-gray-200 p-0.5 dark:border-white/10 w-fit">
        {(['stats', 'verlauf'] as PageTab[]).map((t) => (
          <button
            key={t}
            onClick={() => setPageTab(t)}
            className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
              pageTab === t
                ? 'bg-indigo-600 text-white'
                : 'text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            {t === 'stats' ? 'Statistiken' : 'Verlauf'}
          </button>
        ))}
      </div>

      {pageTab === 'verlauf' && <AttemptHistory />}

      {pageTab === 'stats' && (
        <>
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
        </>
      )}
    </div>
  )
}

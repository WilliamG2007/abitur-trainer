import type { GradingResult } from '../lib/gradeWithClaude'

interface ResultsPanelProps {
  loading: boolean
  error: string | null
  result: GradingResult | null
  onScoreConfirmed: (score: number, feedback: string) => void
}

export default function ResultsPanel({ loading, error, result, onScoreConfirmed }: ResultsPanelProps) {
  if (loading) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-5">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
        <p className="text-sm text-slate-400">KI-Bewertung wird geladen…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-5">
        <p className="text-sm font-medium text-red-400">Fehler bei der Bewertung</p>
        <p className="mt-1 text-xs text-slate-400">{error}</p>
      </div>
    )
  }

  if (!result) return null

  const { score, maxPoints, feedback } = result
  const pct = Math.round((score / maxPoints) * 100)
  const scoreColor =
    score >= maxPoints ? 'text-emerald-400' : score > 0 ? 'text-amber-400' : 'text-red-400'
  const icon = score >= maxPoints ? '✅' : score > 0 ? '🟡' : '❌'

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-white/10 bg-surface p-5">
      {/* Score header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">KI-Bewertung</p>
          <p className={`mt-1 text-2xl font-bold ${scoreColor}`}>
            {score} / {maxPoints}{' '}
            <span className="text-base font-normal text-slate-500">Punkte ({pct}%)</span>
          </p>
        </div>
        <span className="text-2xl">{icon}</span>
      </div>

      {/* Feedback text */}
      <div className="rounded-lg border border-white/5 bg-white/[0.02] p-4">
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-300">{feedback}</p>
      </div>

      <button
        onClick={() => onScoreConfirmed(score, feedback)}
        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
      >
        Ergebnis speichern &amp; weiter
      </button>
    </div>
  )
}

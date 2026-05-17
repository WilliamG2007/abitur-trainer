import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { TOPICS } from '../data/topics'

// ---------------------------------------------------------------------------
// Subject / topic metadata
// ---------------------------------------------------------------------------

export const SUBJECTS = [
  { id: 'math',       label: 'Mathematik' },
  { id: 'deutsch',    label: 'Deutsch' },
  { id: 'englisch',   label: 'Englisch' },
  { id: 'physik',     label: 'Physik' },
  { id: 'geschichte', label: 'Geschichte' },
]

const SUBJECT_LABEL: Record<string, string> = Object.fromEntries(
  SUBJECTS.map((s) => [s.id, s.label]),
)

const MATH_TOPIC_LABEL: Record<string, string> = Object.fromEntries(
  TOPICS.map((t) => [t.id, t.label]),
)

function topicLabel(subject: string, topic: string): string {
  if (subject === 'math') return MATH_TOPIC_LABEL[topic] ?? topic
  return topic.charAt(0).toUpperCase() + topic.slice(1)
}

function groupKey(subject: string, topic: string) {
  return `${subject}::${topic}`
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ProcessedAttempt {
  questionId: string
  subject: string
  topic: string
  score: number
  maxScore: number
}

type AttemptRow = {
  score: number
  max_score: number
  question_id: string
  attempted_at: string
  questions: { topic: string; subject: string } | null
}

export interface BreakdownStat {
  id: string
  label: string
  attempted: number
  total: number
  avgPct: number
  totalScore: number
  totalMaxScore: number
}

export interface FilteredStats {
  totalAttempted: number
  avgPct: number
  totalScore: number
  totalMaxScore: number
  fullMarks: number
  zeroPts: number
  scoreBuckets: { label: string; count: number }[]
  breakdownStats: BreakdownStat[]
  bestBreakdown: BreakdownStat | null
  weakestBreakdown: BreakdownStat | null
}

// ---------------------------------------------------------------------------
// Score bucket helpers
// ---------------------------------------------------------------------------

const BUCKET_LABELS = ['0–20 %', '20–40 %', '40–60 %', '60–80 %', '80–100 %']

function pctBucket(pct: number): number {
  if (pct <= 20) return 0
  if (pct <= 40) return 1
  if (pct <= 60) return 2
  if (pct <= 80) return 3
  return 4
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useAnalytics() {
  const { user } = useAuth()
  const [latestAttempts, setLatestAttempts] = useState<ProcessedAttempt[]>([])
  const [totals, setTotals] = useState<Map<string, number>>(new Map())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) { setLoading(false); return }
    setLoading(true)
    setError(null)

    Promise.all([
      supabase
        .from('user_attempts')
        .select('score, max_score, question_id, attempted_at, questions(topic, subject)')
        .eq('user_id', user.id)
        .order('attempted_at', { ascending: false }),
      supabase
        .from('questions')
        .select('id, topic, subject')
        .eq('locked', false),
    ]).then(([attemptsRes, questionsRes]) => {
      if (attemptsRes.error) { setError(attemptsRes.error.message); setLoading(false); return }
      if (questionsRes.error) { setError(questionsRes.error.message); setLoading(false); return }

      // Keep only the latest attempt per question
      const rows = (attemptsRes.data ?? []) as unknown as AttemptRow[]
      const seen = new Set<string>()
      const latest: ProcessedAttempt[] = []
      for (const row of rows) {
        if (seen.has(row.question_id) || !row.questions) continue
        seen.add(row.question_id)
        latest.push({
          questionId: row.question_id,
          subject: row.questions.subject,
          topic: row.questions.topic,
          score: row.score,
          maxScore: row.max_score,
        })
      }
      setLatestAttempts(latest)

      // Count unlocked questions per subject::topic
      const totalMap = new Map<string, number>()
      for (const q of questionsRes.data ?? []) {
        const k = groupKey(q.subject, q.topic)
        totalMap.set(k, (totalMap.get(k) ?? 0) + 1)
      }
      setTotals(totalMap)
      setLoading(false)
    })
  }, [user])

  // ---------------------------------------------------------------------------
  // getStats — pure computation, re-runs on subject change via useMemo in consumer
  // ---------------------------------------------------------------------------
  const getStats = useCallback(
    (subject: string | null): FilteredStats => {
      const attempts = subject
        ? latestAttempts.filter((a) => a.subject === subject)
        : latestAttempts

      const totalAttempted = attempts.length
      const totalScore = attempts.reduce((s, a) => s + a.score, 0)
      const totalMaxScore = attempts.reduce((s, a) => s + a.maxScore, 0)
      const avgPct = totalMaxScore > 0 ? Math.round((totalScore / totalMaxScore) * 100) : 0
      const fullMarks = attempts.filter((a) => a.score === a.maxScore).length
      const zeroPts = attempts.filter((a) => a.score === 0).length

      const buckets = [0, 0, 0, 0, 0]
      for (const a of attempts) {
        const pct = a.maxScore > 0 ? (a.score / a.maxScore) * 100 : 0
        buckets[pctBucket(pct)]++
      }
      const scoreBuckets = BUCKET_LABELS.map((label, i) => ({ label, count: buckets[i] }))

      // Breakdown: by subject when "Alle", by topic when a subject is selected
      let breakdownStats: BreakdownStat[]

      if (!subject) {
        // Aggregate per subject
        const map = new Map<string, { score: number; maxScore: number; count: number }>()
        for (const a of attempts) {
          const c = map.get(a.subject) ?? { score: 0, maxScore: 0, count: 0 }
          map.set(a.subject, { score: c.score + a.score, maxScore: c.maxScore + a.maxScore, count: c.count + 1 })
        }
        const subjectTotals = new Map<string, number>()
        for (const [k, n] of totals) {
          const [subj] = k.split('::')
          subjectTotals.set(subj, (subjectTotals.get(subj) ?? 0) + n)
        }
        breakdownStats = SUBJECTS.map((s) => {
          const d = map.get(s.id)
          const sc = d?.score ?? 0
          const mx = d?.maxScore ?? 0
          return {
            id: s.id,
            label: SUBJECT_LABEL[s.id] ?? s.id,
            attempted: d?.count ?? 0,
            total: subjectTotals.get(s.id) ?? 0,
            avgPct: mx > 0 ? Math.round((sc / mx) * 100) : 0,
            totalScore: sc,
            totalMaxScore: mx,
          }
        })
      } else {
        // Aggregate per topic within the subject
        const map = new Map<string, { score: number; maxScore: number; count: number }>()
        for (const a of attempts) {
          const c = map.get(a.topic) ?? { score: 0, maxScore: 0, count: 0 }
          map.set(a.topic, { score: c.score + a.score, maxScore: c.maxScore + a.maxScore, count: c.count + 1 })
        }
        const topicsInSubject = new Set<string>()
        for (const k of totals.keys()) {
          const [subj, topic] = k.split('::')
          if (subj === subject) topicsInSubject.add(topic)
        }
        breakdownStats = Array.from(topicsInSubject).map((topic) => {
          const d = map.get(topic)
          const sc = d?.score ?? 0
          const mx = d?.maxScore ?? 0
          return {
            id: topic,
            label: topicLabel(subject, topic),
            attempted: d?.count ?? 0,
            total: totals.get(groupKey(subject, topic)) ?? 0,
            avgPct: mx > 0 ? Math.round((sc / mx) * 100) : 0,
            totalScore: sc,
            totalMaxScore: mx,
          }
        })
        // Sort to match canonical order (TOPICS for math, alpha otherwise)
        if (subject === 'math') {
          const order: string[] = TOPICS.map((t) => t.id)
          breakdownStats.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id))
        } else {
          breakdownStats.sort((a, b) => a.label.localeCompare(b.label))
        }
      }

      const withAttempts = breakdownStats.filter((b) => b.attempted > 0)
      const bestBreakdown = withAttempts.length
        ? withAttempts.reduce((a, b) => (a.avgPct >= b.avgPct ? a : b))
        : null
      const weakestBreakdown = withAttempts.length > 1
        ? withAttempts.reduce((a, b) => (a.avgPct <= b.avgPct ? a : b))
        : null

      return {
        totalAttempted, avgPct, totalScore, totalMaxScore,
        fullMarks, zeroPts, scoreBuckets, breakdownStats,
        bestBreakdown, weakestBreakdown,
      }
    },
    [latestAttempts, totals],
  )

  return { getStats, loading, error }
}

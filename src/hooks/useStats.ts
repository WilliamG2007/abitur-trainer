import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { TOPICS } from '../data/topics'

export interface TopicStat {
  topicId: string
  label: string
  attempted: number
  total: number
  avgPct: number   // 0–100
  totalScore: number
  totalMaxScore: number
}

export interface Stats {
  totalAttempted: number    // unique questions with at least one attempt
  avgPct: number            // mean score % across those questions (latest attempt)
  totalScore: number
  totalMaxScore: number
  fullMarks: number         // questions where latest score === max_score
  zeroPts: number           // questions where latest score === 0
  topicStats: TopicStat[]
  scoreBuckets: { label: string; count: number }[]
  bestTopic: TopicStat | null
  weakestTopic: TopicStat | null
}

type AttemptRow = {
  score: number
  max_score: number
  question_id: string
  attempted_at: string
  questions: { topic: string; subject: string } | null
}

type QuestionRow = {
  id: string
  topic: string
  subject: string
}

const BUCKETS = ['0–20 %', '20–40 %', '40–60 %', '60–80 %', '80–100 %']

function pctBucket(pct: number): number {
  if (pct <= 20) return 0
  if (pct <= 40) return 1
  if (pct <= 60) return 2
  if (pct <= 80) return 3
  return 4
}

export function useStats() {
  const { user } = useAuth()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

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

      const allAttempts = (attemptsRes.data ?? []) as unknown as AttemptRow[]
      const allQuestions = (questionsRes.data ?? []) as QuestionRow[]

      // Latest attempt per question
      const latestByQ = new Map<string, AttemptRow>()
      for (const row of allAttempts) {
        if (!latestByQ.has(row.question_id)) {
          latestByQ.set(row.question_id, row)
        }
      }
      const latest = Array.from(latestByQ.values())

      // Total counts per topic (unlocked questions only)
      const totalPerTopic = new Map<string, number>()
      for (const q of allQuestions) {
        totalPerTopic.set(q.topic, (totalPerTopic.get(q.topic) ?? 0) + 1)
      }

      // Per-topic stats
      const topicMap = new Map<string, { scores: number[]; maxScores: number[] }>()
      for (const row of latest) {
        const topic = row.questions?.topic
        if (!topic) continue
        if (!topicMap.has(topic)) topicMap.set(topic, { scores: [], maxScores: [] })
        topicMap.get(topic)!.scores.push(row.score)
        topicMap.get(topic)!.maxScores.push(row.max_score)
      }

      const topicStats: TopicStat[] = TOPICS.map((t) => {
        const data = topicMap.get(t.id)
        const attempted = data?.scores.length ?? 0
        const totalScore = data?.scores.reduce((a, b) => a + b, 0) ?? 0
        const totalMaxScore = data?.maxScores.reduce((a, b) => a + b, 0) ?? 0
        const avgPct = totalMaxScore > 0 ? Math.round((totalScore / totalMaxScore) * 100) : 0
        return {
          topicId: t.id,
          label: t.label,
          attempted,
          total: totalPerTopic.get(t.id) ?? 0,
          avgPct,
          totalScore,
          totalMaxScore,
        }
      })

      // Overall metrics
      const totalAttempted = latest.length
      const totalScore = latest.reduce((a, r) => a + r.score, 0)
      const totalMaxScore = latest.reduce((a, r) => a + r.max_score, 0)
      const avgPct = totalMaxScore > 0 ? Math.round((totalScore / totalMaxScore) * 100) : 0
      const fullMarks = latest.filter((r) => r.score === r.max_score).length
      const zeroPts = latest.filter((r) => r.score === 0).length

      // Score distribution buckets
      const bucketCounts = [0, 0, 0, 0, 0]
      for (const row of latest) {
        const pct = row.max_score > 0 ? (row.score / row.max_score) * 100 : 0
        bucketCounts[pctBucket(pct)]++
      }
      const scoreBuckets = BUCKETS.map((label, i) => ({ label, count: bucketCounts[i] }))

      // Best / weakest topic (only those with at least 1 attempt)
      const attempted = topicStats.filter((t) => t.attempted > 0)
      const bestTopic = attempted.length
        ? attempted.reduce((a, b) => (a.avgPct >= b.avgPct ? a : b))
        : null
      const weakestTopic = attempted.length
        ? attempted.reduce((a, b) => (a.avgPct <= b.avgPct ? a : b))
        : null

      setStats({
        totalAttempted,
        avgPct,
        totalScore,
        totalMaxScore,
        fullMarks,
        zeroPts,
        topicStats,
        scoreBuckets,
        bestTopic,
        weakestTopic,
      })
      setLoading(false)
    })
  }, [user])

  return { stats, loading, error }
}

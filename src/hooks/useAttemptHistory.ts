import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export interface AttemptEntry {
  id: string
  questionId: string
  questionTitle: string
  questionText: string
  erwartungshorizont: string
  subtopic: string
  topic: string
  subject: string
  score: number
  maxScore: number
  feedback: string | null
  solutionImage: string | null
  solutionText: string | null
  attemptedAt: string
  attemptNumber: number
}

type RawRow = {
  id: string
  question_id: string
  score: number
  max_score: number
  ai_feedback: string | null
  solution_image: string | null
  solution_text: string | null
  attempted_at: string
  questions: {
    title: string
    text: string
    erwartungshorizont: string
    subtopic: string
    topic: string
    subject: string
  } | null
}

export function useAttemptHistory() {
  const { user } = useAuth()
  const [attempts, setAttempts] = useState<AttemptEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) { setLoading(false); return }
    setLoading(true)
    setError(null)

    supabase
      .from('user_attempts')
      .select('id, question_id, score, max_score, ai_feedback, solution_image, solution_text, attempted_at, questions(title, text, erwartungshorizont, subtopic, topic, subject)')
      .eq('user_id', user.id)
      .order('attempted_at', { ascending: true })
      .then(({ data, error: err }) => {
        if (err) { setError(err.message); setLoading(false); return }

        const rows = (data ?? []) as unknown as RawRow[]
        const countPerQuestion: Record<string, number> = {}
        const entries: AttemptEntry[] = rows.map((row) => {
          const n = (countPerQuestion[row.question_id] ?? 0) + 1
          countPerQuestion[row.question_id] = n
          return {
            id: row.id,
            questionId: row.question_id,
            questionTitle: row.questions?.title ?? '–',
            questionText: row.questions?.text ?? '',
            erwartungshorizont: row.questions?.erwartungshorizont ?? '',
            subtopic: row.questions?.subtopic ?? '',
            topic: row.questions?.topic ?? '',
            subject: row.questions?.subject ?? '',
            score: row.score,
            maxScore: row.max_score,
            feedback: row.ai_feedback,
            solutionImage: row.solution_image,
            solutionText: row.solution_text,
            attemptedAt: row.attempted_at,
            attemptNumber: n,
          }
        })

        setAttempts(entries.reverse())
        setLoading(false)
      })
  }, [user])

  return { attempts, loading, error }
}

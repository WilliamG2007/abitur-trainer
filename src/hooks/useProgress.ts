import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import type { QuestionState, AttemptRecord } from '../context/ProgressContext'

export interface UseProgressResult {
  attempts: Record<string, AttemptRecord>
  loading: boolean
  recordAttempt: (questionId: string, score: number, maxPoints: number, feedback?: string, solutionImage?: string, solutionText?: string) => void
  getQuestionState: (questionId: string, maxPoints: number) => QuestionState
  getSubtopicProgress: (subtopic: string, questionIds: string[]) => { attempted: number; total: number }
  resetProgress: () => void
}

export function useProgress(): UseProgressResult {
  const { user } = useAuth()
  const [attempts, setAttempts] = useState<Record<string, AttemptRecord>>({})
  const [loading, setLoading] = useState(true)

  // Load latest attempt per question for the current user
  useEffect(() => {
    if (!user) {
      setAttempts({})
      setLoading(false)
      return
    }

    setLoading(true)
    supabase
      .from('user_attempts')
      .select('question_id, score, max_score, attempted_at')
      .eq('user_id', user.id)
      .order('attempted_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) {
          // Keep only the latest attempt per question_id
          const map: Record<string, AttemptRecord> = {}
          for (const row of data) {
            if (!map[row.question_id]) {
              map[row.question_id] = {
                questionId: row.question_id,
                score: row.score,
                maxPoints: row.max_score,
                attemptedAt: row.attempted_at,
              }
            }
          }
          setAttempts(map)
        }
        setLoading(false)
      })
  }, [user])

  const recordAttempt = useCallback(
    (questionId: string, score: number, maxPoints: number, feedback?: string, solutionImage?: string, solutionText?: string) => {
      const now = new Date().toISOString()

      // Optimistic update
      setAttempts((prev) => ({
        ...prev,
        [questionId]: { questionId, score, maxPoints, attemptedAt: now },
      }))

      if (!user) return

      supabase
        .from('user_attempts')
        .insert({
          user_id: user.id,
          question_id: questionId,
          score,
          max_score: maxPoints,
          ai_feedback: feedback ?? null,
          solution_image: solutionImage ?? null,
          solution_text: solutionText ?? null,
          attempted_at: now,
        })
        .then(({ error }) => {
          if (error) console.error('useProgress: failed to save attempt', error.message)
        })
    },
    [user],
  )

  const getQuestionState = useCallback(
    (questionId: string, maxPoints: number): QuestionState => {
      const attempt = attempts[questionId]
      if (!attempt) return 'unattempted'
      if (attempt.score >= maxPoints) return 'full'
      if (attempt.score > 0) return 'partial'
      return 'zero'
    },
    [attempts],
  )

  const getSubtopicProgress = useCallback(
    (_subtopic: string, questionIds: string[]): { attempted: number; total: number } => {
      const attempted = questionIds.filter((id) => attempts[id] !== undefined).length
      return { attempted, total: questionIds.length }
    },
    [attempts],
  )

  const resetProgress = useCallback(() => {
    setAttempts({})
    if (!user) return
    supabase
      .from('user_attempts')
      .delete()
      .eq('user_id', user.id)
      .then(({ error }) => {
        if (error) console.error('useProgress: failed to reset progress', error.message)
      })
  }, [user])

  return { attempts, loading, recordAttempt, getQuestionState, getSubtopicProgress, resetProgress }
}

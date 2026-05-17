/**
 * ProgressContext
 *
 * Tracks which questions have been attempted and the score achieved.
 * Backed by Supabase (users_progress table). The public interface is
 * identical to the previous localStorage version so no consumers change.
 */
import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type QuestionState = 'unattempted' | 'full' | 'partial' | 'zero'

export interface AttemptRecord {
  questionId: string
  score: number
  maxPoints: number
  attemptedAt: string
}

export interface ProgressContextType {
  attempts: Record<string, AttemptRecord>
  /** True while the initial fetch from Supabase is in flight */
  loading: boolean
  recordAttempt: (questionId: string, score: number, maxPoints: number, feedback?: string) => void
  getQuestionState: (questionId: string, maxPoints: number) => QuestionState
  getSubtopicProgress: (subtopic: string, questionIds: string[]) => { attempted: number; total: number }
  resetProgress: () => void
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const ProgressContext = createContext<ProgressContextType | null>(null)

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function ProgressProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [attempts, setAttempts] = useState<Record<string, AttemptRecord>>({})
  const [loading, setLoading] = useState(true)

  // Fetch all attempts for the current user whenever auth changes
  useEffect(() => {
    if (!user) {
      setAttempts({})
      setLoading(false)
      return
    }

    setLoading(true)
    supabase
      .from('users_progress')
      .select('question_id, score, max_score, attempted_at')
      .eq('user_id', user.id)
      .then(({ data, error }) => {
        if (!error && data) {
          const map: Record<string, AttemptRecord> = {}
          for (const row of data) {
            map[row.question_id] = {
              questionId: row.question_id,
              score: row.score,
              maxPoints: row.max_score,
              attemptedAt: row.attempted_at,
            }
          }
          setAttempts(map)
        }
        setLoading(false)
      })
  }, [user])

  const recordAttempt = useCallback(
    (questionId: string, score: number, maxPoints: number, feedback?: string) => {
      const now = new Date().toISOString()

      // Optimistic update so dots change immediately
      setAttempts((prev) => ({
        ...prev,
        [questionId]: { questionId, score, maxPoints, attemptedAt: now },
      }))

      if (!user) return

      // Upsert to Supabase (fire-and-forget; optimistic update already applied)
      supabase
        .from('users_progress')
        .upsert(
          {
            user_id: user.id,
            question_id: questionId,
            score,
            max_score: maxPoints,
            ai_feedback: feedback ?? null,
            attempted_at: now,
          },
          { onConflict: 'user_id,question_id' },
        )
        .then(({ error }) => {
          if (error) console.error('ProgressContext: failed to save attempt', error.message)
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
      .from('users_progress')
      .delete()
      .eq('user_id', user.id)
      .then(({ error }) => {
        if (error) console.error('ProgressContext: failed to reset progress', error.message)
      })
  }, [user])

  return (
    <ProgressContext.Provider
      value={{ attempts, loading, recordAttempt, getQuestionState, getSubtopicProgress, resetProgress }}
    >
      {children}
    </ProgressContext.Provider>
  )
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useProgress(): ProgressContextType {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress must be used inside <ProgressProvider>')
  return ctx
}

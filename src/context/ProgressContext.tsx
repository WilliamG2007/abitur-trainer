/**
 * ProgressContext
 *
 * Tracks which questions have been attempted and the score achieved.
 * Stored in localStorage. Interface designed to be swapped for a
 * Supabase-backed implementation without changes to consumers.
 */
import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type QuestionState = 'unattempted' | 'full' | 'partial' | 'zero'

export interface AttemptRecord {
  questionId: string
  score: number
  maxPoints: number
  attemptedAt: string // ISO timestamp
}

export interface ProgressContextType {
  /** All recorded attempts, keyed by questionId */
  attempts: Record<string, AttemptRecord>

  /** Record (or overwrite) an attempt for a question */
  recordAttempt: (questionId: string, score: number, maxPoints: number) => void

  /** Derive the display state for a single question dot */
  getQuestionState: (questionId: string, maxPoints: number) => QuestionState

  /** How many questions in this subtopic have been attempted */
  getSubtopicProgress: (
    subtopic: string,
    questionIds: string[],
  ) => { attempted: number; total: number }

  /** Reset all progress (for testing) */
  resetProgress: () => void
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const ProgressContext = createContext<ProgressContextType | null>(null)

const STORAGE_KEY = 'abitur_progress_v1'

function loadFromStorage(): Record<string, AttemptRecord> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Record<string, AttemptRecord>) : {}
  } catch {
    return {}
  }
}

function saveToStorage(attempts: Record<string, AttemptRecord>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(attempts))
  } catch {
    // storage unavailable — silently ignore
  }
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [attempts, setAttempts] = useState<Record<string, AttemptRecord>>(loadFromStorage)

  const recordAttempt = useCallback(
    (questionId: string, score: number, maxPoints: number) => {
      setAttempts((prev) => {
        const next = {
          ...prev,
          [questionId]: {
            questionId,
            score,
            maxPoints,
            attemptedAt: new Date().toISOString(),
          },
        }
        saveToStorage(next)
        return next
      })
    },
    [],
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
    (
      _subtopic: string,
      questionIds: string[],
    ): { attempted: number; total: number } => {
      const attempted = questionIds.filter((id) => attempts[id] !== undefined).length
      return { attempted, total: questionIds.length }
    },
    [attempts],
  )

  const resetProgress = useCallback(() => {
    setAttempts({})
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  return (
    <ProgressContext.Provider
      value={{ attempts, recordAttempt, getQuestionState, getSubtopicProgress, resetProgress }}
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

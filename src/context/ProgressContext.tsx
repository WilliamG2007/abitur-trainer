import { createContext, useContext, ReactNode } from 'react'
import { useProgress as useProgressHook, type UseProgressResult } from '../hooks/useProgress'

// ---------------------------------------------------------------------------
// Types (exported so hooks can import them)
// ---------------------------------------------------------------------------

export type QuestionState = 'unattempted' | 'full' | 'partial' | 'zero'

export interface AttemptRecord {
  questionId: string
  score: number
  maxPoints: number
  attemptedAt: string
}

export type ProgressContextType = UseProgressResult

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const ProgressContext = createContext<ProgressContextType | null>(null)

// ---------------------------------------------------------------------------
// Provider — thin wrapper around the useProgress hook
// ---------------------------------------------------------------------------

export function ProgressProvider({ children }: { children: ReactNode }) {
  const progress = useProgressHook()
  return (
    <ProgressContext.Provider value={progress}>
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

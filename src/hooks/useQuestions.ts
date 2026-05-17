import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Question } from '../types/question'

interface UseQuestionsResult {
  questions: Question[]
  loading: boolean
  error: string | null
}

export function useQuestions(subject?: string): UseQuestionsResult {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    let query = supabase
      .from('questions')
      .select('*')
      .order('locked', { ascending: true })
      .order('sort_order', { ascending: true })

    if (subject) {
      query = query.eq('subject', subject)
    }

    query.then(({ data, error: err }) => {
      if (cancelled) return
      if (err) {
        setError(err.message)
      } else {
        setQuestions((data ?? []) as Question[])
      }
      setLoading(false)
    })

    return () => { cancelled = true }
  }, [subject])

  return { questions, loading, error }
}

import { useState, useCallback } from 'react'

const KEY = 'abitur_starred_questions'

function readStarred(): Set<string> {
  try {
    const raw = localStorage.getItem(KEY)
    return new Set(raw ? (JSON.parse(raw) as string[]) : [])
  } catch {
    return new Set()
  }
}

function writeStarred(set: Set<string>) {
  localStorage.setItem(KEY, JSON.stringify([...set]))
}

export function useStarred() {
  const [starred, setStarred] = useState<Set<string>>(() => readStarred())

  const toggle = useCallback((questionId: string) => {
    setStarred((prev) => {
      const next = new Set(prev)
      if (next.has(questionId)) next.delete(questionId)
      else next.add(questionId)
      writeStarred(next)
      return next
    })
  }, [])

  const isStarred = useCallback((questionId: string) => starred.has(questionId), [starred])

  return { starred, toggle, isStarred }
}

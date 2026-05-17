import { useState } from 'react'
import type { Question } from '../types/question'
import { useProgress } from '../context/ProgressContext'
import { gradeWithClaude } from '../lib/gradeWithClaude'
import type { GradingResult } from '../lib/gradeWithClaude'
import DrawingCanvas from './DrawingCanvas'
import UploadBox from './UploadBox'
import ResultsPanel from './ResultsPanel'

interface QuestionCardProps {
  question: Question
  questionNumber: number
  totalQuestions: number
  onPrev?: () => void
  onNext?: () => void
}

const DIFFICULTY_LABEL: Record<string, string> = {
  easy: 'Grundlagen',
  medium: 'Standard',
  hard: 'Erhöht',
}

const DIFFICULTY_COLOR: Record<string, string> = {
  easy: 'bg-emerald-500/20 text-emerald-300',
  medium: 'bg-amber-500/20 text-amber-300',
  hard: 'bg-rose-500/20 text-rose-300',
}

export default function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  onPrev,
  onNext,
}: QuestionCardProps) {
  const { getQuestionState, recordAttempt } = useProgress()
  const [inputMode, setInputMode] = useState<'canvas' | 'upload'>('canvas')
  const [solution, setSolution] = useState<string>('')

  const [isGrading, setIsGrading] = useState(false)
  const [gradingResult, setGradingResult] = useState<GradingResult | null>(null)
  const [gradingError, setGradingError] = useState<string | null>(null)

  const state = getQuestionState(question.id, question.max_points)
  const hasResult = isGrading || gradingResult !== null || gradingError !== null

  const handleSubmit = async () => {
    if (!solution) {
      alert('Bitte zeichne oder lade zuerst deine Lösung hoch.')
      return
    }
    setIsGrading(true)
    setGradingResult(null)
    setGradingError(null)
    try {
      const result = await gradeWithClaude(
        solution,
        question.text,
        question.erwartungshorizont,
        question.max_points,
      )
      setGradingResult(result)
    } catch (err) {
      setGradingError(err instanceof Error ? err.message : 'Unbekannter Fehler.')
    } finally {
      setIsGrading(false)
    }
  }

  const handleScoreConfirmed = (score: number, feedback: string) => {
    recordAttempt(question.id, score, question.max_points, feedback)
    if (onNext) setTimeout(onNext, 300)
  }

  // Reset state when question changes
  const [lastId, setLastId] = useState(question.id)
  if (question.id !== lastId) {
    setLastId(question.id)
    setSolution('')
    setIsGrading(false)
    setGradingResult(null)
    setGradingError(null)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-500">
            Aufgabe {questionNumber} / {totalQuestions}
          </span>
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${DIFFICULTY_COLOR[question.difficulty]}`}>
            {DIFFICULTY_LABEL[question.difficulty]}
          </span>
          <span className="text-xs text-slate-500">{question.max_points} Pkt</span>
        </div>
        {state !== 'unattempted' && (
          <span className="text-lg" title="Bearbeitungsstatus">
            {state === 'full' ? '✅' : state === 'partial' ? '🟡' : '❌'}
          </span>
        )}
      </div>

      {/* Question text */}
      <div className="rounded-xl border border-white/10 bg-surface p-5">
        <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-slate-200">
          {question.text}
        </pre>
      </div>

      {/* Input toggle */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-slate-300">Deine Lösung</p>
          <div className="ml-auto flex rounded-lg border border-white/10 p-0.5">
            <button
              onClick={() => setInputMode('canvas')}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                inputMode === 'canvas' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              ✏️ Zeichnen
            </button>
            <button
              onClick={() => setInputMode('upload')}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                inputMode === 'upload' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              📷 Foto
            </button>
          </div>
        </div>

        {inputMode === 'canvas' ? (
          <DrawingCanvas onChange={setSolution} />
        ) : (
          <UploadBox onChange={setSolution} />
        )}
      </div>

      {/* Submit button */}
      {!hasResult && (
        <button
          onClick={handleSubmit}
          disabled={isGrading}
          className="w-full rounded-lg bg-indigo-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          Lösung einreichen
        </button>
      )}

      {/* Results */}
      {hasResult && (
        <ResultsPanel
          loading={isGrading}
          error={gradingError}
          result={gradingResult}
          onScoreConfirmed={handleScoreConfirmed}
        />
      )}

      {/* Navigation */}
      <div className="flex justify-between border-t border-white/5 pt-4">
        <button
          onClick={onPrev}
          disabled={!onPrev}
          className="rounded-md px-4 py-2 text-sm text-slate-400 transition-colors hover:text-white disabled:opacity-30"
        >
          ← Vorherige
        </button>
        <button
          onClick={onNext}
          disabled={!onNext}
          className="rounded-md px-4 py-2 text-sm text-slate-400 transition-colors hover:text-white disabled:opacity-30"
        >
          Nächste →
        </button>
      </div>
    </div>
  )
}

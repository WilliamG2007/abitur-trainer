import { useState } from 'react'
import type { Question } from '../types/question'
import { useProgress } from '../context/ProgressContext'
import { gradeWithClaude } from '../lib/gradeWithClaude'
import type { GradingResult } from '../lib/gradeWithClaude'
import DrawingCanvas, { capCanvasForApi } from './DrawingCanvas'
import UploadBox from './UploadBox'
import TextBox, { TEXT_MAX } from './TextBox'
import ResultsPanel from './ResultsPanel'
import LatexRenderer from './LatexRenderer'
import { useAuth } from '../context/AuthContext'

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
  easy: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300',
  medium: 'bg-amber-500/20 text-amber-600 dark:text-amber-300',
  hard: 'bg-rose-500/20 text-rose-600 dark:text-rose-300',
}

type InputMode = 'canvas' | 'upload' | 'text'

export default function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  onPrev,
  onNext,
}: QuestionCardProps) {
  const { getQuestionState, recordAttempt } = useProgress()
  const { user } = useAuth()
  const [inputMode, setInputMode] = useState<InputMode>('canvas')

  // canvas / upload stores a data URL; text mode stores plain text
  const [imageDataUrl, setImageDataUrl] = useState<string>('')
  const [textSolution, setTextSolution] = useState<string>('')

  const [isGrading, setIsGrading] = useState(false)
  const [gradingResult, setGradingResult] = useState<GradingResult | null>(null)
  const [gradingError, setGradingError] = useState<string | null>(null)

  const state = getQuestionState(question.id, question.max_points)
  const hasResult = isGrading || gradingResult !== null || gradingError !== null

  const textOver = inputMode === 'text' && textSolution.length > TEXT_MAX

  const handleSubmit = async () => {
    if (inputMode === 'text' && !textSolution.trim()) {
      alert('Bitte gib zuerst deine Lösung ein.')
      return
    }
    if (inputMode === 'text' && textOver) return
    if (inputMode !== 'text' && !imageDataUrl) {
      alert('Bitte zeichne oder lade zuerst deine Lösung hoch.')
      return
    }

    setIsGrading(true)
    setGradingResult(null)
    setGradingError(null)

    try {
      let solution: Parameters<typeof gradeWithClaude>[0]
      if (inputMode === 'text') {
        solution = { type: 'text', content: textSolution }
      } else {
        // Cap canvas payload before sending to API
        const cappedUrl = inputMode === 'canvas' ? capCanvasForApi(imageDataUrl) : imageDataUrl
        solution = { type: 'image', dataUrl: cappedUrl }
      }

      const result = await gradeWithClaude(
        solution,
        question.text,
        question.erwartungshorizont,
        question.max_points,
        user?.id,
      )
      setGradingResult(result)
    } catch (err) {
      setGradingError(err instanceof Error ? err.message : 'Unbekannter Fehler.')
    } finally {
      setIsGrading(false)
    }
  }

  const handleScoreConfirmed = (score: number, feedback: string) => {
    recordAttempt(
      question.id,
      score,
      question.max_points,
      feedback,
      inputMode !== 'text' ? imageDataUrl || undefined : undefined,
      inputMode === 'text' ? textSolution || undefined : undefined,
    )
    if (onNext) setTimeout(onNext, 300)
  }

  // Reset state when question changes
  const [lastId, setLastId] = useState(question.id)
  if (question.id !== lastId) {
    setLastId(question.id)
    setImageDataUrl('')
    setTextSolution('')
    setIsGrading(false)
    setGradingResult(null)
    setGradingError(null)
  }

  const modeBtn = (_mode: InputMode, active: boolean) =>
    `rounded-md px-3 py-1 text-xs font-medium transition-colors ${
      active ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white'
    }`

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400 dark:text-slate-500">
            Aufgabe {questionNumber} / {totalQuestions}
          </span>
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${DIFFICULTY_COLOR[question.difficulty]}`}>
            {DIFFICULTY_LABEL[question.difficulty]}
          </span>
          <span className="text-xs text-gray-400 dark:text-slate-500">{question.max_points} Pkt</span>
        </div>
        {state !== 'unattempted' && (
          <span className="text-lg" title="Bearbeitungsstatus">
            {state === 'full' ? '✅' : state === 'partial' ? '🟡' : '❌'}
          </span>
        )}
      </div>

      {/* Question text */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/10 dark:bg-surface">
        <p className="text-sm leading-relaxed text-gray-800 dark:text-slate-200">
          <LatexRenderer>{question.text}</LatexRenderer>
        </p>
        {question.images && question.images.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-3">
            {question.images.map((img) => (
              <img
                key={img}
                src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/question-images/${img}`}
                alt=""
                className="max-h-72 rounded-lg border border-gray-200 object-contain dark:border-white/10"
              />
            ))}
          </div>
        )}
      </div>

      {/* Input toggle */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-gray-700 dark:text-slate-300">Deine Lösung</p>
          <div className="ml-auto flex rounded-lg border border-gray-200 p-0.5 dark:border-white/10">
            <button onClick={() => setInputMode('canvas')} className={modeBtn('canvas', inputMode === 'canvas')}>
              ✏️ Zeichnen
            </button>
            <button onClick={() => setInputMode('upload')} className={modeBtn('upload', inputMode === 'upload')}>
              📷 Foto
            </button>
            <button onClick={() => setInputMode('text')} className={modeBtn('text', inputMode === 'text')}>
              ⌨️ Text
            </button>
          </div>
        </div>

        {inputMode === 'canvas' && (
          <DrawingCanvas key={question.id} onChange={setImageDataUrl} />
        )}
        {inputMode === 'upload' && (
          <UploadBox onChange={setImageDataUrl} />
        )}
        {inputMode === 'text' && (
          <TextBox onChange={setTextSolution} />
        )}
      </div>

      {/* Submit button */}
      {!hasResult && (
        <button
          onClick={handleSubmit}
          disabled={isGrading || textOver}
          className="w-full rounded-lg bg-indigo-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
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
      <div className="flex justify-between border-t border-gray-100 pt-4 dark:border-white/5">
        <button
          onClick={onPrev}
          disabled={!onPrev}
          className="rounded-md px-4 py-2 text-sm text-gray-500 transition-colors hover:text-gray-900 disabled:opacity-30 dark:text-slate-400 dark:hover:text-white"
        >
          ← Vorherige
        </button>
        <button
          onClick={onNext}
          disabled={!onNext}
          className="rounded-md px-4 py-2 text-sm text-gray-500 transition-colors hover:text-gray-900 disabled:opacity-30 dark:text-slate-400 dark:hover:text-white"
        >
          Nächste →
        </button>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { TOPICS, QUESTIONS_PER_SUBTOPIC } from '../data/topics'
import type { Topic } from '../data/topics'
import type { Question } from '../types/question'
import { useQuestions } from '../hooks/useQuestions'
import { useProgress } from '../context/ProgressContext'
import QuestionCard from '../components/QuestionCard'
import LearnMode from '../components/LearnMode'

// ---------------------------------------------------------------------------
// View state (discriminated union)
// ---------------------------------------------------------------------------
type View =
  | { mode: 'topics' }
  | { mode: 'subtopics'; topicId: Topic }
  | { mode: 'question'; topicId: Topic; subtopic: string; questionIdx: number }

// ---------------------------------------------------------------------------
// Dot indicator for a single question
// ---------------------------------------------------------------------------
function QuestionDot({
  state,
  locked,
  score,
  maxPoints,
  onClick,
}: {
  state: 'unattempted' | 'full' | 'partial' | 'zero' | 'locked'
  locked?: boolean
  score?: number
  maxPoints?: number
  onClick?: () => void
}) {
  const colors = {
    locked: 'bg-white/5 cursor-not-allowed',
    unattempted: 'bg-slate-600 hover:bg-slate-400 cursor-pointer',
    full: 'bg-emerald-500 hover:bg-emerald-400 cursor-pointer',
    partial: 'bg-amber-400 hover:bg-amber-300 cursor-pointer',
    zero: 'bg-red-500 hover:bg-red-400 cursor-pointer',
  }
  const key = locked ? 'locked' : state

  let tooltip: string
  if (locked) {
    tooltip = 'Gesperrt'
  } else if (state === 'unattempted') {
    tooltip = 'Noch nicht bearbeitet'
  } else {
    tooltip = `${score ?? 0} / ${maxPoints ?? '?'} Punkte`
  }

  return (
    <button
      onClick={locked ? undefined : onClick}
      title={tooltip}
      className={`h-3 w-3 rounded-full transition-colors ${colors[key]}`}
    />
  )
}

// ---------------------------------------------------------------------------
// Topic accent colours
// ---------------------------------------------------------------------------
const TOPIC_ACCENT: Record<Topic, { bg: string; border: string; text: string; dot: string }> = {
  analysis: {
    bg: 'bg-indigo-600/10',
    border: 'border-indigo-500/30 hover:border-indigo-500/60',
    text: 'text-indigo-300',
    dot: 'bg-indigo-500',
  },
  stochastik: {
    bg: 'bg-violet-600/10',
    border: 'border-violet-500/30 hover:border-violet-500/60',
    text: 'text-violet-300',
    dot: 'bg-violet-500',
  },
  geometrie: {
    bg: 'bg-sky-600/10',
    border: 'border-sky-500/30 hover:border-sky-500/60',
    text: 'text-sky-300',
    dot: 'bg-sky-500',
  },
}

const TOPIC_ICONS: Record<Topic, string> = {
  analysis: '∫',
  stochastik: '🎲',
  geometrie: '📐',
}

// ---------------------------------------------------------------------------
// Topics view
// ---------------------------------------------------------------------------
function TopicsView({
  questions,
  onSelectTopic,
}: {
  questions: Question[]
  onSelectTopic: (id: Topic) => void
}) {
  const { getSubtopicProgress } = useProgress()

  return (
    <div className="flex flex-col gap-6">
      <div className="mb-4 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-600/20 text-2xl text-indigo-300">
          ∑
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Mathematik</h1>
          <p className="text-sm text-slate-400">Bayern Abitur · G9 Lehrplan</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {TOPICS.map((topic) => {
          const accent = TOPIC_ACCENT[topic.id]
          const allQuestionIds = topic.subtopics.flatMap((s) =>
            questions.filter((q) => q.subtopic === s && !q.locked).map((q) => q.id),
          )
          const { attempted, total } = getSubtopicProgress('', allQuestionIds)

          return (
            <button
              key={topic.id}
              onClick={() => onSelectTopic(topic.id)}
              className={`group flex flex-col gap-4 rounded-xl border p-5 text-left transition-all ${accent.bg} ${accent.border}`}
            >
              <div className="flex items-center gap-3">
                <span className={`text-xl ${accent.text}`}>{TOPIC_ICONS[topic.id]}</span>
                <h2 className="font-semibold text-white">{topic.label}</h2>
              </div>

              <ul className="space-y-1">
                {topic.subtopics.map((sub) => {
                  const subIds = questions
                    .filter((q) => q.subtopic === sub && !q.locked)
                    .map((q) => q.id)
                  const prog = getSubtopicProgress(sub, subIds)
                  return (
                    <li key={sub} className="flex items-center justify-between gap-2">
                      <span className="text-xs text-slate-400 truncate">{sub}</span>
                      <span className="text-xs text-slate-600 shrink-0">
                        {prog.attempted}/{QUESTIONS_PER_SUBTOPIC}
                      </span>
                    </li>
                  )
                })}
              </ul>

              <div className="mt-auto">
                <div className="mb-1 flex justify-between text-xs text-slate-500">
                  <span>Gesamt</span>
                  <span>{attempted}/{total}</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                  <div
                    className={`h-full rounded-full transition-all ${accent.dot}`}
                    style={{ width: total > 0 ? `${(attempted / total) * 100}%` : '0%' }}
                  />
                </div>
              </div>

              <span className={`text-xs font-medium ${accent.text} group-hover:underline`}>
                Thema öffnen →
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Subtopics view
// ---------------------------------------------------------------------------
function SubtopicsView({
  topicId,
  questions,
  onSelectSubtopic,
  onBack,
}: {
  topicId: Topic
  questions: Question[]
  onSelectSubtopic: (subtopic: string, idx: number) => void
  onBack: () => void
}) {
  const { attempts, getQuestionState, getSubtopicProgress } = useProgress()
  const topic = TOPICS.find((t) => t.id === topicId)!
  const accent = TOPIC_ACCENT[topicId]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="text-sm text-slate-500 hover:text-white">
          ← Zurück
        </button>
        <span className={`text-lg ${accent.text}`}>{TOPIC_ICONS[topicId]}</span>
        <h1 className="text-xl font-bold text-white">{topic.label}</h1>
      </div>

      <div className="flex flex-col gap-3">
        {topic.subtopics.map((sub) => {
          const qs = questions.filter((q) => q.subtopic === sub)
          const unlockedIds = qs.filter((q) => !q.locked).map((q) => q.id)
          const { attempted } = getSubtopicProgress(sub, unlockedIds)
          const pct = (attempted / QUESTIONS_PER_SUBTOPIC) * 100

          return (
            <div key={sub} className="rounded-xl border border-white/10 bg-surface p-4">
              <div className="mb-3 flex items-center justify-between gap-4">
                <h3 className="font-medium text-white">{sub}</h3>
                <span className="text-xs text-slate-500">
                  {attempted}/{QUESTIONS_PER_SUBTOPIC}
                </span>
              </div>

              <div className="mb-3 h-1 w-full overflow-hidden rounded-full bg-white/5">
                <div
                  className="h-full rounded-full bg-indigo-500 transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>

              <div className="mb-3 flex flex-wrap gap-1.5">
                {qs.map((q, idx) => {
                  const attempt = attempts[q.id]
                  return (
                  <QuestionDot
                    key={q.id}
                    locked={q.locked}
                    state={q.locked ? 'locked' : getQuestionState(q.id, q.max_points)}
                    score={attempt?.score}
                    maxPoints={attempt?.maxPoints ?? q.max_points}
                    onClick={() => onSelectSubtopic(sub, idx)}
                  />
                  )
                })}
              </div>

              <button
                onClick={() => {
                  const firstUnlockedIdx = qs.findIndex((q) => !q.locked)
                  onSelectSubtopic(sub, firstUnlockedIdx >= 0 ? firstUnlockedIdx : 0)
                }}
                className={`text-xs font-medium ${accent.text} hover:underline`}
              >
                Aufgaben öffnen →
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Question view (with Lernen / Üben tabs)
// ---------------------------------------------------------------------------
function QuestionView({
  topicId,
  subtopic,
  questionIdx,
  questions,
  onNavigate,
  onBack,
}: {
  topicId: Topic
  subtopic: string
  questionIdx: number
  questions: Question[]
  onNavigate: (idx: number) => void
  onBack: () => void
}) {
  const { attempts } = useProgress()
  const qs = questions.filter((q) => q.subtopic === subtopic)
  const question = qs[questionIdx]
  const accent = TOPIC_ACCENT[topicId]

  // Default to Üben if any question in this subtopic has been attempted
  const hasAnyAttempt = qs.some((q) => !q.locked && attempts[q.id] !== undefined)
  const [tab, setTab] = useState<'lernen' | 'ueben'>(hasAnyAttempt ? 'ueben' : 'lernen')

  if (!question) return null

  return (
    <div className="flex flex-col gap-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="text-sm text-slate-500 hover:text-white">
          ← Zurück
        </button>
        <span className={`text-sm ${accent.text}`}>{TOPICS.find((t) => t.id === topicId)?.label}</span>
        <span className="text-slate-600">/</span>
        <span className="text-sm text-slate-400">{subtopic}</span>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 rounded-lg border border-white/10 bg-white/[0.03] p-1 w-fit">
        <button
          onClick={() => setTab('lernen')}
          className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
            tab === 'lernen'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Lernen
        </button>
        <button
          onClick={() => setTab('ueben')}
          className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
            tab === 'ueben'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Üben
        </button>
      </div>

      {/* Tab content */}
      {tab === 'lernen' ? (
        <LearnMode subtopic={subtopic} />
      ) : question.locked ? (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-white/10 bg-surface py-16 text-center">
          <span className="text-4xl">🔒</span>
          <h2 className="font-semibold text-white">Gesperrte Aufgabe</h2>
          <p className="max-w-sm text-sm text-slate-400">
            Diese Aufgabe wird bald freigeschaltet. Weitere Inhalte sind in Vorbereitung.
          </p>
          <button onClick={onBack} className={`text-sm font-medium ${accent.text} hover:underline`}>
            Zurück zur Übersicht
          </button>
        </div>
      ) : (
        <QuestionCard
          question={question}
          questionNumber={questionIdx + 1}
          totalQuestions={qs.length}
          onPrev={questionIdx > 0 ? () => onNavigate(questionIdx - 1) : undefined}
          onNext={questionIdx < qs.length - 1 ? () => onNavigate(questionIdx + 1) : undefined}
        />
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main Math page
// ---------------------------------------------------------------------------
export default function Math() {
  const [view, setView] = useState<View>({ mode: 'topics' })
  const { questions, loading, error } = useQuestions('math')

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-12">
        <p className="text-sm text-red-400">Fehler beim Laden der Aufgaben: {error}</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-6">
        {view.mode === 'topics' && (
          <Link to="/" className="text-sm text-slate-500 hover:text-white">
            ← Fächerübersicht
          </Link>
        )}
      </div>

      {view.mode === 'topics' && (
        <TopicsView
          questions={questions}
          onSelectTopic={(topicId) => setView({ mode: 'subtopics', topicId })}
        />
      )}

      {view.mode === 'subtopics' && (
        <SubtopicsView
          topicId={view.topicId}
          questions={questions}
          onBack={() => setView({ mode: 'topics' })}
          onSelectSubtopic={(subtopic, idx) =>
            setView({ mode: 'question', topicId: view.topicId, subtopic, questionIdx: idx })
          }
        />
      )}

      {view.mode === 'question' && (
        <QuestionView
          key={view.subtopic}
          topicId={view.topicId}
          subtopic={view.subtopic}
          questionIdx={view.questionIdx}
          questions={questions}
          onBack={() => setView({ mode: 'subtopics', topicId: view.topicId })}
          onNavigate={(idx) =>
            setView({ mode: 'question', topicId: view.topicId, subtopic: view.subtopic, questionIdx: idx })
          }
        />
      )}
    </div>
  )
}

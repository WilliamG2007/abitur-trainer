import { useState } from 'react'
import { Link } from 'react-router-dom'
import { TOPICS, QUESTIONS_PER_SUBTOPIC } from '../data/topics'
import type { Topic } from '../data/topics'
import type { Question } from '../types/question'
import { useQuestions } from '../hooks/useQuestions'
import { useProgress } from '../context/ProgressContext'
import QuestionCard from '../components/QuestionCard'
import LearnMode from '../components/LearnMode'

type View =
  | { mode: 'topics' }
  | { mode: 'subtopics'; topicId: Topic }
  | { mode: 'question'; topicId: Topic; subtopic: string; questionIdx: number }

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
    locked: 'bg-gray-200 cursor-not-allowed dark:bg-white/5',
    unattempted: 'bg-gray-300 hover:bg-gray-400 cursor-pointer dark:bg-slate-600 dark:hover:bg-slate-400',
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

const TOPIC_ACCENT: Record<Topic, { bg: string; border: string; text: string; dot: string }> = {
  analysis: {
    bg: 'bg-indigo-600/10',
    border: 'border-indigo-500/30 hover:border-indigo-500/60',
    text: 'text-indigo-600 dark:text-indigo-300',
    dot: 'bg-indigo-500',
  },
  stochastik: {
    bg: 'bg-violet-600/10',
    border: 'border-violet-500/30 hover:border-violet-500/60',
    text: 'text-violet-600 dark:text-violet-300',
    dot: 'bg-violet-500',
  },
  geometrie: {
    bg: 'bg-sky-600/10',
    border: 'border-sky-500/30 hover:border-sky-500/60',
    text: 'text-sky-600 dark:text-sky-300',
    dot: 'bg-sky-500',
  },
}

const TOPIC_ICONS: Record<Topic, string> = {
  analysis: '∫',
  stochastik: '🎲',
  geometrie: '📐',
}

function TopicsView({ questions, onSelectTopic }: { questions: Question[]; onSelectTopic: (id: Topic) => void }) {
  const { getSubtopicProgress } = useProgress()

  return (
    <div className="flex flex-col gap-6">
      <div className="mb-4 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-600/20 text-2xl text-indigo-600 dark:text-indigo-300">
          ∑
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mathematik</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400">Bayern Abitur · G9 Lehrplan</p>
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
                <h2 className="font-semibold text-gray-900 dark:text-white">{topic.label}</h2>
              </div>

              <ul className="space-y-1">
                {topic.subtopics.map((sub) => {
                  const subIds = questions.filter((q) => q.subtopic === sub && !q.locked).map((q) => q.id)
                  const prog = getSubtopicProgress(sub, subIds)
                  return (
                    <li key={sub} className="flex items-center justify-between gap-2">
                      <span className="truncate text-xs text-gray-500 dark:text-slate-400">{sub}</span>
                      <span className="shrink-0 text-xs text-gray-400 dark:text-slate-600">
                        {prog.attempted}/{QUESTIONS_PER_SUBTOPIC}
                      </span>
                    </li>
                  )
                })}
              </ul>

              <div className="mt-auto">
                <div className="mb-1 flex justify-between text-xs text-gray-400 dark:text-slate-500">
                  <span>Gesamt</span>
                  <span>{attempted}/{total}</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-white/5">
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
        <button onClick={onBack} className="text-sm text-gray-400 hover:text-gray-900 dark:text-slate-500 dark:hover:text-white">
          ← Zurück
        </button>
        <span className={`text-lg ${accent.text}`}>{TOPIC_ICONS[topicId]}</span>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">{topic.label}</h1>
      </div>

      <div className="flex flex-col gap-3">
        {topic.subtopics.map((sub) => {
          const qs = questions.filter((q) => q.subtopic === sub)
          const unlockedIds = qs.filter((q) => !q.locked).map((q) => q.id)
          const { attempted } = getSubtopicProgress(sub, unlockedIds)
          const pct = (attempted / QUESTIONS_PER_SUBTOPIC) * 100

          return (
            <div key={sub} className="rounded-xl border border-gray-200 bg-surface p-4 dark:border-white/10">
              <div className="mb-3 flex items-center justify-between gap-4">
                <h3 className="font-medium text-gray-900 dark:text-white">{sub}</h3>
                <span className="text-xs text-gray-400 dark:text-slate-500">
                  {attempted}/{QUESTIONS_PER_SUBTOPIC}
                </span>
              </div>

              <div className="mb-3 h-1 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-white/5">
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

  const hasAnyAttempt = qs.some((q) => !q.locked && attempts[q.id] !== undefined)
  const [tab, setTab] = useState<'lernen' | 'ueben'>(hasAnyAttempt ? 'ueben' : 'lernen')

  if (!question) return null

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="text-sm text-gray-400 hover:text-gray-900 dark:text-slate-500 dark:hover:text-white">
          ← Zurück
        </button>
        <span className={`text-sm ${accent.text}`}>{TOPICS.find((t) => t.id === topicId)?.label}</span>
        <span className="text-gray-300 dark:text-slate-600">/</span>
        <span className="text-sm text-gray-500 dark:text-slate-400">{subtopic}</span>
      </div>

      <div className="flex w-fit gap-1 rounded-lg border border-gray-200 bg-gray-50 p-1 dark:border-white/10 dark:bg-white/[0.03]">
        <button
          onClick={() => setTab('lernen')}
          className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
            tab === 'lernen'
              ? 'bg-indigo-600 text-white'
              : 'text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          Lernen
        </button>
        <button
          onClick={() => setTab('ueben')}
          className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
            tab === 'ueben'
              ? 'bg-indigo-600 text-white'
              : 'text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          Üben
        </button>
      </div>

      {tab === 'lernen' ? (
        <LearnMode subtopic={subtopic} />
      ) : question.locked ? (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-gray-200 bg-surface py-16 text-center dark:border-white/10">
          <span className="text-4xl">🔒</span>
          <h2 className="font-semibold text-gray-900 dark:text-white">Gesperrte Aufgabe</h2>
          <p className="max-w-sm text-sm text-gray-500 dark:text-slate-400">
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
        <p className="text-sm text-red-500 dark:text-red-400">Fehler beim Laden der Aufgaben: {error}</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-6">
        {view.mode === 'topics' && (
          <Link to="/" className="text-sm text-gray-400 hover:text-gray-900 dark:text-slate-500 dark:hover:text-white">
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

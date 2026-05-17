import { useState } from 'react'
import { Link } from 'react-router-dom'
import { TOPICS } from '../data/topics'
import type { Topic, Subtopic } from '../data/topics'
import type { Question } from '../types/question'
import { useQuestions } from '../hooks/useQuestions'
import { useProgress } from '../context/ProgressContext'
import QuestionCard from '../components/QuestionCard'
import LearnMode from '../components/LearnMode'

type View =
  | { mode: 'topics' }
  | { mode: 'subtopics'; topicId: Topic }
  | { mode: 'question'; topicId: Topic; subtopicId: string; questionIdx: number }

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
  'analytische-geometrie': {
    bg: 'bg-sky-600/10',
    border: 'border-sky-500/30 hover:border-sky-500/60',
    text: 'text-sky-600 dark:text-sky-300',
    dot: 'bg-sky-500',
  },
}

const TOPIC_ICONS: Record<Topic, string> = {
  analysis: '∫',
  stochastik: '🎲',
  'analytische-geometrie': '📐',
}

function QuestionDot({
  state,
  score,
  maxPoints,
  onClick,
}: {
  state: 'unattempted' | 'full' | 'partial' | 'zero'
  score?: number
  maxPoints?: number
  onClick?: () => void
}) {
  const colors = {
    unattempted: 'bg-gray-300 hover:bg-gray-400 cursor-pointer dark:bg-slate-600 dark:hover:bg-slate-400',
    full: 'bg-emerald-500 hover:bg-emerald-400 cursor-pointer',
    partial: 'bg-amber-400 hover:bg-amber-300 cursor-pointer',
    zero: 'bg-red-500 hover:bg-red-400 cursor-pointer',
  }
  const tooltip =
    state === 'unattempted' ? 'Noch nicht bearbeitet' : `${score ?? 0} / ${maxPoints ?? '?'} Punkte`

  return (
    <button
      onClick={onClick}
      title={tooltip}
      className={`h-3 w-3 rounded-full transition-colors ${colors[state]}`}
    />
  )
}

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
            questions.filter((q) => q.subtopic === s.id).map((q) => q.id),
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
                  const subIds = questions.filter((q) => q.subtopic === sub.id).map((q) => q.id)
                  const prog = getSubtopicProgress(sub.id, subIds)
                  const count = subIds.length
                  return (
                    <li key={sub.id} className="flex items-center justify-between gap-2">
                      <span className="truncate text-xs text-gray-500 dark:text-slate-400">{sub.label}</span>
                      <span className="shrink-0 text-xs text-gray-400 dark:text-slate-600">
                        {prog.attempted}/{count}
                      </span>
                    </li>
                  )
                })}
              </ul>

              <div className="mt-auto">
                <div className="mb-1 flex justify-between text-xs text-gray-400 dark:text-slate-500">
                  <span>Gesamt</span>
                  <span>
                    {attempted}/{total}
                  </span>
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
  onSelectSubtopic: (subtopicId: string, idx: number) => void
  onBack: () => void
}) {
  const { attempts, getQuestionState, getSubtopicProgress } = useProgress()
  const topic = TOPICS.find((t) => t.id === topicId)!
  const accent = TOPIC_ACCENT[topicId]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="text-sm text-gray-400 hover:text-gray-900 dark:text-slate-500 dark:hover:text-white"
        >
          ← Zurück
        </button>
        <span className={`text-lg ${accent.text}`}>{TOPIC_ICONS[topicId]}</span>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">{topic.label}</h1>
      </div>

      <div className="flex flex-col gap-3">
        {topic.subtopics.map((sub: Subtopic) => {
          const qs = questions.filter((q) => q.subtopic === sub.id)
          const total = qs.length
          const { attempted } = getSubtopicProgress(sub.id, qs.map((q) => q.id))
          const pct = total > 0 ? (attempted / total) * 100 : 0

          return (
            <div key={sub.id} className="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-surface">
              <div className="mb-3 flex items-center justify-between gap-4">
                <h3 className="font-medium text-gray-900 dark:text-white">{sub.label}</h3>
                {total > 0 ? (
                  <span className="text-xs text-gray-400 dark:text-slate-500">
                    {attempted}/{total} bearbeitet
                  </span>
                ) : (
                  <span className="text-xs text-gray-400 dark:text-slate-600">0 Aufgaben verfügbar</span>
                )}
              </div>

              {total > 0 ? (
                <>
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
                          state={getQuestionState(q.id, q.max_points)}
                          score={attempt?.score}
                          maxPoints={attempt?.maxPoints ?? q.max_points}
                          onClick={() => onSelectSubtopic(sub.id, idx)}
                        />
                      )
                    })}
                  </div>

                  <button
                    onClick={() => onSelectSubtopic(sub.id, 0)}
                    className={`text-xs font-medium ${accent.text} hover:underline`}
                  >
                    Aufgaben öffnen →
                  </button>
                </>
              ) : (
                <p className="text-xs text-gray-400 dark:text-slate-600">
                  Noch keine Aufgaben für dieses Thema vorhanden.
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function QuestionView({
  topicId,
  subtopicId,
  questionIdx,
  questions,
  onNavigate,
  onBack,
}: {
  topicId: Topic
  subtopicId: string
  questionIdx: number
  questions: Question[]
  onNavigate: (idx: number) => void
  onBack: () => void
}) {
  const { attempts } = useProgress()
  const topic = TOPICS.find((t) => t.id === topicId)!
  const subtopic = topic.subtopics.find((s) => s.id === subtopicId)
  const accent = TOPIC_ACCENT[topicId]

  const qs = questions.filter((q) => q.subtopic === subtopicId)
  const question = qs[questionIdx]

  const hasAnyAttempt = qs.some((q) => attempts[q.id] !== undefined)
  const [tab, setTab] = useState<'lernen' | 'ueben'>(hasAnyAttempt ? 'ueben' : 'lernen')

  if (!question) return null

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="text-sm text-gray-400 hover:text-gray-900 dark:text-slate-500 dark:hover:text-white"
        >
          ← Zurück
        </button>
        <span className={`text-sm ${accent.text}`}>{topic.label}</span>
        <span className="text-gray-300 dark:text-slate-600">/</span>
        <span className="text-sm text-gray-500 dark:text-slate-400">{subtopic?.label ?? subtopicId}</span>
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
        <LearnMode subtopic={subtopicId} />
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
          <Link
            to="/"
            className="text-sm text-gray-400 hover:text-gray-900 dark:text-slate-500 dark:hover:text-white"
          >
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
          onSelectSubtopic={(subtopicId, idx) =>
            setView({ mode: 'question', topicId: view.topicId, subtopicId, questionIdx: idx })
          }
        />
      )}

      {view.mode === 'question' && (
        <QuestionView
          key={view.subtopicId}
          topicId={view.topicId}
          subtopicId={view.subtopicId}
          questionIdx={view.questionIdx}
          questions={questions}
          onBack={() => setView({ mode: 'subtopics', topicId: view.topicId })}
          onNavigate={(idx) =>
            setView({
              mode: 'question',
              topicId: view.topicId,
              subtopicId: view.subtopicId,
              questionIdx: idx,
            })
          }
        />
      )}
    </div>
  )
}

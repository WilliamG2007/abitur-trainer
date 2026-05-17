import { useState, useEffect } from 'react'
import { getLearnContent } from '../data/learnContent'
import MathRenderer from './MathRenderer'

function ConceptCard({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-surface p-5 border-l-4 border-l-indigo-500 dark:border-white/10">
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-indigo-600 dark:text-indigo-400">Konzept</p>
      <p className="text-sm leading-relaxed text-gray-700 dark:text-slate-200">
        <MathRenderer formula={text} />
      </p>
    </div>
  )
}

function FormulaCard({
  notation,
  parameters,
}: {
  notation: string
  parameters: { symbol: string; description: string }[]
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-white/10 dark:bg-[#12141e]">
      <p className="mb-3 text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-slate-500">
        Formel &amp; Parameter
      </p>
      <div className="mb-4 overflow-x-auto rounded-lg bg-gray-100 px-4 py-4 text-indigo-600 dark:bg-white/[0.04] dark:text-indigo-300">
        <MathRenderer formula={notation} />
      </div>
      <ul className="flex flex-col gap-2.5">
        {parameters.map((p, i) => (
          <li key={i} className="flex items-baseline gap-3">
            <span className="shrink-0 rounded bg-gray-100 px-2 py-0.5 text-sm text-gray-700 dark:bg-white/5 dark:text-slate-300">
              <MathRenderer formula={p.symbol} />
            </span>
            <span className="text-xs text-gray-500 dark:text-slate-500">
              <MathRenderer formula={p.description} />
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function StepCard({
  index,
  total,
  step,
}: {
  index: number
  total: number
  step: { instruction: string; calculation: string; result: string }
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-surface p-4 dark:border-white/10">
      <div className="mb-2 flex items-center gap-2">
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
          {index + 1}
        </span>
        <p className="text-xs font-medium text-gray-700 dark:text-slate-300">
          <MathRenderer formula={step.instruction} />
        </p>
        <span className="ml-auto text-xs text-gray-400 dark:text-slate-600">
          {index + 1} / {total}
        </span>
      </div>
      <div className="mt-2 overflow-x-auto rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-700 dark:bg-white/[0.03] dark:text-slate-300">
        <MathRenderer formula={step.calculation} />
      </div>
      <p className="mt-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
        →&nbsp;<MathRenderer formula={step.result} />
      </p>
    </div>
  )
}

function ExampleSection({
  question,
  steps,
}: {
  question: string
  steps: { instruction: string; calculation: string; result: string }[]
}) {
  const [revealed, setRevealed] = useState(0)
  const allRevealed = revealed >= steps.length

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-xl border border-gray-200 bg-surface p-5 dark:border-white/10">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-slate-500">
          Schritt-für-Schritt Beispiel
        </p>
        <p className="text-sm leading-relaxed text-gray-700 dark:text-slate-200">
          <MathRenderer formula={question} />
        </p>
      </div>

      {steps.slice(0, revealed).map((step, i) => (
        <StepCard key={i} index={i} total={steps.length} step={step} />
      ))}

      <div className="flex items-center gap-3">
        {!allRevealed && (
          <button
            onClick={() => setRevealed((r) => r + 1)}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
          >
            {revealed === 0 ? 'Ersten Schritt anzeigen' : 'Nächster Schritt →'}
          </button>
        )}
        {!allRevealed && revealed > 0 && (
          <button
            onClick={() => setRevealed(steps.length)}
            className="rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-500 transition-colors hover:text-gray-900 dark:border-white/10 dark:text-slate-400 dark:hover:text-white"
          >
            Alle anzeigen
          </button>
        )}
        {allRevealed && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-emerald-600 dark:text-emerald-400">✓ Alle Schritte angezeigt</span>
            <button
              onClick={() => setRevealed(0)}
              className="text-xs text-gray-400 hover:text-gray-600 dark:text-slate-600 dark:hover:text-slate-400"
            >
              Zurücksetzen
            </button>
          </div>
        )}
        {revealed === 0 && (
          <p className="text-xs text-gray-400 dark:text-slate-600">Versuche zuerst selbst – dann reveal!</p>
        )}
      </div>
    </div>
  )
}

function MerkhilfeCard({ tips }: { tips: string[] }) {
  return (
    <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
      <p className="mb-3 text-xs font-medium uppercase tracking-wide text-amber-600 dark:text-amber-400">
        ⚠️ Merkhilfe
      </p>
      <ul className="flex flex-col gap-2">
        {tips.map((tip, i) => (
          <li key={i} className="flex gap-2 text-sm text-gray-700 dark:text-slate-300">
            <span className="mt-0.5 shrink-0 text-amber-500">•</span>
            <span className="leading-relaxed">
              <MathRenderer formula={tip} />
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function ComingSoon({ subtopic }: { subtopic: string }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-gray-200 bg-surface py-14 text-center dark:border-white/10">
      <span className="text-3xl">📖</span>
      <p className="text-sm font-medium text-gray-900 dark:text-white">Lerninhalt für „{subtopic}" kommt bald</p>
      <p className="max-w-xs text-xs text-gray-400 dark:text-slate-500">
        Dieser Lernabschnitt wird gerade vorbereitet. Nutze in der Zwischenzeit den Üben-Tab.
      </p>
    </div>
  )
}

export default function LearnMode({ subtopic }: { subtopic: string }) {
  const content = getLearnContent(subtopic)
  const [exampleKey, setExampleKey] = useState(0)
  useEffect(() => { setExampleKey((k) => k + 1) }, [subtopic])

  if (!content) return <ComingSoon subtopic={subtopic} />

  return (
    <div className="flex flex-col gap-4">
      <ConceptCard text={content.concept} />
      <FormulaCard notation={content.formula.notation} parameters={content.formula.parameters} />
      <ExampleSection key={exampleKey} question={content.example.question} steps={content.example.steps} />
      <MerkhilfeCard tips={content.merkhilfe} />
    </div>
  )
}

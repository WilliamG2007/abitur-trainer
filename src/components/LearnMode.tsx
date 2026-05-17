import { useState, useEffect } from 'react'
import { getLearnContent } from '../data/learnContent'

// ---------------------------------------------------------------------------
// Section: Konzept
// ---------------------------------------------------------------------------
function ConceptCard({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-surface p-5 border-l-4 border-l-indigo-500">
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-indigo-400">Konzept</p>
      <p className="text-sm leading-relaxed text-slate-200">{text}</p>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Section: Formel & Parameter
// ---------------------------------------------------------------------------
function FormulaCard({
  notation,
  parameters,
}: {
  notation: string
  parameters: { symbol: string; description: string }[]
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#12141e] p-5">
      <p className="mb-3 text-xs font-medium uppercase tracking-wide text-slate-500">
        Formel &amp; Parameter
      </p>
      {/* Main notation */}
      <div className="mb-4 rounded-lg bg-white/[0.04] px-4 py-3">
        <pre className="font-mono text-sm text-indigo-300 whitespace-pre-wrap">{notation}</pre>
      </div>
      {/* Parameters */}
      <ul className="flex flex-col gap-2">
        {parameters.map((p, i) => (
          <li key={i} className="flex items-baseline gap-3">
            <code className="shrink-0 rounded bg-white/5 px-1.5 py-0.5 font-mono text-xs text-slate-300">
              {p.symbol}
            </code>
            <span className="text-xs text-slate-500">{p.description}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Section: Schritt-für-Schritt Beispiel
// ---------------------------------------------------------------------------
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
    <div className="rounded-xl border border-white/10 bg-surface p-4">
      <div className="mb-2 flex items-center gap-2">
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
          {index + 1}
        </span>
        <p className="text-xs font-medium text-slate-300">{step.instruction}</p>
        <span className="ml-auto text-xs text-slate-600">
          {index + 1} / {total}
        </span>
      </div>
      <div className="mt-2 rounded-lg bg-white/[0.03] px-4 py-3">
        <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-slate-300">
          {step.calculation}
        </pre>
      </div>
      <p className="mt-2 text-xs font-medium text-emerald-400">
        → {step.result}
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
  const canRevealMore = revealed < steps.length

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-xl border border-white/10 bg-surface p-5">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">
          Schritt-für-Schritt Beispiel
        </p>
        <p className="text-sm leading-relaxed text-slate-200">{question}</p>
      </div>

      {/* Revealed steps */}
      {steps.slice(0, revealed).map((step, i) => (
        <StepCard key={i} index={i} total={steps.length} step={step} />
      ))}

      {/* Controls */}
      <div className="flex items-center gap-3">
        {canRevealMore && (
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
            className="rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-400 transition-colors hover:text-white"
          >
            Alle Schritte anzeigen
          </button>
        )}
        {allRevealed && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-emerald-400">✓ Alle Schritte angezeigt</span>
            <button
              onClick={() => setRevealed(0)}
              className="text-xs text-slate-600 hover:text-slate-400"
            >
              Zurücksetzen
            </button>
          </div>
        )}
        {revealed === 0 && (
          <p className="text-xs text-slate-600">Versuche zuerst selbst – dann reveal!</p>
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Section: Merkhilfe
// ---------------------------------------------------------------------------
function MerkhilfeCard({ tips }: { tips: string[] }) {
  return (
    <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
      <p className="mb-3 text-xs font-medium uppercase tracking-wide text-amber-400">
        ⚠️ Merkhilfe
      </p>
      <ul className="flex flex-col gap-2">
        {tips.map((tip, i) => (
          <li key={i} className="flex gap-2 text-sm text-slate-300">
            <span className="mt-0.5 shrink-0 text-amber-500">•</span>
            <span className="leading-relaxed">{tip}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Coming soon state
// ---------------------------------------------------------------------------
function ComingSoon({ subtopic }: { subtopic: string }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-white/10 bg-surface py-14 text-center">
      <span className="text-3xl">📖</span>
      <p className="text-sm font-medium text-white">Lerninhalt für „{subtopic}" kommt bald</p>
      <p className="max-w-xs text-xs text-slate-500">
        Dieser Lernabschnitt wird gerade vorbereitet. Nutze in der Zwischenzeit den Üben-Tab.
      </p>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function LearnMode({ subtopic }: { subtopic: string }) {
  const content = getLearnContent(subtopic)

  // Reset example steps whenever the subtopic changes
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

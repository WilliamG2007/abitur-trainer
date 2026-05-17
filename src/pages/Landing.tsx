import { useRef, useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import SubjectCard from '../components/SubjectCard'

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------
const subjects = [
  { to: '/math',      icon: '∑',  title: 'Mathematik', description: 'Analysis, Stochastik, Geometrie – alle Themen des Lehrplans.',     accent: 'bg-indigo-600/20 text-indigo-600 dark:text-indigo-300', available: true },
  { to: '/deutsch',   icon: 'Aa', title: 'Deutsch',     description: 'Textanalyse, Interpretation, Erörterung und Sprachreflexion.',     accent: 'bg-emerald-600/20 text-emerald-600 dark:text-emerald-300', available: false },
  { to: '/englisch',  icon: '🌐', title: 'Englisch',    description: 'Reading comprehension, writing tasks und Grammatik.',              accent: 'bg-sky-600/20 text-sky-600 dark:text-sky-300', available: false },
  { to: '/physik',    icon: '⚡', title: 'Physik',      description: 'Mechanik, Elektrodynamik, Quantenphysik und mehr.',               accent: 'bg-amber-600/20 text-amber-600 dark:text-amber-300', available: false },
  { to: '/geschichte',icon: '📜', title: 'Geschichte',  description: 'Epochen, Quellanalyse und politische Prozesse.',                  accent: 'bg-rose-600/20 text-rose-600 dark:text-rose-300', available: false },
  { to: '/biologie',  icon: '🧬', title: 'Biologie',    description: 'Genetik, Ökologie, Evolution und Neurobiologie.',                 accent: 'bg-teal-600/20 text-teal-600 dark:text-teal-300', available: false },
]

const steps = [
  { icon: '📝', title: 'Aufgabe wählen',       description: 'Suche dir ein Themengebiet aus und wähle eine Aufgabe nach Schwierigkeitsgrad.' },
  { icon: '✏️', title: 'Lösung einreichen',    description: 'Zeichne deine Lösung direkt im Browser oder lade ein Foto deines Heftes hoch.' },
  { icon: '🎯', title: 'KI-Feedback erhalten', description: 'Claude bewertet deine Antwort nach dem offiziellen bayerischen Erwartungshorizont.' },
]

const features = [
  { icon: '📋', title: 'Echter Erwartungshorizont', description: 'Jede Aufgabe wird exakt nach dem ISB-Lehrplan bewertet – kein Raten, keine Approximationen.',            accent: 'text-indigo-600 dark:text-indigo-400' },
  { icon: '🪜', title: 'Schritt-für-Schritt Lernen', description: 'Der Lernmodus erklärt Konzepte, Formeln und Musterlösungen – Schritt für Schritt aufgedeckt.',          accent: 'text-violet-600 dark:text-violet-400' },
  { icon: '📊', title: 'Dein Fortschritt',           description: 'Behalte den Überblick: Welche Aufgaben hast du gemeistert, wo fehlen noch Punkte?',                    accent: 'text-emerald-600 dark:text-emerald-400' },
]

const MOCK_FEEDBACK = `TEILAUFGABEN:
(a) 3/3 BE — Funktionsterm korrekt bestimmt.
(b) 2/4 BE — Ableitungsregel angewendet, aber
    Kettenregel fehlt beim zweiten Summanden.
(c) 0/3 BE — Nullstellen nicht berechnet.

FEHLER:
- Kettenregel vergessen: muss −2·e^(−2x) lauten.
- Nullstellenberechnung fehlt vollständig.

HINWEISE:
- (b): Schreibe erst die Regel, dann wende sie an.
- (c): Setze f(x) = 0 und löse algebraisch.`

// ---------------------------------------------------------------------------
// Mini drawing canvas for the demo section
// ---------------------------------------------------------------------------
function DemoCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isDrawing = useRef(false)
  const lastPos = useRef<{ x: number; y: number } | null>(null)
  const [isEmpty, setIsEmpty] = useState(true)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect()
      canvas.width = width
      canvas.height = height
    }
    resize()
    const obs = new ResizeObserver(resize)
    obs.observe(canvas)
    return () => obs.disconnect()
  }, [])

  const getPos = (e: MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return null
    const rect = canvas.getBoundingClientRect()
    if (e instanceof MouseEvent) return { x: e.clientX - rect.left, y: e.clientY - rect.top }
    const t = (e as TouchEvent).touches[0]
    return t ? { x: t.clientX - rect.left, y: t.clientY - rect.top } : null
  }

  const startDraw = useCallback((e: MouseEvent | TouchEvent) => {
    e.preventDefault()
    isDrawing.current = true
    lastPos.current = getPos(e)
    setIsEmpty(false)
  }, [])

  const draw = useCallback((e: MouseEvent | TouchEvent) => {
    e.preventDefault()
    if (!isDrawing.current) return
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx || !canvas) return
    const pos = getPos(e)
    if (!pos) return
    ctx.globalCompositeOperation = 'source-over'
    ctx.strokeStyle = '#a5b4fc'
    ctx.lineWidth = 2.5
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.beginPath()
    ctx.moveTo(lastPos.current?.x ?? pos.x, lastPos.current?.y ?? pos.y)
    ctx.lineTo(pos.x, pos.y)
    ctx.stroke()
    lastPos.current = pos
  }, [])

  const endDraw = useCallback(() => {
    isDrawing.current = false
    lastPos.current = null
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.addEventListener('mousedown', startDraw)
    canvas.addEventListener('mousemove', draw)
    canvas.addEventListener('mouseup', endDraw)
    canvas.addEventListener('mouseleave', endDraw)
    canvas.addEventListener('touchstart', startDraw, { passive: false })
    canvas.addEventListener('touchmove', draw, { passive: false })
    canvas.addEventListener('touchend', endDraw)
    return () => {
      canvas.removeEventListener('mousedown', startDraw)
      canvas.removeEventListener('mousemove', draw)
      canvas.removeEventListener('mouseup', endDraw)
      canvas.removeEventListener('mouseleave', endDraw)
      canvas.removeEventListener('touchstart', startDraw)
      canvas.removeEventListener('touchmove', draw)
      canvas.removeEventListener('touchend', endDraw)
    }
  }, [startDraw, draw, endDraw])

  const clear = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setIsEmpty(true)
  }

  return (
    <div className="relative mt-5 overflow-hidden rounded-lg border border-dashed border-indigo-500/30 bg-[#0d0f1a]" style={{ height: 140 }}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full cursor-crosshair touch-none"
      />
      {isEmpty && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1">
          <p className="text-xs text-slate-500">✏️ Hier deine Lösung einzeichnen</p>
        </div>
      )}
      {!isEmpty && (
        <button
          onClick={clear}
          className="absolute right-2 top-2 rounded px-2 py-0.5 text-xs text-slate-500 transition-colors hover:text-white"
        >
          Löschen
        </button>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Logged-in dashboard view
// ---------------------------------------------------------------------------
function getGreeting(name: string) {
  const h = new Date().getHours()
  const time = h < 12 ? 'Guten Morgen' : h < 18 ? 'Hallo' : 'Guten Abend'
  return `${time}, ${name}!`
}

function LoggedInView({ displayName }: { displayName: string }) {
  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      {/* Greeting */}
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
          {getGreeting(displayName)}
        </h1>
        <p className="mt-1 text-gray-500 dark:text-slate-400">Bereit weiterzumachen?</p>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            to="/math"
            className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500"
          >
            Weiter üben →
          </Link>
          <Link
            to="/analytics"
            className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:border-gray-300 hover:text-gray-900 dark:border-white/10 dark:text-slate-300 dark:hover:border-white/20 dark:hover:text-white"
          >
            📊 Statistiken
          </Link>
          <Link
            to="/profile"
            className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:border-gray-300 hover:text-gray-900 dark:border-white/10 dark:text-slate-300 dark:hover:border-white/20 dark:hover:text-white"
          >
            👤 Profil
          </Link>
        </div>
      </div>

      {/* Subject grid */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-medium uppercase tracking-wide text-gray-400 dark:text-slate-500">
          Deine Fächer
        </h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {subjects.map((s) => (
          <SubjectCard key={s.to} {...s} />
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Marketing / guest view
// ---------------------------------------------------------------------------
function GuestView() {
  return (
    <div>
      {/* ------------------------------------------------------------------ */}
      {/* Hero                                                                */}
      {/* ------------------------------------------------------------------ */}
      <section className="relative mx-auto max-w-5xl px-6 pb-24 pt-20 text-center">
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 -z-10 h-72 w-[600px] -translate-x-1/2 rounded-full bg-indigo-400/10 blur-3xl dark:bg-indigo-600/20" />

        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-300">
          Bayern Abitur 2026
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
          Lern smarter,{' '}
          <span className="bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">
            nicht länger.
          </span>
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-lg text-gray-500 dark:text-slate-400">
          Übe gezielt für das bayerische Abitur – echte Aufgaben, sofortiges KI-Feedback,
          Schritt-für-Schritt Erklärungen. Komplett kostenlos.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/register"
            className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-900/40 transition-colors hover:bg-indigo-500"
          >
            Kostenlos starten →
          </Link>
          <button
            onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            className="rounded-lg border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-600 transition-colors hover:border-gray-300 hover:text-gray-900 dark:border-white/10 dark:text-slate-300 dark:hover:border-white/20 dark:hover:text-white"
          >
            Demo ansehen
          </button>
        </div>

        <p className="mt-4 text-xs text-gray-400 dark:text-slate-600">
          Kein Account erforderlich · Basiert auf dem ISB-Lehrplan Bayern
        </p>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* How It Works                                                        */}
      {/* ------------------------------------------------------------------ */}
      <section className="border-y border-gray-100 bg-gray-50 px-6 py-16 dark:border-white/5 dark:bg-white/[0.02]">
        <div className="mx-auto max-w-5xl">
          <p className="mb-10 text-center text-xs font-medium uppercase tracking-widest text-gray-400 dark:text-slate-500">
            So funktioniert's
          </p>
          <div className="grid gap-6 sm:grid-cols-3">
            {steps.map((step, i) => (
              <div key={i} className="flex flex-col items-center gap-3 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white text-2xl shadow-sm dark:border-white/10 dark:bg-white/5">
                  {step.icon}
                </div>
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                  {i + 1}
                </div>
                <p className="font-semibold text-gray-900 dark:text-white">{step.title}</p>
                <p className="text-sm leading-relaxed text-gray-500 dark:text-slate-500">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Feature Highlights                                                  */}
      {/* ------------------------------------------------------------------ */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <p className="mb-2 text-center text-xs font-medium uppercase tracking-widest text-gray-400 dark:text-slate-500">
          Warum AbiturTrainer?
        </p>
        <h2 className="mb-10 text-center text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
          Alles was du brauchst, nichts was du nicht brauchst.
        </h2>
        <div className="grid gap-5 sm:grid-cols-3">
          {features.map((f, i) => (
            <div
              key={i}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-colors hover:border-gray-300 dark:border-white/10 dark:bg-[#12141e] dark:hover:border-white/20"
            >
              <span className={`text-3xl ${f.accent}`}>{f.icon}</span>
              <p className="mt-3 font-semibold text-gray-900 dark:text-white">{f.title}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-gray-500 dark:text-slate-500">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Demo Section                                                        */}
      {/* ------------------------------------------------------------------ */}
      <section
        id="demo"
        className="scroll-mt-16 border-y border-gray-100 bg-gray-50 px-6 py-20 dark:border-white/5 dark:bg-white/[0.02]"
      >
        <div className="mx-auto max-w-5xl">
          <p className="mb-2 text-center text-xs font-medium uppercase tracking-widest text-gray-400 dark:text-slate-500">
            Live Demo
          </p>
          <h2 className="mb-10 text-center text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
            So sieht das KI-Feedback aus.
          </h2>

          <div className="grid gap-5 lg:grid-cols-2">
            {/* Left: question + canvas */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#12141e]">
              <p className="mb-3 text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-slate-500">
                Aufgabe — Analysis (10 BE)
              </p>
              <p className="text-sm leading-relaxed text-gray-700 dark:text-slate-200">
                Gegeben ist die Funktion{' '}
                <span className="rounded bg-gray-100 px-1 font-mono text-indigo-600 dark:bg-white/5 dark:text-indigo-300">
                  f(x) = e^(−2x) + 3x
                </span>
                .
              </p>
              <ul className="mt-4 flex flex-col gap-2 text-sm text-gray-600 dark:text-slate-300">
                <li className="flex gap-2">
                  <span className="shrink-0 font-medium text-gray-400 dark:text-slate-500">(a)</span>
                  Bestimme den maximalen Definitionsbereich. (3 BE)
                </li>
                <li className="flex gap-2">
                  <span className="shrink-0 font-medium text-gray-400 dark:text-slate-500">(b)</span>
                  Berechne die erste Ableitung f′(x). (4 BE)
                </li>
                <li className="flex gap-2">
                  <span className="shrink-0 font-medium text-gray-400 dark:text-slate-500">(c)</span>
                  Bestimme alle Nullstellen von f. (3 BE)
                </li>
              </ul>

              {/* Interactive mini canvas */}
              <DemoCanvas />
            </div>

            {/* Right: AI feedback */}
            <div className="rounded-xl border border-indigo-500/20 bg-white p-6 shadow-sm dark:bg-[#12141e]">
              <div className="mb-3 flex items-center gap-2">
                <p className="text-xs font-medium uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
                  KI-Korrektur
                </p>
                <span className="ml-auto rounded-full bg-amber-500/20 px-2 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-300">
                  5 / 10 BE
                </span>
              </div>
              <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-gray-600 dark:text-slate-300">
                {MOCK_FEEDBACK}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Subject Grid                                                        */}
      {/* ------------------------------------------------------------------ */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <p className="mb-2 text-center text-xs font-medium uppercase tracking-widest text-gray-400 dark:text-slate-500">
          Verfügbare Fächer
        </p>
        <h2 className="mb-10 text-center text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
          Wähle dein Fach.
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map((s) => (
            <SubjectCard key={s.to} {...s} />
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* CTA Banner                                                          */}
      {/* ------------------------------------------------------------------ */}
      <section className="border-t border-gray-100 bg-gradient-to-b from-indigo-50 to-transparent px-6 py-20 text-center dark:border-white/5 dark:from-indigo-950/30">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
          Bereit für das Abitur?
        </h2>
        <p className="mx-auto mt-3 max-w-sm text-gray-500 dark:text-slate-400">
          Starte jetzt – kostenlos, ohne Kreditkarte.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/register"
            className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-900/40 transition-colors hover:bg-indigo-500"
          >
            Kostenlos starten →
          </Link>
          <Link
            to="/login"
            className="rounded-lg border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-600 transition-colors hover:border-gray-300 hover:text-gray-900 dark:border-white/10 dark:text-slate-300 dark:hover:text-white"
          >
            Bereits registriert? Anmelden
          </Link>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Footer                                                              */}
      {/* ------------------------------------------------------------------ */}
      <footer className="border-t border-gray-100 px-6 py-8 dark:border-white/5">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4">
          <p className="text-sm font-semibold text-gray-900 dark:text-white">AbiturTrainer</p>
          <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-slate-600">
            <span>© 2026 AbiturTrainer</span>
            <a href="#" className="transition-colors hover:text-gray-600 dark:hover:text-slate-400">Datenschutz</a>
            <a href="#" className="transition-colors hover:text-gray-600 dark:hover:text-slate-400">Impressum</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------
export default function Landing() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
      </div>
    )
  }

  if (user) {
    const meta = user.user_metadata ?? {}
    const displayName = meta.display_name || meta.username || user.email?.split('@')[0] || 'du'
    return <LoggedInView displayName={displayName} />
  }

  return <GuestView />
}

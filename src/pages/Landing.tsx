import { Link } from 'react-router-dom'
import SubjectCard from '../components/SubjectCard'

const subjects = [
  {
    to: '/math',
    icon: '∑',
    title: 'Mathematik',
    description: 'Analysis, Stochastik, Geometrie – alle Themen des Lehrplans.',
    accent: 'bg-indigo-600/20 text-indigo-300',
    available: true,
  },
  {
    to: '/deutsch',
    icon: 'Aa',
    title: 'Deutsch',
    description: 'Textanalyse, Interpretation, Erörterung und Sprachreflexion.',
    accent: 'bg-emerald-600/20 text-emerald-300',
    available: false,
  },
  {
    to: '/englisch',
    icon: '🌐',
    title: 'Englisch',
    description: 'Reading comprehension, writing tasks und Grammatik.',
    accent: 'bg-sky-600/20 text-sky-300',
    available: false,
  },
  {
    to: '/physik',
    icon: '⚡',
    title: 'Physik',
    description: 'Mechanik, Elektrodynamik, Quantenphysik und mehr.',
    accent: 'bg-amber-600/20 text-amber-300',
    available: false,
  },
  {
    to: '/geschichte',
    icon: '📜',
    title: 'Geschichte',
    description: 'Epochen, Quellanalyse und politische Prozesse.',
    accent: 'bg-rose-600/20 text-rose-300',
    available: false,
  },
  {
    to: '/biologie',
    icon: '🧬',
    title: 'Biologie',
    description: 'Genetik, Ökologie, Evolution und Neurobiologie.',
    accent: 'bg-teal-600/20 text-teal-300',
    available: false,
  },
]

const steps = [
  {
    icon: '📝',
    title: 'Aufgabe wählen',
    description: 'Suche dir ein Themengebiet aus und wähle eine Aufgabe nach Schwierigkeitsgrad.',
  },
  {
    icon: '✏️',
    title: 'Lösung einreichen',
    description: 'Zeichne deine Lösung direkt im Browser oder lade ein Foto deines Heftes hoch.',
  },
  {
    icon: '🎯',
    title: 'KI-Feedback erhalten',
    description: 'Claude bewertet deine Antwort nach dem offiziellen bayerischen Erwartungshorizont.',
  },
]

const features = [
  {
    icon: '📋',
    title: 'Echter Erwartungshorizont',
    description:
      'Jede Aufgabe wird exakt nach dem ISB-Lehrplan bewertet – kein Raten, keine Approximationen.',
    accent: 'text-indigo-400',
  },
  {
    icon: '🪜',
    title: 'Schritt-für-Schritt Lernen',
    description:
      'Der Lernmodus erklärt Konzepte, Formeln und Musterlösungen – Schritt für Schritt aufgedeckt.',
    accent: 'text-violet-400',
  },
  {
    icon: '📊',
    title: 'Dein Fortschritt',
    description:
      'Behalte den Überblick: Welche Aufgaben hast du gemeistert, wo fehlen noch Punkte?',
    accent: 'text-emerald-400',
  },
]

const MOCK_FEEDBACK = `TEILAUFGABEN:
(a) 3/3 BE — Funktionsterm korrekt bestimmt, Definitionsbereich angegeben.
(b) 2/4 BE — Ableitungsregel angewendet, aber Kettenregel fehlt beim zweiten Summanden.
(c) 0/3 BE — Nullstellen nicht berechnet, nur geraten.

FEHLER:
- Kettenregel bei f'(x) vergessen: Das Ergebnis muss −2·e^(−2x) lauten, nicht −e^(−2x).
- Nullstellenberechnung fehlt vollständig – Ansatz f(x) = 0 nicht gesetzt.

HINWEISE:
- Für Aufgabe (b): Schreibe immer erst die Ableitungsregel auf, dann wende sie an.
- Für Aufgabe (c): Setze f(x) = 0 und löse die Gleichung algebraisch.`

export default function Landing() {
  return (
    <div className="overflow-x-hidden">
      {/* ------------------------------------------------------------------ */}
      {/* Hero                                                                */}
      {/* ------------------------------------------------------------------ */}
      <section className="relative mx-auto max-w-5xl px-6 pb-24 pt-20 text-center">
        {/* Glow blob — subtle in light mode */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 -z-10 h-72 w-[600px] -translate-x-1/2 rounded-full bg-indigo-400/10 blur-3xl dark:bg-indigo-600/20"
        />

        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm text-indigo-300">
          Bayern Abitur 2026
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
          Lern smarter,{' '}
          <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
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
          <a
            href="#demo"
            className="rounded-lg border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-600 transition-colors hover:border-gray-300 hover:text-gray-900 dark:border-white/10 dark:text-slate-300 dark:hover:border-white/20 dark:hover:text-white"
          >
            Demo ansehen
          </a>
        </div>

        <p className="mt-4 text-xs text-gray-400 dark:text-slate-600">
          Kein Account erforderlich · Basiert auf dem ISB-Lehrplan Bayern
        </p>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* How It Works                                                         */}
      {/* ------------------------------------------------------------------ */}
      <section className="border-y border-white/5 bg-white/[0.02] px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <p className="mb-10 text-center text-xs font-medium uppercase tracking-widest text-slate-500">
            So funktioniert's
          </p>
          <div className="grid gap-6 sm:grid-cols-3">
            {steps.map((step, i) => (
              <div key={i} className="flex flex-col items-center gap-3 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-2xl">
                  {step.icon}
                </div>
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                  {i + 1}
                </div>
                <p className="font-semibold text-white">{step.title}</p>
                <p className="text-sm leading-relaxed text-slate-500">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Feature Highlights                                                  */}
      {/* ------------------------------------------------------------------ */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <p className="mb-2 text-center text-xs font-medium uppercase tracking-widest text-slate-500">
          Warum AbiturTrainer?
        </p>
        <h2 className="mb-10 text-center text-2xl font-bold text-white sm:text-3xl">
          Alles was du brauchst, nichts was du nicht brauchst.
        </h2>
        <div className="grid gap-5 sm:grid-cols-3">
          {features.map((f, i) => (
            <div
              key={i}
              className="rounded-xl border border-white/10 bg-[#12141e] p-6 transition-colors hover:border-white/20"
            >
              <span className={`text-3xl ${f.accent}`}>{f.icon}</span>
              <p className="mt-3 font-semibold text-white">{f.title}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Demo Section                                                        */}
      {/* ------------------------------------------------------------------ */}
      <section
        id="demo"
        className="border-y border-white/5 bg-white/[0.02] px-6 py-20 scroll-mt-16"
      >
        <div className="mx-auto max-w-5xl">
          <p className="mb-2 text-center text-xs font-medium uppercase tracking-widest text-slate-500">
            Live Demo
          </p>
          <h2 className="mb-10 text-center text-2xl font-bold text-white sm:text-3xl">
            So sieht das KI-Feedback aus.
          </h2>

          <div className="grid gap-5 lg:grid-cols-2">
            {/* Left: question */}
            <div className="rounded-xl border border-white/10 bg-[#12141e] p-6">
              <p className="mb-3 text-xs font-medium uppercase tracking-wide text-slate-500">
                Aufgabe — Analysis (8 BE)
              </p>
              <p className="text-sm leading-relaxed text-slate-200">
                Gegeben ist die Funktion{' '}
                <span className="rounded bg-white/5 px-1 font-mono text-indigo-300">
                  f(x) = e^(−2x) + 3x
                </span>
                .
              </p>
              <ul className="mt-4 flex flex-col gap-2 text-sm text-slate-300">
                <li className="flex gap-2">
                  <span className="shrink-0 font-medium text-slate-500">(a)</span>
                  Bestimme den Funktionsterm und den maximalen Definitionsbereich. (3 BE)
                </li>
                <li className="flex gap-2">
                  <span className="shrink-0 font-medium text-slate-500">(b)</span>
                  Berechne die erste Ableitung f′(x). (4 BE)
                </li>
                <li className="flex gap-2">
                  <span className="shrink-0 font-medium text-slate-500">(c)</span>
                  Bestimme alle Nullstellen von f. (3 BE)
                </li>
              </ul>

              {/* Fake drawing area */}
              <div className="mt-5 flex h-28 items-center justify-center rounded-lg border border-dashed border-white/10 text-xs text-slate-600">
                [Handschriftliche Schülerlösung]
              </div>
            </div>

            {/* Right: AI feedback */}
            <div className="rounded-xl border border-indigo-500/20 bg-[#12141e] p-6">
              <div className="mb-3 flex items-center gap-2">
                <p className="text-xs font-medium uppercase tracking-wide text-indigo-400">
                  KI-Korrektur
                </p>
                <span className="ml-auto rounded-full bg-amber-500/20 px-2 py-0.5 text-xs font-medium text-amber-300">
                  5 / 10 BE
                </span>
              </div>
              <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-slate-300">
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
        <p className="mb-2 text-center text-xs font-medium uppercase tracking-widest text-slate-500">
          Verfügbare Fächer
        </p>
        <h2 className="mb-10 text-center text-2xl font-bold text-white sm:text-3xl">
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
      <section className="border-t border-white/5 bg-gradient-to-b from-indigo-950/30 to-transparent px-6 py-20 text-center">
        <h2 className="text-2xl font-bold text-white sm:text-3xl">
          Bereit für das Abitur?
        </h2>
        <p className="mx-auto mt-3 max-w-sm text-slate-400">
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
            to="/math"
            className="rounded-lg border border-white/10 px-6 py-3 text-sm font-semibold text-slate-300 transition-colors hover:text-white"
          >
            Direkt zu Mathematik
          </Link>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Footer                                                              */}
      {/* ------------------------------------------------------------------ */}
      <footer className="border-t border-white/5 px-6 py-8">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4">
          <p className="text-sm font-semibold text-white">AbiturTrainer</p>
          <div className="flex items-center gap-4 text-xs text-slate-600">
            <span>© 2026 AbiturTrainer</span>
            <a href="#" className="transition-colors hover:text-slate-400">
              Datenschutz
            </a>
            <a href="#" className="transition-colors hover:text-slate-400">
              Impressum
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

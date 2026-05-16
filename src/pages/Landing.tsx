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

export default function Landing() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      {/* Hero */}
      <div className="mb-16 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm text-indigo-300">
          Bayern Abitur 2026
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Lern smarter,{' '}
          <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            nicht länger.
          </span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-slate-400">
          Übe gezielt für das bayerische Abitur. Aufgaben nach Themengebiet, sofortiges Feedback,
          komplett kostenlos.
        </p>
      </div>

      {/* Subject grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {subjects.map((s) => (
          <SubjectCard key={s.to} {...s} />
        ))}
      </div>

      {/* Footer note */}
      <p className="mt-12 text-center text-xs text-slate-600">
        Kein Account erforderlich · Basiert auf dem ISB-Lehrplan Bayern
      </p>
    </div>
  )
}

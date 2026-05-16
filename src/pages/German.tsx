import { Link } from 'react-router-dom'

export default function German() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <Link to="/" className="mb-8 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-white">
        ← Zurück
      </Link>
      <div className="flex items-center gap-4 mb-10">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-600/20 text-2xl text-emerald-300">
          Aa
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Deutsch</h1>
          <p className="text-sm text-slate-400">Bayern Abitur · G9 Lehrplan</p>
        </div>
      </div>
      <div className="rounded-xl border border-white/10 bg-surface p-12 text-center">
        <p className="text-4xl mb-4">🚧</p>
        <h2 className="text-lg font-semibold text-white mb-2">Demnächst verfügbar</h2>
        <p className="text-sm text-slate-400">
          Der Deutsch-Trainer wird gerade vorbereitet. Schau bald wieder rein!
        </p>
      </div>
    </div>
  )
}

import { Link } from 'react-router-dom'

export default function English() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <Link to="/" className="mb-8 inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-900 dark:text-slate-500 dark:hover:text-white">
        ← Zurück
      </Link>
      <div className="flex items-center gap-4 mb-10">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-sky-600/20 text-2xl text-sky-600 dark:text-sky-300">
          🌐
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Englisch</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400">Bayern Abitur · G9 Lehrplan</p>
        </div>
      </div>
      <div className="rounded-xl border border-gray-200 bg-surface p-12 text-center dark:border-white/10">
        <p className="text-4xl mb-4">🚧</p>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Coming soon</h2>
        <p className="text-sm text-gray-500 dark:text-slate-400">
          The English trainer is being prepared. Check back soon!
        </p>
      </div>
    </div>
  )
}

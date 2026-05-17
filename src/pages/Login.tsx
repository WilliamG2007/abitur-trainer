import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error } = await signIn(email, password)
    setLoading(false)
    if (error) {
      setError(error)
    } else {
      navigate('/')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 text-lg font-black text-white">
            A
          </span>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Abitur<span className="text-indigo-500 dark:text-indigo-400">Trainer</span>
          </h1>
          <p className="text-sm text-gray-400 dark:text-slate-500">Bayern Abitur · G9 Lehrplan</p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-surface p-8 dark:border-white/10">
          <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">Anmelden</h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-500 dark:text-slate-400">E-Mail</label>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder-slate-600"
                placeholder="deine@email.de"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-500 dark:text-slate-400">Passwort</label>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder-slate-600"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-500 dark:text-red-400">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-1 rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 disabled:opacity-60"
            >
              {loading ? 'Wird angemeldet…' : 'Anmelden'}
            </button>
          </form>
        </div>

        <p className="mt-4 text-center text-sm text-gray-500 dark:text-slate-500">
          Noch kein Konto?{' '}
          <Link to="/register" className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
            Registrieren
          </Link>
        </p>
      </div>
    </div>
  )
}

import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [needsConfirmation, setNeedsConfirmation] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirm) {
      setError('Passwörter stimmen nicht überein.')
      return
    }
    if (password.length < 6) {
      setError('Passwort muss mindestens 6 Zeichen lang sein.')
      return
    }

    setLoading(true)
    const { error, needsConfirmation } = await signUp(email, password)
    setLoading(false)

    if (error) {
      setError(error)
    } else if (needsConfirmation) {
      setNeedsConfirmation(true)
    } else {
      navigate('/')
    }
  }

  if (needsConfirmation) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-sm text-center">
          <span className="text-4xl">📬</span>
          <h2 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">E-Mail bestätigen</h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">
            Wir haben dir einen Bestätigungslink an <strong className="text-gray-900 dark:text-white">{email}</strong> gesendet.
            Klicke auf den Link, um dein Konto zu aktivieren.
          </p>
          <Link to="/login" className="mt-6 inline-block text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
            Zurück zum Login
          </Link>
        </div>
      </div>
    )
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
          <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">Konto erstellen</h2>

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
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder-slate-600"
                placeholder="Mindestens 6 Zeichen"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-500 dark:text-slate-400">Passwort bestätigen</label>
              <input
                type="password"
                required
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
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
              {loading ? 'Wird registriert…' : 'Konto erstellen'}
            </button>
          </form>
        </div>

        <p className="mt-4 text-center text-sm text-gray-500 dark:text-slate-500">
          Bereits registriert?{' '}
          <Link to="/login" className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
            Anmelden
          </Link>
        </p>
      </div>
    </div>
  )
}

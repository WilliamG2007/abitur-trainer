import { useState, FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

export default function Profile() {
  const { user } = useAuth()

  const meta = user?.user_metadata ?? {}
  const [displayName, setDisplayName] = useState<string>(meta.display_name ?? '')
  const [username, setUsername] = useState<string>(meta.username ?? '')

  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSuccess(false)
    setError(null)

    const { error } = await supabase.auth.updateUser({
      data: { display_name: displayName.trim(), username: username.trim() },
    })

    setSaving(false)
    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
    }
  }

  return (
    <div className="mx-auto max-w-lg px-6 py-12">
      <Link to="/" className="mb-8 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-white">
        ← Zurück
      </Link>

      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-lg font-bold text-white">
          {(displayName || username || user?.email || '?')[0].toUpperCase()}
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Profil</h1>
          <p className="text-sm text-slate-400">Konto-Einstellungen</p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-surface p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-400">Anzeigename</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => { setDisplayName(e.target.value); setSuccess(false) }}
              placeholder="z. B. Max Mustermann"
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-600 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-400">Benutzername</label>
            <input
              type="text"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setSuccess(false) }}
              placeholder="z. B. maxmuster"
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-600 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-400">E-Mail</label>
            <input
              type="email"
              value={user?.email ?? ''}
              readOnly
              className="rounded-lg border border-white/5 bg-white/[0.03] px-3 py-2 text-sm text-slate-500 outline-none cursor-not-allowed"
            />
          </div>

          {error && (
            <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-400">
              {error}
            </p>
          )}
          {success && (
            <p className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-400">
              Profil gespeichert.
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 disabled:opacity-60"
          >
            {saving ? 'Wird gespeichert…' : 'Speichern'}
          </button>
        </form>
      </div>
    </div>
  )
}

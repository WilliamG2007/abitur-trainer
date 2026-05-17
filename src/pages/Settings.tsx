import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-base font-semibold text-white">{title}</h2>
      {subtitle && <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>}
    </div>
  )
}

function ToggleRow({ label, description }: { label: string; description: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-white/5 last:border-0">
      <div>
        <p className="text-sm text-slate-300">{label}</p>
        <p className="text-xs text-slate-600">{description}</p>
      </div>
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-slate-600">Demnächst</span>
        <div className="h-5 w-9 rounded-full bg-white/10 cursor-not-allowed opacity-40" />
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Account section (moved from Profile)
// ---------------------------------------------------------------------------
function AccountSection() {
  const { user } = useAuth()
  const navigate = useNavigate()
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

    const { data: { session }, error: sessionError } = await supabase.auth.refreshSession()
    if (sessionError || !session) {
      setError('Sitzung abgelaufen. Bitte erneut anmelden.')
      setSaving(false)
      setTimeout(() => navigate('/login'), 1500)
      return
    }

    const { error: updateError } = await supabase.auth.updateUser({
      data: { display_name: displayName.trim(), username: username.trim() },
    })
    setSaving(false)
    if (updateError) {
      setError(updateError.message)
    } else {
      setSuccess(true)
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-surface p-6">
      <SectionHeader title="Konto" subtitle="Änderungen werden sofort übernommen." />
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
            Gespeichert.
          </p>
        )}
        <button
          type="submit"
          disabled={saving}
          className="self-start rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 disabled:opacity-60"
        >
          {saving ? 'Wird gespeichert…' : 'Speichern'}
        </button>
      </form>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Notifications section (stub)
// ---------------------------------------------------------------------------
function NotificationsSection() {
  return (
    <div className="rounded-2xl border border-white/10 bg-surface p-6">
      <SectionHeader title="Benachrichtigungen" subtitle="Lege fest, wann du erinnert wirst." />
      <div>
        <ToggleRow
          label="E-Mail-Benachrichtigungen"
          description="Erhalte wöchentliche Lernzusammenfassungen per E-Mail."
        />
        <ToggleRow
          label="Lern-Erinnerungen"
          description="Tägliche Push-Erinnerungen zum Üben."
        />
        <ToggleRow
          label="Neue Aufgaben"
          description="Benachrichtigung wenn neue Abituraufgaben verfügbar sind."
        />
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Subscription section (stub)
// ---------------------------------------------------------------------------
function SubscriptionSection() {
  return (
    <div className="rounded-2xl border border-white/10 bg-surface p-6">
      <SectionHeader title="Abonnement" />
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-white">Aktueller Plan</p>
            <span className="rounded-full bg-slate-700 px-2 py-0.5 text-xs font-medium text-slate-300">
              Kostenlos
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Zugriff auf alle kostenlosen Aufgaben. Upgrade für vollständigen Zugang.
          </p>
        </div>
        <button
          disabled
          className="shrink-0 rounded-lg bg-indigo-600/40 px-4 py-2 text-sm font-semibold text-indigo-300 cursor-not-allowed opacity-60"
        >
          Upgrade zu Pro
        </button>
      </div>
      <div className="mt-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4">
        <p className="text-xs font-medium text-indigo-300">Pro — demnächst verfügbar</p>
        <ul className="mt-2 space-y-1 text-xs text-slate-400">
          <li>✓ Alle 240 Aufgaben freigeschaltet</li>
          <li>✓ Detaillierte KI-Auswertungen</li>
          <li>✓ Unbegrenzte Einreichungen</li>
          <li>✓ Fortschrittsexport als PDF</li>
        </ul>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Danger zone
// ---------------------------------------------------------------------------
function DangerZone() {
  return (
    <div className="rounded-2xl border border-red-500/20 bg-surface p-6">
      <SectionHeader
        title="Gefahrenzone"
        subtitle="Diese Aktionen können nicht rückgängig gemacht werden."
      />
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-300">Account löschen</p>
          <p className="text-xs text-slate-600">
            Löscht deinen Account und alle deine Daten dauerhaft.
          </p>
        </div>
        <button
          disabled
          className="shrink-0 rounded-lg border border-red-500/40 px-4 py-2 text-sm font-medium text-red-400 cursor-not-allowed opacity-50"
        >
          Account löschen
        </button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function Settings() {
  const { user } = useAuth()
  const meta = user?.user_metadata ?? {}
  const displayLabel = meta.display_name || meta.username || user?.email || '?'

  return (
    <div className="mx-auto max-w-lg px-6 py-12">
      <Link to="/profile" className="mb-8 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-white">
        ← Zurück zum Profil
      </Link>

      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-lg font-bold text-white">
          {displayLabel[0]?.toUpperCase() ?? '?'}
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Einstellungen</h1>
          <p className="text-sm text-slate-400">Konto & Präferenzen</p>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <AccountSection />
        <NotificationsSection />
        <SubscriptionSection />
        <DangerZone />
      </div>
    </div>
  )
}

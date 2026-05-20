import { useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../hooks/useTheme'

const links = [
  { to: '/math', label: 'Mathematik' },
  { to: '/deutsch', label: 'Deutsch' },
  { to: '/englisch', label: 'Englisch' },
  { to: '/physik', label: 'Physik' },
  { to: '/geschichte', label: 'Geschichte' },
]

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  return (
    <button
      onClick={toggleTheme}
      title={theme === 'dark' ? 'Zu hellem Modus wechseln' : 'Zu dunklem Modus wechseln'}
      className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:border-gray-300 hover:text-gray-900 dark:border-white/10 dark:text-slate-400 dark:hover:border-white/20 dark:hover:text-white"
    >
      {theme === 'dark' ? (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <circle cx="12" cy="12" r="5" />
          <path strokeLinecap="round" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      ) : (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
        </svg>
      )}
    </button>
  )
}

function UserMenu() {
  const { user, signOut } = useAuth()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const meta = user?.user_metadata ?? {}
  const displayLabel = meta.display_name || meta.username || user?.email || ''
  const initial = displayLabel[0]?.toUpperCase() ?? '?'

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-lg border border-gray-200 py-1.5 pl-1.5 pr-3 text-sm transition-colors hover:border-gray-300 hover:bg-gray-50 dark:border-white/10 dark:hover:border-white/20 dark:hover:bg-white/5"
        aria-label="Benutzermenü"
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
          {initial}
        </span>
        <span className="hidden max-w-[120px] truncate text-xs text-gray-600 dark:text-slate-300 md:block">
          {displayLabel}
        </span>
        <svg
          className={`h-3 w-3 text-gray-400 dark:text-slate-500 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-52 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl dark:border-white/10 dark:bg-[#1a1d27]">
          <div className="border-b border-gray-100 px-4 py-3 dark:border-white/5">
            <p className="truncate text-xs font-medium text-gray-900 dark:text-white">
              {meta.display_name || meta.username || 'Kein Name gesetzt'}
            </p>
            <p className="truncate text-xs text-gray-500 dark:text-slate-500">{user?.email}</p>
          </div>
          <div className="p-1">
            <Link to="/profile" onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white">
              <span>👤</span> Profil
            </Link>
            <Link to="/analytics" onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white">
              <span>📊</span> Statistiken
            </Link>
            <Link to="/settings" onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white">
              <span>⚙️</span> Einstellungen
            </Link>
            <button
              onClick={() => { setOpen(false); signOut() }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white"
            >
              <span>🚪</span> Abmelden
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function GuestButtons() {
  return (
    <div className="flex items-center gap-2">
      <NavLink
        to="/pricing"
        className={({ isActive }) =>
          `rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            isActive
              ? 'text-indigo-600 dark:text-indigo-400'
              : 'text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white'
          }`
        }
      >
        Preise
      </NavLink>
      <Link
        to="/login"
        className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-slate-300 dark:hover:text-white"
      >
        Anmelden
      </Link>
      <Link
        to="/register"
        className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
      >
        Registrieren
      </Link>
    </div>
  )
}

export default function Navbar() {
  const { user, loading } = useAuth()

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-white/10 dark:bg-[#0f1117]/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <NavLink to="/" className="flex items-center gap-2 text-lg font-bold tracking-tight text-gray-900 dark:text-white">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-600 text-sm font-black text-white">
            A
          </span>
          Abitur<span className="text-indigo-500 dark:text-indigo-400">Trainer</span>
        </NavLink>

        {/* Subject nav — only shown when logged in */}
        {user && (
          <nav className="hidden items-center gap-1 md:flex">
            {links.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
            <NavLink
              to="/pricing"
              className={({ isActive }) =>
                `rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white'
                }`
              }
            >
              Preise
            </NavLink>
          </nav>
        )}

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {!loading && (user ? <UserMenu /> : <GuestButtons />)}
        </div>
      </div>
    </header>
  )
}

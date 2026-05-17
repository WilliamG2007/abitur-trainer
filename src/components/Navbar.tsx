import { useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const links = [
  { to: '/math', label: 'Mathematik' },
  { to: '/deutsch', label: 'Deutsch' },
  { to: '/englisch', label: 'Englisch' },
  { to: '/physik', label: 'Physik' },
  { to: '/geschichte', label: 'Geschichte' },
]

function UserMenu() {
  const { user, signOut } = useAuth()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Close on outside click
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
        className="flex items-center gap-2 rounded-lg border border-white/10 py-1.5 pl-1.5 pr-3 text-sm transition-colors hover:border-white/20 hover:bg-white/5"
        aria-label="Benutzermenü"
      >
        {/* Avatar */}
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
          {initial}
        </span>
        <span className="hidden max-w-[120px] truncate text-xs text-slate-300 md:block">
          {displayLabel}
        </span>
        <svg
          className={`h-3 w-3 text-slate-500 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-52 overflow-hidden rounded-xl border border-white/10 bg-[#1a1d27] shadow-xl">
          {/* Identity header */}
          <div className="border-b border-white/5 px-4 py-3">
            <p className="text-xs font-medium text-white truncate">
              {meta.display_name || meta.username || 'Kein Name gesetzt'}
            </p>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          </div>

          {/* Actions */}
          <div className="p-1">
            <Link
              to="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
            >
              <span>👤</span> Profil
            </Link>
            <Link
              to="/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
            >
              <span>⚙️</span> Einstellungen
            </Link>
            <button
              onClick={() => { setOpen(false); signOut() }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
            >
              <span>🚪</span> Abmelden
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-base/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <NavLink to="/" className="flex items-center gap-2 text-lg font-bold tracking-tight text-white">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-600 text-sm font-black">
            A
          </span>
          Abitur<span className="text-indigo-400">Trainer</span>
        </NavLink>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <UserMenu />
      </div>
    </header>
  )
}

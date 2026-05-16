import { NavLink } from 'react-router-dom'

const links = [
  { to: '/math', label: 'Mathematik' },
  { to: '/deutsch', label: 'Deutsch' },
  { to: '/englisch', label: 'Englisch' },
  { to: '/physik', label: 'Physik' },
  { to: '/geschichte', label: 'Geschichte' },
]

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

        {/* Mobile: simple label */}
        <nav className="flex items-center gap-1 md:hidden">
          <span className="text-xs text-slate-500">Bayern 2026</span>
        </nav>
      </div>
    </header>
  )
}

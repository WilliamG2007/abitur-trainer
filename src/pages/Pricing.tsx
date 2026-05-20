import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// ── Helpers ──────────────────────────────────────────────────────────────────

function Check() {
  return (
    <svg className="h-4 w-4 shrink-0 text-emerald-500" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Cross() {
  return (
    <svg className="h-4 w-4 shrink-0 text-gray-300 dark:text-slate-700" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6 6l4 4M10 6l-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      className={`h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200 dark:text-slate-500 ${open ? 'rotate-180' : ''}`}
      viewBox="0 0 16 16" fill="none"
    >
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ── Feature row ───────────────────────────────────────────────────────────────

function Feature({ text, included }: { text: string; included: boolean }) {
  return (
    <li className="flex items-start gap-2.5">
      {included ? <Check /> : <Cross />}
      <span className={`text-sm ${included ? 'text-gray-700 dark:text-slate-300' : 'text-gray-400 dark:text-slate-600'}`}>
        {text}
      </span>
    </li>
  )
}

// ── Pricing cards ─────────────────────────────────────────────────────────────

interface PlanProps {
  label: string
  badge?: string
  price: string
  billing: string
  features: { text: string; included: boolean }[]
  ctaLabel: string
  ctaTo: string
  highlighted?: boolean
}

function PlanCard({ label, badge, price, billing, features, ctaLabel, ctaTo, highlighted }: PlanProps) {
  const { user } = useAuth()
  const dest = ctaTo === '/register' && user ? '/math' : ctaTo

  return (
    <div
      className={`relative flex flex-col rounded-2xl border p-7 transition-all duration-200 ${
        highlighted
          ? 'border-indigo-500 bg-indigo-600/5 shadow-xl shadow-indigo-500/10 dark:bg-indigo-500/5 scale-[1.03]'
          : 'border-gray-200 bg-white hover:border-gray-300 dark:border-white/10 dark:bg-surface dark:hover:border-white/20'
      }`}
    >
      {/* Badge */}
      {badge && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-3 py-0.5 text-xs font-semibold text-white shadow">
          {badge}
        </span>
      )}

      {/* Plan name */}
      <p className={`text-xs font-semibold uppercase tracking-widest ${highlighted ? 'text-indigo-500 dark:text-indigo-400' : 'text-gray-400 dark:text-slate-500'}`}>
        {label}
      </p>

      {/* Price */}
      <div className="mt-4 flex items-end gap-1">
        <span className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">{price}</span>
        <span className="mb-1 text-sm text-gray-400 dark:text-slate-500">{billing}</span>
      </div>

      {/* Divider */}
      <div className="my-6 h-px w-full bg-gray-100 dark:bg-white/5" />

      {/* Features */}
      <ul className="flex flex-col gap-3">
        {features.map((f) => (
          <Feature key={f.text} text={f.text} included={f.included} />
        ))}
      </ul>

      {/* CTA */}
      <Link
        to={dest}
        className={`mt-8 block rounded-xl py-2.5 text-center text-sm font-semibold transition-colors ${
          highlighted
            ? 'bg-indigo-600 text-white hover:bg-indigo-500'
            : 'border border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50 dark:border-white/10 dark:text-slate-300 dark:hover:border-white/20 dark:hover:bg-white/5'
        }`}
      >
        {ctaLabel}
      </Link>
    </div>
  )
}

// ── FAQ accordion ─────────────────────────────────────────────────────────────

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-gray-100 dark:border-white/5">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 py-4 text-left"
      >
        <span className="text-sm font-medium text-gray-900 dark:text-white">{q}</span>
        <Chevron open={open} />
      </button>
      {open && (
        <p className="pb-4 text-sm leading-relaxed text-gray-500 dark:text-slate-400">{a}</p>
      )}
    </div>
  )
}

// ── Data ──────────────────────────────────────────────────────────────────────

const plans: PlanProps[] = [
  {
    label: 'Kostenlos',
    price: '€0',
    billing: 'Für immer',
    features: [
      { text: '30 Bewertungen / Monat', included: true },
      { text: 'Learn Mode (alle Kapitel)', included: true },
      { text: 'Basis-Statistiken', included: true },
      { text: 'Analysis + Stochastik Fragen', included: true },
      { text: 'Alle Fächer & Fragen', included: false },
      { text: 'Priority Support', included: false },
    ],
    ctaLabel: 'Kostenlos starten',
    ctaTo: '/register',
  },
  {
    label: 'Pro',
    badge: 'Beliebt',
    price: '€4,99',
    billing: '/Monat',
    highlighted: true,
    features: [
      { text: '100 Bewertungen / Monat', included: true },
      { text: 'Alle verfügbaren Fächer & Fragen', included: true },
      { text: 'Detaillierte Statistiken', included: true },
      { text: 'Fortschrittsberichte', included: true },
      { text: 'Email Support', included: true },
      { text: 'Unlimited Bewertungen', included: false },
    ],
    ctaLabel: 'Pro starten',
    ctaTo: '/register',
  },
  {
    label: 'Premium',
    price: '€9,99',
    billing: '/Monat',
    features: [
      { text: '1.000 Bewertungen / Monat', included: true },
      { text: 'Alle Inhalte', included: true },
      { text: 'Erweiterte Analysen', included: true },
      { text: 'Early Access zu neuen Fächern', included: true },
      { text: 'Priority Support', included: true },
      { text: 'Extra Bewertungen kaufbar (€0,02 / Stk.)', included: true },
    ],
    ctaLabel: 'Premium starten',
    ctaTo: '/register',
  },
]

const faqs = [
  {
    q: 'Kann ich mein Abo jederzeit kündigen?',
    a: 'Ja, jederzeit ohne Bindung. Du kannst direkt in deinen Kontoeinstellungen kündigen – keine Kündigungsfristen, keine versteckten Gebühren.',
  },
  {
    q: 'Was passiert, wenn mein Bewertungslimit aufgebraucht ist?',
    a: 'Du kannst entweder warten bis zum nächsten Monat, ein Upgrade auf einen höheren Plan durchführen oder – als Premium-Nutzer – zusätzliche Bewertungen einzeln kaufen.',
  },
  {
    q: 'Gibt es eine Testversion von Pro oder Premium?',
    a: 'Keine zeitlich begrenzte Testversion, aber der kostenlose Plan mit 30 Bewertungen pro Monat gibt dir einen guten Eindruck der Plattform. Kein Risiko.',
  },
  {
    q: 'Welche Zahlungsmethoden werden akzeptiert?',
    a: 'Visa, Mastercard, Apple Pay und Google Pay – sicher verarbeitet über Stripe. Deine Zahlungsdaten verlassen nie deinen Browser unverschlüsselt.',
  },
]

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Pricing() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0d0f18]">
      <div className="mx-auto max-w-5xl px-6 py-20">

        {/* ── Hero ── */}
        <div className="mb-16 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Einfache, transparente Preise
          </h1>
          <p className="mt-4 text-lg text-gray-500 dark:text-slate-400">
            Wähle den Plan, der zu dir passt.
          </p>
        </div>

        {/* ── Cards ── */}
        <div className="mb-20 grid gap-6 sm:grid-cols-3 items-start">
          {plans.map((plan) => (
            <PlanCard key={plan.label} {...plan} />
          ))}
        </div>

        {/* ── Extra usage box ── */}
        <div className="mb-20 overflow-hidden rounded-2xl border border-violet-500/30 bg-violet-600/5 dark:bg-violet-500/5">
          <div className="flex flex-col gap-4 p-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-violet-500 dark:text-violet-400">
                Premium-Feature
              </p>
              <h2 className="mt-2 text-lg font-bold text-gray-900 dark:text-white">
                Bewertungen aufgebraucht?
              </h2>
              <p className="mt-1 max-w-md text-sm text-gray-500 dark:text-slate-400">
                Premium-Nutzer können jederzeit zusätzliche Bewertungen kaufen – ohne Monatsreset abzuwarten.
                Flexibel, günstig, sofort verfügbar.
              </p>
            </div>
            <div className="flex flex-col items-start gap-3 sm:items-end">
              <div className="rounded-xl border border-violet-500/30 bg-white px-6 py-4 text-center dark:bg-white/[0.03]">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">€0,20</p>
                <p className="mt-0.5 text-xs text-gray-500 dark:text-slate-500">10er-Pack Bewertungen</p>
              </div>
              <p className="text-xs text-violet-500 dark:text-violet-400">Nur für Premium · via Stripe</p>
            </div>
          </div>
        </div>

        {/* ── FAQ ── */}
        <div className="mb-20">
          <h2 className="mb-8 text-center text-2xl font-bold text-gray-900 dark:text-white">
            Häufige Fragen
          </h2>
          <div className="mx-auto max-w-2xl divide-y divide-gray-100 rounded-2xl border border-gray-100 bg-white px-6 dark:divide-white/5 dark:border-white/10 dark:bg-surface">
            {faqs.map((faq) => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>

        {/* ── Footer CTA ── */}
        <div className="rounded-2xl border border-gray-100 bg-gray-50 px-8 py-12 text-center dark:border-white/10 dark:bg-white/[0.02]">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Bereit anzufangen?</h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">
            Wähle deinen Plan oben oder teste AbiturTrainer kostenlos – kein Risiko.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/register"
              className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
            >
              Kostenlos starten
            </Link>
            <Link
              to="/math"
              className="rounded-xl border border-gray-200 px-6 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:border-gray-300 hover:text-gray-900 dark:border-white/10 dark:text-slate-300 dark:hover:border-white/20 dark:hover:text-white"
            >
              Aufgaben ansehen →
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}

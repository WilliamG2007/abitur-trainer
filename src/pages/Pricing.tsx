import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import PricingToggle, { type Period, PERIOD_META } from '../components/PricingToggle'

// ── Shared icons ─────────────────────────────────────────────────────────────

function Check() {
  return (
    <svg className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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

// ── Pricing data ──────────────────────────────────────────────────────────────

interface TierPricing {
  monthly: { total: string; perMonth: string }
  '3m':    { total: string; perMonth: string }
  '6m':    { total: string; perMonth: string }
  '12m':   { total: string; perMonth: string }
  baseMonthlyNum: number   // for computing savings
}

interface Tier {
  id: string
  label: string
  badge?: string
  highlighted?: boolean
  includesLabel?: string
  features: string[]
  ctaLabel: string
  pricing: TierPricing | null   // null = free
}

const TIERS: Tier[] = [
  {
    id: 'free',
    label: 'Kostenlos',
    features: [
      '30 Bewertungen/Monat',
      'Learn Mode (alle Themen)',
      'Basis-Statistiken',
      'Email Support',
    ],
    ctaLabel: 'Kostenlos starten',
    pricing: null,
  },
  {
    id: 'pro',
    label: 'Pro',
    badge: 'Beliebt',
    highlighted: true,
    includesLabel: 'Alles von Kostenlos +',
    features: [
      '150 Bewertungen/Monat',
      'Alle Themen & Fragen',
      'Basis-Fortschrittsberichte',
      'Priority Email Support',
    ],
    ctaLabel: 'Pro starten',
    pricing: {
      baseMonthlyNum: 4.99,
      monthly: { total: '€4,99', perMonth: '€4,99/Monat' },
      '3m':    { total: '€14,24', perMonth: '€4,75/Monat' },
      '6m':    { total: '€26,94', perMonth: '€4,49/Monat' },
      '12m':   { total: '€47,99', perMonth: '€3,99/Monat' },
    },
  },
  {
    id: 'premium',
    label: 'Premium',
    includesLabel: 'Alles von Pro +',
    features: [
      '300 Bewertungen/Monat',
      'Erweiterte Analysen (nach Thema)',
      'Detaillierte Fortschrittsberichte',
      'Priority Email Support',
    ],
    ctaLabel: 'Premium starten',
    pricing: {
      baseMonthlyNum: 7.99,
      monthly: { total: '€7,99', perMonth: '€7,99/Monat' },
      '3m':    { total: '€22,79', perMonth: '€7,60/Monat' },
      '6m':    { total: '€43,14', perMonth: '€7,19/Monat' },
      '12m':   { total: '€76,79', perMonth: '€6,40/Monat' },
    },
  },
  {
    id: 'ultra',
    label: 'Ultra',
    includesLabel: 'Alles von Premium +',
    features: [
      '500 Bewertungen/Monat',
      'Wöchentliche Analysen & Berichte',
      'Early Access zu neuen Fächern',
      'Erweiterter Fragenkatalog',
      'Super Priority Support',
    ],
    ctaLabel: 'Ultra starten',
    pricing: {
      baseMonthlyNum: 11.99,
      monthly: { total: '€11,99', perMonth: '€11,99/Monat' },
      '3m':    { total: '€34,24', perMonth: '€11,41/Monat' },
      '6m':    { total: '€64,74', perMonth: '€10,79/Monat' },
      '12m':   { total: '€114,99', perMonth: '€9,58/Monat' },
    },
  },
  {
    id: 'unlimited',
    label: 'Unlimited',
    includesLabel: 'Alles von Ultra +',
    features: [
      'Unbegrenzte Bewertungen',
      'Vollständige Mock-Abiturprüfungen',
      'Exam Score Predictions',
      'VIP Super Priority Support',
    ],
    ctaLabel: 'Unlimited starten',
    pricing: {
      baseMonthlyNum: 15.99,
      monthly: { total: '€15,99', perMonth: '€15,99/Monat' },
      '3m':    { total: '€45,74', perMonth: '€15,25/Monat' },
      '6m':    { total: '€86,34', perMonth: '€14,39/Monat' },
      '12m':   { total: '€153,59', perMonth: '€12,80/Monat' },
    },
  },
]

// ── Savings computation ───────────────────────────────────────────────────────

function fmtEur(n: number): string {
  return '€' + n.toFixed(2).replace('.', ',')
}

function computeSavings(tier: Tier, period: Period): { pct: number; amount: string } | null {
  if (!tier.pricing || period === 'monthly') return null
  const { months, discPct } = PERIOD_META[period]
  const saved = tier.pricing.baseMonthlyNum * months * (discPct / 100)
  return { pct: discPct, amount: fmtEur(saved) }
}

// ── Plan card ─────────────────────────────────────────────────────────────────

function PlanCard({ tier, period }: { tier: Tier; period: Period }) {
  const { user } = useAuth()
  const dest = user ? '/math' : '/register'
  const savings = computeSavings(tier, period)
  const p = tier.pricing
  const isFree = !p

  return (
    <div
      className={`relative flex flex-col rounded-2xl border transition-all duration-200 ${
        tier.highlighted
          ? 'border-indigo-500 bg-indigo-600/5 shadow-xl shadow-indigo-500/10 dark:bg-indigo-500/5'
          : 'border-gray-200 bg-white hover:border-gray-300 dark:border-white/10 dark:bg-surface dark:hover:border-white/20'
      }`}
    >
      {/* Badge */}
      {tier.badge && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-indigo-600 px-3 py-0.5 text-xs font-semibold text-white shadow">
          {tier.badge}
        </span>
      )}

      <div className="flex flex-1 flex-col p-5">
        {/* Tier name */}
        <p className={`text-xs font-semibold uppercase tracking-widest ${tier.highlighted ? 'text-indigo-500 dark:text-indigo-400' : 'text-gray-400 dark:text-slate-500'}`}>
          {tier.label}
        </p>

        {/* Price block */}
        {isFree ? (
          <div className="mt-3">
            <div className="flex items-end gap-1">
              <span className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">€0</span>
            </div>
            <p className="mt-1 text-xs text-gray-400 dark:text-slate-500">Für immer kostenlos</p>
          </div>
        ) : (
          <div className="mt-3">
            {period === 'monthly' ? (
              <>
                <div className="flex items-end gap-1">
                  <span className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{p.monthly.total}</span>
                </div>
                <p className="mt-1 text-xs text-gray-400 dark:text-slate-500">/Monat</p>
              </>
            ) : (
              <>
                <div className="flex items-end gap-1">
                  <span className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{p[period].total}</span>
                </div>
                <p className="mt-1 text-xs text-gray-400 dark:text-slate-500">{p[period].perMonth}</p>
                {savings && (
                  <p className="mt-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    Sparen Sie {savings.pct}% ({savings.amount})
                  </p>
                )}
              </>
            )}
          </div>
        )}

        {/* Divider */}
        <div className="my-5 h-px w-full bg-gray-100 dark:bg-white/5" />

        {/* "Includes all of X" */}
        {tier.includesLabel && (
          <p className="mb-3 text-xs font-medium text-gray-400 dark:text-slate-500 italic">
            {tier.includesLabel}
          </p>
        )}

        {/* Features */}
        <ul className="flex flex-1 flex-col gap-2.5">
          {tier.features.map((f) => (
            <li key={f} className="flex items-start gap-2">
              <Check />
              <span className="text-xs text-gray-700 dark:text-slate-300">{f}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Link
          to={dest}
          className={`mt-6 block rounded-xl py-2.5 text-center text-sm font-semibold transition-colors ${
            tier.highlighted
              ? 'bg-indigo-600 text-white hover:bg-indigo-500'
              : 'border border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50 dark:border-white/10 dark:text-slate-300 dark:hover:border-white/20 dark:hover:bg-white/5'
          }`}
        >
          {tier.ctaLabel}
        </Link>
      </div>
    </div>
  )
}

// ── FAQ ───────────────────────────────────────────────────────────────────────

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
  const [period, setPeriod] = useState<Period>('monthly')

  return (
    <div className="min-h-screen bg-white dark:bg-[#0d0f18]">

      {/* ── Hero (untouched) ── */}
      <div className="mx-auto max-w-5xl px-6 pt-20 pb-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Einfache, transparente Preise
          </h1>
          <p className="mt-4 text-lg text-gray-500 dark:text-slate-400">
            Wähle den Plan, der zu dir passt.
          </p>
        </div>
      </div>

      {/* ── Toggle ── */}
      <div className="mx-auto max-w-5xl px-6 pb-10">
        <PricingToggle period={period} onChange={setPeriod} />
      </div>

      {/* ── Cards ── */}
      <div className="mx-auto max-w-7xl px-6 pb-20">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {TIERS.map((tier) => (
            <PlanCard key={tier.id} tier={tier} period={period} />
          ))}
        </div>
      </div>

      {/* ── FAQ (untouched) ── */}
      <div className="mx-auto max-w-5xl px-6 pb-20">
        <h2 className="mb-8 text-center text-2xl font-bold text-gray-900 dark:text-white">
          Häufige Fragen
        </h2>
        <div className="mx-auto max-w-2xl divide-y divide-gray-100 rounded-2xl border border-gray-100 bg-white px-6 dark:divide-white/5 dark:border-white/10 dark:bg-surface">
          {faqs.map((faq) => (
            <FaqItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </div>
      </div>

      {/* ── Footer CTA (untouched) ── */}
      <div className="mx-auto max-w-5xl px-6 pb-20">
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

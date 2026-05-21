import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import PricingToggle, { type Period, PERIOD_META } from '../components/PricingToggle'

// ── Icons ─────────────────────────────────────────────────────────────────────

function Check() {
  return (
    <svg className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" viewBox="0 0 16 16" fill="none">
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

// ── Price computation ─────────────────────────────────────────────────────────

function roundDown(n: number): number {
  // Round down to nearest x.49 or x.99
  return Math.floor(n * 2) / 2 - 0.01
}

function fmtEur(n: number): string {
  return '€\u202f' + n.toFixed(2).replace('.', ',')
}

interface ComputedPrice {
  totalDisplay: string
  savedDisplay: string | null
  discPct: number
}

function computePrice(baseMonthly: number, period: Period): ComputedPrice {
  const { months, discPct } = PERIOD_META[period]
  if (period === 'monthly') {
    return {
      totalDisplay: fmtEur(baseMonthly),
      savedDisplay: null,
      discPct: 0,
    }
  }
  const raw = baseMonthly * months * (1 - discPct / 100)
  const total = roundDown(raw)
  const saved = baseMonthly * months - total
  return {
    totalDisplay: fmtEur(total),
    savedDisplay: fmtEur(Math.max(0, saved)),
    discPct,
  }
}

// ── Particles (Unlimited intro) ───────────────────────────────────────────────

const PARTICLE_COLORS = ['#e879f9', '#ec4899', '#a855f7', '#f472b6', '#c084fc']
const PARTICLES = [
  { id: 0,  left: '8%',  bottom: '18%', delay: '0.00s', size: 4, dur: '1.10s' },
  { id: 1,  left: '18%', bottom: '12%', delay: '0.18s', size: 3, dur: '0.90s' },
  { id: 2,  left: '30%', bottom: '28%', delay: '0.32s', size: 5, dur: '1.20s' },
  { id: 3,  left: '45%', bottom: '8%',  delay: '0.07s', size: 4, dur: '1.00s' },
  { id: 4,  left: '60%', bottom: '22%', delay: '0.22s', size: 3, dur: '0.85s' },
  { id: 5,  left: '72%', bottom: '32%', delay: '0.42s', size: 5, dur: '1.15s' },
  { id: 6,  left: '85%', bottom: '14%', delay: '0.12s', size: 4, dur: '1.00s' },
  { id: 7,  left: '92%', bottom: '24%', delay: '0.38s', size: 3, dur: '0.90s' },
  { id: 8,  left: '25%', bottom: '42%', delay: '0.52s', size: 4, dur: '1.10s' },
  { id: 9,  left: '55%', bottom: '36%', delay: '0.28s', size: 3, dur: '0.95s' },
  { id: 10, left: '70%', bottom: '8%',  delay: '0.48s', size: 5, dur: '1.20s' },
  { id: 11, left: '40%', bottom: '30%', delay: '0.62s', size: 3, dur: '0.80s' },
]

function ParticleBurst() {
  return (
    <>
      {PARTICLES.map((p) => (
        <span
          key={p.id}
          className="pointer-events-none absolute rounded-full"
          style={{
            left: p.left,
            bottom: p.bottom,
            width: p.size,
            height: p.size,
            background: PARTICLE_COLORS[p.id % PARTICLE_COLORS.length],
            animation: `float-particle ${p.dur} ${p.delay} ease-out infinite`,
            boxShadow: `0 0 ${p.size * 2}px ${PARTICLE_COLORS[p.id % PARTICLE_COLORS.length]}`,
          }}
        />
      ))}
    </>
  )
}

// ── Tier data ─────────────────────────────────────────────────────────────────

interface Tier {
  id: string
  label: string
  badge?: string
  accent: { border: string; glow: string; badge: string; label: string; cta: string; ctaHover: string; ctaText: string }
  includesLabel?: string
  features: string[]
  ctaLabel: string
  baseMonthly: number | null
}

const TIERS: Tier[] = [
  {
    id: 'free',
    label: 'Kostenlos',
    accent: {
      border:   'border-gray-300 dark:border-white/20',
      glow:     '',
      badge:    '',
      label:    'text-gray-400 dark:text-slate-500',
      cta:      'border border-gray-200 dark:border-white/15',
      ctaHover: 'hover:bg-gray-50 dark:hover:bg-white/5',
      ctaText:  'text-gray-700 dark:text-slate-300',
    },
    features: [
      '30 Bewertungen/Monat',
      'Learn Mode (alle Themen)',
      'Basis-Statistiken',
      'Email Support',
    ],
    ctaLabel: 'Kostenlos starten',
    baseMonthly: null,
  },
  {
    id: 'pro',
    label: 'Pro',
    badge: 'Beliebt',
    accent: {
      border:   'border-indigo-500',
      glow:     'shadow-xl shadow-indigo-500/20',
      badge:    'bg-indigo-600 text-white',
      label:    'text-indigo-500 dark:text-indigo-400',
      cta:      'bg-indigo-600',
      ctaHover: 'hover:bg-indigo-500',
      ctaText:  'text-white',
    },
    includesLabel: 'Alles von Kostenlos +',
    features: [
      '150 Bewertungen/Monat',
      'Alle Themen & Fragen',
      'Basis-Fortschrittsberichte',
      'Priority Email Support',
    ],
    ctaLabel: 'Pro starten',
    baseMonthly: 4.99,
  },
  {
    id: 'premium',
    label: 'Premium',
    accent: {
      border:   'border-violet-500/50 dark:border-violet-500/40',
      glow:     'shadow-lg shadow-violet-500/10',
      badge:    '',
      label:    'text-violet-500 dark:text-violet-400',
      cta:      'bg-violet-600',
      ctaHover: 'hover:bg-violet-500',
      ctaText:  'text-white',
    },
    includesLabel: 'Alles von Pro +',
    features: [
      '300 Bewertungen/Monat',
      'Erweiterte Analysen (nach Thema)',
      'Detaillierte Fortschrittsberichte',
      'Priority Email Support',
    ],
    ctaLabel: 'Premium starten',
    baseMonthly: 7.99,
  },
  {
    id: 'ultra',
    label: 'Ultra',
    badge: 'Beste Leistung',
    accent: {
      border:   'border-purple-500',
      glow:     'shadow-xl shadow-purple-500/20',
      badge:    'bg-purple-600 text-white',
      label:    'text-purple-500 dark:text-purple-400',
      cta:      'bg-purple-600',
      ctaHover: 'hover:bg-purple-500',
      ctaText:  'text-white',
    },
    includesLabel: 'Alles von Premium +',
    features: [
      '500 Bewertungen/Monat',
      'Wöchentliche Analysen & Berichte',
      'Early Access zu neuen Fächern',
      'Erweiterter Fragenkatalog',
      'Super Priority Support',
    ],
    ctaLabel: 'Ultra starten',
    baseMonthly: 11.99,
  },
  {
    id: 'unlimited',
    label: 'Unlimited',
    accent: {
      border:   'border-fuchsia-500/50 dark:border-fuchsia-500/40',
      glow:     'shadow-lg shadow-fuchsia-500/10',
      badge:    '',
      label:    'text-fuchsia-500 dark:text-fuchsia-400',
      cta:      'bg-gradient-to-r from-fuchsia-600 to-pink-600',
      ctaHover: 'hover:from-fuchsia-500 hover:to-pink-500',
      ctaText:  'text-white',
    },
    includesLabel: 'Alles von Ultra +',
    features: [
      'Unbegrenzte Bewertungen',
      'Vollständige Mock-Abiturprüfungen',
      'Exam Score Predictions',
      'VIP Super Priority Support',
    ],
    ctaLabel: 'Unlimited starten',
    baseMonthly: 15.99,
  },
]

// ── Plan card ─────────────────────────────────────────────────────────────────

type UnlimitedPhase = 'burst' | 'settled'

function PlanCard({
  tier,
  period,
  unlimitedPhase,
  noBorder,
}: {
  tier: Tier
  period: Period
  unlimitedPhase?: UnlimitedPhase
  noBorder?: boolean
}) {
  const { user } = useAuth()
  const dest = user ? '/math' : '/register'
  const isFree = tier.baseMonthly === null
  const price = isFree ? null : computePrice(tier.baseMonthly!, period)
  const a = tier.accent

  const isUnlimited = !!unlimitedPhase
  const borderClass = noBorder ? '' : `border ${a.border}`
  const glowClass   = noBorder ? '' : a.glow

  return (
    <div
      className={`flex h-full flex-col rounded-2xl bg-white transition-all duration-200 dark:bg-surface ${borderClass} ${glowClass} relative overflow-hidden`}
    >
      {/* Badge */}
      {tier.badge && (
        <span className={`absolute right-4 top-4 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider shadow ${a.badge}`}>
          {tier.badge}
        </span>
      )}

      <div className="flex flex-1 flex-col p-6">
        {/* Tier label */}
        <p className={`text-[11px] font-bold uppercase tracking-widest ${a.label}`}>{tier.label}</p>

        {/* Price block */}
        <div className="mt-4 min-h-[72px]">
          {isFree ? (
            <>
              <div className="flex items-baseline gap-0.5">
                <span className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">€0</span>
              </div>
              <p className="mt-1 text-xs text-gray-400 dark:text-slate-500">Für immer kostenlos</p>
            </>
          ) : period === 'monthly' ? (
            <>
              <div className="flex items-baseline gap-0.5">
                <span
                  className="text-4xl font-bold tracking-tight"
                  style={isUnlimited ? {
                    background: 'linear-gradient(90deg,#e879f9,#ec4899,#a855f7,#e879f9)',
                    backgroundSize: '200% auto',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    animation: 'gradient-shift 2s ease infinite',
                  } : { color: undefined }}
                >
                  {price!.totalDisplay}
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-400 dark:text-slate-500">/Monat</p>
            </>
          ) : (
            <>
              <div className="flex items-baseline gap-1.5">
                <span
                  className="text-4xl font-bold tracking-tight"
                  style={isUnlimited ? {
                    background: 'linear-gradient(90deg,#e879f9,#ec4899,#a855f7,#e879f9)',
                    backgroundSize: '200% auto',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    animation: 'gradient-shift 2s ease infinite',
                  } : { color: undefined }}
                >
                  {price!.totalDisplay}
                </span>
              </div>
              {price!.savedDisplay && (
                <p className="mt-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  ↓ Sparen Sie {price!.discPct}% ({price!.savedDisplay})
                </p>
              )}
            </>
          )}
        </div>

        {/* Divider */}
        <div className="my-5 h-px bg-gray-100 dark:bg-white/5" />

        {/* "Includes previous tier" */}
        {tier.includesLabel && (
          <p className={`mb-3 text-[11px] font-semibold italic ${a.label} opacity-80`}>
            {tier.includesLabel}
          </p>
        )}

        {/* Features */}
        <ul className="flex flex-1 flex-col gap-2.5">
          {tier.features.map((f) => (
            <li key={f} className="flex items-start gap-2">
              <Check />
              <span className="text-xs leading-snug text-gray-700 dark:text-slate-300">{f}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Link
          to={dest}
          className={`mt-6 block rounded-xl py-2.5 text-center text-sm font-semibold transition-all duration-150 ${a.cta} ${a.ctaHover} ${a.ctaText} relative overflow-hidden`}
        >
          {tier.ctaLabel}
          {isUnlimited && (
            <span
              className="pointer-events-none absolute inset-0"
              style={{
                background: 'linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.28) 50%,transparent 60%)',
                animation: 'shimmer-slide 2.4s ease-in-out infinite',
              }}
            />
          )}
        </Link>
      </div>
    </div>
  )
}

// ── Extra credits section ─────────────────────────────────────────────────────

function ExtraCredits() {
  return (
    <div className="relative mx-auto max-w-7xl overflow-hidden rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-600/10 via-indigo-600/5 to-fuchsia-600/10 px-8 py-10 dark:from-violet-600/[0.08] dark:via-indigo-600/[0.04] dark:to-fuchsia-600/[0.08]">
      {/* Background glow blobs */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 left-10 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl" />

      <div className="relative flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/20 text-lg">⚡</span>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-violet-500 dark:text-violet-400">
                Extra Credits
              </p>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Bewertungen aufgebraucht?
              </h3>
            </div>
          </div>
          <p className="mt-3 max-w-sm text-sm text-gray-500 dark:text-slate-400">
            Kein Monatsreset nötig — kaufe jederzeit extra Bewertungen einzeln dazu.
            Verfügbar für alle bezahlten Pläne, sofort aktiviert.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="rounded-2xl border border-violet-500/20 bg-white/70 px-8 py-5 text-center backdrop-blur dark:bg-white/[0.04]">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">€ 0,20</p>
            <p className="mt-1 text-xs font-medium text-gray-500 dark:text-slate-400">pro 10 Bewertungen</p>
            <p className="mt-0.5 text-[10px] text-gray-400 dark:text-slate-600">= €0,02 pro Stk.</p>
          </div>
          <Link
            to="/register"
            className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-colors hover:bg-violet-500"
          >
            Jetzt kaufen
          </Link>
        </div>
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
    a: 'Du kannst entweder warten bis zum nächsten Monat, ein Upgrade auf einen höheren Plan durchführen, oder direkt extra Bewertungen kaufen – €0,20 pro 10 Stück.',
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
  const [unlimitedPhase, setUnlimitedPhase] = useState<UnlimitedPhase>('burst')

  const scrollRef   = useRef<HTMLDivElement>(null)
  const unlimitedRef = useRef<HTMLDivElement>(null)

  // Custom eased scroll — much smoother than browser scrollTo 'smooth'
  function easedScrollX(el: HTMLElement, to: number, duration: number, onDone?: () => void) {
    const from = el.scrollLeft
    const dist = to - from
    const t0 = performance.now()
    function tick(now: number) {
      const p = Math.min((now - t0) / duration, 1)
      // ease in-out cubic
      const e = p < 0.5 ? 4 * p ** 3 : 1 - (-2 * p + 2) ** 3 / 2
      el.scrollLeft = from + dist * e
      if (p < 1) requestAnimationFrame(tick)
      else onDone?.()
    }
    requestAnimationFrame(tick)
  }

  function easedScrollY(to: number, duration: number, onDone?: () => void) {
    const from = window.scrollY
    const dist = to - from
    const t0 = performance.now()
    function tick(now: number) {
      const p = Math.min((now - t0) / duration, 1)
      const e = p < 0.5 ? 4 * p ** 3 : 1 - (-2 * p + 2) ** 3 / 2
      window.scrollTo(0, from + dist * e)
      if (p < 1) requestAnimationFrame(tick)
      else onDone?.()
    }
    requestAnimationFrame(tick)
  }

  // On mount: scroll down to show cards, then pan right to Unlimited
  useEffect(() => {
    const t0 = setTimeout(() => {
      const el = scrollRef.current
      if (!el) return

      // 1. Gently scroll the page down so title + full cards are visible
      const cardTop = el.getBoundingClientRect().top + window.scrollY
      const targetY = Math.max(0, cardTop - window.innerHeight * 0.15)
      easedScrollY(targetY, 800, () => {
        // 2. After page settles, pan right to Unlimited
        if (!scrollRef.current) return
        const hEl = scrollRef.current
        easedScrollX(hEl, 99999, 2400, () => {})
      })
    }, 500)

    const t1 = setTimeout(() => setUnlimitedPhase('settled'), 3500)

    return () => { clearTimeout(t0); clearTimeout(t1) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="min-h-screen bg-white dark:bg-[#0d0f18]">

      {/* ── Hero ── */}
      <div className="mx-auto max-w-5xl px-6 pt-20 pb-10">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Einfache, transparente Preise
          </h1>
          <p className="mt-4 text-lg text-gray-500 dark:text-slate-400">
            Wähle den Plan, der zu dir passt.
          </p>
        </div>
      </div>

      {/* ── Period toggle ── */}
      <div className="flex justify-center px-6 pb-5">
        <PricingToggle period={period} onChange={setPeriod} />
      </div>

      {/* ── Cards — horizontal scroll, same height, equal margins ── */}
      <div
        ref={scrollRef}
        className="pricing-scroll overflow-x-auto pt-10 pb-8"
        style={{ display: 'grid', gridAutoFlow: 'column', gridAutoColumns: '256px', gap: '20px', WebkitOverflowScrolling: 'touch' }}
      >

        {TIERS.map((tier) => {
          const isUnlimited = tier.id === 'unlimited'
          return (
            <div
              key={tier.id}
              ref={isUnlimited ? unlimitedRef : undefined}
              className="relative"
              style={{
                width: '256px',
                flexShrink: 0,
                ...(isUnlimited ? {
                  borderRadius: '1rem',
                  animation: 'unlimited-glow 1.5s ease-in-out infinite',
                } : {}),
              }}
            >
              {isUnlimited && (
                <>
                  {/* Gradient border ring — inset:-2px floats it outside the card, overflow:hidden clips the spinner to that ring */}
                  <div style={{ position: 'absolute', inset: '-2px', borderRadius: '1rem', overflow: 'hidden', zIndex: 0 }}>
                    <div style={{
                      position: 'absolute',
                      inset: '-100%',
                      background: 'conic-gradient(from 0deg, #e879f9, #ffffff, #ec4899, #8b5cf6, #7c3aed, #a78bfa, #f472b6, rgba(255,255,255,0.7), #e879f9)',
                      animation: `spin ${unlimitedPhase === 'burst' ? '1.2s' : '3.5s'} linear infinite`,
                      opacity: unlimitedPhase === 'settled' ? 1 : 0,
                      transition: 'opacity 1.4s ease',
                    }} />
                  </div>
                  {/* Particles */}
                  {unlimitedPhase === 'burst' && <ParticleBurst />}
                </>
              )}

              {/* Card — full w-64, sits on top of the border ring */}
              <div style={isUnlimited ? { position: 'relative', zIndex: 1, height: '100%' } : { height: '100%' }}>
                <PlanCard
                  tier={tier}
                  period={period}
                  unlimitedPhase={isUnlimited ? unlimitedPhase : undefined}
                  noBorder={isUnlimited}
                />
              </div>
            </div>
          )
        })}

      </div>

      {/* ── Extra credits ── */}
      <div className="px-6 py-16">
        <ExtraCredits />
      </div>

      {/* ── FAQ ── */}
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

      {/* ── Footer CTA ── */}
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

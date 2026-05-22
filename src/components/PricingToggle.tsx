export type Period = 'monthly' | '3m' | '6m' | '12m'

export const PERIOD_META: Record<Period, { months: number; discPct: number }> = {
  monthly: { months: 1,  discPct: 0  },
  '3m':    { months: 3,  discPct: 5  },
  '6m':    { months: 6,  discPct: 10 },
  '12m':   { months: 12, discPct: 20 },
}

const ORDER: Period[] = ['monthly', '3m', '6m', '12m']

const LABELS: Record<Period, { main: string; disc: string | null }> = {
  monthly: { main: 'Monatlich',  disc: null   },
  '3m':    { main: '3 Monate',   disc: '−5%'  },
  '6m':    { main: '6 Monate',   disc: '−10%' },
  '12m':   { main: '12 Monate',  disc: '−20%' },
}

interface Props {
  period: Period
  onChange: (p: Period) => void
}

export default function PricingToggle({ period, onChange }: Props) {
  const idx = ORDER.indexOf(period)

  return (
    <div className="relative flex w-full max-w-[420px] rounded-2xl bg-gray-100 p-1 dark:bg-white/[0.06]">
      {/* Sliding indicator */}
      <div
        className="absolute inset-y-1 rounded-xl bg-indigo-600 shadow-lg shadow-indigo-500/40 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{
          left:  `calc(${idx} * 25% + 4px)`,
          width: 'calc(25% - 8px)',
        }}
      />

      {ORDER.map((p) => {
        const active = p === period
        const { main, disc } = LABELS[p]
        return (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`relative z-10 flex flex-1 min-w-0 flex-col items-center justify-center gap-0.5 px-2 py-2.5 text-sm font-medium transition-colors duration-200 select-none ${
              active
                ? 'text-white'
                : 'text-gray-500 hover:text-gray-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <span className="leading-tight">{main}</span>
            {disc && (
              <span
                className={`rounded px-1.5 py-px text-[10px] font-bold leading-tight transition-colors duration-200 ${
                  active
                    ? 'bg-white/20 text-white'
                    : 'bg-red-500/10 text-red-500 dark:bg-red-500/15 dark:text-red-400'
                }`}
              >
                {disc}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

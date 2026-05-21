export type Period = 'monthly' | '3m' | '6m' | '12m'

export const PERIOD_META: Record<Period, { label: string; months: number; discPct: number }> = {
  monthly: { label: 'Monatlich',       months: 1,  discPct: 0   },
  '3m':    { label: '3 Monate −5%',   months: 3,  discPct: 5   },
  '6m':    { label: '6 Monate −10%',  months: 6,  discPct: 10  },
  '12m':   { label: '12 Monate −20%', months: 12, discPct: 20  },
}

const ORDER: Period[] = ['monthly', '3m', '6m', '12m']

interface Props {
  period: Period
  onChange: (p: Period) => void
}

export default function PricingToggle({ period, onChange }: Props) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {ORDER.map((p) => {
        const active = p === period
        return (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-all duration-150 ${
              active
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                : 'border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50 dark:border-white/10 dark:text-slate-400 dark:hover:border-white/20 dark:hover:bg-white/5'
            }`}
          >
            {PERIOD_META[p].label}
          </button>
        )
      })}
    </div>
  )
}

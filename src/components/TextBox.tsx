import { useState } from 'react'

export const TEXT_MAX = 2000

interface TextBoxProps {
  onChange?: (text: string) => void
}

export default function TextBox({ onChange }: TextBoxProps) {
  const [value, setValue] = useState('')
  const over = value.length > TEXT_MAX

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value)
    onChange?.(e.target.value)
  }

  return (
    <div className="flex flex-col gap-1.5">
      <textarea
        value={value}
        onChange={handleChange}
        placeholder="Lösung hier eintippen oder einfügen…"
        className={`min-h-[280px] w-full resize-y rounded-lg border bg-[#0a0c13] p-4 text-sm leading-relaxed text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 ${
          over
            ? 'border-red-500/60 focus:ring-red-500'
            : 'border-white/10 focus:ring-indigo-500'
        }`}
        spellCheck={false}
      />
      <p className={`text-right text-xs ${over ? 'text-red-500 dark:text-red-400' : 'text-gray-400 dark:text-slate-600'}`}>
        {value.length} / {TEXT_MAX}
      </p>
    </div>
  )
}

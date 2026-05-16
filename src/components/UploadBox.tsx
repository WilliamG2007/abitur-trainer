import { useRef, useState, DragEvent, ChangeEvent } from 'react'

interface UploadBoxProps {
  onChange?: (dataUrl: string) => void
}

export default function UploadBox({ onChange }: UploadBoxProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (e) => {
      const url = e.target?.result as string
      setPreview(url)
      onChange?.(url)
    }
    reader.readAsDataURL(file)
  }

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const clear = () => {
    setPreview(null)
    onChange?.('')
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="flex flex-col gap-2">
      {preview ? (
        <div className="relative overflow-hidden rounded-lg border border-white/10" style={{ height: 280 }}>
          <img src={preview} alt="Lösung" className="h-full w-full object-contain" />
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed transition-colors ${
            dragging
              ? 'border-indigo-500 bg-indigo-500/10'
              : 'border-white/10 bg-[#0a0c13] hover:border-white/20'
          }`}
          style={{ height: 280 }}
        >
          <span className="text-3xl">📷</span>
          <p className="text-sm text-slate-400">Foto hochladen oder hierher ziehen</p>
          <p className="text-xs text-slate-600">PNG, JPG, HEIC</p>
        </div>
      )}

      <div className="flex justify-end gap-2">
        {preview && (
          <button
            onClick={clear}
            className="rounded-md border border-white/10 px-3 py-1.5 text-xs text-slate-400 transition-colors hover:border-white/20 hover:text-white"
          >
            Löschen
          </button>
        )}
        <button
          onClick={() => inputRef.current?.click()}
          className="rounded-md border border-white/10 px-3 py-1.5 text-xs text-slate-400 transition-colors hover:border-white/20 hover:text-white"
        >
          {preview ? 'Anderes Bild' : 'Datei wählen'}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onInputChange}
      />
    </div>
  )
}

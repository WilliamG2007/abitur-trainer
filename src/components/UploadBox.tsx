import { useRef, useState, DragEvent, ChangeEvent } from 'react'

const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/heic']
const MAX_BYTES = 2 * 1024 * 1024 // 2 MB

interface UploadBoxProps {
  onChange?: (dataUrl: string) => void
}

export default function UploadBox({ onChange }: UploadBoxProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const [fileError, setFileError] = useState<string | null>(null)

  const handleFile = (file: File) => {
    setFileError(null)

    if (!ALLOWED_TYPES.includes(file.type)) {
      setFileError('Nur Bilder erlaubt (PNG, JPG, HEIC)')
      return
    }
    if (file.size > MAX_BYTES) {
      setFileError('Datei zu groß. Maximale Größe: 2MB')
      return
    }

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
    setFileError(null)
    onChange?.('')
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="flex flex-col gap-2">
      {preview ? (
        <div className="relative overflow-hidden rounded-lg border border-gray-200 dark:border-white/10" style={{ height: 280 }}>
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
              : 'border-gray-200 bg-gray-50 hover:border-gray-300 dark:border-white/10 dark:bg-[#0a0c13] dark:hover:border-white/20'
          }`}
          style={{ height: 280 }}
        >
          <span className="text-3xl">📷</span>
          <p className="text-sm text-gray-500 dark:text-slate-400">Foto hochladen oder hierher ziehen</p>
          <p className="text-xs text-gray-400 dark:text-slate-600">PNG, JPG, HEIC · max. 2 MB</p>
        </div>
      )}

      {fileError && (
        <p className="text-xs text-red-500 dark:text-red-400">{fileError}</p>
      )}

      <div className="flex justify-end gap-2">
        {preview && (
          <button
            onClick={clear}
            className="rounded-md border border-gray-200 px-3 py-1.5 text-xs text-gray-500 transition-colors hover:border-gray-300 hover:text-gray-900 dark:border-white/10 dark:text-slate-400 dark:hover:border-white/20 dark:hover:text-white"
          >
            Löschen
          </button>
        )}
        <button
          onClick={() => inputRef.current?.click()}
          className="rounded-md border border-gray-200 px-3 py-1.5 text-xs text-gray-500 transition-colors hover:border-gray-300 hover:text-gray-900 dark:border-white/10 dark:text-slate-400 dark:hover:border-white/20 dark:hover:text-white"
        >
          {preview ? 'Anderes Bild' : 'Datei wählen'}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/heic"
        className="hidden"
        onChange={onInputChange}
      />
    </div>
  )
}

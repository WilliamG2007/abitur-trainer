import { useRef, useEffect, useCallback, useState } from 'react'

type Tool = 'pen' | 'eraser'
type StrokeWidth = 'thin' | 'medium' | 'thick'

const PEN_WIDTHS: Record<StrokeWidth, number> = { thin: 1.5, medium: 3, thick: 6 }
const ERASER_WIDTHS: Record<StrokeWidth, number> = { thin: 8, medium: 16, thick: 28 }

interface DrawingCanvasProps {
  onChange?: (dataUrl: string) => void
}

export default function DrawingCanvas({ onChange }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isDrawing = useRef(false)
  const lastPos = useRef<{ x: number; y: number } | null>(null)
  const historyRef = useRef<ImageData[]>([])

  const [tool, setTool] = useState<Tool>('pen')
  const [strokeWidth, setStrokeWidth] = useState<StrokeWidth>('medium')
  const [isEmpty, setIsEmpty] = useState(true)
  const [canUndo, setCanUndo] = useState(false)

  // Keep refs in sync so draw callbacks always read current values
  const toolRef = useRef(tool)
  const strokeWidthRef = useRef(strokeWidth)
  useEffect(() => { toolRef.current = tool }, [tool])
  useEffect(() => { strokeWidthRef.current = strokeWidth }, [strokeWidth])

  const applyCtxSettings = useCallback((ctx: CanvasRenderingContext2D) => {
    const t = toolRef.current
    const w = strokeWidthRef.current
    ctx.globalCompositeOperation = t === 'eraser' ? 'destination-out' : 'source-over'
    ctx.strokeStyle = t === 'eraser' ? 'rgba(0,0,0,1)' : '#e2e8f0'
    ctx.lineWidth = t === 'eraser' ? ERASER_WIDTHS[w] : PEN_WIDTHS[w]
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
  }, [])

  // Resize – clears history since ImageData dims change
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height
      historyRef.current = []
      setCanUndo(false)
      const ctx = canvas.getContext('2d')
      if (ctx) applyCtxSettings(ctx)
    }
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    return () => observer.disconnect()
  }, [applyCtxSettings])

  const getPos = (e: MouseEvent | TouchEvent): { x: number; y: number } | null => {
    const canvas = canvasRef.current
    if (!canvas) return null
    const rect = canvas.getBoundingClientRect()
    if (e instanceof MouseEvent) return { x: e.clientX - rect.left, y: e.clientY - rect.top }
    const touch = (e as TouchEvent).touches[0]
    if (!touch) return null
    return { x: touch.clientX - rect.left, y: touch.clientY - rect.top }
  }

  const notifyChange = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || !onChange) return
    onChange(canvas.toDataURL())
  }, [onChange])

  const startDraw = useCallback((e: MouseEvent | TouchEvent) => {
    e.preventDefault()
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx || !canvas) return

    // Snapshot before stroke for undo
    historyRef.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height))
    setCanUndo(true)

    applyCtxSettings(ctx)
    isDrawing.current = true
    lastPos.current = getPos(e)
    setIsEmpty(false)
  }, [applyCtxSettings])

  const draw = useCallback((e: MouseEvent | TouchEvent) => {
    e.preventDefault()
    if (!isDrawing.current) return
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx || !canvas) return
    const pos = getPos(e)
    if (!pos) return

    ctx.beginPath()
    if (lastPos.current) {
      ctx.moveTo(lastPos.current.x, lastPos.current.y)
    } else {
      ctx.moveTo(pos.x, pos.y)
    }
    ctx.lineTo(pos.x, pos.y)
    ctx.stroke()
    lastPos.current = pos
  }, [])

  const endDraw = useCallback(() => {
    if (!isDrawing.current) return
    isDrawing.current = false
    lastPos.current = null
    notifyChange()
  }, [notifyChange])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.addEventListener('mousedown', startDraw)
    canvas.addEventListener('mousemove', draw)
    canvas.addEventListener('mouseup', endDraw)
    canvas.addEventListener('mouseleave', endDraw)
    canvas.addEventListener('touchstart', startDraw, { passive: false })
    canvas.addEventListener('touchmove', draw, { passive: false })
    canvas.addEventListener('touchend', endDraw)
    return () => {
      canvas.removeEventListener('mousedown', startDraw)
      canvas.removeEventListener('mousemove', draw)
      canvas.removeEventListener('mouseup', endDraw)
      canvas.removeEventListener('mouseleave', endDraw)
      canvas.removeEventListener('touchstart', startDraw)
      canvas.removeEventListener('touchmove', draw)
      canvas.removeEventListener('touchend', endDraw)
    }
  }, [startDraw, draw, endDraw])

  const undo = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx || !canvas) return
    const snapshot = historyRef.current.pop()
    if (snapshot) {
      ctx.putImageData(snapshot, 0, 0)
      setCanUndo(historyRef.current.length > 0)
      if (historyRef.current.length === 0) setIsEmpty(true)
      notifyChange()
    }
  }, [notifyChange])

  const clear = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx || !canvas) return
    historyRef.current = []
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setIsEmpty(true)
    setCanUndo(false)
    onChange?.('')
  }, [onChange])

  // Ctrl+Z
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault()
        undo()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [undo])

  const tbBtn = (active: boolean) =>
    `rounded px-2 py-1 text-xs font-medium transition-colors ${
      active
        ? 'bg-white/15 text-white'
        : 'text-slate-400 hover:bg-white/5 hover:text-white'
    }`

  return (
    <div className="flex flex-col gap-2">
      {/* Toolbar */}
      <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-[#0a0c13] px-2 py-1.5">
        {/* Tool */}
        <button onClick={() => setTool('pen')} className={tbBtn(tool === 'pen')} title="Stift">
          ✏️
        </button>
        <button onClick={() => setTool('eraser')} className={tbBtn(tool === 'eraser')} title="Radierer">
          ◻ Rad.
        </button>

        <div className="mx-1.5 h-4 w-px bg-white/10" />

        {/* Stroke width */}
        {(['thin', 'medium', 'thick'] as StrokeWidth[]).map((w) => (
          <button
            key={w}
            onClick={() => setStrokeWidth(w)}
            className={tbBtn(strokeWidth === w)}
            title={w}
          >
            <span
              className="inline-block rounded-full bg-current"
              style={{
                width: w === 'thin' ? 6 : w === 'medium' ? 10 : 15,
                height: w === 'thin' ? 6 : w === 'medium' ? 10 : 15,
              }}
            />
          </button>
        ))}

        <div className="mx-1.5 h-4 w-px bg-white/10" />

        {/* Undo */}
        <button
          onClick={undo}
          disabled={!canUndo}
          className={`${tbBtn(false)} disabled:opacity-30`}
          title="Rückgängig (Ctrl+Z)"
        >
          ↩ Undo
        </button>

        {/* Clear */}
        <button
          onClick={clear}
          disabled={isEmpty}
          className={`${tbBtn(false)} disabled:opacity-30`}
          title="Alles löschen"
        >
          🗑
        </button>
      </div>

      {/* Canvas */}
      <div
        className="relative overflow-hidden rounded-lg border border-white/10 bg-[#0a0c13]"
        style={{ height: 280 }}
      >
        <canvas
          ref={canvasRef}
          className={`absolute inset-0 h-full w-full touch-none ${
            tool === 'eraser' ? 'cursor-cell' : 'cursor-crosshair'
          }`}
        />
        {isEmpty && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <p className="text-sm text-slate-600">Hier zeichnen / schreiben…</p>
          </div>
        )}
      </div>
    </div>
  )
}

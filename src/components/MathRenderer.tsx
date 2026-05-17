import katex from 'katex'

// ---------------------------------------------------------------------------
// Segment parser — splits a string into plain text / inline $...$ / block $$...$$
// ---------------------------------------------------------------------------
type Segment =
  | { type: 'text'; content: string }
  | { type: 'inline'; content: string }
  | { type: 'block'; content: string }

function parseSegments(input: string): Segment[] {
  const result: Segment[] = []
  // Match $$...$$ before $...$ so block wins
  const re = /(\$\$[\s\S]+?\$\$|\$[^$\n]+?\$)/g
  let last = 0
  let m: RegExpExecArray | null

  while ((m = re.exec(input)) !== null) {
    if (m.index > last) {
      result.push({ type: 'text', content: input.slice(last, m.index) })
    }
    const full = m[0]
    if (full.startsWith('$$')) {
      result.push({ type: 'block', content: full.slice(2, -2) })
    } else {
      result.push({ type: 'inline', content: full.slice(1, -1) })
    }
    last = m.index + full.length
  }
  if (last < input.length) {
    result.push({ type: 'text', content: input.slice(last) })
  }
  return result
}

function tryRender(latex: string, displayMode: boolean): string {
  try {
    return katex.renderToString(latex.trim(), {
      displayMode,
      throwOnError: false,
      strict: false,
    })
  } catch {
    return latex
  }
}

// Renders plain text while preserving newlines as <br/>
function TextWithBreaks({ text }: { text: string }) {
  const lines = text.split('\n')
  return (
    <>
      {lines.map((line, i) => (
        <span key={i}>
          {i > 0 && <br />}
          {line}
        </span>
      ))}
    </>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
interface MathRendererProps {
  /** String that may contain $inline$ and/or $$block$$ LaTeX alongside plain text */
  formula: string
  className?: string
}

export default function MathRenderer({ formula, className }: MathRendererProps) {
  const segments = parseSegments(formula)

  return (
    <span className={className}>
      {segments.map((seg, i) => {
        if (seg.type === 'block') {
          return (
            <span
              key={i}
              className="my-2 block overflow-x-auto text-center"
              dangerouslySetInnerHTML={{ __html: tryRender(seg.content, true) }}
            />
          )
        }
        if (seg.type === 'inline') {
          return (
            <span
              key={i}
              dangerouslySetInnerHTML={{ __html: tryRender(seg.content, false) }}
            />
          )
        }
        return <TextWithBreaks key={i} text={seg.content} />
      })}
    </span>
  )
}

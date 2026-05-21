/**
 * LatexRenderer — renders question_text strings that mix:
 *  - Plain text (single \n = space, double \n = paragraph break)
 *  - $...$ inline KaTeX math
 *  - $$...$$ display KaTeX math
 *  - \begin{enumerate}...\end{enumerate} → <ol>
 *  - \begin{itemize}...\end{itemize}    → <ul>
 *  - {\bf ...} and \textbf{...}        → <strong>
 *  - \emph{...} and \textit{...}       → <em>
 *  - \\  (double backslash)            → <br/>
 *  - \tiny{...}                        → stripped (just content)
 */

import katex from 'katex'

// ── KaTeX helpers ────────────────────────────────────────────────────────────

// Custom macros used in Bayern Abitur LaTeX source files
const KATEX_MACROS: Record<string, string> = {
  '\\e':  'e',                  // \e^x  → e^x
  '\\D':  '\\displaystyle',     // \D\frac → \displaystyle\frac
  '\\m':  '\\mathrm{#1}',       // \m{f_a} → \mathrm{f_a}
}

function renderKatex(s: string, display: boolean): string {
  try {
    return katex.renderToString(s.trim(), {
      displayMode: display,
      throwOnError: false,
      strict: false,
      macros: KATEX_MACROS,
    })
  } catch {
    return s
  }
}

// ── Document-level block parser ──────────────────────────────────────────────

type Block =
  | { kind: 'text'; content: string }
  | { kind: 'list'; ordered: boolean; start: number; items: string[] }

function parseBlocks(input: string): Block[] {
  // Strip \newcommand declarations
  input = input.replace(/\\newcommand\{[^}]+\}(?:\[\d+\])?\{[^}]*\}\n?/g, '')
  // Strip LaTeX line comments (% not preceded by \)
  input = input.replace(/(^|[^\\])%[^\n]*/gm, '$1')

  const blocks: Block[] = []
  const envRe = /\\begin\{(enumerate|itemize)\}([\s\S]*?)\\end\{(?:enumerate|itemize)\}/g
  let last = 0
  let m: RegExpExecArray | null

  while ((m = envRe.exec(input)) !== null) {
    if (m.index > last) {
      blocks.push({ kind: 'text', content: input.slice(last, m.index) })
    }

    const ordered = m[1] === 'enumerate'
    const body = m[2]

    // \addtocounter{enumi}{N} → start numbering at N+1
    let start = 1
    const ctr = body.match(/\\addtocounter\{enumi\}\{(\d+)\}/)
    if (ctr) start = parseInt(ctr[1]) + 1

    // Split on \item (with optional [label])
    const items = body
      .split(/\\item(?:\[[^\]]*\])?/)
      .slice(1)
      .map((s) => s.trim())
      .filter(Boolean)

    blocks.push({ kind: 'list', ordered, start, items })
    last = m.index + m[0].length
  }

  if (last < input.length) {
    blocks.push({ kind: 'text', content: input.slice(last) })
  }

  return blocks
}

// ── Inline segment parser ────────────────────────────────────────────────────

type Seg =
  | { k: 'text'; s: string }
  | { k: 'math'; s: string; display: boolean }
  | { k: 'bold'; inner: string }
  | { k: 'italic'; inner: string }
  | { k: 'br' }

function parseInline(input: string): Seg[] {
  // Strip \tiny{...} — just keep the content
  input = input.replace(/\\tiny\{([^}]*)\}/g, '$1')
  // LaTeX special-character escapes → literal characters
  input = input.replace(/\\%/g, '%')
  input = input.replace(/\\&/g, '&')
  input = input.replace(/\\_/g, '_')

  const segs: Seg[] = []
  let i = 0
  let buf = ''

  const flush = () => {
    if (buf) {
      segs.push({ k: 'text', s: buf })
      buf = ''
    }
  }

  while (i < input.length) {
    // $$...$$ display math
    if (input[i] === '$' && input[i + 1] === '$') {
      const end = input.indexOf('$$', i + 2)
      if (end !== -1) {
        flush()
        segs.push({ k: 'math', s: input.slice(i + 2, end), display: true })
        i = end + 2
        continue
      }
    }

    // $...$ inline math
    if (input[i] === '$') {
      let j = i + 1
      while (j < input.length && input[j] !== '$') j++
      if (j < input.length) {
        flush()
        segs.push({ k: 'math', s: input.slice(i + 1, j), display: false })
        i = j + 1
        continue
      }
    }

    // \\ line break (two backslashes in the actual string)
    if (input[i] === '\\' && input[i + 1] === '\\') {
      flush()
      segs.push({ k: 'br' })
      i += 2
      if (input[i] === '\n') i++ // skip the trailing newline
      continue
    }

    // {\bf ...} bold
    if (input[i] === '{' && input[i + 1] === '\\' && input.slice(i + 2, i + 4) === 'bf') {
      let depth = 1
      let j = i + 1
      while (j < input.length && depth > 0) {
        if (input[j] === '{') depth++
        else if (input[j] === '}') depth--
        j++
      }
      if (depth === 0) {
        flush()
        const inner = input.slice(i + 1, j - 1).replace(/^\\bf\s*/, '')
        segs.push({ k: 'bold', inner })
        i = j
        continue
      }
    }

    // \textbf{...}
    if (input.slice(i, i + 8) === '\\textbf{') {
      let depth = 1
      let j = i + 8
      while (j < input.length && depth > 0) {
        if (input[j] === '{') depth++
        else if (input[j] === '}') depth--
        j++
      }
      if (depth === 0) {
        flush()
        segs.push({ k: 'bold', inner: input.slice(i + 8, j - 1) })
        i = j
        continue
      }
    }

    // \emph{...} or \textit{...}
    const emphM = /^\\(?:emph|textit)\{/.exec(input.slice(i))
    if (emphM) {
      const argStart = i + emphM[0].length
      let depth = 1
      let j = argStart
      while (j < input.length && depth > 0) {
        if (input[j] === '{') depth++
        else if (input[j] === '}') depth--
        j++
      }
      if (depth === 0) {
        flush()
        segs.push({ k: 'italic', inner: input.slice(argStart, j - 1) })
        i = j
        continue
      }
    }

    buf += input[i]
    i++
  }

  flush()
  return segs
}

// ── Inline renderer ───────────────────────────────────────────────────────────

function InlineContent({ text }: { text: string }) {
  const segs = parseInline(text)
  return (
    <>
      {segs.map((seg, idx) => {
        if (seg.k === 'br') return <br key={idx} />

        if (seg.k === 'math')
          return (
            <span
              key={idx}
              className={seg.display ? 'my-2 block overflow-x-auto text-center' : undefined}
              dangerouslySetInnerHTML={{ __html: renderKatex(seg.s, seg.display) }}
            />
          )

        if (seg.k === 'bold')
          return (
            <strong key={idx} className="font-semibold">
              <InlineContent text={seg.inner} />
            </strong>
          )

        if (seg.k === 'italic')
          return (
            <em key={idx}>
              <InlineContent text={seg.inner} />
            </em>
          )

        // Plain text — single \n is just word-wrap in LaTeX source → space
        return <span key={idx}>{seg.s.replace(/\n/g, ' ')}</span>
      })}
    </>
  )
}

// ── Public component ──────────────────────────────────────────────────────────

interface LatexRendererProps {
  children: string
  className?: string
}

export default function LatexRenderer({ children, className }: LatexRendererProps) {
  const blocks = parseBlocks(children)

  return (
    <span className={className}>
      {blocks.map((block, i) => {
        if (block.kind === 'list') {
          const Tag = block.ordered ? 'ol' : 'ul'
          return (
            <Tag
              key={i}
              start={block.ordered ? block.start : undefined}
              className={`my-3 ml-5 space-y-1.5 ${block.ordered ? 'list-decimal' : 'list-disc'}`}
            >
              {block.items.map((item, j) => (
                <li key={j} className="leading-relaxed">
                  <InlineContent text={item} />
                </li>
              ))}
            </Tag>
          )
        }

        return <InlineContent key={i} text={block.content} />
      })}
    </span>
  )
}

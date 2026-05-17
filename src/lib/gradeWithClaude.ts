import Anthropic from '@anthropic-ai/sdk'

const SYSTEM_PROMPT = `Du bist ein strenger aber fairer bayerischer Abitur Mathematik Korrektor.
Bewerte ausschließlich nach dem Erwartungshorizont.
Vergib Punkte NUR für mathematisch korrekte und vollständige Schritte.
Eine falsche oder themenfremde Antwort bekommt 0 Punkte — keine Ausnahmen.
Interpretiere keine Absichten, nur was tatsächlich auf dem Papier steht.
Sei ehrlich über die Punktzahl, aber ermutigend im Erklärungstext.`

export interface GradingResult {
  score: number
  maxPoints: number
  feedback: string
}

export async function gradeWithClaude(
  imageDataUrl: string,
  questionText: string,
  erwartungshorizont: string,
  maxPoints: number,
): Promise<GradingResult> {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY as string | undefined
  if (!apiKey) {
    throw new Error('VITE_ANTHROPIC_API_KEY ist nicht gesetzt. Erstelle eine .env Datei.')
  }

  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true })

  // Strip data-URL prefix → raw base64
  const base64 = imageDataUrl.replace(/^data:image\/\w+;base64,/, '')

  const userText =
    `Aufgabe:\n${questionText}\n\n` +
    `Erwartungshorizont:\n${erwartungshorizont}\n\n` +
    `Maximale Punktzahl: ${maxPoints} BE\n\n` +
    `Bewerte die handgeschriebene Schülerlösung im Bild.\n` +
    `Antworte in diesem Format:\n\n` +
    `PUNKTE: X / ${maxPoints}\n\n` +
    `TEILAUFGABEN:\n` +
    `(a) X/X BE — [ein Satz was richtig/falsch war]\n` +
    `(b) X/X BE — [ein Satz was richtig/falsch war]\n` +
    `...\n\n` +
    `FEHLER:\n` +
    `- [konkreter Fehler 1]\n` +
    `- [konkreter Fehler 2]\n\n` +
    `HINWEISE:\n` +
    `- [hilfreicher Tipp 1]\n` +
    `- [hilfreicher Tipp 2]`

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: 'image/png', data: base64 },
          },
          {
            type: 'text',
            text: userText,
          },
        ],
      },
    ],
  })

  const raw = response.content[0].type === 'text' ? response.content[0].text : ''

  // Parse "PUNKTE: X / Y" (with or without spaces around slash)
  const match = raw.match(/PUNKTE:\s*(\d+)\s*\/\s*\d+/)
  const score = match ? Math.min(parseInt(match[1], 10), maxPoints) : 0
  const feedback = raw.replace(/^PUNKTE:.*\n?/, '').trim()

  return { score, maxPoints, feedback }
}

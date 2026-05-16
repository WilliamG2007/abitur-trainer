import Anthropic from '@anthropic-ai/sdk'

const SYSTEM_PROMPT = `Du bist ein bayerischer Abitur Mathematik Korrektor. \
Bewerte die handgeschriebene Schülerlösung anhand des \
Erwartungshorizonts. Gib an: erreichte Punkte / maximale \
Punkte, welche Teilaufgaben korrekt waren, wo Punkte \
verloren wurden und warum. Sei präzise aber ermutigend.

Beginne deine Antwort immer mit genau dieser Zeile (ersetze X und Y):
PUNKTE: X/Y

Danach folgt dein detailliertes Feedback.`

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
            text: `Aufgabe (maximal ${maxPoints} Punkte):\n${questionText}\n\nErwartungshorizont:\n${erwartungshorizont}`,
          },
        ],
      },
    ],
  })

  const raw = response.content[0].type === 'text' ? response.content[0].text : ''

  // Parse "PUNKTE: X/Y" from the first line
  const firstLine = raw.split('\n')[0]
  const match = firstLine.match(/PUNKTE:\s*(\d+)\s*\/\s*(\d+)/)
  const score = match ? Math.min(parseInt(match[1], 10), maxPoints) : 0
  const feedback = raw.replace(/^PUNKTE:.*\n?/, '').trim()

  return { score, maxPoints, feedback }
}

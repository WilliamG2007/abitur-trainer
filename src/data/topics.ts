export type Topic = 'analysis' | 'stochastik' | 'geometrie'

export const TOPICS: { id: Topic; label: string; subtopics: string[] }[] = [
  {
    id: 'analysis',
    label: 'Analysis',
    subtopics: [
      'Differentialrechnung',
      'Integralrechnung',
      'Kurvendiskussion',
      'Exponential- & Logarithmusfunktionen',
    ],
  },
  {
    id: 'stochastik',
    label: 'Stochastik',
    subtopics: [
      'Binomialverteilung',
      'Erwartungswert',
      'Normalverteilung',
      'Hypothesentests',
    ],
  },
  {
    id: 'geometrie',
    label: 'Geometrie',
    subtopics: [
      'Vektoren',
      'Geraden & Ebenen',
      'Abstände & Winkel',
      'Koordinatensysteme',
    ],
  },
]

export const QUESTIONS_PER_SUBTOPIC = 20

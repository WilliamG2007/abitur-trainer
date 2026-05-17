export type Topic = 'analysis' | 'stochastik' | 'analytische-geometrie'

export interface Subtopic {
  id: string
  label: string
}

export const TOPICS: { id: Topic; label: string; subtopics: Subtopic[] }[] = [
  {
    id: 'analysis',
    label: 'Analysis',
    subtopics: [
      { id: 'ganzrationale-funktionen', label: 'Ganzrationale Funktionen' },
      { id: 'exponentialfunktion', label: 'Exponentialfunktion' },
      { id: 'sinus-kosinus', label: 'Sinus & Kosinusfunktion' },
      { id: 'gebrochen-rationale-funktionen', label: 'Gebrochen-rationale Funktionen' },
      { id: 'wurzel-umkehrfunktionen', label: 'Wurzel & Umkehrfunktionen' },
      { id: 'logarithmusfunktion', label: 'Logarithmusfunktion' },
      { id: 'integralrechnung', label: 'Integralrechnung' },
      { id: 'anwendungen', label: 'Anwendungen der Analysis' },
    ],
  },
  {
    id: 'stochastik',
    label: 'Stochastik',
    subtopics: [
      { id: 'wahrscheinlichkeit-zufallsgroessen', label: 'Wahrscheinlichkeit & Zufallsgrößen' },
      { id: 'binomialverteilung', label: 'Binomialverteilung' },
      { id: 'signifikanztest', label: 'Einseitiger Signifikanztest' },
      { id: 'normalverteilung', label: 'Normalverteilung' },
    ],
  },
  {
    id: 'analytische-geometrie',
    label: 'Analytische Geometrie',
    subtopics: [
      { id: 'vektorrechnung', label: 'Vektorrechnung' },
      { id: 'geraden', label: 'Geraden im Raum' },
      { id: 'ebenen', label: 'Ebenen im Raum' },
      { id: 'lagebeziehungen-abstaende', label: 'Lagebeziehungen & Abstände' },
      { id: 'kugeln', label: 'Kugeln' },
    ],
  },
]

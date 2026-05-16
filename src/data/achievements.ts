export type AchievementId =
  | 'first_question'
  | 'erwartungswert_complete'
  | 'stochastik_complete'
  | 'math_complete'
  | 'streak_7'

export interface Achievement {
  id: AchievementId
  title: string
  description: string
  icon: string
  /** Returns true when the achievement should be unlocked based on progress state */
  check: (params: AchievementCheckParams) => boolean
}

export interface AchievementCheckParams {
  /** Set of question IDs that have been attempted at least once */
  attemptedIds: Set<string>
  /** Map of questionId → score achieved */
  scores: Map<string, number>
  /** Map of questionId → max_points for that question */
  maxPoints: Map<string, number>
  /** Current streak in days */
  streakDays: number
  /** All unlocked question IDs (non-locked) per subtopic */
  subtopicUnlockedIds: Map<string, string[]>
}

export const achievements: Achievement[] = [
  {
    id: 'first_question',
    title: 'Erster Schritt',
    description: 'Reiche deine erste Aufgabe ein.',
    icon: '🎯',
    check: ({ attemptedIds }) => attemptedIds.size >= 1,
  },
  {
    id: 'erwartungswert_complete',
    title: 'Erwartungsgemäß gut',
    description: 'Bearbeite alle freigeschalteten Erwartungswert-Aufgaben.',
    icon: '📊',
    check: ({ attemptedIds, subtopicUnlockedIds }) => {
      const unlocked = subtopicUnlockedIds.get('Erwartungswert') ?? []
      return unlocked.length > 0 && unlocked.every((id) => attemptedIds.has(id))
    },
  },
  {
    id: 'stochastik_complete',
    title: 'Stochastik-Profi',
    description: 'Bearbeite alle freigeschalteten Stochastik-Aufgaben.',
    icon: '🎲',
    check: ({ attemptedIds, subtopicUnlockedIds }) => {
      const subtopics = ['Binomialverteilung', 'Erwartungswert', 'Normalverteilung', 'Hypothesentests']
      const allUnlocked = subtopics.flatMap((s) => subtopicUnlockedIds.get(s) ?? [])
      return allUnlocked.length > 0 && allUnlocked.every((id) => attemptedIds.has(id))
    },
  },
  {
    id: 'math_complete',
    title: 'Mathe-Abiturient',
    description: 'Bearbeite alle freigeschalteten Mathematik-Aufgaben.',
    icon: '🏆',
    check: ({ attemptedIds, subtopicUnlockedIds }) => {
      const allUnlocked = [...subtopicUnlockedIds.values()].flat()
      return allUnlocked.length > 0 && allUnlocked.every((id) => attemptedIds.has(id))
    },
  },
  {
    id: 'streak_7',
    title: '7-Tage-Streak',
    description: 'Übe 7 Tage in Folge.',
    icon: '🔥',
    check: ({ streakDays }) => streakDays >= 7,
  },
]

export type Difficulty = 'easy' | 'medium' | 'hard'

export interface Question {
  id: string           // UUID from Supabase
  smart_id?: string
  subject: string
  topic: string
  subtopic: string
  title: string
  text: string
  difficulty: Difficulty
  max_points: number
  erwartungshorizont: string
  images: string[]
  locked: boolean
  sort_order: number
  source?: string
  created_at?: string
}

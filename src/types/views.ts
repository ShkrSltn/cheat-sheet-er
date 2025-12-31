import type { CheatSheet } from './index'

// ============================================
// ProfileView
// ============================================

export interface EditForm {
  name: string
  email: string
}

export interface UserStats {
  totalSheets: number
  categories: number
  recentSheets: CheatSheet[]
}


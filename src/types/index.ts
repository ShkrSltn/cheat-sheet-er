export interface CheatSheet {
  id: string
  title: string
  description: string
  category: string
  content: string
  createdAt: string
  updatedAt: string
}

export type CheatSheetInput = Omit<CheatSheet, 'id' | 'createdAt' | 'updatedAt'>

export type CheatSheetUpdate = Partial<CheatSheetInput>

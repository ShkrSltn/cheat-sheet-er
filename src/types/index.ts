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

export interface User {
  id: string
  email: string
  name: string
  createdAt: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  password: string
  name: string
  confirmPassword: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

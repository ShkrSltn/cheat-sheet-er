import type { CheatSheet } from './index'

// AuthGuard Props
export interface AuthGuardProps {
  requireAuth?: boolean
}

// CategoryTabs Props
export interface CategoryTabsProps {
  categories: string[]
  activeCategory: string | null
  totalCount: number
  categoryCounts: Record<string, number>
}

// ConfirmDialog Props
export interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  isDanger?: boolean
}

// CheatSheetViewModal Props
export interface CheatSheetViewModalProps {
  isOpen: boolean
  cheatSheet: CheatSheet | null
}

// CategoryDialog Props
export interface CategoryDialogProps {
  isOpen: boolean
  existingCategories: string[]
}

// CheatSheetModal Props
export interface CheatSheetModalProps {
  isOpen: boolean
  cheatSheet?: CheatSheet | null
  initialCategory?: string
}

// CheatSheetModal Save Data
export interface CheatSheetFormData {
  title: string
  description: string
  category: string
  content: string
}

// CheatSheetCard Props
export interface CheatSheetCardProps {
  cheatSheet: CheatSheet
  totalCount: number
}

// CodeHighlight Props
export interface CodeHighlightProps {
  code: string
  language?: string
  autoDetect?: boolean
}

// SearchBar Props
export interface SearchBarProps {
  modelValue: string
}

// Category Color Interface
export interface CategoryColor {
  bg: string
  bgHover: string
  bgActive: string
  border: string
  borderHover: string
  text: string
}


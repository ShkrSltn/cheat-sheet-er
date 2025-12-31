import type { CategoryColor } from './components'

// ============================================
// useNavigation Composable
// ============================================

export interface NavigationComposable {
  navigateToLogin: () => void
  navigateToRegister: () => void
  navigateToProfile: () => void
  navigateToDashboard: () => void
  navigateToHome: () => void
  logout: () => void
}

// ============================================
// useCategoryColors Composable
// ============================================

export interface CategoryStyles {
  backgroundColor: string
  borderColor: string
  color: string
}

export interface CategoryHoverStyles {
  '--hover-bg': string
  '--hover-border': string
}

export interface CategoryColorsComposable {
  getCategoryColor: (category: string) => CategoryColor
  getCategoryStyles: (category: string, isActive?: boolean) => CategoryStyles
  getCategoryHoverStyles: (category: string) => CategoryHoverStyles
}

// Re-export CategoryColor for external use
export type { CategoryColor }


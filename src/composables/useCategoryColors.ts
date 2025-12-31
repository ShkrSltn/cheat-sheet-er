import type {
  CategoryColor,
  CategoryStyles,
  CategoryHoverStyles,
  CategoryColorsComposable,
} from '@/types'

const colorPalette: CategoryColor[] = [
  // Muted Blue
  {
    bg: 'rgba(91, 124, 153, 0.12)',
    bgHover: 'rgba(91, 124, 153, 0.18)',
    bgActive: 'rgba(91, 124, 153, 0.25)',
    border: 'rgba(91, 124, 153, 0.35)',
    borderHover: 'rgba(91, 124, 153, 0.5)',
    text: 'rgb(107, 140, 174)',
  },
  // Muted Purple
  {
    bg: 'rgba(139, 123, 155, 0.12)',
    bgHover: 'rgba(139, 123, 155, 0.18)',
    bgActive: 'rgba(139, 123, 155, 0.25)',
    border: 'rgba(139, 123, 155, 0.35)',
    borderHover: 'rgba(139, 123, 155, 0.5)',
    text: 'rgb(155, 138, 171)',
  },
  // Muted Mauve
  {
    bg: 'rgba(155, 138, 155, 0.12)',
    bgHover: 'rgba(155, 138, 155, 0.18)',
    bgActive: 'rgba(155, 138, 155, 0.25)',
    border: 'rgba(155, 138, 155, 0.35)',
    borderHover: 'rgba(155, 138, 155, 0.5)',
    text: 'rgb(171, 154, 171)',
  },
  // Muted Rose
  {
    bg: 'rgba(184, 155, 155, 0.12)',
    bgHover: 'rgba(184, 155, 155, 0.18)',
    bgActive: 'rgba(184, 155, 155, 0.25)',
    border: 'rgba(184, 155, 155, 0.35)',
    borderHover: 'rgba(184, 155, 155, 0.5)',
    text: 'rgb(200, 171, 171)',
  },
  // Muted Terracotta
  {
    bg: 'rgba(166, 123, 123, 0.12)',
    bgHover: 'rgba(166, 123, 123, 0.18)',
    bgActive: 'rgba(166, 123, 123, 0.25)',
    border: 'rgba(166, 123, 123, 0.35)',
    borderHover: 'rgba(166, 123, 123, 0.5)',
    text: 'rgb(182, 139, 139)',
  },
  // Muted Coral
  {
    bg: 'rgba(182, 139, 123, 0.12)',
    bgHover: 'rgba(182, 139, 123, 0.18)',
    bgActive: 'rgba(182, 139, 123, 0.25)',
    border: 'rgba(182, 139, 123, 0.35)',
    borderHover: 'rgba(182, 139, 123, 0.5)',
    text: 'rgb(198, 155, 139)',
  },
  // Muted Sand
  {
    bg: 'rgba(171, 155, 139, 0.12)',
    bgHover: 'rgba(171, 155, 139, 0.18)',
    bgActive: 'rgba(171, 155, 139, 0.25)',
    border: 'rgba(171, 155, 139, 0.35)',
    borderHover: 'rgba(171, 155, 139, 0.5)',
    text: 'rgb(187, 171, 155)',
  },
  // Muted Olive
  {
    bg: 'rgba(139, 155, 123, 0.12)',
    bgHover: 'rgba(139, 155, 123, 0.18)',
    bgActive: 'rgba(139, 155, 123, 0.25)',
    border: 'rgba(139, 155, 123, 0.35)',
    borderHover: 'rgba(139, 155, 123, 0.5)',
    text: 'rgb(155, 171, 139)',
  },
  // Muted Sage
  {
    bg: 'rgba(123, 155, 139, 0.12)',
    bgHover: 'rgba(123, 155, 139, 0.18)',
    bgActive: 'rgba(123, 155, 139, 0.25)',
    border: 'rgba(123, 155, 139, 0.35)',
    borderHover: 'rgba(123, 155, 139, 0.5)',
    text: 'rgb(139, 171, 155)',
  },
  // Muted Mint
  {
    bg: 'rgba(123, 155, 147, 0.12)',
    bgHover: 'rgba(123, 155, 147, 0.18)',
    bgActive: 'rgba(123, 155, 147, 0.25)',
    border: 'rgba(123, 155, 147, 0.35)',
    borderHover: 'rgba(123, 155, 147, 0.5)',
    text: 'rgb(139, 171, 163)',
  },
  // Muted Teal
  {
    bg: 'rgba(107, 147, 147, 0.12)',
    bgHover: 'rgba(107, 147, 147, 0.18)',
    bgActive: 'rgba(107, 147, 147, 0.25)',
    border: 'rgba(107, 147, 147, 0.35)',
    borderHover: 'rgba(107, 147, 147, 0.5)',
    text: 'rgb(123, 163, 163)',
  },
  // Muted Cyan
  {
    bg: 'rgba(107, 140, 155, 0.12)',
    bgHover: 'rgba(107, 140, 155, 0.18)',
    bgActive: 'rgba(107, 140, 155, 0.25)',
    border: 'rgba(107, 140, 155, 0.35)',
    borderHover: 'rgba(107, 140, 155, 0.5)',
    text: 'rgb(123, 156, 171)',
  },
  // Muted Sky
  {
    bg: 'rgba(115, 131, 155, 0.12)',
    bgHover: 'rgba(115, 131, 155, 0.18)',
    bgActive: 'rgba(115, 131, 155, 0.25)',
    border: 'rgba(115, 131, 155, 0.35)',
    borderHover: 'rgba(115, 131, 155, 0.5)',
    text: 'rgb(131, 147, 171)',
  },
  // Muted Indigo
  {
    bg: 'rgba(115, 123, 155, 0.12)',
    bgHover: 'rgba(115, 123, 155, 0.18)',
    bgActive: 'rgba(115, 123, 155, 0.25)',
    border: 'rgba(115, 123, 155, 0.35)',
    borderHover: 'rgba(115, 123, 155, 0.5)',
    text: 'rgb(131, 139, 171)',
  },
  // Muted Lavender
  {
    bg: 'rgba(131, 123, 155, 0.12)',
    bgHover: 'rgba(131, 123, 155, 0.18)',
    bgActive: 'rgba(131, 123, 155, 0.25)',
    border: 'rgba(131, 123, 155, 0.35)',
    borderHover: 'rgba(131, 123, 155, 0.5)',
    text: 'rgb(147, 139, 171)',
  },
  // Muted Plum
  {
    bg: 'rgba(147, 123, 147, 0.12)',
    bgHover: 'rgba(147, 123, 147, 0.18)',
    bgActive: 'rgba(147, 123, 147, 0.25)',
    border: 'rgba(147, 123, 147, 0.35)',
    borderHover: 'rgba(147, 123, 147, 0.5)',
    text: 'rgb(163, 139, 163)',
  },
  // Muted Orchid
  {
    bg: 'rgba(163, 131, 155, 0.12)',
    bgHover: 'rgba(163, 131, 155, 0.18)',
    bgActive: 'rgba(163, 131, 155, 0.25)',
    border: 'rgba(163, 131, 155, 0.35)',
    borderHover: 'rgba(163, 131, 155, 0.5)',
    text: 'rgb(179, 147, 171)',
  },
  // Muted Dusty Rose
  {
    bg: 'rgba(171, 139, 147, 0.12)',
    bgHover: 'rgba(171, 139, 147, 0.18)',
    bgActive: 'rgba(171, 139, 147, 0.25)',
    border: 'rgba(171, 139, 147, 0.35)',
    borderHover: 'rgba(171, 139, 147, 0.5)',
    text: 'rgb(187, 155, 163)',
  },
  // Muted Taupe
  {
    bg: 'rgba(147, 139, 131, 0.12)',
    bgHover: 'rgba(147, 139, 131, 0.18)',
    bgActive: 'rgba(147, 139, 131, 0.25)',
    border: 'rgba(147, 139, 131, 0.35)',
    borderHover: 'rgba(147, 139, 131, 0.5)',
    text: 'rgb(163, 155, 147)',
  },
  // Muted Warm Gray
  {
    bg: 'rgba(155, 147, 139, 0.12)',
    bgHover: 'rgba(155, 147, 139, 0.18)',
    bgActive: 'rgba(155, 147, 139, 0.25)',
    border: 'rgba(155, 147, 139, 0.35)',
    borderHover: 'rgba(155, 147, 139, 0.5)',
    text: 'rgb(171, 163, 155)',
  },
]

export function useCategoryColors(): CategoryColorsComposable {
  const getCategoryColor = (category: string): CategoryColor => {
    // Generate a consistent hash from the category name
    let hash: number = 0
    for (let i = 0; i < category.length; i++) {
      hash = category.charCodeAt(i) + ((hash << 5) - hash)
      hash = hash & hash // Convert to 32bit integer
    }

    // Use the hash to select a color from the palette
    const index: number = Math.abs(hash) % colorPalette.length
    return colorPalette[index]!
  }

  const getCategoryStyles = (category: string, isActive: boolean = false): CategoryStyles => {
    const colors: CategoryColor = getCategoryColor(category)

    return {
      backgroundColor: isActive ? colors.bgActive : colors.bg,
      borderColor: isActive ? colors.borderHover : colors.border,
      color: colors.text,
    }
  }

  const getCategoryHoverStyles = (category: string): CategoryHoverStyles => {
    const colors: CategoryColor = getCategoryColor(category)

    return {
      '--hover-bg': colors.bgHover,
      '--hover-border': colors.borderHover,
    }
  }

  return {
    getCategoryColor,
    getCategoryStyles,
    getCategoryHoverStyles,
  }
}
